// =============================================================================
// KINFORM branding constants
// =============================================================================
//
// SINGLE source of truth for the working brand name and required tokens.
// To rename the project (e.g. KINFORM → something else), edit ONLY this file
// and the Python mirror at `packages/shared/python/kinform_shared/branding.py`.
// Marketing copy lives separately in `apps/storefront/MARKETING-CAPTIONS.md`
// and is intentionally not derived from these constants.
//
// =============================================================================

export const BRAND = {
  /** Working title for the brand. */
  name: "KINFORM",
  /** Internal system name (the orchestrator). */
  systemName: "KINFORM-AEO",
  /** Tagline for headers / OG metadata. */
  tagline: "Wear the network.",
  /** Affiliate programme name (TM). */
  programme: "Torqued Affiliation",
} as const;

/**
 * Hashtags that MUST appear on every approved campaign, in canonical form.
 * Compliance enforcement is case-insensitive but the canonical casing is
 * what we recommend in suggestions.
 */
export const REQUIRED_HASHTAGS: readonly string[] = [
  "#KINFORM",
  "#TorquedAffiliation",
];

/**
 * Vocabulary of acceptable CTA shapes. A campaign must include at least one
 * CTA whose normalised form matches one of these tokens (case-insensitive).
 */
export const APPROVED_CTAS: readonly string[] = [
  "Scan the tag",
  "Scan to wear",
  "Join the network",
  "Claim your share",
  "Wear the network",
];

/** Hard maximum length for campaign body content, in characters. */
export const CONTENT_MAX_LENGTH = 140;

/**
 * Phrases that disqualify a campaign immediately (compliance FAIL, not WARN).
 * Lower-cased for matching.
 */
export const BANNED_PHRASES: readonly string[] = [
  "guaranteed income",
  "risk-free",
  "get rich",
  "pyramid",
  "mlm",
  "limited time only", // overused; downgraded to FAIL to enforce voice discipline
];
