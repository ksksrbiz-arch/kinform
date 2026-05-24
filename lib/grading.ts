/**
 * KINFORM — Size Grading Engine
 *
 * This module provides automated size grading for the three debut designs.
 * It is designed to be simple, transparent, and founder-editable.
 *
 * Grading philosophy:
 * - Base size = M
 * - Each size step has a "grade" (increment) per measurement
 * - Contemporary relaxed fit uses moderate grades (3.5–5cm typical for bust/hip)
 */

export type Size = "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL";

export const SIZES: Size[] = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

export interface GradeRule {
  measurement: string;      // e.g. "bust", "waist", "length"
  label: string;            // Human readable: "Bust (Full)"
  baseValue: number;        // Value at size M
  gradeUp: number;          // How much to add when going up one size
  gradeDown: number;        // How much to subtract when going down one size (usually same or slightly less)
  unit: string;             // "cm"
}

export interface DesignGrading {
  slug: string;
  baseSize: Size;
  rules: GradeRule[];
}

/**
 * Grading rules for each design.
 * These are realistic starting points for contemporary women's clothing.
 * The founder can later adjust these numbers in the UI or code.
 */
export const gradingRules: Record<string, DesignGrading> = {
  tether: {
    slug: "tether",
    baseSize: "M",
    rules: [
      { measurement: "bust", label: "Bust (Full Circumference)", baseValue: 114, gradeUp: 4.5, gradeDown: 4.5, unit: "cm" },
      { measurement: "waist", label: "Waist (Full)", baseValue: 112, gradeUp: 4.5, gradeDown: 4.5, unit: "cm" },
      { measurement: "hip", label: "Hip (Full)", baseValue: 118, gradeUp: 4.5, gradeDown: 4.5, unit: "cm" },
      { measurement: "length", label: "Center Front Length", baseValue: 72, gradeUp: 1.0, gradeDown: 1.0, unit: "cm" },
      { measurement: "sleeve", label: "Sleeve Length", baseValue: 26, gradeUp: 0.8, gradeDown: 0.8, unit: "cm" },
      { measurement: "shoulder", label: "Shoulder Width", baseValue: 52, gradeUp: 1.2, gradeDown: 1.2, unit: "cm" },
    ],
  },
  clasp: {
    slug: "clasp",
    baseSize: "M",
    rules: [
      { measurement: "bust", label: "Bust (Full)", baseValue: 96, gradeUp: 4.0, gradeDown: 4.0, unit: "cm" },
      { measurement: "waist", label: "Waist (at knot)", baseValue: 78, gradeUp: 3.5, gradeDown: 3.5, unit: "cm" },
      { measurement: "hip", label: "Hip (Full)", baseValue: 104, gradeUp: 4.0, gradeDown: 4.0, unit: "cm" },
      { measurement: "lengthCF", label: "Length (Center Front)", baseValue: 62, gradeUp: 1.0, gradeDown: 1.0, unit: "cm" },
      { measurement: "lengthCB", label: "Length (Center Back)", baseValue: 66, gradeUp: 1.0, gradeDown: 1.0, unit: "cm" },
    ],
  },
  aperture: {
    slug: "aperture",
    baseSize: "M",
    rules: [
      { measurement: "bust", label: "Bust (Full)", baseValue: 94, gradeUp: 4.0, gradeDown: 4.0, unit: "cm" },
      { measurement: "waist", label: "Waist", baseValue: 76, gradeUp: 3.5, gradeDown: 3.5, unit: "cm" },
      { measurement: "hip", label: "Hip (Full)", baseValue: 102, gradeUp: 4.0, gradeDown: 4.0, unit: "cm" },
      { measurement: "length", label: "Total Length", baseValue: 86, gradeUp: 1.2, gradeDown: 1.2, unit: "cm" },
      { measurement: "sleeve", label: "Sleeve Length (from shoulder)", baseValue: 64, gradeUp: 0.8, gradeDown: 0.8, unit: "cm" },
    ],
  },
};

/**
 * Calculate graded measurements for all sizes given a design slug.
 */
export function calculateGradedSizes(slug: string): Record<Size, Record<string, number>> {
  const ruleset = gradingRules[slug];
  if (!ruleset) throw new Error(`No grading rules for ${slug}`);

  const result: Record<Size, Record<string, number>> = {} as any;
  const baseIndex = SIZES.indexOf(ruleset.baseSize);

  SIZES.forEach((size, sizeIndex) => {
    const sizeData: Record<string, number> = {};
    const steps = sizeIndex - baseIndex;

    ruleset.rules.forEach((rule) => {
      let value = rule.baseValue;

      if (steps > 0) {
        value += steps * rule.gradeUp;
      } else if (steps < 0) {
        value += steps * rule.gradeDown; // steps is negative
      }

      sizeData[rule.measurement] = Math.round(value * 10) / 10;
    });

    result[size] = sizeData;
  });

  return result;
}

/**
 * Get human-readable rules for a design (useful for UI display).
 */
export function getGradingRules(slug: string) {
  return gradingRules[slug];
}

/**
 * Generate a CSV string for graded specs.
 */
export function gradedSizesToCSV(slug: string, designName: string): string {
  const graded = calculateGradedSizes(slug);
  const ruleset = gradingRules[slug];
  if (!ruleset) return "";

  const measurements = ruleset.rules.map((r) => r.measurement);

  const header = ["Size", ...ruleset.rules.map((r) => r.label)];
  const rows = SIZES.map((size) => {
    return [size, ...measurements.map((m) => graded[size][m])];
  });

  const escape = (v: any) => `"${v}"`;
  return [
    `KINFORM ${designName} - Graded Measurement Chart`,
    "",
    header.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ].join("\n");
}
