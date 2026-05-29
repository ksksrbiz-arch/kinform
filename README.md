# KINFORM Autonomous Ecosystem Orchestrator (KINFORM-AEO)

> **KINFORM** (working title) is a physical–digital apparel and jewelry brand under 1Commerce.
> The core thesis is **Torqued Affiliation™**: every physical product (hoodies, crop tops, earrings, etc.) is a live node in a digital revenue and affiliate graph. **Wearing the product = participating in the network.**

This repository is the orchestrator for the whole ecosystem: storefront, internal operator IDE, agentic content service, the data layer that ties physical SKUs to affiliate revenue, and the governance pipeline that keeps humans in the loop.

---

## Monorepo layout

```
kinform/
├── apps/
│   ├── storefront/         # Customer-facing Next.js 16 site (kinform.vercel.app)
│   ├── payload-studio/     # Operator IDE — visual filesystem + bootstrap compiler   (Phase 3)
│   └── persona-genai/      # FastAPI + LangGraph agentic content service             (Phase 2)
├── packages/
│   ├── torqued-graph/      # Prisma schema + SQLAlchemy mirror + shared TS types
│   └── shared/             # Governance rules, validators, schemas
├── infra/
│   └── github-actions/     # CI / governance workflows                                (Phase 4)
├── docs/
│   └── architecture.md     # Architecture decisions and trade-offs
├── .env.example
└── package.json            # npm workspaces root
```

Phases marked above land in subsequent commits. This commit ships **Phase 1**: monorepo restructure, `torqued-graph`, and `shared`.

---

## Build phases

| Phase | Scope                                                                                | Status      |
| ----- | ------------------------------------------------------------------------------------ | ----------- |
| 1     | Monorepo restructure, `packages/torqued-graph`, `packages/shared`, docs              | ✅ In repo  |
| 2     | `apps/persona-genai` — FastAPI + LangGraph + 3 agents + simulation/approval gate     | ⏳ Next     |
| 3     | `apps/payload-studio` — IDE + Polymorphic Bootstrapping Compiler + integration       | ⏳          |
| 4     | `infra/github-actions` governance workflows + full end-to-end demo                    | ⏳          |

---

## Quick start

```bash
# 1. Install all workspace JS/TS dependencies (one install, shared lockfile)
npm install

# 2. Bring up the data layer (defaults to local SQLite — zero config)
cp .env.example .env
npm run db:generate     # generate Prisma client (cached by turbo)
npm run db:migrate      # create / migrate dev database
npm run db:seed         # seed designs, drops, affiliates, sample revenue events

# 3. Run the existing storefront (port 3000)
npm run storefront:dev

# Whole-graph tasks (use Turborepo's cache + remote cache):
npm run lint            # turbo run lint
npm run typecheck       # turbo run typecheck
npm run build           # turbo run build
```

### Turborepo Remote Cache

Optional but recommended — speeds up CI to near-zero on cache hits. Set two repo secrets/vars:

| Name                                  | Where               | Source                          |
| ------------------------------------- | ------------------- | ------------------------------- |
| `TURBO_TOKEN`                         | Secrets             | Vercel Account → Tokens         |
| `TURBO_TEAM`                          | Variables           | Vercel team / personal slug     |
| `TURBO_REMOTE_CACHE_SIGNATURE_KEY`    | Secrets (recommend) | any random 32-byte hex string   |

These are already wired into [.github/workflows/ci.yml](.github/workflows/ci.yml) and `turbo.json`'s `remoteCache.signature: true`.

PersonaGenAI (Phase 2) and Payload Studio (Phase 3) commands are wired in the root `package.json` and will activate as those phases land.

---

## Key design decisions

These are recorded in [docs/architecture.md](docs/architecture.md). The shortlist:

1. **npm workspaces** — already the package manager in the storefront; no extra tooling.
2. **SQLite by default, Postgres-compatible** — Prisma + SQLAlchemy schemas use only portable types so the same models run locally without infra and on Vercel Postgres in production.
3. **Deterministic stub LLM provider by default** — PersonaGenAI runs end-to-end with no API keys (air-gapped, CI-friendly). Swap to OpenAI/Anthropic with one env var.
4. **Simulation → human approval → production** is a hard state machine, not a soft convention. The `Campaign.status` enum and `ValidationLog` table make it auditable.
5. **Physical products are first-class graph nodes** — `Product.physicalId` (QR/NFC) is unique and is what `RevenueEvent` rows attach to.

---

## License & ownership

UNLICENSED — internal to 1Commerce / KINFORM. Working title; rename is intentionally easy (see `packages/shared/src/branding.ts`).
