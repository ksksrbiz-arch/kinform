"""End-to-end pipeline test.

Drives a Campaign through every legal transition using an in-memory SQLite
database. No network, no real LLM, no FastAPI server — just the pure
domain layer + state machine + repository.
"""

from __future__ import annotations

from collections.abc import Iterator
from datetime import datetime, timezone

import pytest
from sqlalchemy.orm import Session, sessionmaker

from kinform_torqued_graph import (
    Base,
    Campaign,
    CampaignStatus,
    Drop,
    ValidationAgent,
    ValidationVerdict,
    engine_from_url,
)

from kinform_persona import repository
from kinform_persona.llm import StubProvider
from kinform_persona.simulation import simulate_campaign
from kinform_persona.state_machine import (
    IllegalTransitionError,
    assert_human_approval,
    assert_transition,
)


@pytest.fixture()
def session() -> Iterator[Session]:
    engine = engine_from_url("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    SessionFactory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    s = SessionFactory()
    try:
        yield s
    finally:
        s.close()
        engine.dispose()


@pytest.fixture()
def drop(session: Session) -> Drop:
    drop = Drop(
        slug="fishnet-keystone",
        name="Fishnet Keystone",
        description="Inaugural KINFORM piece — woven mesh, brass keystone tag.",
        released_at=datetime(2025, 1, 1, tzinfo=timezone.utc),
        status="UPCOMING",
    )
    session.add(drop)
    session.commit()
    return drop


def test_full_pipeline_draft_to_publish(session: Session, drop: Drop) -> None:
    # 1. Create DRAFT
    campaign = repository.create_draft(
        session,
        slug="fishnet-launch",
        content="placeholder",
        ctas=["Scan the tag"],
        hashtags=["#KINFORM", "#TorquedAffiliation"],
        channel="instagram",
        drop_id=drop.id,
    )
    session.commit()
    assert campaign.status == CampaignStatus.DRAFT

    # 2. Simulate → AWAITING_APPROVAL (stub provider is governance-clean)
    campaign, final = simulate_campaign(
        session,
        campaign,
        provider=StubProvider(),
        drop_name=drop.name,
        drop_description=drop.description,
        seed="t1",
    )
    session.commit()
    assert campaign.status == CampaignStatus.AWAITING_APPROVAL
    assert final.agent == ValidationAgent.SUPERVISOR
    assert final.verdict in {ValidationVerdict.PASS, ValidationVerdict.WARN}

    # Four logs: brand_voice, compliance, analytics, supervisor
    assert len(campaign.validation_logs) == 4
    agents_logged = {log.agent for log in campaign.validation_logs}
    assert agents_logged == {
        ValidationAgent.BRAND_VOICE,
        ValidationAgent.COMPLIANCE,
        ValidationAgent.ANALYTICS,
        ValidationAgent.SUPERVISOR,
    }

    # Draft was actually written into the campaign body
    assert "placeholder" not in campaign.content

    # 3. Approving without an approver MUST fail
    with pytest.raises(IllegalTransitionError):
        repository.transition_status(
            session,
            campaign,
            to_status=CampaignStatus.APPROVED,
            approved_by=None,
        )

    # 4. Approve with a real approver
    repository.transition_status(
        session,
        campaign,
        to_status=CampaignStatus.APPROVED,
        approved_by="founder@kinform.local",
    )
    session.commit()
    assert campaign.status == CampaignStatus.APPROVED
    assert campaign.approved_by == "founder@kinform.local"
    assert campaign.approved_at is not None

    # 5. Publish
    repository.transition_status(session, campaign, to_status=CampaignStatus.PUBLISHED)
    session.commit()
    assert campaign.status == CampaignStatus.PUBLISHED
    assert campaign.published_at is not None


def test_illegal_transitions_are_blocked() -> None:
    # Cannot skip from DRAFT straight to APPROVED
    with pytest.raises(IllegalTransitionError):
        assert_transition(CampaignStatus.DRAFT, CampaignStatus.APPROVED)
    # Cannot leave PUBLISHED
    with pytest.raises(IllegalTransitionError):
        assert_transition(CampaignStatus.PUBLISHED, CampaignStatus.DRAFT)
    # Cannot leave REJECTED
    with pytest.raises(IllegalTransitionError):
        assert_transition(CampaignStatus.REJECTED, CampaignStatus.DRAFT)


def test_human_approval_required() -> None:
    with pytest.raises(IllegalTransitionError):
        assert_human_approval(CampaignStatus.APPROVED, None)
    # No-op for non-APPROVED targets
    assert_human_approval(CampaignStatus.PUBLISHED, None)


def test_stub_provider_is_deterministic() -> None:
    from kinform_persona.llm import DraftRequest

    provider = StubProvider()
    req = DraftRequest(
        drop_slug="fishnet-keystone",
        drop_name="Fishnet Keystone",
        drop_description="x",
        channel="instagram",
        seed="seed-A",
    )
    a = provider.draft_campaign(req)
    b = provider.draft_campaign(req)
    assert a == b
    assert "#KINFORM" in a.hashtags
    assert "#TorquedAffiliation" in a.hashtags
    assert len(a.content) <= 140
