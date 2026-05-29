/**
 * KINFORM Torqued Graph — shared TypeScript types.
 *
 * These hand-written types intentionally do NOT depend on the generated
 * Prisma client so they can be imported by edge / serverless contexts and
 * by the Polymorphic Bootstrapping Compiler. They are kept in lockstep with
 * `prisma/schema.prisma` and `python/torqued_graph/models.py`.
 */

export type CampaignStage =
  | "simulation"
  | "approved"
  | "production"
  | "rejected";

export interface Product {
  id: string;
  physicalId: string;
  sku: string;
  name: string;
  category: string;
  basePriceCents: number;
  metadata?: string | null;
  dropId?: string | null;
}

export interface AffiliateProfile {
  id: string;
  handle: string;
  displayName: string;
  email: string;
  payoutAddress?: string | null;
  tier: "seed" | "core" | "anchor" | string;
}

export interface TorquedAffiliation {
  id: string;
  productId: string;
  affiliateId: string;
  sharePermille: number; // parts per thousand
  role: string;
  activatedAt: string;
  deactivatedAt?: string | null;
}

export interface RevenueSplitEntry {
  affiliateId: string;
  sharePermille: number;
  payoutCents: number;
}

export interface RevenueEvent {
  id: string;
  productId: string;
  affiliateId?: string | null;
  kind: "scan" | "sale" | "callback" | string;
  amountCents: number;
  currency: string;
  /**
   * Deserialised form of the DB column `splitJson` (Prisma stores it as a
   * `String`; this interface exposes the parsed array for callers).
   * Re-serialise with `JSON.stringify(event.split)` before writing.
   */
  split: RevenueSplitEntry[];
  occurredAt: string;
  sourcePhysicalId?: string | null;
}

export interface CampaignCTA {
  verb: string;
  url: string;
  label: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  content: string;
  hashtags: string[];
  cta: CampaignCTA;
  stage: CampaignStage;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rulesVersion: string;
  dropId?: string | null;
}

export interface ValidationLog {
  id: string;
  campaignId: string;
  source: "persona-genai" | "ci-pipeline" | "manual" | string;
  ok: boolean;
  rulesVersion: string;
  violations: { code: string; message: string; field: string }[];
  warnings: string[];
  createdAt: string;
}

export interface Drop {
  id: string;
  slug: string;
  name: string;
  goLiveAt: string;
  retiredAt?: string | null;
}
