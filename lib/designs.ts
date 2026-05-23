/**
 * KINFORM — Design Data Model
 * ============================================
 *
 * THIS IS THE PRIMARY FILE THE FOUNDER WILL EDIT.
 *
 * - All copy, specifications, measurements, and construction notes live here.
 * - Changes here automatically update the website + generated Tech Packs.
 * - Everything is strongly typed for safety.
 *
 * HOW TO CUSTOMIZE:
 * 1. Edit any string / number below.
 * 2. For new designs: duplicate one object, update slug/name/images/measurements.
 * 3. Image paths must exist in /public/images/[slug]/...
 * 4. After edits, run `npm run dev` — site + PDFs refresh instantly.
 *
 * MEASUREMENTS: All values in CM (site can offer IN toggle later).
 * Sizing: Relaxed contemporary fit. Adjust ease as needed for your pattern maker.
 */

export type DesignSlug = "tether" | "clasp" | "aperture";

export interface Design {
  slug: DesignSlug;
  number: "01" | "02" | "03";
  name: string;              // Short evocative name (e.g. "TETHER")
  fullName: string;          // "The Tether Shirt"
  category: "Shirt" | "Top" | "Dress / Set";
  shortDesc: string;
  longDesc: string;
  vibe: string;
  keyDetails: string[];      // 5-8 bullets shown on site + PDF
  suggestedFabrics: string[];
  colorways: string[];
  measurements: Record<string, Record<string, number>>; // size -> spec
  measurementNotes: string;
  constructionNotes: string[];
  careInstructions: string;
  imagePaths: {
    flat: string;            // main technical flat sketch (PNG/SVG recommended)
    detail?: string[];       // optional detail shots
    lifestyle?: string;      // optional styled/lifestyle
  };
}

/**
 * The three debut signatures.
 * All descriptions pulled directly from founder brief + elevated for marketing.
 */
