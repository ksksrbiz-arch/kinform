# `packages/torqued-graph`

The **bipartite affiliate graph** that powers KINFORM's Torqued Affiliation™
revenue engine.

## What's in here

| Path                                     | Role                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| `prisma/schema.prisma`                   | **Source of truth** for the schema (Next.js side).   |
| `python/torqued_graph/`                  | SQLAlchemy mirror used by the FastAPI service.       |
| `ts/index.ts`                            | Hand-written types for serverless / compiler usage.  |

## Core concept

Physical products (hoodies, crop tops, earrings, …) and affiliate profiles
are **both** first-class nodes. The `TorquedAffiliation` table is the
junction. Scanning a product's QR/NFC `physicalId` produces a `RevenueEvent`
whose `splitJson` snapshots the per-affiliate split at that moment, so
historical payouts remain reproducible even after the live split is rebalanced.

## Running migrations

```bash
# Prisma (TypeScript apps)
cd packages/torqued-graph
npm install
npm run prisma:push          # dev sync
npm run prisma:migrate       # production migration

# SQLAlchemy (Python service) — no migration step; tables are created on
# first boot via torqued_graph.init_db().
```

The default `DATABASE_URL` is a local SQLite file (`./kinform_aeo.db`) so
both stacks can share one DB in dev. Use Postgres in production.

## Keeping the two ORMs in sync

When you change one schema, change the other. The PersonaGenAI test suite
includes a column-parity check that fails CI if a field drifts.
