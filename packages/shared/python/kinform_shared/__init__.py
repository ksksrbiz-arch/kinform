"""kinform_shared — shared governance rules and validators for KINFORM-AEO.

This package is the single source of truth for cross-service governance.
Both the FastAPI PersonaGenAI service and the GitHub Actions governance
pipeline import from here, guaranteeing that what passes simulation in the
backend is the *same* contract enforced in CI.

Renaming KINFORM later: search for the string "KINFORM" — the brand name is
intentionally not embedded in any class names so renames stay surgical.
"""

from .governance import (
    BRAND_NAME,
    MAX_CONTENT_CHARS,
    REQUIRED_HASHTAGS,
    BANNED_PHRASES,
    REQUIRED_CTA_VERBS,
    GovernanceViolation,
    GovernanceResult,
    enforce_governance,
    GOVERNANCE_RULES_VERSION,
)

__all__ = [
    "BRAND_NAME",
    "MAX_CONTENT_CHARS",
    "REQUIRED_HASHTAGS",
    "BANNED_PHRASES",
    "REQUIRED_CTA_VERBS",
    "GovernanceViolation",
    "GovernanceResult",
    "enforce_governance",
    "GOVERNANCE_RULES_VERSION",
]
