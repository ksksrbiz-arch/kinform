"""Analytics agent.

Produces deterministic, explainable engagement predictions. We deliberately
avoid an opaque ML model here so reviewers can reason about the score in the
approval UI. When real telemetry from the Torqued Graph is wired up, the
``predicted_reach`` term should be replaced by a historical lookup keyed on
``product_category`` and ``audience``.
"""
from __future__ import annotations

from ..schemas import AnalyticsScore, CampaignDraft
from kinform_shared.governance import MAX_CONTENT_CHARS, BANNED_PHRASES


def _length_score(content: str) -> float:
    """CTR proxy: shorter copy converts marginally better, with diminishing returns."""

    n = len(content)
    if n == 0:
        return 0.0
    # Triangular curve peaking around 80 chars; clamps to [0, 1].
    peak = 80.0
    if n <= peak:
        return min(1.0, n / peak) * 0.08 + 0.02
    return max(0.01, 0.10 - ((n - peak) / (MAX_CONTENT_CHARS - peak)) * 0.05)


def _hashtag_score(hashtags: list[str]) -> float:
    """Tag count proxy for reach. 3–6 tags is the sweet spot."""

    n = len(hashtags)
    if n < 3:
        return 0.5
    if n <= 6:
        return 1.0
    return max(0.4, 1.0 - (n - 6) * 0.15)


def score(draft: CampaignDraft) -> AnalyticsScore:
    """Compute predicted engagement for ``draft``. Pure function."""

    ctr = _length_score(draft.content)
    base_reach = 5_000
    reach = int(base_reach * _hashtag_score(draft.hashtags))

    risk = 0.0
    lowered = draft.content.lower()
    for phrase in BANNED_PHRASES:
        if phrase in lowered:
            risk += 0.25
    risk = min(1.0, risk)

    notes = (
        f"length={len(draft.content)}, tags={len(draft.hashtags)}, "
        f"banned-hits={int(risk / 0.25) if risk > 0 else 0}"
    )
    return AnalyticsScore(
        predicted_ctr=round(ctr, 4),
        predicted_reach=reach,
        risk_score=round(risk, 4),
        notes=notes,
    )
