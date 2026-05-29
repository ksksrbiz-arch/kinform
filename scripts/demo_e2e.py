#!/usr/bin/env python3
"""End-to-end KINFORM-AEO demo.

Runs entirely in-process — no servers, no network. Demonstrates that every
moving part fits together:

  1. Bootstrap a fresh in-memory database.
  2. Seed a Drop, create a Campaign in DRAFT.
  3. Simulate it through Brand Voice → Compliance → Analytics → Supervisor.
  4. Refuse to APPROVE without an approver, then approve with one.
  5. Publish.
  6. Print the final state + every ValidationLog.

This is the simplest possible "does it all work?" smoke test. CI also runs
it via `make demo` so a green pipeline implies a working pipeline.
"""

from __future__ import annotations

import sys
from datetime import datetime, timezone

from sqlalchemy.orm import sessionmaker

from kinform_torqued_graph import (
    Base,
    Campaign,
    CampaignStatus,
    Drop,
    engine_from_url,
)
from kinform_torqued_graph.json import decode_json

from kinform_persona import repository
from kinform_persona.llm import StubProvider
from kinform_persona.simulation import simulate_campaign


def main() -> int:
    print("KINFORM-AEO end-to-end demo")
    print("=" * 60)

    engine = engine_from_url("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    session = Session()

    drop = Drop(
        slug="fishnet-keystone",
        name="Fishnet Keystone",
        description="Inaugural KINFORM piece — woven mesh, brass keystone tag.",
        released_at=datetime(2026, 6, 1, tzinfo=timezone.utc),
        status="UPCOMING",
    )
    session.add(drop)
    session.commit()
    print(f"\n[1/5] Seeded Drop {drop.slug!r}.")

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
    print(f"[2/5] Created Campaign {campaign.slug!r} → status={campaign.status}")

    campaign, final = simulate_campaign(
        session,
        campaign,
        provider=StubProvider(),
        drop_name=drop.name,
        drop_description=drop.description,
        seed="demo",
    )
    session.commit()
    print(
        f"[3/5] Simulated → status={campaign.status} "
        f"supervisor={final.verdict} score={final.score}"
    )
    print(f"      Draft body: {campaign.content!r}")

    # Refuse approval without an approver.
    try:
        repository.transition_status(
            session,
            campaign,
            to_status=CampaignStatus.APPROVED,
            approved_by=None,
        )
        print("[!] BUG: approval without approver should have failed.")
        return 1
    except Exception as exc:
        print(f"[4/5] Correctly refused approval without approver: {exc.__class__.__name__}")

    repository.transition_status(
        session,
        campaign,
        to_status=CampaignStatus.APPROVED,
        approved_by="founder@kinform.local",
    )
    session.commit()
    print(f"      Approved by {campaign.approved_by} at {campaign.approved_at}")

    repository.transition_status(session, campaign, to_status=CampaignStatus.PUBLISHED)
    session.commit()
    print(f"[5/5] Published at {campaign.published_at}")

    print("\nValidationLog trail:")
    fresh: Campaign = session.get(Campaign, campaign.id)
    for log in fresh.validation_logs:
        details = decode_json(log.details)
        print(
            f"  - {log.agent:<12} verdict={log.verdict:<4} "
            f"score={log.score:>3}  details_keys={list(details)[:3]}"
        )

    print("\n" + "=" * 60)
    print("Final Campaign state:")
    print(f"  slug         = {fresh.slug}")
    print(f"  status       = {fresh.status}")
    print(f"  channel      = {fresh.channel}")
    print(f"  approved_by  = {fresh.approved_by}")
    print(f"  ctas         = {decode_json(fresh.ctas)}")
    print(f"  hashtags     = {decode_json(fresh.hashtags)}")
    print("\n✓ demo complete")
    return 0


if __name__ == "__main__":
    sys.exit(main())
