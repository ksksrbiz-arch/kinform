"""FastAPI entry point for KINFORM PersonaGenAI.

Endpoints:

* ``GET  /health``                       — liveness + rules version
* ``POST /campaigns/simulate``           — orchestrate agents and stage a draft
* ``POST /campaigns/preview``            — same, but never persists
* ``POST /campaigns/approve``            — human approval / rejection gate
* ``GET  /campaigns``                    — list (optionally filter by stage)
* ``GET  /campaigns/{id}``               — single campaign record
* ``POST /revenue/scan``                 — record a scan / sale RevenueEvent

CORS is open by default to ``KINFORM_ALLOWED_ORIGINS`` (comma-separated) so
the Payload Studio can call this service from the browser in dev.
"""
from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from typing import Optional

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select

from torqued_graph import (
    Product,
    RevenueEvent,
    TorquedAffiliation,
    get_session,
    init_db,
)

from . import __version__
from .schemas import (
    ApprovalRequest,
    CampaignBrief,
    CampaignRecord,
    HealthResponse,
    SimulationReport,
)
from .simulation import (
    get_campaign,
    list_campaigns,
    promote,
    run_simulation,
)
from kinform_shared.governance import GOVERNANCE_RULES_VERSION

log = logging.getLogger("kinform.persona_genai")
logging.basicConfig(
    level=os.getenv("KINFORM_LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)


def _allowed_origins() -> list[str]:
    raw = os.getenv(
        "KINFORM_ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:3001",
    )
    return [o.strip() for o in raw.split(",") if o.strip()]


@asynccontextmanager
async def _lifespan(_app: FastAPI):
    init_db()
    log.info(
        "KINFORM-AEO PersonaGenAI booted: version=%s rules=%s",
        __version__,
        GOVERNANCE_RULES_VERSION,
    )
    yield


app = FastAPI(
    title="KINFORM PersonaGenAI",
    version=__version__,
    description=(
        "Multi-agent campaign orchestrator for the KINFORM Autonomous "
        "Ecosystem Orchestrator (KINFORM-AEO). Human approval required "
        "before any campaign reaches production."
    ),
    lifespan=_lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(version=__version__, rules_version=GOVERNANCE_RULES_VERSION)


@app.post("/campaigns/preview", response_model=SimulationReport)
def preview(brief: CampaignBrief) -> SimulationReport:
    return run_simulation(brief, persist=False)


@app.post("/campaigns/simulate", response_model=SimulationReport)
def simulate(brief: CampaignBrief) -> SimulationReport:
    return run_simulation(brief, persist=True)


@app.post("/campaigns/approve", response_model=CampaignRecord)
def approve(req: ApprovalRequest) -> CampaignRecord:
    try:
        return promote(req)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@app.get("/campaigns", response_model=list[CampaignRecord])
def campaigns(stage: Optional[str] = Query(default=None)) -> list[CampaignRecord]:
    return list_campaigns(stage)


@app.get("/campaigns/{campaign_id}", response_model=CampaignRecord)
def campaign(campaign_id: str) -> CampaignRecord:
    rec = get_campaign(campaign_id)
    if rec is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return rec


# --- Revenue ingestion -----------------------------------------------------


class ScanRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    physical_id: str = Field(min_length=1, max_length=200)
    kind: str = Field(default="scan", pattern=r"^(scan|sale|callback)$")
    amount_cents: int = Field(default=0, ge=0, le=1_000_000_00)
    currency: str = Field(default="USD", min_length=3, max_length=8)


class ScanResponse(BaseModel):
    revenue_event_id: str
    product_id: str
    split: list[dict]
    amount_cents: int
    currency: str


def _split_payout(amount_cents: int, edges: list[TorquedAffiliation]) -> list[dict]:
    out: list[dict] = []
    if not edges:
        return out
    total_permille = sum(e.share_permille for e in edges)
    if total_permille <= 0:
        return out
    for e in edges:
        out.append(
            {
                "affiliateId": e.affiliate_id,
                "sharePermille": e.share_permille,
                "payoutCents": int(amount_cents * e.share_permille / 1000),
            }
        )
    return out


@app.post("/revenue/scan", response_model=ScanResponse)
def revenue_scan(req: ScanRequest) -> ScanResponse:
    """Record a physical scan / sale and compute the per-affiliate split.

    Idempotency note: clients should include a per-scan ``physical_id`` and
    handle duplicates via their own request-id middleware; this endpoint
    intentionally records every call so high-frequency NFC taps remain
    auditable.
    """

    init_db()
    with get_session() as session:
        product = session.execute(
            select(Product).where(Product.physical_id == req.physical_id)
        ).scalar_one_or_none()
        if product is None:
            raise HTTPException(
                status_code=404,
                detail=f"No product registered for physical_id={req.physical_id!r}",
            )

        edges = list(
            session.execute(
                select(TorquedAffiliation).where(
                    TorquedAffiliation.product_id == product.id,
                    TorquedAffiliation.deactivated_at.is_(None),
                )
            )
            .scalars()
            .all()
        )
        split = _split_payout(req.amount_cents, edges)
        primary = edges[0].affiliate_id if edges else None

        event = RevenueEvent(
            product_id=product.id,
            affiliate_id=primary,
            kind=req.kind,
            amount_cents=req.amount_cents,
            currency=req.currency,
            split_json=json.dumps(split),
            occurred_at=datetime.now(timezone.utc),
            source_physical_id=req.physical_id,
        )
        session.add(event)
        session.flush()
        return ScanResponse(
            revenue_event_id=event.id,
            product_id=product.id,
            split=split,
            amount_cents=req.amount_cents,
            currency=req.currency,
        )
