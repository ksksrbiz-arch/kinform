import Link from "next/link";

export const metadata = {
  title: "Our Story | KINFORM",
  description: "The origin of KINFORM — three designs born from structure, contrast, and the boldness of contemporary clothing.",
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
          The three debut pieces — HALTER, FISHNET, and ACADEMIC — each carry a signature gesture: crisscross straps that structure and frame the body, a chevron seam that defines architecture through contrast, and layered tiers that reference uniform and subculture in equal measure. These are not trends. They are statements with construction to match.
        </p>
        <p>
          We believe contemporary clothing can be bold without losing craft. That a bustier can be both structural and sensual. That a mesh yoke and velvet piping can share the same garment. That an academic uniform can be reimagined as something worth wearing beyond any campus.
        </p>

        <h3 className="font-display text-3xl tracking-tight !mt-14 !mb-5 not-prose">The Three Gestures</h3>

        <p>
          <strong>HALTER</strong> — the crisscross that holds and frames. Straps that originate from the sides and meet at the neck, creating geometry from structure.
        </p>
        <p>
          <strong>FISHNET</strong> — the boundary between sheer and opaque. A chevron seam and velvet piping that mark the line between exposure and coverage.
        </p>
        <p>
          <strong>ACADEMIC</strong> — the layered uniform reimagined. Three tiers, a lacing corset, and a ruffled blouse that reference lineage while declaring something entirely new.
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
