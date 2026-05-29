# kinform-shared (Python)

Mirror of `@kinform/shared`. Provides:

- `kinform_shared.branding` — `BRAND`, `REQUIRED_HASHTAGS`, `APPROVED_CTAS`, `BANNED_PHRASES`, `CONTENT_MAX_LENGTH`.
- `kinform_shared.governance` — `evaluate_governance`, `suggest_fixes`, `GovernanceReport`, `Finding`.
- `kinform_shared.schemas` — Pydantic v2 schemas that match the Zod validators in `../src/validators.ts`.

CI asserts value parity with the TypeScript module.
