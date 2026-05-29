# KINFORM-AEO — Architecture

This document captures the load-bearing decisions for the KINFORM Autonomous Ecosystem Orchestrator and the trade-offs behind each one. It is meant to be read top-to-bottom by anyone joining the project.

---

## 1. The thesis

KINFORM is built around **Torqued Affiliation™**: a physical garment or accessory is not the endpoint of a sale, it is the *entry point* into a bipartite revenue graph.

- **Physical nodes** — every produced unit has a `physicalId` (QR/NFC). Scans become events.
- **Digital nodes** — affiliates (customers who opt in to wearing-as-marketing) hold profiles with payout configuration.
- **Edges** — `TorquedAffiliation` rows connect products to affiliates, weighted and time-bounded.
- **Events** — scans, attributed purchases, and pass-throughs become `RevenueEvent` rows that drive payouts.

Everything else in the system exists to safely generate content, validate it, attach it to the graph, and deploy it.

---

## 2. Repository shape — why a monorepo, why npm workspaces

We chose a single repo with `npm workspaces` over multiple repos or pnpm/turbo because:

- The storefront, IDE, and agentic service all consume the same TypeScript types from `packages/torqued-graph` and the same governance rules from `packages/shared`. Cross-repo PRs would be the dominant unit of change.
- npm workspaces are already the package manager of the existing storefront. No tooling migration tax.
- Turborepo can be layered on later without changing folder shape.
- The Python service (`apps/persona-genai`) is *not* a JS workspace — it lives in the monorepo as a sibling app with its own `pyproject.toml`. It consumes `packages/torqued-graph/python/` as a local-path Python dependency, mirroring the Prisma schema.

**Trade-off:** root `node_modules` grows. Acceptable; CI caches mitigate it.

---

## 3. Data layer (`packages/torqued-graph`)

Single source of truth for the schema is **Prisma**. SQLAlchemy is a *generated-by-convention* mirror, hand-kept in lock-step and asserted in CI.

| Concern | Decision |
| --- | --- |
| Primary ORM | Prisma (Next.js + serverless friendly) |
| Python ORM | SQLAlchemy 2.x with `DeclarativeBase` |
| Default driver | SQLite (`file:./prisma/dev.db`) for zero-config dev |
| Production driver | Postgres (Vercel Postgres compatible) |
| ID type | `String @id @default(cuid())` — portable, URL-safe, no Postgres-only types |
| Money | Integer minor units (cents) — never floats |
| Timestamps | `createdAt @default(now())`, `updatedAt @updatedAt` |
| Enums | Defined as `enum` in Prisma and as `str, Enum` in Python so values are wire-identical |

**Why dual ORMs at all?** The agentic service writes campaigns and validation logs from Python; the storefront and Studio read/write from TypeScript. Going through a JSON RPC for every write would add latency to the hot path of governance and produce inconsistent constraint enforcement. Two ORMs against one schema, with CI checking parity, is cheaper to operate.

**Core models** (see [packages/torqued-graph/prisma/schema.prisma](packages/torqued-graph/prisma/schema.prisma)):

- `Product` — physical SKU, has `physicalId` (QR/NFC), price, drop reference.
- `Drop` — a release (e.g. `HALTER`, `FISHNET`, `ACADEMIC`) grouping products.
- `AffiliateProfile` — human or organisation that earns through wearing/sharing.
- `TorquedAffiliation` — junction: which affiliate is bonded to which product, with weight and lifecycle.
- `RevenueEvent` — append-only ledger of scans/attributed purchases. Drives payouts.
- `Campaign` — generated marketing content with strict status state machine.
- `ValidationLog` — per-agent verdicts on a campaign. Append-only, auditable.

---

## 4. PersonaGenAI (`apps/persona-genai`) — Phase 2

**Stack:** Python 3.11+, FastAPI, LangGraph, Pydantic v2, SQLAlchemy 2, `httpx`.

**Agents:**

1. **Brand Voice Agent** — drafts copy that fits KINFORM voice, enforces ≤140 chars and required hashtags.
2. **Compliance Agent** — checks claims, banned terms, mandatory CTAs, and brand-name correctness.
3. **Analytics Agent** — scores predicted engagement and target-channel fit.
4. **Supervisor / router** — sequences the three, escalates conflicts, finalises a verdict.

**LLM provider:** swappable behind a `LLMProvider` interface. Default is `StubProvider` — deterministic, seedable, produces structurally valid KINFORM-style output. Real providers (OpenAI, Anthropic) plug in by setting `KINFORM_LLM_PROVIDER` and a key. CI runs the stub.

**State machine** (enforced by Prisma enum + Pydantic):

```
DRAFT  ─▶  SIMULATION  ─▶  AWAITING_APPROVAL  ─▶  APPROVED  ─▶  PUBLISHED
                  │                  │                │
                  └──▶ REJECTED ◀────┴────────────────┘
```

Promotion from `AWAITING_APPROVAL` to `APPROVED` *requires* a human approver token recorded in `Campaign.approvedBy`. No code path bypasses this.

---

## 5. Payload Studio (`apps/payload-studio`) — Phase 3

Next.js 16, App Router, TypeScript, Tailwind 4.

- A virtual filesystem (Zustand-backed) holds campaigns, governance rules, product schemas, and assets as in-memory tree nodes.
- The **Polymorphic Bootstrapping Compiler** serialises the entire workspace state to JSON, base64-encodes it, and embeds it inside a self-contained Python script with idempotent write logic and structured logging. The output runs on any machine with Python 3.9+ and no network access.
- A "Compile & Download Bootstrapper" button is **disabled** when any embedded campaign is not in status `APPROVED` or `PUBLISHED`. This is the IDE's governance gate.

---

## 6. Governance pipeline (`infra/github-actions`) — Phase 4

GitHub Actions workflow that runs on PRs touching campaigns, schemas, or governance rules:

- Lints campaigns against `packages/shared` rules (length, hashtags, CTAs).
- Verifies that any campaign promoted to `APPROVED` in the diff has a matching `ValidationLog` entry with an approver identity.
- Asserts Prisma ↔ SQLAlchemy schema parity.
- Blocks merge if any check fails. No `--no-verify` escape hatch.

---

## 7. Renaming KINFORM

The brand name is still a working title. To rename:

1. Edit `packages/shared/src/branding.ts` (single source of truth — name, hashtag, CTA tokens).
2. Run `npm run lint` — TypeScript references update via import; Pydantic schemas pick it up via `kinform_shared.branding`.
3. Update repo name and Vercel project. Done.

No string-replace across the codebase is needed for the *system* name. Marketing copy in `MARKETING-CAPTIONS.md` and product photography paths are intentionally kept as separate files so they can be redone.
