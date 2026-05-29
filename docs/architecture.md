# KINFORM Autonomous Ecosystem Orchestrator (KINFORM-AEO)

> Working title. Renames are deliberately easy — see "Renaming the brand"
> at the bottom.

## What this system is

KINFORM-AEO turns the **KINFORM** physical-digital apparel & jewelry brand
into an autonomous, governed platform with four integrated components:

```
                     ┌────────────────────────────────────┐
                     │      Payload Studio (Next.js)      │
                     │ ┌──────────────────────────────┐   │
                     │ │ Visual file tree / editor    │   │
                     │ │ Campaign Composer            │   │
                     │ │ Polymorphic Bootstrapping    │   │
                     │ │ Compiler  → bootstrap.py     │   │
                     │ └─────┬──────────────────┬─────┘   │
                     └───────┼──────────────────┼─────────┘
                             │                  │
                  HTTPS (or  │                  │ download
                  /api/persona proxy)           │
                             ▼                  ▼
   ┌─────────────────────────────────┐   ┌────────────────────────────┐
   │ PersonaGenAI (FastAPI)          │   │ Generated bootstrap.py     │
   │ ┌───────────┐  ┌───────────┐    │   │ - air-gapped friendly      │
   │ │BrandVoice │─▶│Compliance │─┐  │   │ - idempotent (SHA-256)     │
   │ └───────────┘  └───────────┘ │  │   │ - approval-aware staging   │
   │            ┌──────────────┐  │  │   └────────────────────────────┘
   │            │  Analytics   │◀┘  │
   │            └─────┬────────┘    │
   │       Supervisor / router      │
   │       (LangGraph w/ fallback)  │
   └────────┬───────────────────────┘
            │ persist via SQLAlchemy
            ▼
   ┌─────────────────────────────────┐
   │ Torqued Graph (Prisma + SQLA)   │
   │   Product (physicalId)          │
   │   AffiliateProfile              │
   │   TorquedAffiliation (junction) │
   │   RevenueEvent                  │
   │   Campaign + ValidationLog      │
   │   Drop                          │
   └─────────────────────────────────┘
            ▲
            │
   ┌────────┴──────────────────────────────────┐
   │ Governance Pipeline (GitHub Actions)      │
   │ - Imports kinform_shared.governance       │
   │ - Validates every committed campaign      │
   │ - Requires approval on pushes to main     │
   │ - Runs PersonaGenAI test suite            │
   │ - Runs Compiler tests (executes the .py)  │
   └───────────────────────────────────────────┘
```

## Key design decisions

### 1. The governance rules are shared code, not just docs.

`packages/shared` ships both a Python and a TypeScript implementation of the
exact same checks, with a single `GOVERNANCE_RULES_VERSION` constant. The
FastAPI service, the Payload Studio's client-side pre-flight, the
Polymorphic Bootstrapping Compiler header, and the GitHub Actions pipeline
all reference the same module. There is no "drift" — there is exactly one
truth.

Trade-off: dual-implementation cost. Mitigated by `rules_version` mismatch
checks in CI and in the generated `.py` script.

### 2. The Campaign lifecycle is enforced *in code*, not by convention.

`app/simulation.py` is the **only** module that writes the `Campaign`
table. A campaign is born in `simulation`; the only path forward is
`promote(approve)`, which re-runs governance with the human-gate enabled
and refuses to advance if the latest `ValidationLog` is not OK. Two
approvals are required: `simulation → approved → production`. Direct
manipulation requires editing the database, which CI also checks.

### 3. The Torqued Graph is bipartite by design.

Physical products carry a `physicalId` (QR/NFC payload) and are first-class
nodes. Affiliates are the other half. The `TorquedAffiliation` junction
carries `sharePermille` (parts per thousand — integer math, no floating
point in payouts). On every scan, `RevenueEvent.splitJson` snapshots the
*current* split as a denormalised JSON so historical payouts remain
reproducible if shares are later rebalanced.

### 4. The Bootstrapping Compiler is "Polymorphic".

The compiler emits **Python source code**, not just data. The same payload
can be re-rendered into different runtimes (Bash, Node, container image)
without changing the upstream IDE — the IDE only knows about the abstract
artifact. v1 ships Python because Python is the most likely environment a
KINFORM operator will already have on a 2026 laptop.

### 5. LangGraph is optional.

The supervisor tries to import LangGraph; if it fails (or the runtime is
air-gapped), the in-process deterministic state machine runs instead.
**Outputs are identical.** This means the bootstrapped script can carry
the entire orchestration logic with zero third-party deps.

### 6. Human-in-the-loop is the default.

No campaign reaches `production` without **two** explicit
`POST /campaigns/approve` calls by a named human, and the second call
is gated on a fresh `ValidationLog`. The Payload Studio's "Production
only" compile toggle additionally refuses to compile if any embedded file
lacks `approved=true`.

### 7. Auditability over throughput.

`RevenueEvent` records every scan; `ValidationLog` records every
governance run (including the CI ones). Append-only. The bootstrap script
re-emits the embedded ruleset and prints structured per-file actions.

## End-to-end flow

```
Payload Studio: Composer → "Simulate"
  → POST /campaigns/simulate
  → BrandVoice draft
  → Compliance auto-injects required hashtags + validates
  → Analytics scores
  → Persist (stage=simulation) + ValidationLog row
Payload Studio: "Approve → Production"
  → POST /campaigns/approve (×2)
  → stage flips simulation → approved → production
  → Composer writes /campaigns/<slug>.json with approved=true
Payload Studio: "Compile & Download Bootstrapper"
  → lib/compiler.ts collects VFS, b64-encodes, embeds in PY_TEMPLATE
  → bootstrap.py downloaded
  → Run `python bootstrap.py --target ./project` anywhere
Governance CI:
  → On PR: validates every campaign JSON (no approval required)
  → On main: same, but --require-approval (any unapproved → fail)
  → On PR/main: runs PersonaGenAI test suite + Compiler tests
```

## Renaming the brand

The string "KINFORM" appears in only three categories of place:

1. `packages/shared/.../governance.py` and `.../governance.ts` — exported
   `BRAND_NAME` and `REQUIRED_HASHTAGS`. Edit, bump
   `GOVERNANCE_RULES_VERSION`, run CI.
2. Marketing copy in `apps/payload-studio` UI labels.
3. Documentation.

No class names, table names, or model names reference the brand. Renaming
is a search-and-replace operation, not a refactor.

## Future hooks

- **Real LLM in Brand Voice** — set `KINFORM_LLM_PROVIDER=openai`.
- **NFC reader integration** — POST to `/revenue/scan` from a serverless
  endpoint near the reader; the split JSON is already standard.
- **Multiple bootstrap targets** — implement another `PY_TEMPLATE`-style
  template in `lib/compiler.ts` and add a target selector in the UI.
- **Postgres** — set `DATABASE_URL=postgres://…`; both ORMs already
  support it.
