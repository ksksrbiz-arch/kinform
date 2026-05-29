# `@kinform/payload-studio` — KINFORM Payload Studio

In-browser IDE for KINFORM-AEO:

- Author arbitrary files in a Zustand-backed virtual filesystem (persisted to
  `localStorage`).
- Draft campaigns and run them through the PersonaGenAI agent pipeline
  (Brand Voice → Compliance → Analytics → Supervisor).
- Approve, publish, or reject campaigns — promotion to `APPROVED` requires a
  human approver email.
- Hit **Compile & Download Bootstrapper** to bake the VFS + every
  `APPROVED`/`PUBLISHED` campaign into a single self-contained Python 3.9+
  script that recreates the workspace deterministically and idempotently.

The compile button stays disabled until **every** campaign is `APPROVED` or
`PUBLISHED`. This is the human-in-the-loop gate Phase 4 also enforces in CI.

## Run

```bash
# 1. Start PersonaGenAI (in another shell)
npm run persona:dev

# 2. Start the Studio
npm run studio:dev
# → http://localhost:3001
```

`NEXT_PUBLIC_PERSONA_GENAI_URL` defaults to `http://localhost:8088`.

## Bootstrapper output

The downloaded `kinform-bootstrapper-*.py` is self-contained:

```bash
python3 kinform-bootstrapper-20260529-123456.py --out ./my-workspace
```

- Stdlib only (base64, json, hashlib, pathlib, argparse).
- Idempotent: re-running with the same payload skips unchanged files.
- Safe: refuses paths containing `..` or escaping the output root.
- Writes one `campaigns/<slug>.json` per approved campaign + a
  `.kinform-bootstrap.json` manifest.
