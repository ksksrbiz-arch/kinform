"""SQLAlchemy ORM models — mirror of ``prisma/schema.prisma``.

See the Prisma schema for design commentary; this file deliberately keeps
column names and semantics identical so the two ORMs can share a database.

Column naming convention
------------------------
Prisma writes columns in **camelCase** by default. Python prefers
**snake_case**. We resolve this by mapping every Python attribute to the
camelCase storage name with the second positional argument to
``mapped_column``, e.g. ``physical_id: Mapped[str] = mapped_column("physicalId", ...)``.

When you add a new column, follow this pattern so the two ORMs continue to
read/write the same SQLite/Postgres rows without runtime errors.
"""
from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def _cuid_like() -> str:
    """A small, URL-safe, sortable-ish id. Not a true cuid but adequate.

    We use ``uuid4().hex`` so we don't add a runtime dep on `cuid`. The
    Prisma side uses true cuids; both fit in the same VARCHAR column.
    """

    return uuid.uuid4().hex


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class CampaignStage(str, enum.Enum):
    """Lifecycle stages for a Campaign.

    Promotion is strictly one-way: simulation → approved → production.
    A reviewer may also reject from any non-production stage.
    """

    SIMULATION = "simulation"
    APPROVED = "approved"
    PRODUCTION = "production"
    REJECTED = "rejected"


class Product(Base):
    __tablename__ = "product"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid_like)
    physical_id: Mapped[str] = mapped_column("physicalId", String, unique=True)
    sku: Mapped[str] = mapped_column(String, unique=True)
    name: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String, index=True)
    base_price_cents: Mapped[int] = mapped_column("basePriceCents", Integer)
    metadata_json: Mapped[Optional[str]] = mapped_column("metadata", Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        "updatedAt", DateTime, default=_utcnow, onupdate=_utcnow
    )
    drop_id: Mapped[Optional[str]] = mapped_column(
        "dropId", String, ForeignKey("drop.id"), nullable=True
    )

    affiliations: Mapped[list["TorquedAffiliation"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )
    revenue_events: Mapped[list["RevenueEvent"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )
    drop: Mapped[Optional["Drop"]] = relationship(back_populates="products")


class AffiliateProfile(Base):
    __tablename__ = "affiliateProfile"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid_like)
    handle: Mapped[str] = mapped_column(String, unique=True)
    display_name: Mapped[str] = mapped_column("displayName", String)
    email: Mapped[str] = mapped_column(String, unique=True)
    payout_address: Mapped[Optional[str]] = mapped_column(
        "payoutAddress", String, nullable=True
    )
    tier: Mapped[str] = mapped_column(String, default="seed")
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, default=_utcnow)

    affiliations: Mapped[list["TorquedAffiliation"]] = relationship(
        back_populates="affiliate", cascade="all, delete-orphan"
    )
    revenue_events: Mapped[list["RevenueEvent"]] = relationship(
        back_populates="affiliate"
    )


class TorquedAffiliation(Base):
    __tablename__ = "torquedAffiliation"
    __table_args__ = (
        UniqueConstraint("productId", "affiliateId", "role", name="uq_torqued_edge"),
        Index("ix_torqued_affiliate", "affiliateId"),
    )

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid_like)
    product_id: Mapped[str] = mapped_column(
        "productId", String, ForeignKey("product.id", ondelete="CASCADE")
    )
    affiliate_id: Mapped[str] = mapped_column(
        "affiliateId", String, ForeignKey("affiliateProfile.id", ondelete="CASCADE")
    )
    share_permille: Mapped[int] = mapped_column("sharePermille", Integer)
    role: Mapped[str] = mapped_column(String)
    activated_at: Mapped[datetime] = mapped_column("activatedAt", DateTime, default=_utcnow)
    deactivated_at: Mapped[Optional[datetime]] = mapped_column(
        "deactivatedAt", DateTime, nullable=True
    )

    product: Mapped[Product] = relationship(back_populates="affiliations")
    affiliate: Mapped[AffiliateProfile] = relationship(back_populates="affiliations")


