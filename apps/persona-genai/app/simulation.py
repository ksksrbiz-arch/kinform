"""Simulation staging layer.

A campaign is *never* persisted directly to ``production``. Instead:

1. ``run_simulation`` orchestrates the agents and produces a ``SimulationReport``.
2. The draft + governance result is persisted to the DB with ``stage='simulation'``
   and a fresh ``ValidationLog`` entry.
3. A human reviewer calls ``promote`` (with ``decision='approve'``) to flip the
   stage to ``approved`` and stamp the approver. Optionally a second call moves
   it to ``production`` once the social channels are scheduled.

This module is the *only* place the FastAPI layer writes campaigns, so the
"simulation → approved → production" invariant is locally enforceable.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select

from torqued_graph import (
    Campaign,
    CampaignStage,
    ValidationLog,
    get_session,
    init_db,
)

from .agents import run_supervisor
from .schemas import (
    ApprovalRequest,
    CampaignBrief,
    CampaignRecord,
    CTA,
    SimulationReport,
)


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _campaign_to_record(c: Campaign) -> CampaignRecord:
    return CampaignRecord(
        id=c.id,
        slug=c.slug,
        title=c.title,
        content=c.content,
        hashtags=json.loads(c.hashtags_json),
        cta=CTA.model_validate(json.loads(c.cta_json)),
        stage=c.stage,  # type: ignore[arg-type]
        approved_by=c.approved_by,
        approved_at=c.approved_at,
        rules_version=c.rules_version,
        created_at=c.created_at,
        updated_at=c.updated_at,
    )


def run_simulation(brief: CampaignBrief, *, persist: bool = True) -> SimulationReport:
    """Orchestrate the agents and (by default) persist the result.

    Returns a :class:`SimulationReport`. When ``persist=False`` the report
    still includes ``promotable``, but no DB row is created — useful for the
    Payload Studio's "preview" button.
    """

    report = run_supervisor(brief)
    if not persist:
        return report

    init_db()
    with get_session() as session:
        # Upsert by slug — re-simulating the same brief overwrites the draft.
        existing = session.execute(
            select(Campaign).where(Campaign.slug == report.draft.slug)
        ).scalar_one_or_none()

        if existing is None:
            row = Campaign(
                slug=report.draft.slug,
                title=report.draft.title,
                content=report.draft.content,
                hashtags_json=json.dumps(report.draft.hashtags),
                cta_json=report.draft.cta.model_dump_json(),
                stage=CampaignStage.SIMULATION.value,
                rules_version=report.governance.rules_version,
            )
            session.add(row)
            session.flush()
        else:
            if existing.stage == CampaignStage.PRODUCTION.value:
                raise ValueError(
                    f"Refusing to overwrite production campaign {existing.slug!r}."
                )
            existing.title = report.draft.title
            existing.content = report.draft.content
            existing.hashtags_json = json.dumps(report.draft.hashtags)
            existing.cta_json = report.draft.cta.model_dump_json()
            existing.stage = CampaignStage.SIMULATION.value
            existing.approved_by = None
            existing.approved_at = None
            existing.rules_version = report.governance.rules_version
            row = existing

        session.add(
            ValidationLog(
                campaign_id=row.id,
                source="persona-genai",
                ok=report.governance.ok,
                rules_version=report.governance.rules_version,
                violations_json=json.dumps([v.model_dump() for v in report.governance.violations]),
                warnings_json=json.dumps(report.governance.warnings),
            )
        )
        session.flush()
        report = report.model_copy(update={"campaign_id": row.id})

    return report


def promote(req: ApprovalRequest) -> CampaignRecord:
    """Apply a human approval / rejection decision.

    Transitions:

    * ``simulation`` + ``approve`` → ``approved``
    * ``approved`` + ``approve``   → ``production``
    * any non-production + ``reject`` → ``rejected``
    """

    init_db()
    with get_session() as session:
        row = session.get(Campaign, req.campaign_id)
        if row is None:
            raise LookupError(f"Campaign {req.campaign_id!r} not found.")

        if req.decision == "reject":
            if row.stage == CampaignStage.PRODUCTION.value:
                raise ValueError("Cannot reject a campaign already in production.")
            row.stage = CampaignStage.REJECTED.value
            row.approved_by = req.approver
            row.approved_at = _now()
        else:  # approve
            if row.stage == CampaignStage.SIMULATION.value:
                # Re-run governance one last time, this time WITH the human gate.
                latest = session.execute(
                    select(ValidationLog)
                    .where(ValidationLog.campaign_id == row.id)
                    .order_by(ValidationLog.created_at.desc())
                ).scalars().first()
                if latest is None or not latest.ok:
                    raise ValueError(
                        "Cannot approve a campaign with outstanding governance violations."
                    )
                row.stage = CampaignStage.APPROVED.value
                row.approved_by = req.approver
                row.approved_at = _now()
            elif row.stage == CampaignStage.APPROVED.value:
                row.stage = CampaignStage.PRODUCTION.value
            elif row.stage == CampaignStage.REJECTED.value:
                raise ValueError("Cannot approve a previously rejected campaign.")
            else:
                raise ValueError(f"Campaign already in stage {row.stage!r}.")

        session.add(
            ValidationLog(
                campaign_id=row.id,
                source="manual",
                ok=True,
                rules_version=row.rules_version,
                violations_json="[]",
                warnings_json=json.dumps([f"{req.decision} by {req.approver}: {req.note}"]),
            )
        )
        session.flush()
        return _campaign_to_record(row)


def get_campaign(campaign_id: str) -> Optional[CampaignRecord]:
    init_db()
    with get_session() as session:
        row = session.get(Campaign, campaign_id)
        return _campaign_to_record(row) if row else None


def list_campaigns(stage: Optional[str] = None) -> list[CampaignRecord]:
    init_db()
    with get_session() as session:
        q = select(Campaign).order_by(Campaign.created_at.desc())
        if stage:
            q = q.where(Campaign.stage == stage)
        return [_campaign_to_record(r) for r in session.execute(q).scalars().all()]
