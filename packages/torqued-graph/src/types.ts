// =============================================================================
// Plain TypeScript shapes mirroring the Prisma models.
//
// These are the structural types consumed by other workspaces *without* having
// to import the Prisma client (which carries a substantial runtime cost in
// edge environments). The Prisma-generated types remain the source of truth
// for query inputs/outputs.
// =============================================================================

import type {
  AffiliateTier,
  CampaignChannel,
  CampaignStatus,
  DropStatus,
  ProductCategory,
  RevenueEventKind,
  ValidationAgent,
  ValidationVerdict,
} from "./enums";

export interface Drop {
  id: string;
  slug: string;
  name: string;
  description: string;
  releasedAt: Date;
  status: DropStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  sku: string;
  physicalId: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceCents: number;
  available: boolean;
  dropId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AffiliateProfile {
  id: string;
  handle: string;
  displayName: string;
  email: string;
  tier: AffiliateTier;
  payoutConfig: Record<string, unknown> | null;
  defaultShareBps: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TorquedAffiliation {
  id: string;
  productId: string;
  affiliateId: string;
  shareBps: number | null;
  weight: number;
  startsAt: Date;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RevenueEvent {
  id: string;
  kind: RevenueEventKind;
  amountCents: number;
  payoutCents: number;
  metadata: Record<string, unknown> | null;
  productId: string;
  affiliateId: string | null;
  affiliationId: string | null;
  occurredAt: Date;
}

export interface Campaign {
  id: string;
  slug: string;
  status: CampaignStatus;
  dropId: string | null;
  content: string;
  ctas: string[];
  hashtags: string[];
  channel: CampaignChannel;
  approvedBy: string | null;
  approvedAt: Date | null;
  publishedAt: Date | null;
  rejectedReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidationLogDetails {
  violations?: string[];
  suggestions?: string[];
  metrics?: Record<string, number>;
  notes?: string;
}

export interface ValidationLog {
  id: string;
  campaignId: string;
  agent: ValidationAgent;
  verdict: ValidationVerdict;
  score: number;
  details: ValidationLogDetails;
  actor: string | null;
  createdAt: Date;
}
