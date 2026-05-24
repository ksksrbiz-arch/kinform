/**
 * KINFORM — Earring Accessory Data
 * ============================================
 *
 * Product catalog for the curated earring collection.
 * Changes here automatically update the accessories pages.
 */

export interface Earring {
  id: string;
  slug: string;
  nickname: string;
  name: string;
  material: string;
  description: string;
  /** Exact public path to primary product photo (user-provided assets) */
  photo: string;
  /** Optional secondary angle / colorway / detail shot (.2 files) */
  photoSecondary?: string;
}

export const earrings: Earring[] = [
  {
    id: "e1",
    slug: "sunflowers",
    nickname: "Sunflowers",
    name: "The Solis Bloom Drop Earrings",
    material:
      "Textured antiqued gold plating with a high-relief, dark-patina seeded center and vibrant matte-yellow enameled petals.",
    description:
      "A radiant botanical statement piece featuring meticulously layered sunflower petals that catch the light from every angle. The darkened center contrast brings a vintage, rustic depth to a classic summer motif, anchored on comfortable, hypoallergenic French wire hooks.",
    photo: "/images/accessories/earrings/E1.png",
    photoSecondary: "/images/accessories/earrings/E1-Sunflowers.jpg",
  },
  {
    id: "e2",
    slug: "rainclouds",
    nickname: "Rainclouds",
    name: "The Nimbus Drizzle Dangle Earrings",
    material:
      "Gunmetal or oxidized sterling silver cloud base with highly polished tanzanite and aquamarine bead drop charms.",
    description:
      "A playful tribute to Pacific Northwest skies. These earrings feature a stylized, contoured raincloud with a finely hammered texture. Suspended below are delicate micro-chains holding faceted glass or gemstone droplets that sway dynamically with movement.",
    photo: "/images/accessories/earrings/E2.jpg",
  },
  {
    id: "e3",
    slug: "stars",
    nickname: "Stars",
    name: "The Astral Bevel Drop Earrings",
    material:
      "High-polish surgical steel or burnished silver with deep-set geometric beveling.",
    description:
      "Sharp, clean, and minimalist. These five-point stars feature distinctive diamond-cut facets that create an intentional play between shadow and light. Perfect for an everyday minimalist edge or a subtle alternative accent.",
    photo: "/images/accessories/earrings/E3.png",
  },
  {
    id: "e4",
    slug: "frogs",
    nickname: "Frogs",
    name: "The Kero Whimsy Hoop Earrings",
    material:
      "Vibrant sage green cold-enameled brass with high-gloss protective topcoat and hand-painted expression details.",
    description:
      "Infuse a touch of playful charm into your look with these character-driven frog face drops. Featuring an expressive, slightly irreverent hand-detailed aesthetic, these lightweight charms add a distinct pop of color and personality.",
    photo: "/images/accessories/earrings/E4.png",
  },
  {
    id: "e5",
    slug: "raindrops",
    nickname: "Raindrops",
    name: "The Filigree Tear-Cascade Earrings",
    material:
      "Open-work sterling silver filigree teardrop framework featuring suspended micro-bead accents.",
    description:
      "An elegant, bohemian evolution of a classic silhouette. The teardrop outer frame houses intricate internal metal scrolling, finished with a delicate fringe of dangling silver beads at the base for an elongated, jawline-framing effect.",
    photo: "/images/accessories/earrings/E5.jpg",
    photoSecondary: "/images/accessories/earrings/E5.2.jpg",
  },
  {
    id: "e6",
    slug: "mushrooms",
    nickname: "Mushrooms",
    name: "The Amanita Forest Drop Earrings",
    material:
      "Hand-painted porcelain or resin cap in crimson red with crisp white enamel spots, paired with a carved brass or silver stem.",
    description:
      "A striking piece of cottagecore-inspired statement jewelry. Modeled after the iconic forest floor mushroom, the high-gloss red cap creates an eye-catching focal point, while the naturally contoured stem balances the design with a grounding organic texture.",
    photo: "/images/accessories/earrings/E6.png",
    photoSecondary: "/images/accessories/earrings/E6.2.jpg",
  },
  {
    id: "e7",
    slug: "moons",
    nickname: "Moons",
    name: "The Selene Crescent Dangle Earrings",
    material:
      "Distressed pewter or antiqued sterling silver with etched crater profiling and celestial star-stamp accents.",
    description:
      "A mystic, lunar-inspired classic. These thick, inward-facing crescent moons feature a detailed, pitted texture reminiscent of true lunar topography, finished with subtle engraved star elements along the outer spine.",
    photo: "/images/accessories/earrings/E7.png",
    photoSecondary: "/images/accessories/earrings/E7.2.jpg",
  },
  {
    id: "e8",
    slug: "musicnotes",
    nickname: "Music Notes",
    name: "The Nocturne Allegro Chain Earrings",
    material:
      "Jet-black anodized titanium or high-shine black enamel over stainless steel.",
    description:
      "Designed for a bold, asymmetric rhythm. One side features a fluid eighth note while the other mirrors it with a paired beam note, both finished in a stark, obsidian black coat that stands out sharply against light backgrounds.",
    photo: "/images/accessories/earrings/E8.png",
    photoSecondary: "/images/accessories/earrings/E8.2.jpg",
  },
  {
    id: "e9",
    slug: "xs",
    nickname: "X's",
    name: "The Crucible Cross Stud Earrings",
    material:
      "Heavy distressed industrial bronze or brass with raw rivet head details on each axis point.",
    description:
      "Stripped-back, structural, and heavy. These graphic \"X\" marks lean into a raw, utilitarian aesthetic, utilizing exposed hardware markings and a matte, brushed metallic finish to anchor an alternative everyday style.",
    photo: "/images/accessories/earrings/E9.png",
    photoSecondary: "/images/accessories/earrings/E9.2.jpg",
  },
  {
    id: "e10",
    slug: "feathers",
    nickname: "Feathers",
    name: "The Aquila Plume Etched Earrings",
    material:
      "Two-tone silver and gold-tipped wire-wrapped sterling silver.",
    description:
      "Highly detailed, organic design showcasing deep vane-etched grooves to replicate the delicate texture of a bird's plume. The spine is finished with a tight metal-wire wrap at the base of the hook, giving it a handcrafted, premium artisan finish.",
    photo: "/images/accessories/earrings/E10.2.jpg",
    // photoSecondary: "/images/accessories/earrings/E10.jpg", // add base if available
  },
  {
    id: "e11",
    slug: "rainbows",
    nickname: "Rainbows",
    name: "The Iris Arc Enamel Earrings",
    material:
      "Multi-color cloisonné hard enamel fill set within an antiqued gold-plated zinc alloy frame.",
    description:
      "A crisp, nostalgic color-block statement piece. Smooth, vibrant rainbow bands terminate in fluffy, cloud-shaped white enamel weights at the base, creating an optimal weight balance that sits flat without twisting.",
    photo: "/images/accessories/earrings/E11.2.jpg",
    // photoSecondary: "/images/accessories/earrings/E11.jpg", // add base if available
  },
  {
    id: "e12",
    slug: "paint-splashes",
    nickname: "Paint Splashes",
    name: "The Artisan Splatter Abstract Earrings",
    material:
      "Cast white ceramic-coated alloy or opaque milk-glass acrylic with multi-colored micro-speckle resin detailing.",
    description:
      "A nod to abstract expressionism. These earrings feature a fluid, amorphous liquid-drop shape that mimics wet paint frozen in mid-air. Each piece features a unique arrangement of fine primary-color speckles across a clean white base.",
    photo: "/images/accessories/earrings/E12.2.jpg",
    // photoSecondary: "/images/accessories/earrings/E12.jpg", // add base if available
  },
];

/**
 * Tailored earring recommendations for each signature garment.
 * Used by AccessoriesCrossSell to show contextually perfect pairings.
 * Feel free to tweak the slugs for different vibes.
 */
export const garmentEarringRecommendations: Record<string, string[]> = {
  HALTER: ["e1", "e7", "e9"],     // Sunflowers (botanical), Moons (lunar sculptural), X's (architectural edge)
  FISHNET: ["e8", "e3", "e10"],   // Music Notes (rhythmic), Stars (minimal sharp), Feathers (organic texture)
  ACADEMIC: ["e6", "e11", "e4"],  // Mushrooms (cottagecore), Rainbows (playful color), Frogs (whimsical charm)
};
