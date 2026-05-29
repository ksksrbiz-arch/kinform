# `@kinform/persona-genai` — PersonaGenAI service

FastAPI service that drafts KINFORM campaigns, runs them through a deterministic
three-agent simulation (Brand Voice → Compliance → Analytics → Supervisor),
and gates promotion to `APPROVED` behind an explicit human approver identity.

## Install (one time)

```bash
cd apps/persona-genai
python3 -m pip install -r requirements-dev.txt
```

This installs the in-repo `kinform-shared` and `kinform-torqued-graph` packages
in editable mode, then this app.

## Run

```bash
# from the repo root
set -a && . ./.env && set +a
npm run persona:dev
```

The service binds to `PERSONA_GENAI_HOST:PERSONA_GENAI_PORT` (default
`0.0.0.0:8088`).

## Test

```bash
npm run persona:test
```

The end-to-end test (`tests/test_pipeline.py`) drives a draft through the full
state machine using an in-memory SQLite database and the deterministic stub LLM
provider. No network access required.

## LLM provider

Selected by `KINFORM_LLM_PROVIDER`. Default is `stub` — a deterministic, seedable
generator that produces schema-valid KINFORM-style output. CI runs the stub.

To swap providers, set `KINFORM_LLM_PROVIDER=openai` (or `anthropic`) and supply
the matching API key. The `LLMProvider` interface in `kinform_persona/llm.py`
documents what a custom provider must implement.

## State machine

```
DRAFT  →  SIMULATION  →  AWAITING_APPROVAL  →  APPROVED  →  PUBLISHED
              │                  │                │
              └──→ REJECTED ←────┴────────────────┘
```

Transitions are validated by `kinform_torqued_graph.can_transition_campaign`.
Promotion from `AWAITING_APPROVAL` to `APPROVED` **requires** a non-null
`approved_by`. No code path bypasses this.
