"""LLM provider abstraction.

The agentic layer never imports a concrete LLM SDK. It depends on
:class:`LLMProvider`, and concrete providers are chosen at startup via
:func:`get_provider`. This makes air-gapped CI runs trivial (the default
``StubProvider`` is deterministic and offline) and lets us swap to OpenAI /
Anthropic / Ollama by changing one env var.

The provider returns a single structured draft per request. Agents are
responsible for any further reasoning over that draft.
"""

from __future__ import annotations

import hashlib
import os
from dataclasses import dataclass
from typing import Protocol

from kinform_shared.branding import APPROVED_CTAS, BRAND, REQUIRED_HASHTAGS


@dataclass(frozen=True)
class DraftRequest:
    """Inputs the supervisor hands to the provider."""

    drop_slug: str
    drop_name: str
    drop_description: str
    channel: str
    seed: str | None = None


@dataclass(frozen=True)
class DraftResponse:
    """Structured campaign draft returned by the provider."""

    content: str
    ctas: list[str]
    hashtags: list[str]


class LLMProvider(Protocol):
    """Anything that can produce a :class:`DraftResponse` for a request."""

    name: str

    def draft_campaign(self, request: DraftRequest) -> DraftResponse:  # pragma: no cover - Protocol
        ...


# ---------------------------------------------------------------------------
# StubProvider — the deterministic, offline default
# ---------------------------------------------------------------------------
class StubProvider:
    """Deterministic generator that produces schema-valid KINFORM copy.

    Seeded by ``(drop_slug, channel, optional seed)``. The same inputs always
    produce the same output, which is exactly what we want for CI and for
    reproducible bootstrapper payloads.
    """

    name = "stub"

    # A handful of voice fragments — picked deterministically by hash.
    _OPENERS: tuple[str, ...] = (
        "Drop in.",
        "Pull the thread.",
        "The lattice tightens.",
        "Tag scanned. Network engaged.",
        "Quiet signal.",
        "First lock.",
    )
    _BRIDGES: tuple[str, ...] = (
        "Wear becomes signal.",
        "Every stitch is a node.",
        "Movement compounds.",
        "Edges activate on contact.",
    )

    def draft_campaign(self, request: DraftRequest) -> DraftResponse:
        h = self._hash(request)
        opener = self._OPENERS[h % len(self._OPENERS)]
        bridge = self._BRIDGES[(h // 7) % len(self._BRIDGES)]
        cta = APPROVED_CTAS[h % len(APPROVED_CTAS)]

        # Compose under the 140-char cap. Drop name is included for context.
        body = f"{opener} {request.drop_name}. {bridge} {cta}."
        if len(body) > 140:
            body = body[:140].rstrip()

        return DraftResponse(
            content=body,
            ctas=[cta],
            hashtags=list(REQUIRED_HASHTAGS) + [f"#{request.drop_slug.replace('-', '')}"],
        )

    @staticmethod
    def _hash(request: DraftRequest) -> int:
        key = f"{request.drop_slug}|{request.channel}|{request.seed or ''}|{BRAND.name}"
        return int(hashlib.sha256(key.encode("utf-8")).hexdigest(), 16) % (2**32)


# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------
def get_provider(name: str | None = None) -> LLMProvider:
    """Resolve a provider by name. Defaults to the env-configured choice.

    Unknown names raise ``ValueError`` rather than silently falling back, so a
    typo in production fails loudly instead of shipping the stub.
    """
    chosen = (name or os.environ.get("KINFORM_LLM_PROVIDER") or "stub").lower()
    if chosen == "stub":
        return StubProvider()
    raise ValueError(
        f"Unknown KINFORM_LLM_PROVIDER {chosen!r}. "
        "Only 'stub' is bundled today; wire 'openai'/'anthropic' here when ready."
    )