export const designs: Design[] = [
  {
    slug: "tether",
    number: "01",
    name: "TETHER",
    fullName: "The Tether Shirt",
    category: "Shirt",
    shortDesc: "Short-sleeve collared shirt with integrated vertical striped/patterned tie detail running down the center front, subtle waist tie/knot accent, relaxed modern fit.",
    longDesc: "A study in quiet utility. The Tether features a classic point collar reimagined with a continuous vertical tie detail that runs the length of the placket — a signature that feels both familiar and new. A soft waist knot adds subtle shape without sacrificing ease. Cut in a relaxed, slightly boxy silhouette that moves with the body. Perfect worn open over a slip or buttoned as a standalone statement.",
    vibe: "Casual-elevated. The kind of shirt you reach for daily and still feel pulled together in.",
    keyDetails: [
      "Relaxed modern fit with dropped shoulders",
      "Integrated vertical tie detail down center front (pattern or solid)",
      "Subtle self-tie waist knot accent at side seam",
      "Point collar with hidden button placket",
      "Short sleeves with clean rolled cuff option",
      "French seams throughout for longevity",
      "Signature KINFORM label at side seam",
    ],
    suggestedFabrics: [
      "Japanese cotton poplin (crisp, breathable)",
      "Washed linen-cotton blend (soft drape)",
      "Silk crepe de chine (elevated evening)",
      "Lightweight Tencel twill (sustainable option)",
    ],
    colorways: ["Warm Ivory", "Soft Charcoal", "Terracotta", "Black", "Sage"],
    measurements: {
      XS: { bust: 102, waist: 100, hip: 106, length: 68, sleeve: 24, shoulder: 48 },
      S:  { bust: 108, waist: 106, hip: 112, length: 70, sleeve: 25, shoulder: 50 },
      M:  { bust: 114, waist: 112, hip: 118, length: 72, sleeve: 26, shoulder: 52 },
      L:  { bust: 122, waist: 120, hip: 126, length: 74, sleeve: 27, shoulder: 54 },
      XL: { bust: 130, waist: 128, hip: 134, length: 76, sleeve: 28, shoulder: 56 },
    },
    measurementNotes: "Relaxed fit with 10–12cm ease at bust. Length measured from high point shoulder to hem at center front. Sleeve length from shoulder seam to cuff.",
    constructionNotes: [
      "Center front vertical tie detail is cut as continuous self-fabric strip, bar-tacked at stress points.",
      "Waist knot uses reinforced self-tie with hidden snap for security.",
      "All seams are French finished for clean interior and durability.",
      "Collar and placket are fused with lightweight interfacing for structure without stiffness.",
      "Hem is clean finished with 1cm double turn-back.",
      "Optional: contrast topstitching in tonal or accent thread.",
    ],
    careInstructions: "Machine wash cold on gentle cycle. Tumble dry low or hang to dry. Warm iron on reverse if needed. Dry clean recommended for silk versions.",
    imagePaths: {
      flat: "/images/tether/tether-flat.png",
      // detail: ["/images/tether/detail-1.jpg"],
      // lifestyle: "/images/tether/lifestyle.jpg",
    },
  },
  {
    slug: "clasp",
    number: "02",
    name: "CLASP",
    fullName: "The Clasp Top",
    category: "Top",
    shortDesc: "Sleeveless or cap-sleeve wrap/surplice top with flattering gathered waist knot and asymmetrical hem details. Feminine, drapey, versatile.",
    longDesc: "The Clasp is pure poetry in motion. A modern surplice wrap silhouette that crosses at the bust and gathers into a signature knot at the waist — creating beautiful shape while remaining incredibly comfortable. The asymmetrical hem adds movement and interest whether worn tucked or loose. Cap sleeves (or sleeveless option) keep it versatile across seasons. Designed to be worn with everything from high-waisted trousers to the matching bottom from the Aperture set.",
    vibe: "Feminine without fuss. Drapey, flattering, and quietly powerful.",
    keyDetails: [
      "Surplice wrap front with deep V-neckline",
      "Signature gathered waist knot (self-tie or fixed)",
      "Asymmetrical hem with subtle high-low detail",
      "Cap sleeves or sleeveless versions available",
      "Lightweight, fluid drape that skims the body",
      "French seams + clean finish at all edges",
      "Can be paired with Aperture bottom for a coordinated set",
    ],
    suggestedFabrics: [
      "Sand-washed silk charmeuse (luxurious drape)",
      "Viscose crepe (affordable fluidity)",
      "Tencel jersey (soft, sustainable, travel-friendly)",
      "Lightweight cupro (matte elegance)",
    ],
    colorways: ["Dusty Rose", "Warm Ivory", "Black", "Clay", "Midnight Navy"],
    measurements: {
      XS: { bust: 84, waist: 66, hip: 92, lengthCF: 58, lengthCB: 62 },
      S:  { bust: 90, waist: 72, hip: 98, lengthCF: 60, lengthCB: 64 },
      M:  { bust: 96, waist: 78, hip: 104, lengthCF: 62, lengthCB: 66 },
      L:  { bust: 104, waist: 86, hip: 112, lengthCF: 64, lengthCB: 68 },
      XL: { bust: 112, waist: 94, hip: 120, lengthCF: 66, lengthCB: 70 },
    },
    measurementNotes: "Body-skimming fit with negative ease at waist. Length CF = center front from shoulder to hem point. Length CB = center back. Knot creates natural waist definition.",
    constructionNotes: [
      "Wrap front is cut on bias for beautiful drape and movement.",
      "Waist knot is gathered into a self-fabric tie with reinforced core.",
      "Asymmetrical hem is clean finished with narrow rolled edge or baby hem.",
      "Cap sleeve is set-in with clean finish; optional sleeveless armhole is bias-bound.",
      "All stress points (knot, wrap crossover) are reinforced with stay tape.",
      "Invisible side zipper option available for more structured fit.",
    ],
    careInstructions: "Hand wash or delicate machine cycle in cold water. Do not wring. Hang or lay flat to dry. Cool iron on reverse. Professional dry clean preferred for silk.",
    imagePaths: {
      flat: "/images/clasp/clasp-flat.png",
    },
  },
  {
    slug: "aperture",
    number: "03",
    name: "APERTURE",
    fullName: "The Aperture Dress / Set",
    category: "Dress / Set",
    shortDesc: "Long-sleeve statement piece with high neck, prominent triangular cutout on the chest, dramatic bell sleeves or interesting sleeve treatment, and a textured or detailed hem that integrates into a mini dress or top+bottom set. Bold and modern.",
    longDesc: "The most architectural piece in the collection. Aperture features a high, clean neckline interrupted by a bold triangular cutout at the chest — a deliberate aperture that draws the eye and celebrates the body. Dramatic bell or sculptural sleeves balance the silhouette. The hem treatment (textured, embroidered, or layered) allows the piece to function as a standalone mini dress or be paired with a coordinating bottom for a modern set. A true statement that still feels wearable.",
    vibe: "Bold, modern, confident. The piece that turns heads and starts conversations.",
    keyDetails: [
      "High neck with prominent triangular chest cutout (raw or bound edge)",
      "Dramatic bell or sculptural long sleeves with interesting cuff detail",
      "Textured or detailed hem treatment (can read as mini dress)",
      "Designed as convertible top + separate bottom or one-piece dress",
      "Precision tailoring with architectural lines",
      "Reinforced cutout edges for structure and longevity",
      "Pairs beautifully with Tether or Clasp for layered looks",
    ],
    suggestedFabrics: [
      "Heavyweight crepe or double-faced wool (structured)",
      "Matte silk faille or duchesse satin (evening drama)",
      "Textured jacquard or cloqué (for hem interest)",
      "Sustainable heavy Tencel or linen blend (day version)",
    ],
    colorways: ["Deep Charcoal", "Black", "Warm Ivory", "Burgundy", "Forest"],
    measurements: {
      XS: { bust: 82, waist: 64, hip: 90, length: 82, sleeve: 62 },
      S:  { bust: 88, waist: 70, hip: 96, length: 84, sleeve: 63 },
      M:  { bust: 94, waist: 76, hip: 102, length: 86, sleeve: 64 },
      L:  { bust: 102, waist: 84, hip: 110, length: 88, sleeve: 65 },
      XL: { bust: 110, waist: 92, hip: 118, length: 90, sleeve: 66 },
    },
    measurementNotes: "More fitted through body with strategic ease at cutout and sleeves. Length from high point shoulder through center front to hem. Bell sleeve is very full at cuff.",
    constructionNotes: [
      "Triangular cutout is stabilized with horsehair or light boning at edges for clean shape.",
      "Cutout edges are either raw with overlock + topstitch or fully bound in self or contrast fabric.",
      "Bell sleeves are cut in two or three panels for volume control and interesting seaming.",
      "Hem features integrated texture: option for contrast panel, embroidery, or layered ruffle.",
      "Center back invisible zipper or hook-and-eye for clean entry.",
      "All cut edges of the aperture are reinforced to prevent stretching over time.",
    ],
    careInstructions: "Dry clean only for structured versions. For softer fabrics, gentle hand wash and reshape while damp. Steam to refresh. Store on padded hanger to protect sleeve shape.",
    imagePaths: {
      flat: "/images/aperture/aperture-flat.png",
    },
  },
];

/**
 * Helper to get a design by slug (used across pages + PDF generator).
 */
export function getDesign(slug: string): Design | undefined {
  return designs.find((d) => d.slug === slug);
}

export const designSlugs = designs.map((d) => d.slug);

/**
 * Suggested interest types for the form (used in InterestForm + PDF recipient context).
 */
export const interestTypes = [
  "Early Access List",
  "Wholesale Inquiry",
  "Production Collaboration",
  "Press / Media",
  "Other",
] as const;

export type InterestType = (typeof interestTypes)[number];
