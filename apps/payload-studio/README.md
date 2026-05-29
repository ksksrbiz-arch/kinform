# `apps/payload-studio`

The **KINFORM Payload Studio** — a Next.js 15 + TypeScript + Tailwind visual
IDE for KINFORM-AEO. Houses the workspace, the campaign composer that calls
PersonaGenAI, and the **Polymorphic Bootstrapping Compiler**.

## Quickstart

```bash
cd apps/payload-studio
npm install
# In another terminal, run the FastAPI service (see apps/persona-genai)
npm run dev          # http://localhost:3001
```

## Architecture

- `lib/vfs.ts` — pure-data virtual filesystem (files, kinds, tree builder).
- `lib/compiler.ts` — the **Polymorphic Bootstrapping Compiler**. Pure
  function: `(VFS, opts) → CompilerArtifact`. Output is a Python script with
  a base64-encoded JSON payload of the entire workspace.
- `lib/personaClient.ts` — typed wrapper around the FastAPI service.
- `app/page.tsx` — three-pane IDE shell (tree / editor / compiler).
- `app/api/compile/route.ts` — server-side compile (same function, exposed
  as a downloadable `text/x-python` attachment). Used by CI.
- `app/api/persona/[...path]/route.ts` — CORS-free proxy to PersonaGenAI.

## Bootstrap script guarantees

The generated `.py` file:

1. Uses only the Python standard library (`base64`, `json`, `hashlib`,
   `pathlib`, `argparse`, `logging`) — air-gap friendly.
2. Is **idempotent**: re-runs only rewrite files whose SHA-256 has changed.
3. Validates the embedded `rules_version` matches the header.
4. Writes unapproved files under `<target>/staging/`. The
   "Production-only" toggle refuses to compile at all if any file is
   unapproved.
5. Emits a structured per-file log and a final summary dict.

## End-to-end flow

```
[Composer] ──simulate──▶ [PersonaGenAI] ──validate──▶ [DB:simulation]
    │
    └──approve(2×)──▶ [DB:approved]──▶[DB:production]
                                          │
                                          ▼
[IDE workspace] ←──"approved"──── campaign JSON written to /campaigns/<slug>.json
    │
    └──Compile & Download──▶ [bootstrap.py] (production-only respects approvals)
```

## Tests

```bash
npm test             # runs node --test tests/*.test.mjs
```

These tests actually execute the generated Python bootstrapper against
real tmp directories to prove idempotency and the production-only gate.
