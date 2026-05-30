"""Strict Pydantic v2 schemas for the PersonaGenAI public API.

Every campaign request and response is gated through these models. The
character budget, hashtag requirements, and CTA shape are enforced at the
*schema* layer so malformed payloads can never reach the orchestration graph.
"""
from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from kinform_shared.governance import (
    MAX_CONTENT_CHARS,
    REQUIRED_HASHTAGS,
    REQUIRED_CTA_VERBS,
)


class CampaignBrief(BaseModel):
    """Inbound brief from the Payload Studio (or any caller)."""

    model_config = ConfigDict(extra="forbid")

    slug: str = Field(min_length=3, max_length=80, pattern=r"^[a-z0-9][a-z0-9\-]*$")
    title: str = Field(min_length=3, max_length=120)
    audience: str = Field(min_length=3, max_length=120)
    product_category: str = Field(min_length=2, max_length=40)
    drop_slug: Optional[str] = Field(default=None, max_length=80)
    extra_hashtags: list[str] = Field(default_factory=list, max_length=8)
    creative_seed: Optional[str] = Field(default=None, max_length=200)


class CTA(BaseModel):
    model_config = ConfigDict(extra="forbid")

    verb: str = Field(min_length=2, max_length=20)
    url: str = Field(min_length=1, max_length=400)
    label: str = Field(min_length=2, max_length=60)

    @field_validator("verb")
    @classmethod
    def _verb_in_whitelist(cls, v: str) -> str:
        if v.lower() not in REQUIRED_CTA_VERBS:
            raise ValueError(
                f"CTA verb must be one of {REQUIRED_CTA_VERBS}, got {v!r}."
            )
        return v.lower()


class CampaignDraft(BaseModel):
    """Internal artifact passed between agents."""

    model_config = ConfigDict(extra="forbid")

    slug: str
    title: str
    content: str = Field(max_length=MAX_CONTENT_CHARS)
    hashtags: list[str] = Field(min_length=len(REQUIRED_HASHTAGS), max_length=12)
    cta: CTA
    rationale: str = Field(default="", max_length=500)

    @field_validator("hashtags")
    @classmethod
    def _no_blank_tags(cls, tags: list[str]) -> list[str]:
        cleaned = [t.strip() for t in tags if t and t.strip()]
        if len(cleaned) != len(tags):
            raise ValueError("hashtags must not contain blank entries")
        return cleaned


class GovernanceViolationOut(BaseModel):
    code: str
    message: str
    field: str


class GovernanceResultOut(BaseModel):
    ok: bool
    rules_version: str
    violations: list[GovernanceViolationOut]
    warnings: list[str]


class AnalyticsScore(BaseModel):
    """Predicted engagement scores produced by the Analytics agent."""

    model_config = ConfigDict(extra="forbid")

    predicted_ctr: float = Field(ge=0.0, le=1.0)
    predicted_reach: int = Field(ge=0)
    risk_score: float = Field(ge=0.0, le=1.0)
    notes: str = Field(default="", max_length=400)


CampaignStageLiteral = Literal["simulation", "approved", "production", "rejected"]


class CampaignRecord(BaseModel):
    """Persisted campaign as returned by the API."""

    model_config = ConfigDict(extra="forbid")

    id: str
    slug: str
    title: str
    content: str
    hashtags: list[str]
    cta: CTA
    stage: CampaignStageLiteral
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    rules_version: str
    created_at: datetime
    updated_at: datetime


class SimulationReport(BaseModel):
    """End-to-end output of one simulation run."""

    model_config = ConfigDict(extra="forbid")

    draft: CampaignDraft
    governance: GovernanceResultOut
    analytics: AnalyticsScore
    promotable: bool
    campaign_id: Optional[str] = None


class ApprovalRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    campaign_id: str
    approver: str = Field(min_length=2, max_length=80)
    decision: Literal["approve", "reject"]
    note: str = Field(default="", max_length=400)


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    service: Literal["kinform-persona-genai"] = "kinform-persona-genai"
    version: str
    rules_version: str
