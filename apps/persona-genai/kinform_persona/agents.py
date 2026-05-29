"""Three specialist agents + a supervisor pipeline.

The supervisor is implemented as a deterministic finite pipeline rather than
a LangGraph runtime. This keeps the dependency surface tiny (no langgraph
install, no event loop machinery), keeps CI fast, and keeps the air-gapped
bootstrapper viable. The mental model is identical to a LangGraph state graph:
each node reads the shared state and returns a new state, and the supervisor
decides the final verdict from the per-agent verdicts.

Swap to LangGraph by re-implementing :func:`run_pipeline` over a
``StateGraph`` if/when richer routing is needed; the agent functions are
already pure and node-shaped.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable

from kinform_shared.governance import (
    CampaignCandidate,
    GovernanceReport,
    evaluate_governance,
)
from kinform_torqued_graph import ValidationAgent, ValidationVerdict

from kinform_persona.llm import DraftRequest, DraftResponse, LLMProvider


@dataclass
class AgentVerdict:
    agent: str
    verdict: str
    score: int
    details: dict[str, object]


@dataclass
class PipelineState:
    request: DraftRequest
    draft: DraftResponse | None = None
    verdicts: list[AgentVerdict] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Brand Voice — produces the draft via the LLM provider
# ---------------------------------------------------------------------------
def brand_voice_agent(state: PipelineState, provider: LLMProvider) -> PipelineState:
    draft = provider.draft_campaign(state.request)
    state.draft = draft
    state.verdicts.append(
        AgentVerdict(
            agent=ValidationAgent.BRAND_VOICE,
            verdict=ValidationVerdict.PASS,
            score=100,
            details={
                "provider": provider.name,
                "content_length": len(draft.content),
                "cta_count": len(draft.ctas),
                "hashtag_count": len(draft.hashtags),
            },
        )
    )
    return state


# ---------------------------------------------------------------------------
# Compliance — delegates to the shared governance ruleset
# ---------------------------------------------------------------------------
def compliance_agent(state: PipelineState) -> PipelineState:
    if state.draft is None:
        raise RuntimeError("compliance_agent called before brand_voice_agent")

    report: GovernanceReport = evaluate_governance(
        CampaignCandidate(
            content=state.draft.content,
            ctas=tuple(state.draft.ctas),
            hashtags=tuple(state.draft.hashtags),
        )
    )
    state.verdicts.append(
        AgentVerdict(
            agent=ValidationAgent.COMPLIANCE,
            verdict=report.verdict,
            score=report.score,
            details=report.to_dict(),
        )
    )
    return state


# ---------------------------------------------------------------------------
# Analytics — deterministic, transparent engagement heuristic
# ---------------------------------------------------------------------------
def analytics_agent(state: PipelineState) -> PipelineState:
    if state.draft is None:
        raise RuntimeError("analytics_agent called before brand_voice_agent")

    score = _engagement_score(state.draft)
    verdict = ValidationVerdict.PASS if score >= 50 else ValidationVerdict.WARN
    state.verdicts.append(
        AgentVerdict(
            agent=ValidationAgent.ANALYTICS,
            verdict=verdict,
            score=score,
            details={
                "channel": state.request.channel,
                "predicted_engagement": score,
                "heuristic": "length_band + hashtag_count + cta_strength",
            },
        )
    )
    return state


def _engagement_score(draft: DraftResponse) -> int:
    length = len(draft.content)
    # Sweet spot 60..120 chars for IG/TikTok captions.
    length_score = 100 - min(abs(length - 90), 90)
    hashtag_score = min(len(draft.hashtags), 5) * 10
    cta_score = 30 if draft.ctas else 0
    raw = (length_score * 0.5) + hashtag_score + cta_score
    return max(0, min(100, int(raw)))


# ---------------------------------------------------------------------------
# Supervisor — collects per-agent verdicts into a single final verdict.
# ---------------------------------------------------------------------------
def supervisor_verdict(state: PipelineState) -> AgentVerdict:
    if not state.verdicts:
        raise RuntimeError("supervisor_verdict called with no agent verdicts")

    has_fail = any(v.verdict == ValidationVerdict.FAIL for v in state.verdicts)
    has_warn = any(v.verdict == ValidationVerdict.WARN for v in state.verdicts)

    if has_fail:
        final = ValidationVerdict.FAIL
    elif has_warn:
        final = ValidationVerdict.WARN
    else:
        final = ValidationVerdict.PASS

    score = sum(v.score for v in state.verdicts) // len(state.verdicts)
    return AgentVerdict(
        agent=ValidationAgent.SUPERVISOR,
        verdict=final,
        score=score,
        details={
            "agent_verdicts": [
                {"agent": v.agent, "verdict": v.verdict, "score": v.score}
                for v in state.verdicts
            ]
        },
    )


# ---------------------------------------------------------------------------
# Pipeline runner
# ---------------------------------------------------------------------------
def run_pipeline(
    request: DraftRequest,
    provider: LLMProvider,
    *,
    extra_steps: list[Callable[[PipelineState], PipelineState]] | None = None,
) -> tuple[PipelineState, AgentVerdict]:
    """Run Brand Voice → Compliance → Analytics → Supervisor in order."""
    state = PipelineState(request=request)
    state = brand_voice_agent(state, provider)
    state = compliance_agent(state)
    state = analytics_agent(state)
    for step in extra_steps or []:
        state = step(state)
    final = supervisor_verdict(state)
    state.verdicts.append(final)
    return state, final
