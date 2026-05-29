# `packages/shared`

Cross-language governance rules for **KINFORM-AEO**.

This package is the single source of truth for:

- Character budget for marketing copy (`MAX_CONTENT_CHARS`)
- Required hashtags (`#KINFORM`, `#TorquedAffiliation`)
- Banned phrases (high-risk financial / FTC red flags)
- Required call-to-action vocabulary
- The human-approval gate

Two parallel implementations are kept in lockstep:

| Language   | Entry point                                      |
| ---------- | ------------------------------------------------ |
| Python     | `python/kinform_shared/governance.py`            |
| TypeScript | `ts/governance.ts`                               |

Whenever you change one, change the other **and** bump
`GOVERNANCE_RULES_VERSION`. The GitHub Actions governance pipeline pins on
that version and will fail builds whose validated campaigns reference an
older rule set.
