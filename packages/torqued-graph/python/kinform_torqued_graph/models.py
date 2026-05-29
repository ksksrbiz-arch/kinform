"""SQLAlchemy models — mirror of ``../prisma/schema.prisma``.

Rules of mirror maintenance:

* Column names use the Prisma camelCase form. SQLAlchemy attribute names use
  Python snake_case, with the camelCase form supplied as the ``name`` of the
  underlying ``Column``. This keeps the on-disk table compatible with Prisma
  reads/writes from TypeScript.
* Enum columns are plain ``String`` — values are constrained at write time
  using the classes in :mod:`kinform_torqued_graph.enums`.
* JSON-shaped fields are stored as ``String`` (TEXT) for SQLite portability
  and (de)serialised by :mod:`kinform_torqued_graph.json`. The typed Mapped
  annotation is kept as ``str`` so the ORM stays honest about the on-disk
  shape; helper accessors live in app code.
* ``id`` columns are ``String`` because Prisma's ``@default(cuid())`` produces
  string IDs. We generate cuids on the Python side via :func:`_cuid`.
"""

from __future__ import annotations

import secrets
import time
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from kinform_torqued_graph.database import Base


def _cuid() -> str:
    """Compact, URL-safe, sortable ID compatible with Prisma's cuid format.

    Not a 1:1 reimplementation of `cuid` — values are still globally unique and
    lexicographically sortable, which is all the schema requires.
    """
    return f"c{int(time.time() * 1000):x}{secrets.token_hex(8)}"


def _now() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Drop
# ---------------------------------------------------------------------------
class Drop(Base):
    __tablename__ = "Drop"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    released_at: Mapped[datetime] = mapped_column(
        "releasedAt", DateTime(timezone=True), nullable=False
    )
    status: Mapped[str] = mapped_column(String, nullable=False, default="DRAFT")

    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=True), nullable=False, default=_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        "updatedAt", DateTime(timezone=True), nullable=False, default=_now, onupdate=_now
    )

    products: Mapped[list["Product"]] = relationship(back_populates="drop")
    campaigns: Mapped[list["Campaign"]] = relationship(back_populates="drop")

    __table_args__ = (Index("Drop_status_idx", "status"),)


# ---------------------------------------------------------------------------
# Product
# ---------------------------------------------------------------------------
class Product(Base):
    __tablename__ = "Product"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid)
    sku: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    physical_id: Mapped[str] = mapped_column(
        "physicalId", String, unique=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    price_cents: Mapped[int] = mapped_column("priceCents", Integer, nullable=False)
    available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    drop_id: Mapped[str | None] = mapped_column(
        "dropId", String, ForeignKey("Drop.id", ondelete="SET NULL"), nullable=True
    )
    drop: Mapped[Drop | None] = relationship(back_populates="products")

    affiliations: Mapped[list["TorquedAffiliation"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )
    revenue_events: Mapped[list["RevenueEvent"]] = relationship(back_populates="product")

    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=True), nullable=False, default=_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        "updatedAt", DateTime(timezone=True), nullable=False, default=_now, onupdate=_now
    )

    __table_args__ = (
        Index("Product_category_idx", "category"),
        Index("Product_dropId_idx", "dropId"),
    )


# ---------------------------------------------------------------------------
# AffiliateProfile
# ---------------------------------------------------------------------------
class AffiliateProfile(Base):
    __tablename__ = "AffiliateProfile"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid)
    handle: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column("displayName", String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    tier: Mapped[str] = mapped_column(String, nullable=False, default="SEED")
    payout_config: Mapped[str | None] = mapped_column(
        "payoutConfig", String, nullable=True
    )
    default_share_bps: Mapped[int] = mapped_column(
        "defaultShareBps", Integer, nullable=False, default=1000
    )
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    affiliations: Mapped[list["TorquedAffiliation"]] = relationship(
        back_populates="affiliate", cascade="all, delete-orphan"
    )
    revenue_events: Mapped[list["RevenueEvent"]] = relationship(back_populates="affiliate")

    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=True), nullable=False, default=_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        "updatedAt", DateTime(timezone=True), nullable=False, default=_now, onupdate=_now
    )

    __table_args__ = (Index("AffiliateProfile_tier_idx", "tier"),)


# ---------------------------------------------------------------------------
# TorquedAffiliation — bipartite junction
# ---------------------------------------------------------------------------
class TorquedAffiliation(Base):
    __tablename__ = "TorquedAffiliation"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid)
    product_id: Mapped[str] = mapped_column(
        "productId",
        String,
        ForeignKey("Product.id", ondelete="CASCADE"),
        nullable=False,
    )
    affiliate_id: Mapped[str] = mapped_column(
        "affiliateId",
        String,
        ForeignKey("AffiliateProfile.id", ondelete="CASCADE"),
        nullable=False,
    )
    share_bps: Mapped[int | None] = mapped_column("shareBps", Integer, nullable=True)
    weight: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    starts_at: Mapped[datetime] = mapped_column(
        "startsAt", DateTime(timezone=True), nullable=False, default=_now
    )
    ends_at: Mapped[datetime | None] = mapped_column(
        "endsAt", DateTime(timezone=True), nullable=True
    )

    product: Mapped[Product] = relationship(back_populates="affiliations")
    affiliate: Mapped[AffiliateProfile] = relationship(back_populates="affiliations")
    revenue_events: Mapped[list["RevenueEvent"]] = relationship(back_populates="affiliation")

    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=True), nullable=False, default=_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        "updatedAt", DateTime(timezone=True), nullable=False, default=_now, onupdate=_now
    )

    __table_args__ = (
        UniqueConstraint(
            "productId",
            "affiliateId",
            "startsAt",
            name="TorquedAffiliation_productId_affiliateId_startsAt_key",
        ),
        Index("TorquedAffiliation_productId_idx", "productId"),
        Index("TorquedAffiliation_affiliateId_idx", "affiliateId"),
    )


