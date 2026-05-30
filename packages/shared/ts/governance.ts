/**
 * Cross-service governance rules for KINFORM-AEO (TypeScript mirror).
 *
 * Mirrors `packages/shared/python/kinform_shared/governance.py` line for line.
 * When you change one, change the other and bump `GOVERNANCE_RULES_VERSION`.
 *
 * Used by:
 * - `apps/payload-studio` (client-side pre-flight before calling PersonaGenAI)
 * - The Polymorphic Bootstrapping Compiler (embedded into generated artifacts)
 */

export const GOVERNANCE_RULES_VERSION = "1.0.0";

export const BRAND_NAME = "KINFORM";
export const MAX_CONTENT_CHARS = 140;
export const REQUIRED_HASHTAGS: readonly string[] = [
  "#KINFORM",
  "#TorquedAffiliation",
];
export const BANNED_PHRASES: readonly string[] = [
  "guaranteed returns",
  "get rich quick",
  "risk-free",
  "no risk",
  "miracle",
  "passive income forever",
];
export const REQUIRED_CTA_VERBS: readonly string[] = [
  "shop",
  "wear",
  "join",
  "claim",
  "drop",
  "scan",
  "tap",
];

export interface GovernanceViolation {
  code: string;
  message: string;
  field: "content" | "hashtags" | "approval";
}

export interface GovernanceResult {
  ok: boolean;
  rules_version: string;
  violations: GovernanceViolation[];
  warnings: string[];
}

export interface EnforceOptions {
  hashtags?: readonly string[];
  approvedByHuman?: boolean;
  requireHumanApproval?: boolean;
}

const WORD_RE = /[A-Za-z]+/g;

function containsCTA(content: string): boolean {
  const words = new Set((content.match(WORD_RE) ?? []).map((w) => w.toLowerCase()));
  return REQUIRED_CTA_VERBS.some((verb) => words.has(verb));
}

export function enforceGovernance(
  content: string,
  opts: EnforceOptions = {},
): GovernanceResult {
  const {
    hashtags = [],
    approvedByHuman = false,
    requireHumanApproval = true,
  } = opts;

  const violations: GovernanceViolation[] = [];
  const warnings: string[] = [];

  if (typeof content !== "string" || !content.trim()) {
    violations.push({
      code: "EMPTY_CONTENT",
      message: "Content must be non-empty.",
      field: "content",
    });
    return {
      ok: false,
      rules_version: GOVERNANCE_RULES_VERSION,
      violations,
      warnings,
    };
  }

  if (content.length > MAX_CONTENT_CHARS) {
    violations.push({
      code: "CONTENT_TOO_LONG",
      message: `Content is ${content.length} chars; max is ${MAX_CONTENT_CHARS}.`,
      field: "content",
    });
  }

  const lowered = content.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lowered.includes(phrase)) {
      violations.push({
        code: "BANNED_PHRASE",
        message: `Content contains banned phrase: "${phrase}".`,
        field: "content",
      });
    }
  }

  if (!containsCTA(content)) {
    violations.push({
      code: "MISSING_CTA",
      message:
        "Content must include a call-to-action verb (one of: " +
        REQUIRED_CTA_VERBS.join(", ") +
        ").",
      field: "content",
    });
  }

  const normalised = new Set(
    hashtags.map((h) => h.toLowerCase().replace(/^#/, "")),
  );
  for (const required of REQUIRED_HASHTAGS) {
    if (!normalised.has(required.toLowerCase().replace(/^#/, ""))) {
      violations.push({
        code: "MISSING_HASHTAG",
        message: `Required hashtag missing: ${required}`,
        field: "hashtags",
      });
    }
  }

  if (requireHumanApproval && !approvedByHuman) {
    violations.push({
      code: "HUMAN_APPROVAL_REQUIRED",
      message: "Promotion to production requires explicit human approval.",
      field: "approval",
    });
  } else if (!requireHumanApproval && !approvedByHuman) {
    warnings.push(
      "Running in simulation mode — human approval still required before production promotion.",
    );
  }

  return {
    ok: violations.length === 0,
    rules_version: GOVERNANCE_RULES_VERSION,
    violations,
    warnings,
  };
}
