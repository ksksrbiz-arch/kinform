"""Governance ruleset — mirror of ``packages/shared/src/governance.ts``.

The evaluation function must produce a verdict identical to the TypeScript
counterpart given the same input. Parity is asserted by CI.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal, Sequence

from kinform_shared.branding import (
    APPROVED_CTAS,
    BANNED_PHRASES,
    BRAND,
    CONTENT_MAX_LENGTH,
    REQUIRED_HASHTAGS,
)

GovernanceVerdict = Literal["PASS", "WARN", "FAIL"]


@dataclass(frozen=True)
class CampaignCandidate:
    content: str
    ctas: tuple[str, ...]
    hashtags: tuple[str, ...]


@dataclass(frozen=True)
class Finding:
    rule: str
    severity: GovernanceVerdict
    message: str


@dataclass
class GovernanceReport:
    verdict: GovernanceVerdict
    score: int
    findings: list[Finding] = field(default_factory=list)

    def to_dict(self) -> dict[str, object]:
        return {
            "verdict": self.verdict,
            "score": self.score,
            "findings": [
                {"rule": f.rule, "severity": f.severity, "message": f.message}
                for f in self.findings
            ],
        }


def _norm(s: str) -> str:
    return s.strip().lower()


def evaluate_governance(candidate: CampaignCandidate) -> GovernanceReport:
    """Run the full ruleset; verdict precedence is FAIL > WARN > PASS."""
    findings: list[Finding] = []
    score = 100

    # --- Length ---
    if len(candidate.content) == 0:
        findings.append(
            Finding("content.nonEmpty", "FAIL", "Campaign content is empty.")
        )
        score -= 50
    elif len(candidate.content) > CONTENT_MAX_LENGTH:
        findings.append(
            Finding(
                "content.maxLength",
                "FAIL",
                f"Content exceeds {CONTENT_MAX_LENGTH} characters "
                f"(got {len(candidate.content)}).",
            )
        )
        score -= 30

    # --- Required hashtags ---
    hashtags_lower = {_norm(h) for h in candidate.hashtags}
    for required in REQUIRED_HASHTAGS:
        if _norm(required) not in hashtags_lower:
            findings.append(
                Finding(
                    "hashtags.required",
                    "FAIL",
                    f"Missing required hashtag {required}.",
                )
            )
            score -= 20

    # --- At least one approved CTA ---
    ctas_lower = [_norm(c) for c in candidate.ctas]
    approved_lower = {_norm(c) for c in APPROVED_CTAS}
    if len(candidate.ctas) == 0:
        findings.append(
            Finding("ctas.required", "FAIL", "At least one CTA is required.")
        )
        score -= 25
    elif not any(c in approved_lower for c in ctas_lower):
        findings.append(
            Finding(
                "ctas.approved",
                "WARN",
                "No CTA matches the approved vocabulary "
                f"({' | '.join(APPROVED_CTAS)}).",
            )
        )
        score -= 10

    # --- Banned phrases ---
    content_lower = _norm(candidate.content)
    for banned in BANNED_PHRASES:
        if banned in content_lower:
            findings.append(
                Finding(
                    "content.bannedPhrase",
                    "FAIL",
                    f'Content contains banned phrase "{banned}".',
                )
            )
            score -= 40

    # --- Brand name presence (WARN only) ---
    if _norm(BRAND.name) not in content_lower:
        if not any(_norm(BRAND.name) in h for h in hashtags_lower):
            findings.append(
                Finding(
                    "brand.namePresence",
                    "WARN",
                    f'Content does not mention "{BRAND.name}" or carry it in a hashtag.',
                )
            )
            score -= 5

    if any(f.severity == "FAIL" for f in findings):
        verdict: GovernanceVerdict = "FAIL"
    elif any(f.severity == "WARN" for f in findings):
        verdict = "WARN"
    else:
        verdict = "PASS"

    return GovernanceReport(verdict=verdict, score=max(0, min(100, score)), findings=findings)


def suggest_fixes(report: GovernanceReport) -> list[str]:
    """Concrete patch suggestions; does NOT mutate the candidate."""
    out: list[str] = []
    for f in report.findings:
        if f.rule == "content.maxLength":
            out.append(f"Trim content to {CONTENT_MAX_LENGTH} characters or fewer.")
        elif f.rule == "hashtags.required":
            out.append(
                "Add the missing required hashtags: " + ", ".join(REQUIRED_HASHTAGS) + "."
            )
        elif f.rule in {"ctas.required", "ctas.approved"}:
            out.append(
                "Use one of the approved CTAs: " + " | ".join(APPROVED_CTAS) + "."
            )
        elif f.rule == "content.bannedPhrase":
            out.append("Remove banned phrasing — see KINFORM voice guidelines.")
        elif f.rule == "brand.namePresence":
            out.append(f'Mention "{BRAND.name}" in the body or include #{BRAND.name}.')
        elif f.rule == "content.nonEmpty":
            out.append("Write at least one sentence of campaign body.")
    return out


def evaluate_simple(
    *,
    content: str,
    ctas: Sequence[str],
    hashtags: Sequence[str],
) -> GovernanceReport:
    """Convenience entrypoint that accepts plain sequences."""
    return evaluate_governance(
        CampaignCandidate(content=content, ctas=tuple(ctas), hashtags=tuple(hashtags))
    )
