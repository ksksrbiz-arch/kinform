"""Process-wide configuration read from environment variables.

Kept tiny on purpose: env reads happen once at import time, downstream code
takes ``Settings`` as a dependency so tests can construct it explicitly.
"""

from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    llm_provider: str
    host: str
    port: int
    default_approver: str

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            llm_provider=os.environ.get("KINFORM_LLM_PROVIDER", "stub"),
            host=os.environ.get("PERSONA_GENAI_HOST", "0.0.0.0"),
            port=int(os.environ.get("PERSONA_GENAI_PORT", "8088")),
            default_approver=os.environ.get(
                "KINFORM_DEFAULT_APPROVER", "founder@kinform.local"
            ),
        )
