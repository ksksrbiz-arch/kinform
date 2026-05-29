# `infra/github-actions`

The **KINFORM-AEO Governance Pipeline**.

Two pieces:

| File                          | Role                                                        |
| ----------------------------- | ----------------------------------------------------------- |
| `governance_check.py`         | Pure-Python CLI that runs the cross-service rules in CI.    |
| `../../.github/workflows/kinform-governance.yml` | The GitHub Actions workflow itself.          |

## What it enforces

1. **Every committed campaign JSON** under
   `apps/payload-studio/**/campaigns/` is validated against the *same* rule
   set the FastAPI orchestrator uses (`kinform_shared.governance`).
2. **The PersonaGenAI test suite** runs on every PR.
3. **The Polymorphic Bootstrapping Compiler tests** run on every PR — they
   actually execute the generated Python script to prove idempotency and the
   production-only gate.

## On pushes to `main`

The workflow passes `--require-approval`, which fails the build if any
committed campaign JSON has `approved=false`. This is how the
"Production-only" toggle in the IDE is enforced at the *repo* layer.

## Running locally

```bash
python infra/github-actions/governance_check.py \
  --paths 'apps/payload-studio/**/campaigns/**/*.json' \
  --report /tmp/report.json
```

## Report shape

```json
{
  "rules_version": "1.0.0",
  "checked": 4,
  "failed": 0,
  "results": [
    { "path": "...", "ok": true, "approved": true,
      "violations": [], "warnings": [] }
  ]
}
```
