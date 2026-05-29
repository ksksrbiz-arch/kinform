"""Pytest fixtures — give every test its own SQLite DB."""

import os
import pathlib
import tempfile

import pytest


@pytest.fixture(autouse=True)
def _isolated_db(monkeypatch: pytest.MonkeyPatch) -> None:
    tmp = tempfile.mkdtemp(prefix="kinform-test-")
    db_path = pathlib.Path(tmp) / "test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{db_path}")
    # Reset the lazy singletons in torqued_graph.database
    import torqued_graph.database as dbmod

    dbmod._engine = None
    dbmod._SessionLocal = None
    yield
