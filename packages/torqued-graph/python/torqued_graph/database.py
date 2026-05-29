"""Database engine + session helpers for the Torqued Graph (Python side).

Defaults to a local SQLite file (``./kinform_aeo.db``) so a developer can
``pip install -e .[dev]`` and immediately run the FastAPI service with zero
infra. Override ``DATABASE_URL`` for Postgres in production.
"""
from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


class Base(DeclarativeBase):
    """Declarative base for all Torqued Graph models."""


_engine: Engine | None = None
_SessionLocal: sessionmaker[Session] | None = None


def _default_url() -> str:
    return os.getenv("DATABASE_URL", "sqlite:///./kinform_aeo.db")


def get_engine() -> Engine:
    """Lazily build (and memoise) the process-wide SQLAlchemy engine."""

    global _engine, _SessionLocal
    if _engine is None:
        url = _default_url()
        # SQLite + threading needs check_same_thread=False for FastAPI.
        connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
        _engine = create_engine(url, future=True, connect_args=connect_args)
        _SessionLocal = sessionmaker(
            bind=_engine, autoflush=False, autocommit=False, future=True
        )
    return _engine


def init_db() -> None:
    """Create all tables. Idempotent — safe to call on every boot."""

    # Import models so they register with Base.metadata before create_all.
    from . import models  # noqa: F401

    engine = get_engine()
    Base.metadata.create_all(engine)


@contextmanager
def get_session() -> Iterator[Session]:
    """Context-managed SQLAlchemy session with auto-commit / rollback."""

    get_engine()  # ensure _SessionLocal is built
    assert _SessionLocal is not None
    session = _SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