class RevenueEvent(Base):
    __tablename__ = "revenueEvent"
    __table_args__ = (
        Index("ix_revenue_occurred", "occurredAt"),
        Index("ix_revenue_product_occurred", "productId", "occurredAt"),
    )

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid_like)
    product_id: Mapped[str] = mapped_column(
        "productId", String, ForeignKey("product.id", ondelete="CASCADE")
    )
    affiliate_id: Mapped[Optional[str]] = mapped_column(
        "affiliateId",
        String,
        ForeignKey("affiliateProfile.id", ondelete="SET NULL"),
        nullable=True,
    )
    kind: Mapped[str] = mapped_column(String)
    amount_cents: Mapped[int] = mapped_column("amountCents", Integer)
    currency: Mapped[str] = mapped_column(String, default="USD")
    split_json: Mapped[str] = mapped_column("splitJson", Text)
    occurred_at: Mapped[datetime] = mapped_column("occurredAt", DateTime, default=_utcnow)
    source_physical_id: Mapped[Optional[str]] = mapped_column(
        "sourcePhysicalId", String, nullable=True
    )

    product: Mapped[Product] = relationship(back_populates="revenue_events")
    affiliate: Mapped[Optional[AffiliateProfile]] = relationship(
        back_populates="revenue_events"
    )


class Campaign(Base):
    __tablename__ = "campaign"
    __table_args__ = (Index("ix_campaign_stage", "stage"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid_like)
    slug: Mapped[str] = mapped_column(String, unique=True)
    title: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(String)
    hashtags_json: Mapped[str] = mapped_column("hashtagsJson", Text)
    cta_json: Mapped[str] = mapped_column("ctaJson", Text)
    stage: Mapped[str] = mapped_column(String, default=CampaignStage.SIMULATION.value)
    approved_by: Mapped[Optional[str]] = mapped_column("approvedBy", String, nullable=True)
    approved_at: Mapped[Optional[datetime]] = mapped_column(
        "approvedAt", DateTime, nullable=True
    )
    rules_version: Mapped[str] = mapped_column("rulesVersion", String)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        "updatedAt", DateTime, default=_utcnow, onupdate=_utcnow
    )
    drop_id: Mapped[Optional[str]] = mapped_column(
        "dropId", String, ForeignKey("drop.id"), nullable=True
    )

    validations: Mapped[list["ValidationLog"]] = relationship(
        back_populates="campaign", cascade="all, delete-orphan"
    )
    drop: Mapped[Optional["Drop"]] = relationship(back_populates="campaigns")


class ValidationLog(Base):
    __tablename__ = "validationLog"
    __table_args__ = (Index("ix_validation_campaign_created", "campaignId", "createdAt"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid_like)
    campaign_id: Mapped[str] = mapped_column(
        "campaignId", String, ForeignKey("campaign.id", ondelete="CASCADE")
    )
    source: Mapped[str] = mapped_column(String)
    ok: Mapped[bool] = mapped_column(Boolean)
    rules_version: Mapped[str] = mapped_column("rulesVersion", String)
    violations_json: Mapped[str] = mapped_column("violationsJson", Text)
    warnings_json: Mapped[str] = mapped_column("warningsJson", Text)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, default=_utcnow)

    campaign: Mapped[Campaign] = relationship(back_populates="validations")


class Drop(Base):
    __tablename__ = "drop"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid_like)
    slug: Mapped[str] = mapped_column(String, unique=True)
    name: Mapped[str] = mapped_column(String)
    go_live_at: Mapped[datetime] = mapped_column("goLiveAt", DateTime)
    retired_at: Mapped[Optional[datetime]] = mapped_column(
        "retiredAt", DateTime, nullable=True
    )
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, default=_utcnow)

    products: Mapped[list[Product]] = relationship(back_populates="drop")
    campaigns: Mapped[list[Campaign]] = relationship(back_populates="drop")
