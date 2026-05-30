"""Compliance agent.

Runs the cross-service governance rules against a candidate draft. Also
performs auto-remediation for one specific class of violation: missing
required hashtags. (We never auto-shorten content — that's a deliberate
human-or-brand-voice decision.)

The agent returns a possibly-amended draft plus the resulting governance
report. ``ok=False`` blocks promotion but does **not** block storage; the
campaign is persisted in the ``simulation`` stage so reviewers can see what
went wrong.
"""
from __future__ import annotations

from kinform_shared.governance import (
    REQUIRED_HASHTAGS,
    GovernanceResult,
    enforce_governance,
)

from ..schemas import CampaignDraft, GovernanceResultOut, GovernanceViolationOut


def _result_to_schema(r: GovernanceResult) -> GovernanceResultOut:
    return GovernanceResultOut(
        ok=r.ok,
        rules_version=r.rules_version,
        violations=[GovernanceViolationOut(**v.__dict__) for v in r.violations],
        warnings=list(r.warnings),
    )


def _auto_inject_required_hashtags(draft: CampaignDraft) -> CampaignDraft:
    existing = {t.lower().lstrip("#") for t in draft.hashtags}
    new_tags = list(draft.hashtags)
    for required in REQUIRED_HASHTAGS:
        if required.lower().lstrip("#") not in existing:
            new_tags.append(required)
    if new_tags == draft.hashtags:
        return draft
    return draft.model_copy(update={"hashtags": new_tags})


def review(draft: CampaignDraft) -> tuple[CampaignDraft, GovernanceResultOut]:
    """Apply compliance review. Always runs in simulation mode (no human gate)."""

    amended = _auto_inject_required_hashtags(draft)
    raw = enforce_governance(
        amended.content,
        hashtags=amended.hashtags,
        approved_by_human=False,
        require_human_approval=False,  # simulation stage
    )
    return amended, _result_to_schema(raw)
