import Link from "next/link";

export const metadata = {
  title: "Our Story | KINFORM",
  description: "The origin of KINFORM — three designs born from connection, lineage, and the clothes that carry us.",
};

export default function StoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-12 pb-24">
      <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-[-0.04em] mb-8">
        A Lineage in Form
      </h1>

      <div className="prose prose-lg max-w-none text-[#2C2722] space-y-6 text-[17px] leading-relaxed">
        <p>
          KINFORM was born from a simple observation between cousins: the clothes we reach for again and again are the ones that feel like an extension of our own rhythm — familiar in silhouette, quietly surprising in detail.
        </p>
        <p>
          The three debut pieces — TETHER, CLASP, and APERTURE — each carry a signature gesture: a vertical tie that anchors the front, a waist knot that gathers and releases, a deliberate triangular opening that frames the body. These are not trends. They are recurring motifs across generations of dressing.
        </p>
        <p>
          We believe contemporary clothing can hold memory without heaviness. That a shirt can feel like a conversation. That a knot can be both functional and tender.
        </p>

        <h3 className="font-display text-3xl tracking-tight !mt-14 !mb-5 not-prose">The Three Gestures</h3>

        <p>
          <strong>TETHER</strong> — the vertical line that connects collar to hem. A reminder to stay grounded while moving through the world.
        </p>
        <p>
          <strong>CLASP</strong> — the waist knot that draws fabric to the body. A small act of care, repeated daily.
        </p>
        <p>
          <strong>APERTURE</strong> — the intentional opening. Space for breath, for light, for the wearer to be seen.
        </p>

        <p className="pt-6 border-t border-[#D4C9B8] text-[#6F5A47]">
          This is only the beginning. More pieces will follow the same language — always rooted in the belief that the best clothing creates quiet connections between people, between past and present, between the body and the world it moves through.
        </p>
      </div>

      <div className="mt-16 pt-8 border-t border-[#D4C9B8] text-sm text-[#6F5A47]">
        Designed with care. <Link href="/atelier" className="underline hover:text-[#B37A5F]">Explore production tools →</Link>
      </div>
    </div>
  );
}
