"""Simulation orchestration.

Drives a Campaign through DRAFT → SIMULATION → (AWAITING_APPROVAL | REJECTED)
by running the agent pipeline, persisting each agent's verdict to
:class:`ValidationLog`, and updating the campaign body with the latest draft.

This module is the only place that combines the state machine, the agent
pipeline, and the database — keeping the FastAPI layer thin.
"""

from __future__ import annotations

from sqlalchemy.orm import Session

from kinform_torqued_graph import Campaign, CampaignStatus, ValidationVerdict

from kinform_persona import repository
from kinform_persona.agents import AgentVerdict, run_pipeline
from kinform_persona.llm import DraftRequest, LLMProvider


def simulate_campaign(
    session: Session,
    campaign: Campaign,
    *,
    provider: LLMProvider,
    drop_name: str,
    drop_description: str,
    seed: str | None = None,
) -> tuple[Campaign, AgentVerdict]:
    """Run the full simulation. Returns the updated campaign + final verdict."""
    repository.transition_status(session, campaign, to_status=CampaignStatus.SIMULATION)

    request = DraftRequest(
        drop_slug=campaign.slug,
        drop_name=drop_name,
        drop_description=drop_description,
        channel=campaign.channel,
        seed=seed,
    )
    state, final = run_pipeline(request, provider)

    assert state.draft is not None  # run_pipeline always sets it on PASS path
    repository.record_simulation_draft(
        session,
        campaign,
        content=state.draft.content,
        ctas=state.draft.ctas,
        hashtags=state.draft.hashtags,
    )

    for verdict in state.verdicts:
        repository.append_validation_log(session, campaign, verdict=verdict)

    next_status = (
        CampaignStatus.AWAITING_APPROVAL
        if final.verdict != ValidationVerdict.FAIL
        else CampaignStatus.REJECTED
    )
    rejected_reason = (
        "Failed governance simulation."
        if next_status == CampaignStatus.REJECTED
        else None
    )
    repository.transition_status(
        session,
        campaign,
        to_status=next_status,
        rejected_reason=rejected_reason,
    )
    return campaign, final
