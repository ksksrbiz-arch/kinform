"""Multi-agent orchestration for PersonaGenAI.

We use LangGraph when it's importable, but fall back to a deterministic
in-process orchestrator that runs the same agents in the same order. The
fallback exists so:

1. Tests run in air-gapped CI without pulling LangGraph + an LLM provider.
2. The Polymorphic Bootstrapping Compiler can embed a runnable orchestrator
   into the generated bootstrap script with zero external deps.

The agent contracts are identical in both modes.
"""

from .supervisor import run_supervisor, AgentState

__all__ = ["run_supervisor", "AgentState"]
