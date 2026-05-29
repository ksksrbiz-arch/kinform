"""HTTP integration tests for the FastAPI surface.

Uses FastAPI's TestClient and overrides the `get_db` dependency to point at
a fresh in-memory SQLite for every test. No real network, no real LLM.
"""

from __future__ import annotations

from collections.abc import Iterator
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from kinform_torqued_graph import Base, Drop
from kinform_persona.app import app, get_db


@pytest.fixture()
def client() -> Iterator[TestClient]:
    # StaticPool keeps the single in-memory connection alive across sessions —
    # otherwise each session opens a fresh empty database.
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    Factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

    # Seed one Drop so /generate has something to hang a campaign off.
    seed = Factory()
    drop = Drop(
        id="drop_fixture_0001",
        slug="fishnet-keystone",
        name="Fishnet Keystone",
        description="Inaugural KINFORM piece.",
        released_at=datetime(2026, 6, 1, tzinfo=timezone.utc),
        status="UPCOMING",
    )
    seed.add(drop)
    seed.commit()
    seed.close()

    def _override() -> Iterator[Session]:
        s = Factory()
        try:
            yield s
        finally:
            s.close()

    app.dependency_overrides[get_db] = _override
    try:
        with TestClient(app) as c:
            yield c
    finally:
        app.dependency_overrides.pop(get_db, None)
        engine.dispose()


def test_health(client: TestClient) -> None:
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_generate_endpoint_full_response(client: TestClient) -> None:
    r = client.post(
        "/campaigns/generate",
        json={"dropId": "drop_fixture_0001", "days": 14, "channel": "instagram"},
    )
    assert r.status_code == 200, r.text
    body = r.json()

    # Shape from integration plan §3.1
    assert set(body.keys()) >= {
        "simulationId",
        "campaignId",
        "status",
        "draft",
        "validation",
        "campaign",
    }
    assert body["status"] in {"AWAITING_APPROVAL", "REJECTED"}
    assert body["draft"]["title"] == "Fishnet Keystone"
    assert "#KINFORM" in body["draft"]["hashtags"]
    assert len(body["draft"]["content"]) <= 140
    assert body["validation"]["passed"] is True

    # Campaign was persisted and is retrievable
    cid = body["campaignId"]
    fetched = client.get(f"/campaigns/{cid}")
    assert fetched.status_code == 200
    assert fetched.json()["campaign"]["id"] == cid


def test_generate_then_approve_then_publish(client: TestClient) -> None:
    gen = client.post(
        "/campaigns/generate",
        json={"dropId": "drop_fixture_0001", "channel": "tiktok"},
    ).json()
    cid = gen["campaignId"]

    # Approval without an approver email must fail validation.
    bad = client.post(f"/campaigns/{cid}/approve", json={})
    assert bad.status_code == 422

    ok = client.post(
        f"/campaigns/{cid}/approve",
        json={"approver": "founder@kinform.local"},
    )
    assert ok.status_code == 200, ok.text
    assert ok.json()["campaign"]["status"] == "APPROVED"
    assert ok.json()["campaign"]["approved_by"] == "founder@kinform.local"

    pub = client.post(f"/campaigns/{cid}/publish")
    assert pub.status_code == 200
    assert pub.json()["campaign"]["status"] == "PUBLISHED"


def test_generate_unknown_drop_404(client: TestClient) -> None:
    r = client.post(
        "/campaigns/generate",
        json={"dropId": "nope", "channel": "email"},
    )
    assert r.status_code == 404
