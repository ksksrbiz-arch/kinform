"""KINFORM branding constants — mirror of ``packages/shared/src/branding.ts``.

CI asserts value parity. Edit both files in the same PR when changing tokens.
"""

from __future__ import annotations

from typing import Final


class BRAND:
    """Working brand name and system identity tokens."""

    name: Final[str] = "KINFORM"
    system_name: Final[str] = "KINFORM-AEO"
    tagline: Final[str] = "Wear the network."
    programme: Final[str] = "Torqued Affiliation"


REQUIRED_HASHTAGS: Final[tuple[str, ...]] = (
    "#KINFORM",
    "#TorquedAffiliation",
)

APPROVED_CTAS: Final[tuple[str, ...]] = (
    "Scan the tag",
    "Scan to wear",
    "Join the network",
    "Claim your share",
    "Wear the network",
)

CONTENT_MAX_LENGTH: Final[int] = 140

BANNED_PHRASES: Final[tuple[str, ...]] = (
    "guaranteed income",
    "risk-free",
    "get rich",
    "pyramid",
    "mlm",
    "limited time only",
)
