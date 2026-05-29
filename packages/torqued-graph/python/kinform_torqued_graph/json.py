"""JSON helpers for fields stored as TEXT in the Prisma schema.

Mirror of ``packages/torqued-graph/src/json.ts``. Use :func:`encode_json` on
writes and :func:`decode_json` on reads.
"""

from __future__ import annotations

import json
from typing import Any, TypeVar

T = TypeVar("T")


def encode_json(value: Any) -> str:
    return json.dumps(value if value is not None else None, separators=(",", ":"))


def encode_json_nullable(value: Any) -> str | None:
    if value is None:
        return None
    return json.dumps(value, separators=(",", ":"))


def decode_json(raw: str) -> Any:
    return json.loads(raw)


def decode_json_nullable(raw: str | None) -> Any:
    if raw is None:
        return None
    return json.loads(raw)
