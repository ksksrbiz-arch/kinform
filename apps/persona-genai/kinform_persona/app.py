"""FastAPI surface for PersonaGenAI.

Routes are intentionally thin — they translate HTTP into calls to
:mod:`kinform_persona.simulation` / :mod:`kinform_persona.repository` and
back. The state machine, governance gates, and persistence all live in those
modules.
"""

from __future__ import annotations

from collections.abc import Iterator
from datetime import datetime, timezone
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from kinform_torqued_graph import (
    Campaign,
    CampaignStatus,
    Drop,
    SessionLocal,
    ValidationVerdict,
)
from kinform_torqued_graph.json import decode_json

from kinform_persona import repository
from kinform_persona.config import Settings
from kinform_persona.llm import get_provider
from kinform_persona.simulation import simulate_campaign
from kinform_persona.state_machine import IllegalTransitionError


# ---------------------------------------------------------------------------
# Dependency injection
# ---------------------------------------------------------------------------
def get_db() -> Iterator[Session]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def get_settings() -> Settings:
    return Settings.from_env()


# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------
class CreateDraftRequest(BaseModel):
    slug: str = Field(min_length=3, max_length=64)
    drop_id: str | None = None
    channel: Literal["instagram", "tiktok", "email", "print", "other"] = "instagram"


class SimulateRequest(BaseModel):
    seed: str | None = None


class ApprovalRequest(BaseModel):
    # The approver is an attestation string (email OR internal user id), per
    # the integration plan. We don't deliver email from this service, so we
    # don't enforce strict RFC email validation — that would reject perfectly
    # valid internal identities like `founder@kinform.local`.
    approver: str = Field(min_length=3, max_length=200)


class RejectRequest(BaseModel):
    reason: str = Field(min_length=1, max_length=500)


# ---------------------------------------------------------------------------
# One-shot generate endpoint (Integration Plan §3.1).
#
# Combines create + simulate into a single round trip from the Studio. The
# response shape follows the integration plan, with two intentional
# differences from the spec:
#   1. `status` returns the actual `CampaignStatus` enum value
#      (`AWAITING_APPROVAL` or `REJECTED`), not `AWAITING_HUMAN_APPROVAL`.
#      We mirror the database enum verbatim — the plan's name was prose.
#   2. `simulationId` is the supervisor `ValidationLog.id` from this run,
#      since the simulation itself isn't a discrete entity.
# ---------------------------------------------------------------------------
class GenerateRequest(BaseModel):
    drop_id: str = Field(alias="dropId")
    days: int = Field(default=14, ge=1, le=365)
    channel: Literal["instagram", "tiktok", "email", "print", "other"] = "instagram"
    force_regenerate: bool = Field(default=False, alias="forceRegenerate")

    model_config = {"populate_by_name": True}


class DraftBlock(BaseModel):
    title: str
    content: str
    ctas: list[str]
    hashtags: list[str]
    tone: str


class ValidationBlock(BaseModel):
    passed: bool
    errors: list[str]


class GenerateResponse(BaseModel):
    simulationId: str
    campaignId: str
    status: str
    draft: DraftBlock
    validation: ValidationBlock
    campaign: dict


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------
app = FastAPI(
    title="KINFORM PersonaGenAI",
    version="0.1.0",
    description="Governed multi-agent campaign service for KINFORM-AEO.",
)


@app.get("/health")
def health(settings: Settings = Depends(get_settings)) -> dict[str, str]:
    return {"status": "ok", "llm_provider": settings.llm_provider}


