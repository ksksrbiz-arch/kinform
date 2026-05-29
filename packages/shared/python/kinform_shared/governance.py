"""Cross-service governance rules for KINFORM-AEO.

These rules are intentionally pure-Python (no third-party deps) so they can be
imported by:

* the FastAPI PersonaGenAI service (campaign validation),
* the GitHub Actions governance pipeline (CI-time enforcement),
* offline tooling embedded in the Polymorphic Bootstrapping Compiler.

The rules deliberately mirror ``packages/shared/ts/governance.ts`` line for
line. When you change one, change the other and bump ``GOVERNANCE_RULES_VERSION``.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Iterable

#: Bump this whenever the rule set changes. The CI pipeline pins on it so
#: campaigns approved under an older version are flagged for re-validation.
GOVERNANCE_RULES_VERSION = "1.0.0"

#: Brand name used in all required hashtags and brand-voice checks. Keep this
#: as the only place "KINFORM" is hard-coded for governance purposes.
BRAND_NAME = "KINFORM"

#: Hard limit on marketing copy length, in characters. Twitter-derived budget
#: so the same content fits every channel KINFORM ships today.
MAX_CONTENT_CHARS = 140

#: Hashtags every campaign **must** carry. ``#TorquedAffiliation`` is the
#: program-wide attribution tag; ``#KINFORM`` is brand attribution.
REQUIRED_HASHTAGS: tuple[str, ...] = ("#KINFORM", "#TorquedAffiliation")

#: Phrases the Brand Voice agent must reject. Add to this list rather than
#: editing inline regexes.
BANNED_PHRASES: tuple[str, ...] = (
    "guaranteed returns",
    "get rich quick",
    "risk-free",
    "no risk",
    "miracle",
    "passive income forever",
)

#: A campaign must contain a call-to-action whose imperative verb is in this
#: set. The check is case-insensitive and matches whole words only.
REQUIRED_CTA_VERBS: tuple[str, ...] = (
    "shop",
    "wear",
    "join",
    "claim",
    "drop",
    "scan",
    "tap",
)

_WORD_RE = re.compile(r"[A-Za-z]+")


@dataclass(frozen=True)
class GovernanceViolation:
    """A single rule violation. ``code`` is stable; ``message`` is human text."""

    code: str
    message: str
    field: str = "content"


@dataclass
class GovernanceResult:
    """Aggregate validation result.

    ``ok`` is True only when there are zero violations. ``warnings`` never
    block promotion but are surfaced to humans in the approval UI.
    """

    ok: bool
    violations: list[GovernanceViolation] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    rules_version: str = GOVERNANCE_RULES_VERSION

    def to_dict(self) -> dict:
        return {
            "ok": self.ok,
            "rules_version": self.rules_version,
            "violations": [v.__dict__ for v in self.violations],
            "warnings": list(self.warnings),
        }


def _contains_cta(content: str) -> bool:
    words = {w.lower() for w in _WORD_RE.findall(content)}
    return any(verb in words for verb in REQUIRED_CTA_VERBS)


def enforce_governance(
    content: str,
    hashtags: Iterable[str] = (),
    *,
    approved_by_human: bool = False,
    require_human_approval: bool = True,
) -> GovernanceResult:
    """Run every governance rule against a candidate campaign payload.

    Parameters
    ----------
    content:
        The marketing copy itself (the part subject to the character budget).
    hashtags:
        Hashtags attached to the campaign (case-insensitive comparison).
    approved_by_human:
        Whether a human reviewer has signed off. Only meaningful when
        ``require_human_approval`` is True (the default).
    require_human_approval:
        When False (e.g. simulation staging), the human-gate violation is
        downgraded to a warning instead of blocking.
    """

    violations: list[GovernanceViolation] = []
    warnings: list[str] = []

    if not isinstance(content, str) or not content.strip():
        violations.append(
            GovernanceViolation("EMPTY_CONTENT", "Content must be non-empty.")
        )
        return GovernanceResult(ok=False, violations=violations)

    if len(content) > MAX_CONTENT_CHARS:
        violations.append(
            GovernanceViolation(
                "CONTENT_TOO_LONG",
                f"Content is {len(content)} chars; max is {MAX_CONTENT_CHARS}.",
            )
        )

    lowered = content.lower()
    for phrase in BANNED_PHRASES:
        if phrase in lowered:
            violations.append(
                GovernanceViolation(
                    "BANNED_PHRASE",
                    f"Content contains banned phrase: {phrase!r}.",
                )
            )

    if not _contains_cta(content):
        violations.append(
            GovernanceViolation(
                "MISSING_CTA",
                "Content must include a call-to-action verb "
                f"(one of: {', '.join(REQUIRED_CTA_VERBS)}).",
            )
        )

    normalised_tags = {h.lower().lstrip("#") for h in hashtags}
    for required in REQUIRED_HASHTAGS:
        if required.lower().lstrip("#") not in normalised_tags:
            violations.append(
                GovernanceViolation(
                    "MISSING_HASHTAG",
                    f"Required hashtag missing: {required}",
                    field="hashtags",
                )
            )

    if require_human_approval and not approved_by_human:
        violations.append(
            GovernanceViolation(
                "HUMAN_APPROVAL_REQUIRED",
                "Promotion to production requires explicit human approval.",
                field="approval",
            )
        )
    elif not require_human_approval and not approved_by_human:
        warnings.append(
            "Running in simulation mode — human approval still required "
            "before production promotion."
        )

    return GovernanceResult(ok=not violations, violations=violations, warnings=warnings)
