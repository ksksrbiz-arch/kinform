/**
 * Shared types between Studio, PersonaGenAI client, and bootstrap compiler.
 *
 * These mirror — by hand, intentionally — the Pydantic / Prisma schemas in
 * `packages/torqued-graph` and `packages/shared`. CI's governance check
 * (Phase 4) asserts the enum string values still match.
 */

export type CampaignStatus =
  | "DRAFT"
  | "SIMULATION"
  | "AWAITING_APPROVAL"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

export type CampaignChannel =
  | "instagram"
  | "tiktok"
  | "email"
  | "print"
  | "other";

export interface Campaign {
  id: string;
  slug: string;
  status: CampaignStatus;
  drop_id: string | null;
  content: string;
  ctas: string[];
  hashtags: string[];
  channel: CampaignChannel;
  approved_by: string | null;
  approved_at: string | null;
  published_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface SimulationVerdict {
  agent: string;
  verdict: "PASS" | "WARN" | "FAIL";
  score: number;
  details: Record<string, unknown>;
}

export interface VFile {
  /** Forward-slash path, no leading slash (e.g. "campaigns/fishnet.md"). */
  path: string;
  content: string;
}

/** A campaign is ready to bake iff it is APPROVED or PUBLISHED. */
export function isCampaignReleasable(c: Campaign): boolean {
  return c.status === "APPROVED" || c.status === "PUBLISHED";
}
