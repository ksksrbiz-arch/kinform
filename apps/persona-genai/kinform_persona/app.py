"""FastAPI surface for PersonaGenAI.

Routes are intentionally thin — they translate HTTP into calls to
:mod:`kinform_persona.simulation` / :mod:`kinform_persona.repository` and
back. The state machine, governance gates, and persistence all live in those
modules.
"""

from __future__ import annotations

from collections.abc import Iterator
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from kinform_torqued_graph import (
    Campaign,
    CampaignStatus,
    Drop,
    SessionLocal,
)

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
    approver: EmailStr


class RejectRequest(BaseModel):
    reason: str = Field(min_length=1, max_length=500)


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


def _load(db: Session, campaign_id: str) -> Campaign:
    campaign = repository.get_campaign(db, campaign_id)
    if campaign is None:
        raise HTTPException(404, detail=f"Campaign {campaign_id!r} not found.")
    return campaign
