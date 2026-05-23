import Link from "next/link";
import { designs } from "@/lib/designs";

export const metadata = {
  title: "The Collection | KINFORM",
  description: "Explore the debut collection: TETHER, CLASP, and APERTURE — three original designs for the modern woman.",
};

export default function CollectionPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 pt-12 pb-20">
      <div className="mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#9A8671]">KINFORM DEBUT 2026</div>
        <h1 className="font-display text-7xl tracking-[-0.03em] mt-1">The Collection</h1>
        <p className="max-w-md mt-4 text-lg text-[#6F5A47]">Three signature pieces. Each one a quiet manifesto.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {designs.map((design, index) => (
          <Link
            key={design.slug}
            href={`/designs/${design.slug}`}
            className="elegant-card group block bg-white overflow-hidden border"
          >
            <div className="aspect-[16/11] bg-[#F1E9DF] relative flex items-center justify-center overflow-hidden">
              {/* Placeholder for flat sketch — replace with real image in /public/images/[slug]/ */}
              <div className="text-center px-8">
                <div className="text-[10px] tracking-[0.3em] text-[#9A8671] mb-2">0{index + 1} TECHNICAL FLAT</div>
                <div className="font-display text-6xl tracking-tight text-[#B37A5F]/70 group-hover:text-[#B37A5F] transition-colors">
                  {design.name}
                </div>
                <div className="text-xs mt-3 text-[#9A8671]">Click to view details &amp; tech pack</div>
              </div>
            </div>

            <div className="p-7">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-4xl tracking-[-0.01em]">{design.name}</h3>
                <span className="text-xs font-mono text-[#9A8671]">{design.number}</span>
              </div>
              <p className="mt-3 text-sm leading-snug text-[#6F5A47] pr-4">{design.shortDesc}</p>
              <div className="mt-6 text-xs tracking-widest text-[#B37A5F] group-hover:underline">VIEW FULL SPEC →</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center text-sm text-[#6F5A47]">
        Each piece is designed to be worn alone or layered. <Link href="/atelier" className="underline hover:text-[#B37A5F]">Generate a tech pack for production partners.</Link>
      </div>
    </div>
  );
}
