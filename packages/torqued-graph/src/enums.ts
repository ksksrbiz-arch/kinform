// =============================================================================
// KINFORM Torqued Graph — enum constants
// =============================================================================
//
// Prisma cannot enforce enums on SQLite, so enums live here as `const` arrays
// + string-literal union types. The Python mirror in
// `packages/torqued-graph/python/kinform_torqued_graph/enums.py` keeps the
// exact same values. CI asserts parity.
//
// =============================================================================

export const DropStatus = {
  DRAFT: "DRAFT",
  UPCOMING: "UPCOMING",
  LIVE: "LIVE",
  ARCHIVED: "ARCHIVED",
} as const;
export type DropStatus = (typeof DropStatus)[keyof typeof DropStatus];

export const ProductCategory = {
  APPAREL: "APPAREL",
  JEWELRY: "JEWELRY",
  ACCESSORY: "ACCESSORY",
} as const;
export type ProductCategory =
  (typeof ProductCategory)[keyof typeof ProductCategory];

export const AffiliateTier = {
  SEED: "SEED",
  BLOOM: "BLOOM",
  TORQUE: "TORQUE",
  KEYSTONE: "KEYSTONE",
} as const;
export type AffiliateTier =
  (typeof AffiliateTier)[keyof typeof AffiliateTier];

export const RevenueEventKind = {
  SCAN: "SCAN",
  ATTRIBUTED_PURCHASE: "ATTRIBUTED_PURCHASE",
  PASS_THROUGH: "PASS_THROUGH",
  ADJUSTMENT: "ADJUSTMENT",
} as const;
export type RevenueEventKind =
  (typeof RevenueEventKind)[keyof typeof RevenueEventKind];

export const CampaignStatus = {
  DRAFT: "DRAFT",
  SIMULATION: "SIMULATION",
  AWAITING_APPROVAL: "AWAITING_APPROVAL",
  APPROVED: "APPROVED",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
} as const;
export type CampaignStatus =
  (typeof CampaignStatus)[keyof typeof CampaignStatus];

/** Legal forward transitions for Campaign.status. */
export const CampaignTransitions: Readonly<
  Record<CampaignStatus, readonly CampaignStatus[]>
> = {
  DRAFT: ["SIMULATION"],
  SIMULATION: ["AWAITING_APPROVAL", "REJECTED"],
  AWAITING_APPROVAL: ["APPROVED", "REJECTED"],
  APPROVED: ["PUBLISHED", "REJECTED"],
  PUBLISHED: [],
  REJECTED: [],
} as const;

export function canTransitionCampaign(
  from: CampaignStatus,
  to: CampaignStatus,
): boolean {
  return CampaignTransitions[from].includes(to);
}

export const ValidationAgent = {
  BRAND_VOICE: "BRAND_VOICE",
  COMPLIANCE: "COMPLIANCE",
  ANALYTICS: "ANALYTICS",
  HUMAN: "HUMAN",
  SUPERVISOR: "SUPERVISOR",
} as const;
export type ValidationAgent =
  (typeof ValidationAgent)[keyof typeof ValidationAgent];

export const ValidationVerdict = {
  PASS: "PASS",
  FAIL: "FAIL",
  WARN: "WARN",
} as const;
export type ValidationVerdict =
  (typeof ValidationVerdict)[keyof typeof ValidationVerdict];

export const CampaignChannel = {
  INSTAGRAM: "instagram",
  TIKTOK: "tiktok",
  EMAIL: "email",
  PRINT: "print",
  OTHER: "other",
} as const;
export type CampaignChannel =
  (typeof CampaignChannel)[keyof typeof CampaignChannel];
