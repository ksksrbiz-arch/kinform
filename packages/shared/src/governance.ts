// =============================================================================
// KINFORM governance rules
// =============================================================================
//
// Pure functions that turn a candidate campaign into a structured verdict.
// The exact same rule set is mirrored in
// `packages/shared/python/kinform_shared/governance.py` so the PersonaGenAI
// Compliance agent produces identical verdicts to a Studio-side preview.
//
// =============================================================================

import {
  APPROVED_CTAS,
  BANNED_PHRASES,
  BRAND,
  CONTENT_MAX_LENGTH,
  REQUIRED_HASHTAGS,
} from "./branding";

export interface GovernanceInput {
  content: string;
  ctas: readonly string[];
  hashtags: readonly string[];
}

export type GovernanceVerdict = "PASS" | "WARN" | "FAIL";

export interface GovernanceFinding {
  rule: string;
  severity: GovernanceVerdict;
  message: string;
}

export interface GovernanceReport {
  verdict: GovernanceVerdict;
  score: number; // 0–100
  findings: GovernanceFinding[];
}

function normalise(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Run the full governance ruleset against a campaign candidate.
 *
 * Verdict precedence (worst wins): FAIL > WARN > PASS.
 * Score starts at 100 and is decremented per finding.
 */
export function evaluateGovernance(
  candidate: GovernanceInput,
): GovernanceReport {
  const findings: GovernanceFinding[] = [];
  let score = 100;

  // --- Length ---
  if (candidate.content.length === 0) {
    findings.push({
      rule: "content.nonEmpty",
      severity: "FAIL",
      message: "Campaign content is empty.",
    });
    score -= 50;
  } else if (candidate.content.length > CONTENT_MAX_LENGTH) {
    findings.push({
      rule: "content.maxLength",
      severity: "FAIL",
      message: `Content exceeds ${CONTENT_MAX_LENGTH} characters (got ${candidate.content.length}).`,
    });
    score -= 30;
  }

  // --- Required hashtags ---
  const hashtagsLower = candidate.hashtags.map(normalise);
  for (const required of REQUIRED_HASHTAGS) {
    if (!hashtagsLower.includes(normalise(required))) {
      findings.push({
        rule: "hashtags.required",
        severity: "FAIL",
        message: `Missing required hashtag ${required}.`,
      });
      score -= 20;
    }
  }

  // --- At least one approved CTA ---
  const ctasLower = candidate.ctas.map(normalise);
  const approvedLower = APPROVED_CTAS.map(normalise);
  const hasApproved = ctasLower.some((c) => approvedLower.includes(c));
  if (candidate.ctas.length === 0) {
    findings.push({
      rule: "ctas.required",
      severity: "FAIL",
      message: "At least one CTA is required.",
    });
    score -= 25;
  } else if (!hasApproved) {
    findings.push({
      rule: "ctas.approved",
      severity: "WARN",
      message: `No CTA matches the approved vocabulary (${APPROVED_CTAS.join(" | ")}).`,
    });
    score -= 10;
  }

  // --- Banned phrases ---
  const contentLower = normalise(candidate.content);
  for (const banned of BANNED_PHRASES) {
    if (contentLower.includes(banned)) {
      findings.push({
        rule: "content.bannedPhrase",
        severity: "FAIL",
        message: `Content contains banned phrase "${banned}".`,
      });
      score -= 40;
    }
  }

  // --- Brand name presence (WARN only — content can be on-voice without it
  //     when one of the required hashtags carries it) ---
  if (!contentLower.includes(normalise(BRAND.name))) {
    const carriesBrandInTag = hashtagsLower.some((h) =>
      h.includes(normalise(BRAND.name)),
    );
    if (!carriesBrandInTag) {
      findings.push({
        rule: "brand.namePresence",
        severity: "WARN",
        message: `Content does not mention "${BRAND.name}" or carry it in a hashtag.`,
      });
      score -= 5;
    }
  }

  const verdict: GovernanceVerdict = findings.some((f) => f.severity === "FAIL")
    ? "FAIL"
    : findings.some((f) => f.severity === "WARN")
    ? "WARN"
    : "PASS";

  return {
    verdict,
    score: Math.max(0, Math.min(100, score)),
    findings,
  };
}

/**
 * Suggest concrete fixes for a failing report. Returns a list of human-
 * readable patch suggestions; intentionally does NOT mutate the candidate.
 */
export function suggestFixes(report: GovernanceReport): string[] {
  const out: string[] = [];
  for (const f of report.findings) {
    switch (f.rule) {
      case "content.maxLength":
        out.push(`Trim content to ${CONTENT_MAX_LENGTH} characters or fewer.`);
        break;
      case "hashtags.required":
        out.push(
          `Add the missing required hashtags: ${REQUIRED_HASHTAGS.join(", ")}.`,
        );
        break;
      case "ctas.required":
      case "ctas.approved":
        out.push(
          `Use one of the approved CTAs: ${APPROVED_CTAS.join(" | ")}.`,
        );
        break;
      case "content.bannedPhrase":
        out.push("Remove banned phrasing — see KINFORM voice guidelines.");
        break;
      case "brand.namePresence":
        out.push(`Mention "${BRAND.name}" in the body or include #${BRAND.name}.`);
        break;
      case "content.nonEmpty":
        out.push("Write at least one sentence of campaign body.");
        break;
    }
  }
  return out;
}
