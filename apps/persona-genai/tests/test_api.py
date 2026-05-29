"""FastAPI integration tests."""

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["service"] == "kinform-persona-genai"
    assert body["rules_version"]


def test_preview_does_not_persist():
    r = client.post(
        "/campaigns/preview",
        json={
            "slug": "preview-only",
            "title": "Preview only",
            "audience": "core list",
            "product_category": "earring",
        },
    )
    assert r.status_code == 200, r.text
    assert r.json()["campaign_id"] is None
    # And the list endpoint should not contain it.
    listed = client.get("/campaigns").json()
    assert all(c["slug"] != "preview-only" for c in listed)


def test_simulate_and_approve_flow():
    sim = client.post(
        "/campaigns/simulate",
        json={
            "slug": "e2e-drop",
            "title": "E2E Drop",
            "audience": "founding members",
            "product_category": "hoodie",
        },
    ).json()
    cid = sim["campaign_id"]
    assert cid

    a1 = client.post(
        "/campaigns/approve",
        json={"campaign_id": cid, "approver": "alex", "decision": "approve"},
    )
    assert a1.status_code == 200
    assert a1.json()["stage"] == "approved"

    a2 = client.post(
        "/campaigns/approve",
        json={"campaign_id": cid, "approver": "alex", "decision": "approve"},
    )
    assert a2.status_code == 200
    assert a2.json()["stage"] == "production"


def test_revenue_scan_404_on_unknown_product():
    r = client.post("/revenue/scan", json={"physical_id": "does-not-exist"})
    assert r.status_code == 404
