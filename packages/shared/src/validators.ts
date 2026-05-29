// =============================================================================
// Zod validators for campaigns and revenue events
// =============================================================================
//
// These schemas are the runtime equivalent of `packages/torqued-graph/src/types.ts`.
// Use them at every system boundary (HTTP body parsing, IDE form input, etc.).
//
// =============================================================================

import { z } from "zod";
import {
  AffiliateTier,
  CampaignChannel,
  CampaignStatus,
  ProductCategory,
  RevenueEventKind,
} from "@kinform/torqued-graph";
import { CONTENT_MAX_LENGTH } from "./branding";

const enumValues = <T extends Record<string, string>>(e: T) =>
  Object.values(e) as [string, ...string[]];

export const CampaignCandidateSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "slug must be kebab-case lowercase"),
  content: z.string().min(1).max(CONTENT_MAX_LENGTH),
  ctas: z.array(z.string().min(1).max(60)).min(1).max(5),
  hashtags: z.array(z.string().regex(/^#[A-Za-z0-9_]+$/)).min(1).max(10),
  channel: z.enum(enumValues(CampaignChannel)).default(CampaignChannel.INSTAGRAM),
  dropId: z.string().cuid().nullish(),
});
export type CampaignCandidate = z.infer<typeof CampaignCandidateSchema>;

export const CampaignSchema = CampaignCandidateSchema.extend({
  id: z.string(),
  status: z.enum(enumValues(CampaignStatus)),
  approvedBy: z.string().email().nullable(),
  approvedAt: z.coerce.date().nullable(),
  publishedAt: z.coerce.date().nullable(),
  rejectedReason: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Campaign = z.infer<typeof CampaignSchema>;

export const RevenueEventSchema = z.object({
  kind: z.enum(enumValues(RevenueEventKind)),
  amountCents: z.number().int().nonnegative(),
  payoutCents: z.number().int().nonnegative(),
  metadata: z.record(z.string(), z.unknown()).nullish(),
  productId: z.string(),
  affiliateId: z.string().nullish(),
  affiliationId: z.string().nullish(),
});
export type RevenueEventInput = z.infer<typeof RevenueEventSchema>;

export const ApprovalRequestSchema = z.object({
  campaignId: z.string(),
  approver: z.string().email(),
  decision: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().max(500).optional(),
});
export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;

export const ProductCreateSchema = z.object({
  sku: z.string().min(3).max(64),
  physicalId: z.string().min(3).max(128),
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  category: z.enum(enumValues(ProductCategory)),
  priceCents: z.number().int().positive(),
  dropId: z.string().nullish(),
});
export type ProductCreate = z.infer<typeof ProductCreateSchema>;

export const AffiliateCreateSchema = z.object({
  handle: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/),
  displayName: z.string().min(1).max(120),
  email: z.string().email(),
  tier: z.enum(enumValues(AffiliateTier)).default(AffiliateTier.SEED),
  defaultShareBps: z.number().int().min(0).max(10_000).default(1000),
});
export type AffiliateCreate = z.infer<typeof AffiliateCreateSchema>;
