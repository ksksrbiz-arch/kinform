"""End-to-end orchestration test (simulate → approve → promote)."""

from app.schemas import ApprovalRequest, CampaignBrief
from app.simulation import promote, run_simulation


def _brief(**overrides):
    base = dict(
        slug="halter-drop-1",
        title="HALTER Drop 1",
        audience="founding members",
        product_category="hoodie",
    )
    base.update(overrides)
    return CampaignBrief(**base)


def test_simulate_persists_and_is_promotable():
    report = run_simulation(_brief())
    assert report.campaign_id is not None
    assert report.governance.ok, report.governance.violations
    # Both required hashtags must be present.
    tags_lower = {t.lower() for t in report.draft.hashtags}
    assert "#kinform" in tags_lower
    assert "#torquedaffiliation" in tags_lower
    # Content fits the budget.
    assert len(report.draft.content) <= 140
    assert report.promotable


def test_approval_flow_simulation_to_production():
    report = run_simulation(_brief(slug="academic-drop-1"))
    cid = report.campaign_id
    assert cid

    # First approval: simulation -> approved
    approved = promote(ApprovalRequest(
        campaign_id=cid, approver="alex@kinform.studio", decision="approve"
    ))
    assert approved.stage == "approved"
    assert approved.approved_by == "alex@kinform.studio"

    # Second approval: approved -> production
    promoted = promote(ApprovalRequest(
        campaign_id=cid, approver="alex@kinform.studio", decision="approve"
    ))
    assert promoted.stage == "production"


def test_rejection_blocks_further_approval():
    report = run_simulation(_brief(slug="fishnet-drop-1"))
    cid = report.campaign_id
    promote(ApprovalRequest(
        campaign_id=cid, approver="alex", decision="reject", note="off-brand"
    ))
    try:
        promote(ApprovalRequest(
            campaign_id=cid, approver="alex", decision="approve"
        ))
    except ValueError as exc:
        assert "rejected" in str(exc).lower()
    else:
        raise AssertionError("expected approval of rejected campaign to fail")


def test_simulation_is_idempotent_on_slug():
    r1 = run_simulation(_brief(slug="idem-drop"))
    r2 = run_simulation(_brief(slug="idem-drop", title="Idem v2"))
    assert r1.campaign_id == r2.campaign_id