@app.post("/campaigns", status_code=status.HTTP_201_CREATED)
def create_campaign(
    payload: CreateDraftRequest,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    drop_name = payload.slug
    drop_description = ""
    if payload.drop_id:
        drop = db.get(Drop, payload.drop_id)
        if drop is None:
            raise HTTPException(404, detail=f"Drop {payload.drop_id!r} not found.")
        drop_name = drop.name
        drop_description = drop.description

    placeholder_cta = "Scan the tag"
    placeholder_hashtags = ["#KINFORM", "#TorquedAffiliation"]
    campaign = repository.create_draft(
        db,
        slug=payload.slug,
        content=f"DRAFT placeholder for {drop_name}.",
        ctas=[placeholder_cta],
        hashtags=placeholder_hashtags,
        channel=payload.channel,
        drop_id=payload.drop_id,
    )
    db.commit()
    return {"campaign": repository.campaign_to_dict(campaign)}


@app.post("/campaigns/{campaign_id}/simulate")
def simulate(
    campaign_id: str,
    payload: SimulateRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> dict[str, object]:
    campaign = _load(db, campaign_id)

    drop_name = campaign.slug
    drop_description = ""
    if campaign.drop_id:
        drop = db.get(Drop, campaign.drop_id)
        if drop is not None:
            drop_name = drop.name
            drop_description = drop.description

    try:
        campaign, final = simulate_campaign(
            db,
            campaign,
            provider=get_provider(settings.llm_provider),
            drop_name=drop_name,
            drop_description=drop_description,
            seed=payload.seed,
        )
    except IllegalTransitionError as exc:
        raise HTTPException(409, detail=str(exc)) from exc

    db.commit()
    return {
        "campaign": repository.campaign_to_dict(campaign),
        "final_verdict": {
            "agent": final.agent,
            "verdict": final.verdict,
            "score": final.score,
            "details": final.details,
        },
    }


@app.post("/campaigns/{campaign_id}/approve")
def approve(
    campaign_id: str,
    payload: ApprovalRequest,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    campaign = _load(db, campaign_id)
    try:
        repository.transition_status(
            db,
            campaign,
            to_status=CampaignStatus.APPROVED,
            approved_by=payload.approver,
        )
    except IllegalTransitionError as exc:
        raise HTTPException(409, detail=str(exc)) from exc
    db.commit()
    return {"campaign": repository.campaign_to_dict(campaign)}


@app.post("/campaigns/{campaign_id}/publish")
def publish(campaign_id: str, db: Session = Depends(get_db)) -> dict[str, object]:
    campaign = _load(db, campaign_id)
    try:
        repository.transition_status(db, campaign, to_status=CampaignStatus.PUBLISHED)
    except IllegalTransitionError as exc:
        raise HTTPException(409, detail=str(exc)) from exc
    db.commit()
    return {"campaign": repository.campaign_to_dict(campaign)}


@app.post("/campaigns/{campaign_id}/reject")
def reject(
    campaign_id: str,
    payload: RejectRequest,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    campaign = _load(db, campaign_id)
    try:
        repository.transition_status(
            db,
            campaign,
            to_status=CampaignStatus.REJECTED,
            rejected_reason=payload.reason,
        )
    except IllegalTransitionError as exc:
        raise HTTPException(409, detail=str(exc)) from exc
    db.commit()
    return {"campaign": repository.campaign_to_dict(campaign)}


@app.get("/campaigns/{campaign_id}")
def get_one(campaign_id: str, db: Session = Depends(get_db)) -> dict[str, object]:
    return {"campaign": repository.campaign_to_dict(_load(db, campaign_id))}


@app.post("/campaigns/generate", response_model=GenerateResponse)
def generate(
    payload: GenerateRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> GenerateResponse:
    """One-shot create + simulate. See integration plan §3.1."""
    drop = db.get(Drop, payload.drop_id)
    if drop is None:
        raise HTTPException(404, detail=f"Drop {payload.drop_id!r} not found.")

    # Deterministic slug per (drop, channel, minute). `force_regenerate` is
    # accepted but currently a no-op: every call gets a fresh slug, so the
    # unique constraint never collides. Wire reuse semantics here when there
    # is a clear product need.
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    slug = f"{drop.slug}-{payload.channel}-{stamp}"

    campaign = repository.create_draft(
        db,
        slug=slug,
        content=f"DRAFT placeholder for {drop.name}.",
        ctas=["Scan the tag"],
        hashtags=["#KINFORM", "#TorquedAffiliation"],
        channel=payload.channel,
        drop_id=drop.id,
    )

    try:
        campaign, final = simulate_campaign(
            db,
            campaign,
            provider=get_provider(settings.llm_provider),
            drop_name=drop.name,
            drop_description=drop.description,
            seed=f"{drop.slug}|{payload.channel}|d{payload.days}",
        )
    except IllegalTransitionError as exc:  # defensive — fresh DRAFT should always be legal
        raise HTTPException(409, detail=str(exc)) from exc
    db.commit()

    supervisor_log = next(
        (
            log
            for log in reversed(campaign.validation_logs)
            if log.agent == "SUPERVISOR"
        ),
        None,
    )
    fail_findings: list[str] = []
    for log in campaign.validation_logs:
        if log.agent != "COMPLIANCE":
            continue
        details = decode_json(log.details)
        for f in details.get("findings", []) if isinstance(details, dict) else []:
            if isinstance(f, dict) and f.get("severity") == "FAIL":
                fail_findings.append(f.get("message", ""))

    return GenerateResponse(
        simulationId=supervisor_log.id if supervisor_log else campaign.id,
        campaignId=campaign.id,
        status=campaign.status,
        draft=DraftBlock(
            title=drop.name,
            content=campaign.content,
            ctas=decode_json(campaign.ctas),
            hashtags=decode_json(campaign.hashtags),
            tone=f"{settings.llm_provider}:supervisor={final.verdict.lower()}",
        ),
        validation=ValidationBlock(
            passed=final.verdict != ValidationVerdict.FAIL,
            errors=fail_findings,
        ),
        campaign=repository.campaign_to_dict(campaign),
    )


def _load(db: Session, campaign_id: str) -> Campaign:
    campaign = repository.get_campaign(db, campaign_id)
    if campaign is None:
        raise HTTPException(404, detail=f"Campaign {campaign_id!r} not found.")
    return campaign
