"""SQLAlchemy engine / session helpers.

Reads :envvar:`DATABASE_URL`. Translates the Prisma-style SQLite URL
``file:./path/to/db.sqlite`` into the SQLAlchemy form ``sqlite:///path/to/db``
automatically so the same env var works for both ORMs.
"""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


class Base(DeclarativeBase):
    """SQLAlchemy declarative base shared by all Torqued Graph models."""


def _normalise_url(raw: str) -> str:
    """Convert Prisma's ``file:./x.db`` form to SQLAlchemy's ``sqlite:///x.db``.

    Passes through anything else (``postgresql://…``, ``mysql://…``) unchanged.
    """
    if raw.startswith("file:"):
        rel = raw[len("file:") :]
        # Resolve relative to CWD, matching Prisma's behaviour for `file:./`.
        path = Path(rel).expanduser().resolve()
        return f"sqlite:///{path}"
    return raw


def engine_from_url(url: str) -> Engine:
    """Build an :class:`Engine` from a Prisma- or SQLAlchemy-form URL."""
    normalised = _normalise_url(url)
    connect_args: dict[str, object] = {}
    if normalised.startswith("sqlite:"):
        # SQLite + multithreaded FastAPI workers — disable thread check.
        connect_args["check_same_thread"] = False
    return create_engine(normalised, connect_args=connect_args, future=True)


@lru_cache(maxsize=1)
def get_engine() -> Engine:
    """Return the process-wide engine bound to :envvar:`DATABASE_URL`."""
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise RuntimeError(
            "DATABASE_URL is not set. Copy .env.example to .env at the repo root."
        )
    return engine_from_url(url)


@lru_cache(maxsize=1)
def get_sessionmaker() -> sessionmaker[Session]:
    """Return the process-wide session factory."""
    return sessionmaker(bind=get_engine(), autoflush=False, expire_on_commit=False)


def SessionLocal() -> Session:  # noqa: N802 — kept as the conventional alias
    """Create a new session bound to the process engine."""
    return get_sessionmaker()()
