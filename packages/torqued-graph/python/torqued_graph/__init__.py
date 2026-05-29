"""SQLAlchemy mirror of the Prisma schema for KINFORM Torqued Graph.

The Prisma schema in ``prisma/schema.prisma`` is the source of truth for the
Next.js Payload Studio. This module is the Python-side mirror used by the
FastAPI PersonaGenAI service so both apps can read/write the same database
without a network hop.

Both schemas are kept in lockstep manually. When you change one, change the
other. The integration tests verify column parity on every CI run.
"""
from .database import Base, get_engine, get_session, init_db
from .models import (
    AffiliateProfile,
    Campaign,
    Drop,
    Product,
    RevenueEvent,
    TorquedAffiliation,
    ValidationLog,
    CampaignStage,
)

__all__ = [
    "Base",
    "get_engine",
    "get_session",
    "init_db",
    "AffiliateProfile",
    "Campaign",
    "CampaignStage",
    "Drop",
    "Product",
    "RevenueEvent",
    "TorquedAffiliation",
    "ValidationLog",
]
