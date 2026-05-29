"""Pydantic v2 schemas — mirror of ``packages/shared/src/validators.ts``.

Used at every system boundary inside PersonaGenAI: HTTP request parsing,
agent state I/O, and database writes.
"""

from __future__ import annotations

import re
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from kinform_shared.branding import CONTENT_MAX_LENGTH
from kinform_torqued_graph.enums import (
    AffiliateTier,
    CampaignChannel,
    CampaignStatus,
    ProductCategory,
    RevenueEventKind,
)

SLUG_RE = re.compile(r"^[a-z0-9-]+$")
HANDLE_RE = re.compile(r"^[a-z0-9-]+$")
HASHTAG_RE = re.compile(r"^#[A-Za-z0-9_]+$")


class _Base(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class CampaignCandidateModel(_Base):
    slug: str = Field(min_length=3, max_length=64)
    content: str = Field(min_length=1, max_length=CONTENT_MAX_LENGTH)
    ctas: list[str] = Field(min_length=1, max_length=5)
    hashtags: list[str] = Field(min_length=1, max_length=10)
    channel: str = CampaignChannel.INSTAGRAM
    drop_id: str | None = None

    @field_validator("slug")
    @classmethod
    def _slug_format(cls, v: str) -> str:
        if not SLUG_RE.match(v):
            raise ValueError("slug must be kebab-case lowercase")
        return v

    @field_validator("hashtags")
    @classmethod
    def _hashtag_format(cls, v: list[str]) -> list[str]:
        bad = [h for h in v if not HASHTAG_RE.match(h)]
        if bad:
            raise ValueError(f"invalid hashtag(s): {bad}")
        return v

    @field_validator("ctas")
    @classmethod
    def _cta_length(cls, v: list[str]) -> list[str]:
        bad = [c for c in v if not (1 <= len(c) <= 60)]
        if bad:
            raise ValueError(f"cta length must be 1..60 chars: {bad}")
        return v

    @field_validator("channel")
    @classmethod
    def _channel_value(cls, v: str) -> str:
        if v not in CampaignChannel.ALL:
            raise ValueError(f"channel must be one of {sorted(CampaignChannel.ALL)}")
        return v


class CampaignModel(CampaignCandidateModel):
    id: str
    status: str
    approved_by: EmailStr | None = None
    approved_at: datetime | None = None
    published_at: datetime | None = None
    rejected_reason: str | None = None
    created_at: datetime
    updated_at: datetime

    @field_validator("status")
    @classmethod
    def _status_value(cls, v: str) -> str:
        if v not in CampaignStatus.ALL:
            raise ValueError(f"status must be one of {sorted(CampaignStatus.ALL)}")
        return v


class RevenueEventInput(_Base):
    kind: str
    amount_cents: int = Field(ge=0)
    payout_cents: int = Field(ge=0)
    metadata: dict[str, Any] | None = None
    product_id: str
    affiliate_id: str | None = None
    affiliation_id: str | None = None

    @field_validator("kind")
    @classmethod
    def _kind_value(cls, v: str) -> str:
        if v not in RevenueEventKind.ALL:
            raise ValueError(f"kind must be one of {sorted(RevenueEventKind.ALL)}")
        return v


class ApprovalRequest(_Base):
    campaign_id: str
    approver: EmailStr
    decision: Literal["APPROVE", "REJECT"]
    reason: str | None = Field(default=None, max_length=500)


class ProductCreate(_Base):
    sku: str = Field(min_length=3, max_length=64)
    physical_id: str = Field(min_length=3, max_length=128)
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=2000)
    category: str
    price_cents: int = Field(gt=0)
    drop_id: str | None = None

    @field_validator("category")
    @classmethod
    def _category_value(cls, v: str) -> str:
        if v not in ProductCategory.ALL:
            raise ValueError(f"category must be one of {sorted(ProductCategory.ALL)}")
        return v


class AffiliateCreate(_Base):
    handle: str = Field(min_length=3, max_length=40)
    display_name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    tier: str = AffiliateTier.SEED
    default_share_bps: int = Field(default=1000, ge=0, le=10_000)

    @field_validator("handle")
    @classmethod
    def _handle_format(cls, v: str) -> str:
        if not HANDLE_RE.match(v):
            raise ValueError("handle must be kebab-case lowercase")
        return v

    @field_validator("tier")
    @classmethod
    def _tier_value(cls, v: str) -> str:
        if v not in AffiliateTier.ALL:
            raise ValueError(f"tier must be one of {sorted(AffiliateTier.ALL)}")
        return v
