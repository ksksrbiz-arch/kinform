"""Idempotent seed for the Torqued Graph.

Creates one Drop, three Products with physicalIds, two AffiliateProfiles,
and a 70/30 TorquedAffiliation split on each product. Safe to re-run.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone

from sqlalchemy import select

from torqued_graph import (
    AffiliateProfile,
    Drop,
    Product,
    TorquedAffiliation,
    get_session,
    init_db,
)


def _get_or_create(session, model, where: dict, defaults: dict | None = None):
    row = session.execute(select(model).filter_by(**where)).scalar_one_or_none()
    if row:
        return row, False
    row = model(**where, **(defaults or {}))
    session.add(row)
    session.flush()
    return row, True


def main() -> None:
    init_db()
    with get_session() as session:
        drop, _ = _get_or_create(
            session, Drop, {"slug": "halter-launch"},
            defaults={"name": "HALTER Launch", "go_live_at": datetime.now(timezone.utc)},
        )

        alex, _ = _get_or_create(
            session, AffiliateProfile, {"handle": "alex"},
            defaults={"display_name": "Alex (Founder)", "email": "alex@kinform.studio", "tier": "anchor"},
        )
        rae, _ = _get_or_create(
            session, AffiliateProfile, {"handle": "rae"},
            defaults={"display_name": "Rae (Ambassador)", "email": "rae@kinform.studio", "tier": "core"},
        )

        seed_products = [
            ("KF-HOODIE-001", "kf-hoodie-001-phy", "HALTER Hoodie", "hoodie", 14000),
            ("KF-CROP-001",   "kf-crop-001-phy",   "FISHNET Crop Top", "crop-top", 9800),
            ("KF-EAR-001",    "kf-ear-001-phy",    "ACADEMIC Earring E1", "earring", 6500),
        ]
        for sku, phys, name, cat, price in seed_products:
            p, _ = _get_or_create(
                session, Product, {"sku": sku},
                defaults={
                    "physical_id": phys, "name": name, "category": cat,
                    "base_price_cents": price,
                    "metadata_json": json.dumps({"batch": "seed"}),
                    "drop_id": drop.id,
                },
            )
            for affiliate, share, role in [(alex, 700, "designer"), (rae, 300, "ambassador")]:
                _get_or_create(
                    session, TorquedAffiliation,
                    {"product_id": p.id, "affiliate_id": affiliate.id, "role": role},
                    defaults={"share_permille": share},
                )

        print("Seeded Torqued Graph: drop=halter-launch, products=3, affiliates=2")


if __name__ == "__main__":
    main()
