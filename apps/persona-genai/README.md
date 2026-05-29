# `apps/persona-genai`

The **KINFORM PersonaGenAI** backend orchestrator.

A FastAPI service that runs three specialist agents — **Brand Voice**,
**Compliance**, **Analytics** — under a Supervisor / router (LangGraph when
available, deterministic fallback otherwise). Every output flows through a
**Simulation Staging** layer before a human reviewer can promote it to
production.

## Quickstart

```bash
cd apps/persona-genai
python -m venv .venv && source .venv/bin/activate
pip install -e ../../packages/shared
pip install -e ../../packages/torqued-graph
pip install -e .[dev]

uvicorn app.main:app --reload --port 8000
```

Then:

```bash
# 1) Simulate a campaign (persists in stage=simulation)
curl -sX POST http://localhost:8000/campaigns/simulate \
  -H 'content-type: application/json' \
  -d '{"slug":"halter-drop-1","title":"HALTER Drop 1","audience":"founding members","product_category":"hoodie"}'

# 2) Approve it (human gate). Use the campaign_id from the previous response.
curl -sX POST http://localhost:8000/campaigns/approve \
  -H 'content-type: application/json' \
  -d '{"campaign_id":"<id>","approver":"alex@kinform.studio","decision":"approve"}'

# 3) Approve again to promote to production.
```

## Environment

| Var                          | Default                                                | Meaning                                            |
| ---------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| `DATABASE_URL`               | `sqlite:///./kinform_aeo.db`                           | Shared with the Prisma side of the Torqued Graph.  |
| `KINFORM_LOG_LEVEL`          | `INFO`                                                 |                                                    |
| `KINFORM_ALLOWED_ORIGINS`    | `http://localhost:3000,http://localhost:3001`          | CORS allow-list for Payload Studio.                |
| `KINFORM_LLM_PROVIDER`       | _(unset)_                                              | Set to `openai` to enable LLM-backed Brand Voice.  |
| `OPENAI_API_KEY`             | _(unset)_                                              | Required when `KINFORM_LLM_PROVIDER=openai`.       |
| `KINFORM_LLM_MODEL`          | `gpt-4o-mini`                                          |                                                    |

## Architecture notes

* **Pydantic at the edge.** All inbound payloads are validated through
  `app/schemas.py`, which enforces the 140-char budget, required CTAs, and
  minimum hashtag count *before* the orchestrator runs.
* **Governance is shared.** All rule code lives in `packages/shared` so the
  CI pipeline and the bootstrap compiler enforce *exactly* the same checks.
* **Simulation is the only write path.** `app/simulation.py` is the only
  module that touches the Campaign table, which makes the staging invariant
  locally provable.
* **Human gate.** Approval is a separate endpoint that re-runs the latest
  governance check with `require_human_approval=True`. A campaign can only
  reach `production` via two explicit `approve` calls.
* **LangGraph optional.** The supervisor tries `langgraph.StateGraph` first,
  then falls back to a deterministic in-process state machine with identical
  outputs. Air-gapped CI runs the fallback.

## Tests

```bash
pytest -q
```