# ---------------------------------------------------------------------------
# RevenueEvent
# ---------------------------------------------------------------------------
class RevenueEvent(Base):
    __tablename__ = "RevenueEvent"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid)
    kind: Mapped[str] = mapped_column(String, nullable=False)
    amount_cents: Mapped[int] = mapped_column(
        "amountCents", Integer, nullable=False, default=0
    )
    payout_cents: Mapped[int] = mapped_column(
        "payoutCents", Integer, nullable=False, default=0
    )
    metadata_: Mapped[str | None] = mapped_column(
        "metadata", String, nullable=True
    )

    product_id: Mapped[str] = mapped_column(
        "productId",
        String,
        ForeignKey("Product.id", ondelete="RESTRICT"),
        nullable=False,
    )
    affiliate_id: Mapped[str | None] = mapped_column(
        "affiliateId",
        String,
        ForeignKey("AffiliateProfile.id", ondelete="SET NULL"),
        nullable=True,
    )
    affiliation_id: Mapped[str | None] = mapped_column(
        "affiliationId",
        String,
        ForeignKey("TorquedAffiliation.id", ondelete="SET NULL"),
        nullable=True,
    )

    product: Mapped[Product] = relationship(back_populates="revenue_events")
    affiliate: Mapped[AffiliateProfile | None] = relationship(back_populates="revenue_events")
    affiliation: Mapped[TorquedAffiliation | None] = relationship(back_populates="revenue_events")

    occurred_at: Mapped[datetime] = mapped_column(
        "occurredAt", DateTime(timezone=True), nullable=False, default=_now
    )

    __table_args__ = (
        Index("RevenueEvent_productId_occurredAt_idx", "productId", "occurredAt"),
        Index("RevenueEvent_affiliateId_occurredAt_idx", "affiliateId", "occurredAt"),
        Index("RevenueEvent_kind_idx", "kind"),
    )


# ---------------------------------------------------------------------------
# Campaign — strict status state machine
# ---------------------------------------------------------------------------
class Campaign(Base):
    __tablename__ = "Campaign"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="DRAFT")

    drop_id: Mapped[str | None] = mapped_column(
        "dropId", String, ForeignKey("Drop.id", ondelete="SET NULL"), nullable=True
    )
    drop: Mapped[Drop | None] = relationship(back_populates="campaigns")

    content: Mapped[str] = mapped_column(String, nullable=False)
    ctas: Mapped[str] = mapped_column(String, nullable=False)
    hashtags: Mapped[str] = mapped_column(String, nullable=False)
    channel: Mapped[str] = mapped_column(String, nullable=False, default="instagram")

    approved_by: Mapped[str | None] = mapped_column("approvedBy", String, nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(
        "approvedAt", DateTime(timezone=True), nullable=True
    )
    published_at: Mapped[datetime | None] = mapped_column(
        "publishedAt", DateTime(timezone=True), nullable=True
    )
    rejected_reason: Mapped[str | None] = mapped_column(
        "rejectedReason", String, nullable=True
    )

    validation_logs: Mapped[list["ValidationLog"]] = relationship(
        back_populates="campaign", cascade="all, delete-orphan"
    )

    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=True), nullable=False, default=_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        "updatedAt", DateTime(timezone=True), nullable=False, default=_now, onupdate=_now
    )

    __table_args__ = (
        Index("Campaign_status_idx", "status"),
        Index("Campaign_dropId_idx", "dropId"),
    )


# ---------------------------------------------------------------------------
# ValidationLog
# ---------------------------------------------------------------------------
class ValidationLog(Base):
    __tablename__ = "ValidationLog"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_cuid)
    campaign_id: Mapped[str] = mapped_column(
        "campaignId",
        String,
        ForeignKey("Campaign.id", ondelete="CASCADE"),
        nullable=False,
    )
    agent: Mapped[str] = mapped_column(String, nullable=False)
    verdict: Mapped[str] = mapped_column(String, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    details: Mapped[str] = mapped_column(String, nullable=False)
    actor: Mapped[str | None] = mapped_column(String, nullable=True)

    campaign: Mapped[Campaign] = relationship(back_populates="validation_logs")

    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime(timezone=True), nullable=False, default=_now
    )

    __table_args__ = (
        Index("ValidationLog_campaignId_createdAt_idx", "campaignId", "createdAt"),
        Index("ValidationLog_agent_idx", "agent"),
        Index("ValidationLog_verdict_idx", "verdict"),
    )
