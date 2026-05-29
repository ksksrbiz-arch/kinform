"""Enum constants — value-identical to ``packages/torqued-graph/src/enums.ts``.

These are plain ``str`` subclasses (not ``enum.Enum``) so they serialise to
JSON as their string value with no extra wrapping, matching the on-disk format
written by Prisma to the same SQLite / Postgres database.

CI parses this file and the TypeScript counterpart to assert parity.
"""

from __future__ import annotations

from typing import Final


class DropStatus:
    DRAFT: Final = "DRAFT"
    UPCOMING: Final = "UPCOMING"
    LIVE: Final = "LIVE"
    ARCHIVED: Final = "ARCHIVED"

    ALL: Final[frozenset[str]] = frozenset({"DRAFT", "UPCOMING", "LIVE", "ARCHIVED"})


class ProductCategory:
    APPAREL: Final = "APPAREL"
    JEWELRY: Final = "JEWELRY"
    ACCESSORY: Final = "ACCESSORY"

    ALL: Final[frozenset[str]] = frozenset({"APPAREL", "JEWELRY", "ACCESSORY"})


class AffiliateTier:
    SEED: Final = "SEED"
    BLOOM: Final = "BLOOM"
    TORQUE: Final = "TORQUE"
    KEYSTONE: Final = "KEYSTONE"

    ALL: Final[frozenset[str]] = frozenset({"SEED", "BLOOM", "TORQUE", "KEYSTONE"})


class RevenueEventKind:
    SCAN: Final = "SCAN"
    ATTRIBUTED_PURCHASE: Final = "ATTRIBUTED_PURCHASE"
    PASS_THROUGH: Final = "PASS_THROUGH"
    ADJUSTMENT: Final = "ADJUSTMENT"

    ALL: Final[frozenset[str]] = frozenset(
        {"SCAN", "ATTRIBUTED_PURCHASE", "PASS_THROUGH", "ADJUSTMENT"}
    )


class CampaignStatus:
    DRAFT: Final = "DRAFT"
    SIMULATION: Final = "SIMULATION"
    AWAITING_APPROVAL: Final = "AWAITING_APPROVAL"
    APPROVED: Final = "APPROVED"
    PUBLISHED: Final = "PUBLISHED"
    REJECTED: Final = "REJECTED"

    ALL: Final[frozenset[str]] = frozenset(
        {
            "DRAFT",
            "SIMULATION",
            "AWAITING_APPROVAL",
            "APPROVED",
            "PUBLISHED",
            "REJECTED",
        }
    )


CampaignTransitions: Final[dict[str, frozenset[str]]] = {
    CampaignStatus.DRAFT: frozenset({CampaignStatus.SIMULATION}),
    CampaignStatus.SIMULATION: frozenset(
        {CampaignStatus.AWAITING_APPROVAL, CampaignStatus.REJECTED}
    ),
    CampaignStatus.AWAITING_APPROVAL: frozenset(
        {CampaignStatus.APPROVED, CampaignStatus.REJECTED}
    ),
    CampaignStatus.APPROVED: frozenset(
        {CampaignStatus.PUBLISHED, CampaignStatus.REJECTED}
    ),
    CampaignStatus.PUBLISHED: frozenset(),
    CampaignStatus.REJECTED: frozenset(),
}


def can_transition_campaign(from_: str, to: str) -> bool:
    """Return True iff `to` is a legal successor of `from_`."""
    return to in CampaignTransitions.get(from_, frozenset())


class ValidationAgent:
    BRAND_VOICE: Final = "BRAND_VOICE"
    COMPLIANCE: Final = "COMPLIANCE"
    ANALYTICS: Final = "ANALYTICS"
    HUMAN: Final = "HUMAN"
    SUPERVISOR: Final = "SUPERVISOR"

    ALL: Final[frozenset[str]] = frozenset(
        {"BRAND_VOICE", "COMPLIANCE", "ANALYTICS", "HUMAN", "SUPERVISOR"}
    )


class ValidationVerdict:
    PASS: Final = "PASS"
    FAIL: Final = "FAIL"
    WARN: Final = "WARN"

    ALL: Final[frozenset[str]] = frozenset({"PASS", "FAIL", "WARN"})


class CampaignChannel:
    INSTAGRAM: Final = "instagram"
    TIKTOK: Final = "tiktok"
    EMAIL: Final = "email"
    PRINT: Final = "print"
    OTHER: Final = "other"

    ALL: Final[frozenset[str]] = frozenset(
        {"instagram", "tiktok", "email", "print", "other"}
    )
