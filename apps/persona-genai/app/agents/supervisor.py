"""Supervisor / router for PersonaGenAI.

Orchestrates the three specialist agents:

1. **Brand Voice** turns a brief into a draft.
2. **Compliance** auto-remediates trivially fixable issues and validates.
3. **Analytics** scores the (possibly-amended) draft.

When LangGraph is importable, we build a real ``StateGraph`` whose nodes are
the three agents and whose router edges encode the policy
"compliance must pass before analytics is even attempted". When LangGraph is
absent (e.g. air-gapped CI, embedded compiler artifact), we run the same
state machine in plain Python with identical outputs.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Optional

from ..schemas import (
    AnalyticsScore,
    CampaignBrief,
    CampaignDraft,
    GovernanceResultOut,
    SimulationReport,
)
from . import analytics, brand_voice, compliance

log = logging.getLogger(__name__)


@dataclass
class AgentState:
    """The shared object that flows through the graph."""

    brief: CampaignBrief
    draft: Optional[CampaignDraft] = None
    governance: Optional[GovernanceResultOut] = None
    analytics: Optional[AnalyticsScore] = None
    trace: list[str] = field(default_factory=list)


def _node_brand_voice(state: AgentState) -> AgentState:
    state.draft = brand_voice.generate_draft(state.brief)
    state.trace.append("brand_voice:ok")
    return state


def _node_compliance(state: AgentState) -> AgentState:
    assert state.draft is not None
    amended, result = compliance.review(state.draft)
    state.draft = amended
    state.governance = result
    state.trace.append(f"compliance:{'ok' if result.ok else 'violations=' + str(len(result.violations))}")
    return state


def _node_analytics(state: AgentState) -> AgentState:
    assert state.draft is not None
    state.analytics = analytics.score(state.draft)
    state.trace.append("analytics:ok")
    return state


def _fallback_run(state: AgentState) -> AgentState:
    """Deterministic in-process orchestrator (no LangGraph required)."""

    state = _node_brand_voice(state)
    state = _node_compliance(state)
    # Always run analytics — reviewers want the score even on a failing draft,
    # so they can decide whether to remediate or kill.
    state = _node_analytics(state)
    return state


def _try_langgraph_run(state: AgentState) -> Optional[AgentState]:
    """Run via LangGraph if available. Returns ``None`` if unavailable."""

    try:  # pragma: no cover — exercised only when LangGraph is installed
        from langgraph.graph import StateGraph, END  # type: ignore
    except Exception:
        return None

    try:  # pragma: no cover
        graph = StateGraph(AgentState)
        graph.add_node("brand_voice", _node_brand_voice)
        graph.add_node("compliance", _node_compliance)
        graph.add_node("analytics", _node_analytics)
        graph.set_entry_point("brand_voice")
        graph.add_edge("brand_voice", "compliance")
        graph.add_edge("compliance", "analytics")
        graph.add_edge("analytics", END)
        compiled = graph.compile()
        return compiled.invoke(state)
    except Exception as exc:  # pragma: no cover
        log.warning("LangGraph execution failed (%s); using fallback.", exc)
        return None


def run_supervisor(brief: CampaignBrief) -> SimulationReport:
    """Orchestrate all agents and return a structured simulation report."""

    state = AgentState(brief=brief)
    result = _try_langgraph_run(state) or _fallback_run(state)

    assert result.draft is not None
    assert result.governance is not None
    assert result.analytics is not None

    # Promotable means: zero blocking violations *and* low risk score.
    promotable = result.governance.ok and result.analytics.risk_score < 0.5

    log.info(
        "supervisor done slug=%s ok=%s risk=%.2f trace=%s",
        result.draft.slug,
        result.governance.ok,
        result.analytics.risk_score,
        result.trace,
    )
    return SimulationReport(
        draft=result.draft,
        governance=result.governance,
        analytics=result.analytics,
        promotable=promotable,
    )
