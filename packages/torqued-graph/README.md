# @kinform/torqued-graph

Canonical data layer for the KINFORM Autonomous Ecosystem Orchestrator.

## What this package owns

- **Prisma schema** (`prisma/schema.prisma`) — the canonical source of truth for the Torqued Graph.
- **TypeScript types & enums** (`src/`) — published as `@kinform/torqued-graph` to all JS/TS workspaces.
- **SQLAlchemy mirror** (`python/`) — used by the Python PersonaGenAI service.
- **Seed script** (`prisma/seed.ts`) — deterministic, idempotent dev data.

## Models at a glance

```
Drop  ─┬─< Product  ─┬─< TorquedAffiliation >─┬─ AffiliateProfile
       │             │                        │
       │             └─< RevenueEvent >───────┘
       │
       └─< Campaign ─< ValidationLog
```

## Quick reference

```bash
# From repo root:
npm run graph:generate     # generate Prisma client (TypeScript)
npm run graph:migrate      # create/apply migrations against the dev DB
npm run graph:seed         # seed deterministic dev data

# From this package, to switch the datasource provider:
npm run use:sqlite         # default — zero-config dev
npm run use:postgres       # production-style provider
```

## Why dual ORMs

The agentic content service (`apps/persona-genai`) writes campaigns and validation logs from Python. Going through HTTP for those writes would add latency and make constraint enforcement inconsistent. Two ORMs against one schema — with CI asserting parity — is the cheapest operational answer.

The Python mirror lives in `python/kinform_torqued_graph/`. Its enum module mirrors `src/enums.ts` value-for-value, and CI fails the build if they drift.

## Provider portability

Prisma cannot enforce native enums on SQLite, and it cannot read the `datasource.provider` from an env var. To keep zero-config local dev *and* a clean Postgres production:

1. We use only portable column types (`String`, `Int`, `Boolean`, `DateTime`, `Json`).
2. Enums are modelled as `String` columns, with values constrained by `src/enums.ts` / `enums.py`.
3. The `scripts/switch-provider.mjs` script rewrites the one provider line atomically.

This is the standard, supported workaround.
