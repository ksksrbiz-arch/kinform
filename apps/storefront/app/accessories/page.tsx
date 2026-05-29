import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessories",
  description:
    "Explore the KINFORM accessories collection — handcrafted earrings and curated statement pieces.",
};

const categories = [
  {
    name: "Earrings",
    slug: "earrings",
    description:
      "Twelve curated designs — from botanical sunflowers to abstract paint splashes. Each pair is a small statement.",
    count: 12,
  },
];

export default function AccessoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-20">
      <div className="mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F]">
          KINFORM ACCESSORIES
        </div>
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-[-0.04em] mt-1">
          Accessories
        </h1>
        <p className="max-w-md mt-4 text-lg sm:text-xl text-[#6F5A47]">
          Curated pieces that complete the look.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/accessories/${cat.slug}`}
            className="group block"
          >
            <div className="elegant-card bg-white border border-[#D4C9B8] overflow-hidden rounded-3xl h-full flex flex-col hover:border-[#B37A5F] transition-all duration-300">
              <div className="aspect-[16/11] bg-[#F1E9DF] relative flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="text-[10px] tracking-[0.3em] text-[#9A8671] mb-2">
                    {cat.count} PIECES
                  </div>
                  <div className="font-display text-7xl tracking-[-0.02em] text-[#B37A5F]/70 group-hover:text-[#B37A5F] transition-colors">
                    {cat.name}
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-display text-4xl sm:text-5xl tracking-[-0.02em] mb-3">
                  {cat.name}
                </h3>
                <p className="text-[#6F5A47] leading-snug flex-1">
                  {cat.description}
                </p>
                <div className="mt-auto pt-6 text-xs tracking-[0.15em] text-[#B37A5F] group-hover:underline">
                  BROWSE COLLECTION →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
