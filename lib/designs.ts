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

export type DesignSlug = "halter" | "fishnet" | "academic";

export interface Design {
  slug: DesignSlug;
  number: "01" | "02" | "03";
  name: string;              // Short evocative name (e.g. "HALTER")
  fullName: string;          // "The Halter Bustier"
  category: "Top" | "Dress / Set" | "Set";
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
    slug: "halter",
    number: "01",
    name: "HALTER",
    fullName: "The Refined Crossed-Halter Bustier",
    category: "Top",
    shortDesc: "Highly structured cropped bustier with an integrated crisscross halter neck and graphic geometric face-taping across the bodice panels. Body-con, sculptural fit.",
    longDesc: "A highly structured, contemporary cropped bustier top featuring an integrated crisscross halter neck and graphic geometric face-taping across the bodice panels. Wide, flat-laying self-fabric halter straps originate from the lateral side seams, cross neatly over the chest and collarbone, and wrap around to secure at the back of the neck. The form-fitting cropped length terminates precisely at the natural waistline, with flat-stitched structural accent bands forming a crisp \"X\" pattern across the front abdominal panel. Classic sweetheart neckline with demi-molded underwire cups featuring vertical center seams for optimal shaping.",
    vibe: "Sculptural, body-con, and architecturally precise. The piece that announces itself quietly.",
    keyDetails: [
      "Integrated crisscross halter neck from lateral side seams, securing at back collar",
      "Matte Heavy Cotton Crepe or Scuba Knit shell (95% Cotton, 5% Spandex; 320 GSM)",
      "Flat-stitched structural accent bands forming crisp \"X\" pattern across front abdominal panel",
      "Classic sweetheart neckline with demi-molded underwire cups",
      "Vertical center seams on each cup for optimal shaping",
      "Self-fabric high-density bias tape for seamless texture match on straps",
      "#3 YKK Concealed Separating Zipper at center back",
      "Flat dual hook-and-eye closure at rear halter collar",
    ],
    suggestedFabrics: [
      "Matte Heavy Cotton Crepe (firm structure, 320 GSM)",
      "Scuba Knit 95% Cotton / 5% Spandex (body-con hold)",
      "Bonded matte jersey (structured alternative)",
      "Heavyweight ponte (stable, sculptural option)",
    ],
    colorways: ["Black", "Deep Ivory", "Slate Grey", "Terracotta", "Midnight Navy"],
    measurements: {
      XS: { bust: 74, waist: 60, length: 32, strapLength: 38, underwireWidth: 26 },
      S:  { bust: 80, waist: 66, length: 33, strapLength: 40, underwireWidth: 28 },
      M:  { bust: 86, waist: 72, length: 34, strapLength: 42, underwireWidth: 30 },
      L:  { bust: 94, waist: 80, length: 35, strapLength: 44, underwireWidth: 32 },
      XL: { bust: 102, waist: 88, length: 36, strapLength: 46, underwireWidth: 34 },
    },
    measurementNotes: "Body-con fit with minimal ease at bust. Length measured from sweetheart neckline apex to hem at center front. Strap length is adjustable; listed as standard setting. Underwire width measured across base of cup.",
    constructionNotes: [
      "Self-fabric halter straps cut on straight grain and bar-tacked at all origin and crossing points.",
      "Rear halter collar flat dual hook-and-eye is fused with medium-weight interfacing for stability.",
      "Bodice face-tape \"X\" panel is flat-stitched with 1/16\" edge-stitch, tone-on-tone thread.",
      "Sweetheart neckline seam is stabilized with stay tape to prevent stretch.",
      "Underwire casing is double-stitched and tacked at both ends to prevent migration.",
      "Power-mesh or cotton-spandex jersey lining covers all internal seams for comfort.",
      "Center back #3 YKK concealed separating zipper with matching zipper guard.",
    ],
    careInstructions: "Hand wash cold or delicate machine cycle in mesh bag. Do not tumble dry — hang or lay flat. Do not wring or twist. Warm iron on reverse on low heat only.",
    imagePaths: {
      flat: "/images/halter/halter-flat.png",
    },
  },
  {
    slug: "fishnet",
    number: "02",
    name: "FISHNET",
    fullName: "The Precision Fishnet & Chevron Torso Piece",
    category: "Top",
    shortDesc: "Edgy cropped bustier combining a sheer high-neck mesh yoke with a structured high-contrast sweetheart bodice, velvet chevron piping, and a sport-inspired engineered stripe hem band.",
    longDesc: "An edgy, alternative-style cropped bustier top combining a sheer high-neck geometric power-mesh yoke with a structured, high-contrast sweetheart bodice. The boundary between mesh and opaque bodice is defined by plush double-bordered matte velvet V-piping that frames the chevron sweetheart drop — a sharp, dramatic V-shape at the center bust line. Sculpted padded foam cups are integrated with vertical corset-style structural seams for a supported, slimming silhouette. The hem features a high-density woven elastic or flat-knit ribbed band with contrasting horizontal white stripes for a sport-inspired finish.",
    vibe: "Edgy, high-contrast, and architecturally dramatic. Mesh meets structure meets sport.",
    keyDetails: [
      "Heavy-duty geometric power-mesh / precision fishnet knit upper yoke (100% Nylon)",
      "Seamless mock-neck style band attached cleanly to mesh panels",
      "Deep chevron sweetheart drop creating a sharp V-shape at center bust",
      "Plush double-bordered matte velvet V-piping along sweetheart/chevron seam boundary",
      "Premium liquid satin or structured matte faux leather lower bodice",
      "Sculpted padded foam cups with vertical corset-style structural seams",
      "Sport-inspired hem band with contrasting horizontal white stripes",
      "Soft flexible plastic boning strips at side seams for silhouette support",
    ],
    suggestedFabrics: [
      "Heavy-duty geometric power-mesh / precision fishnet knit (100% Nylon, upper yoke)",
      "Premium heavy liquid satin (high-contrast sheen, lower bodice)",
      "Structured matte faux leather PU (alternative lower bodice)",
      "Four-way stretch compression knit (collar and bindings)",
    ],
    colorways: ["Black / White", "Black / Red", "Gunmetal / Ivory", "Midnight / Gold", "All Black"],
    measurements: {
      XS: { bust: 76, waist: 62, length: 34, mockNeckHeight: 6, hemBandWidth: 5 },
      S:  { bust: 82, waist: 68, length: 35, mockNeckHeight: 6, hemBandWidth: 5 },
      M:  { bust: 88, waist: 74, length: 36, mockNeckHeight: 6, hemBandWidth: 5 },
      L:  { bust: 96, waist: 82, length: 37, mockNeckHeight: 6, hemBandWidth: 5 },
      XL: { bust: 104, waist: 90, length: 38, mockNeckHeight: 6, hemBandWidth: 5 },
    },
    measurementNotes: "Fitted silhouette with minimal ease. Bust measured at fullest point. Length from mock-neck top edge to hem band lower edge. Mock-neck height and hem band width are fixed design specs.",
    constructionNotes: [
      "Mesh yoke attached to bodice along chevron sweetheart seam with 3-thread overlock internal seam.",
      "1/8\" matte velvet corded piping hand-stitched and machine-tacked along full sweetheart/chevron boundary.",
      "Mock-neck band is seamless single-layer compression knit, double-folded and clean-finished.",
      "Padded foam cups are pre-formed and bonded to lining before bodice assembly.",
      "Vertical corset seams on bodice panels are stitched with flatlock for clean interior finish.",
      "Plastic boning channels are stitched directly into side seam allowances.",
      "Center back invisible zipper (or tonal zipper with guard) runs from collar to hem.",
      "Hem ribbed band attached with clean topstitch seam; stripe alignment matched at seams.",
    ],
    careInstructions: "Hand wash cold only. Do not machine wash. Do not bleach. Hang dry away from direct sunlight. Low heat iron on bodice panels only; do not iron mesh or velvet piping.",
    imagePaths: {
      flat: "/images/fishnet/fishnet-flat.png",
    },
  },
  {
    slug: "academic",
    number: "03",
    name: "ACADEMIC",
    fullName: "The Academic Tiered Corset Ensemble",
    category: "Set",
    shortDesc: "Anime-inspired multi-layered academic uniform set: ruffled puffed-sleeve cotton poplin shirt, structured front-lacing underbust corset vest, and three-tiered pleated tartan mini skirt with matching necktie.",
    longDesc: "An anime-inspired, multi-layered academic uniform set consisting of an integrated ruffled short-sleeve shirt, a structured front-lacing underbust corset vest, and a three-tiered pleated tartan mini skirt. The blouse features a traditional pointed dress collar with dramatic puffed short sleeves that terminate mid-bicep in an elasticated double-layered ruffled cuff. The contoured underbust corset overlay frames the chest and extends to the waist, with four pairs of polished metallic grommets laced in flat satin ribbon. The high-waisted skirt is composed of three layered knife-pleated tiers of bias-cut plaid fabric for a flounced, high-volume flared silhouette.",
    vibe: "Anime-academic, layered, and boldly referential. Uniform energy with couture construction.",
    keyDetails: [
      "Cotton Poplin blouse (60% Cotton, 40% Polyester; 120 GSM) with pointed dress collar",
      "Dramatic puffed short sleeves terminating mid-bicep with elasticated double-layered ruffled cuff",
      "Structured underbust corset vest in Heavy Cotton Twill or Gabardine (100% Cotton; 280 GSM) — solid deep black",
      "Four pairs of 4mm matte black metallic grommets laced with 1/4\" flat black satin ribbon and bow",
      "Three-tiered knife-pleated tartan mini skirt (Woven Twill Tartan Plaid: 65% Polyester, 35% Rayon)",
      "Classic Red, Black, and White tartan matrix print on skirt and matching necktie",
      "Detachable black woven lanyard with clear vinyl ID badge at left lapel",
      "#3 YKK Invisible Zipper with Hook-and-Eye at skirt left side seam",
    ],
    suggestedFabrics: [
      "Crisp Cotton Poplin 60/40 blend (blouse, 120 GSM)",
      "Heavy Cotton Twill or Gabardine (corset vest, 280 GSM)",
      "Woven Twill Tartan Plaid 65% Polyester / 35% Rayon (skirt and tie)",
      "Lightweight cotton organdy (ruffled cuff underlining option)",
    ],
    colorways: ["Red/Black/White Tartan + Black Corset", "Navy/Green Tartan + Black Corset", "Black/Grey Tartan + Charcoal Corset"],
    measurements: {
      XS: { blouseBust: 84, corsetUnderbust: 64, corsetLength: 22, skirtWaist: 62, skirtLength: 36 },
      S:  { blouseBust: 90, corsetUnderbust: 70, corsetLength: 23, skirtWaist: 68, skirtLength: 37 },
      M:  { blouseBust: 96, corsetUnderbust: 76, corsetLength: 24, skirtWaist: 74, skirtLength: 38 },
      L:  { blouseBust: 104, corsetUnderbust: 84, corsetLength: 25, skirtWaist: 82, skirtLength: 39 },
      XL: { blouseBust: 112, corsetUnderbust: 92, corsetLength: 26, skirtWaist: 90, skirtLength: 40 },
    },
    measurementNotes: "Blouse bust measured at fullest point with 6–8cm ease. Corset underbust measured just below the bust at natural rib. Corset length from underbust seam to lower hem. Skirt waist is finished waistband measurement. Skirt length from waistband top to hem.",
    constructionNotes: [
      "Blouse puffed sleeve head is gathered at sleeve cap and cuff with double-layered ruffled elasticated cuff.",
      "Pointed collar is interfaced and fused for sharp, lay-flat structure.",
      "Corset vest is fully boned internally along side seams and front panels; lining is stitched-in.",
      "Grommets are reinforced with stay-stitched welt buttonholes before setting; lacing threaded post-assembly.",
      "Skirt tiers are each cut on bias for maximum flare; knife pleats pressed and edge-stitched to hold.",
      "Tartan plaid is pattern-matched at all visible seam junctions on skirt and necktie.",
      "Lanyard anchor point is bar-tacked through all layers to left lapel interlining.",
      "Skirt left side seam YKK invisible zipper set below waistband; hook-and-eye at top for clean closure.",
    ],
    careInstructions: "Machine wash cold, delicate cycle, inside-out. Tumble dry low or hang dry. Press blouse with steam iron; press corset on low. Do not wring. Dry clean recommended for first few washes to preserve plaid alignment.",
    imagePaths: {
      flat: "/images/academic/academic-flat.png",
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
  "Pre-Order / First Run",
  "Wholesale Inquiry",
  "Production Collaboration",
  "Press / Media",
  "Other",
] as const;

export type InterestType = (typeof interestTypes)[number];
