"""Database access for Campaign + ValidationLog.

Thin wrapper around the shared SQLAlchemy models. All writes go through here
so the state-machine guard and JSON encoding stay in one place.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from kinform_torqued_graph import Campaign, CampaignStatus, ValidationLog
from kinform_torqued_graph.json import decode_json, encode_json

from kinform_persona.agents import AgentVerdict
from kinform_persona.state_machine import assert_human_approval, assert_transition


def _now() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Campaign reads
# ---------------------------------------------------------------------------
def get_campaign(session: Session, campaign_id: str) -> Campaign | None:
    return session.get(Campaign, campaign_id)


def campaign_to_dict(c: Campaign) -> dict[str, object]:
    return {
        "id": c.id,
        "slug": c.slug,
        "status": c.status,
        "drop_id": c.drop_id,
        "content": c.content,
        "ctas": decode_json(c.ctas),
        "hashtags": decode_json(c.hashtags),
        "channel": c.channel,
        "approved_by": c.approved_by,
        "approved_at": c.approved_at.isoformat() if c.approved_at else None,
        "published_at": c.published_at.isoformat() if c.published_at else None,
        "rejected_reason": c.rejected_reason,
        "created_at": c.created_at.isoformat(),
        "updated_at": c.updated_at.isoformat(),
    }


# ---------------------------------------------------------------------------
# Campaign writes
# ---------------------------------------------------------------------------
def create_draft(
    session: Session,
    *,
    slug: str,
    content: str,
    ctas: list[str],
    hashtags: list[str],
    channel: str,
    drop_id: str | None,
) -> Campaign:
    campaign = Campaign(
        slug=slug,
        status=CampaignStatus.DRAFT,
        drop_id=drop_id,
        content=content,
        ctas=encode_json(ctas),
        hashtags=encode_json(hashtags),
        channel=channel,
    )
    session.add(campaign)
    session.flush()
    return campaign


def transition_status(
    session: Session,
    campaign: Campaign,
    *,
    to_status: str,
    approved_by: str | None = None,
    rejected_reason: str | None = None,
) -> Campaign:
    assert_transition(campaign.status, to_status)
    assert_human_approval(to_status, approved_by)

    campaign.status = to_status
    if to_status == CampaignStatus.APPROVED:
        campaign.approved_by = approved_by
        campaign.approved_at = _now()
    elif to_status == CampaignStatus.PUBLISHED:
        campaign.published_at = _now()
    elif to_status == CampaignStatus.REJECTED:
        campaign.rejected_reason = rejected_reason
    session.flush()
    return campaign


def record_simulation_draft(
    session: Session,
    campaign: Campaign,
    *,
    content: str,
    ctas: list[str],
    hashtags: list[str],
) -> Campaign:
    """Overwrite the campaign's body with the latest LLM draft during SIMULATION."""
    campaign.content = content
    campaign.ctas = encode_json(ctas)
    campaign.hashtags = encode_json(hashtags)
    session.flush()
    return campaign


# ---------------------------------------------------------------------------
# ValidationLog writes
# ---------------------------------------------------------------------------
def append_validation_log(
    session: Session,
    campaign: Campaign,
    *,
    verdict: AgentVerdict,
    actor: str | None = None,
) -> ValidationLog:
    log = ValidationLog(
        campaign_id=campaign.id,
        agent=verdict.agent,
        verdict=verdict.verdict,
        score=verdict.score,
        details=encode_json(verdict.details),
        actor=actor,
    )
    session.add(log)
    session.flush()
    return log
