import Link from "next/link";
import { notFound } from "next/navigation";
import { earrings } from "@/lib/earrings";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return earrings.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const earring = earrings.find((e) => e.slug === slug);
  if (!earring) return {};

  return {
    title: `${earring.name}`,
    description: earring.description,
  };
}

export default async function EarringDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const earring = earrings.find((e) => e.slug === slug);

  if (!earring) {
    notFound();
  }

  const currentIndex = earrings.findIndex((e) => e.slug === slug);
  const prevEarring = currentIndex > 0 ? earrings[currentIndex - 1] : null;
  const nextEarring =
    currentIndex < earrings.length - 1 ? earrings[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-12 pb-20">
      {/* Breadcrumb */}
      <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-8">
        <Link href="/accessories" className="hover:underline">
          ACCESSORIES
        </Link>{" "}
        /{" "}
        <Link href="/accessories/earrings" className="hover:underline">
          EARRINGS
        </Link>{" "}
        / {earring.nickname.toUpperCase()}
      </div>

      {/* Hero area */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Image placeholder */}
        <div className="aspect-square bg-[#F1E9DF] rounded-3xl flex items-center justify-center border border-[#D4C9B8]">
          <div className="text-center px-8">
            <div className="text-[10px] tracking-[0.3em] text-[#9A8671] mb-3">
              {earring.id.toUpperCase()} / EARRING
            </div>
            <div className="font-display text-6xl sm:text-7xl tracking-[-0.02em] text-[#B37A5F]/70">
              {earring.nickname}
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col justify-center">
          <div className="inline-block mb-3 px-3 py-0.5 text-[10px] font-medium bg-[#B37A5F] text-white rounded-full tracking-wider w-fit">
            CURATED EARRING
          </div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-[-0.03em] mb-4">
            {earring.name}
          </h1>
          <p className="text-[#6F5A47] text-lg leading-relaxed mb-8">
            {earring.description}
          </p>

          {/* Material concept */}
          <div className="border-t border-[#D4C9B8] pt-6">
            <h2 className="text-xs uppercase tracking-[0.15em] text-[#9A8671] mb-2">
              Material Concept
            </h2>
            <p className="text-[#6F5A47] leading-relaxed">{earring.material}</p>
          </div>
        </div>
      </div>

      {/* Navigation between earrings */}
      <div className="border-t border-[#D4C9B8] pt-8 flex items-center justify-between">
        {prevEarring ? (
          <Link
            href={`/accessories/earrings/${prevEarring.slug}`}
            className="text-sm tracking-[0.1em] text-[#6F5A47] hover:text-[#B37A5F] transition-colors"
          >
            ← {prevEarring.nickname}
          </Link>
        ) : (
          <span />
        )}

        <Link
          href="/accessories/earrings"
          className="text-xs tracking-[0.15em] text-[#B37A5F] hover:underline"
        >
          ALL EARRINGS
        </Link>

        {nextEarring ? (
          <Link
            href={`/accessories/earrings/${nextEarring.slug}`}
            className="text-sm tracking-[0.1em] text-[#6F5A47] hover:text-[#B37A5F] transition-colors"
          >
            {nextEarring.nickname} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
