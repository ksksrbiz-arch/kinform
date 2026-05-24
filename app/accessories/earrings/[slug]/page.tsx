import Link from "next/link";
import { notFound } from "next/navigation";
import { earrings } from "@/lib/earrings";
import type { Metadata } from "next";
import { EarringPhoto } from "@/components/ui/EarringPhoto";

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
    title: `${earring.name} | KINFORM Earrings`,
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
  const nextEarring = currentIndex < earrings.length - 1 ? earrings[currentIndex + 1] : null;

  // Related suggestions: 3 others, avoiding the current one
  const related = earrings
    .filter(e => e.slug !== slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-12 pb-20">
      {/* Breadcrumb — elegant and compact */}
      <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-8">
        <Link href="/accessories" className="hover:underline">ACCESSORIES</Link>
        {" / "}
        <Link href="/accessories/earrings" className="hover:underline">EARRINGS</Link>
        {" / "}
        <span className="text-[#6F5A47] dark:text-[#C8B8A3]">{earring.nickname.toUpperCase()}</span>
      </div>

      {/* Hero: Large interactive photo + rich details */}
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-10 items-start mb-16">
        {/* Left: Hero product photography with variant switching */}
        <div className="relative">
          <EarringPhoto
            primarySrc={earring.photo}
            secondarySrc={earring.photoSecondary}
            alt={earring.name}
            nickname={earring.nickname}
            aspect="aspect-[4/3.6] md:aspect-square"
            showVariantBadge
            interactive
            priority
          />
          {earring.photoSecondary && (
            <p className="mt-2 text-center text-[10px] tracking-[0.2em] text-[#9A8671] dark:text-[#A38F76]">
              TAP OR CLICK THE IMAGE TO SWITCH VIEWS
            </p>
          )}
        </div>

        {/* Right: Details and purchase path */}
        <div className="pt-2 md:pt-4">
          <div className="inline-block mb-4 px-4 py-1 text-[10px] font-medium bg-[#B37A5F] text-white rounded-full tracking-[0.18em]">
            CURATED EARRING • SHIPS IMMEDIATELY
          </div>

          <h1 className="font-display text-4xl sm:text-5xl tracking-[-0.032em] leading-none mb-4 pr-2">
            {earring.name}
          </h1>

          <p className="text-[#6F5A47] dark:text-[#C8B8A3] text-[17px] leading-relaxed max-w-prose">
            {earring.description}
          </p>

          {/* Material */}
          <div className="mt-8 border-t border-[#D4C9B8] dark:border-[#3A3630] pt-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[#9A8671] dark:text-[#A38F76] mb-2">MATERIAL &amp; FINISH</div>
            <p className="text-[#2C2722] dark:text-[#EDE8DF] leading-snug text-[15px]">
              {earring.material}
            </p>
          </div>

          {/* Trust + CTA block */}
          <div className="mt-8 bg-[#F8F4ED] dark:bg-[#252320] border border-[#D4C9B8] dark:border-[#3A3630] rounded-2xl p-6">
            <div className="uppercase text-[10px] tracking-[0.25em] text-[#B37A5F] mb-2">Handcrafted in small batches</div>
            <p className="text-sm text-[#6F5A47] dark:text-[#C8B8A3]">
              Lightweight, comfortable for daily wear. Each pair is unique in its hand-finished details.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:hello@kinform.studio?subject=Reserve%20earrings%20-%20{earring.nickname}"
                className="btn-primary flex-1 justify-center text-sm py-3"
              >
                RESERVE THIS PAIR
              </a>
              <Link
                href="/accessories/earrings"
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#B37A5F] text-[#B37A5F] dark:text-[#C48A6E] hover:bg-[#F8F4ED] dark:hover:bg-[#1A1816] transition px-5 py-3 text-sm tracking-wider"
              >
                SEE ALL EARRINGS
              </Link>
            </div>
            <p className="text-center mt-3 text-[10px] text-[#9A8671] dark:text-[#A38F76]">
              Or pair it with HALTER, FISHNET, or ACADEMIC on the first drop
            </p>
          </div>
        </div>
      </div>

      {/* Pair it with the collection (quick links) */}
      <div className="border-y border-[#D4C9B8] dark:border-[#3A3630] py-8 mb-14">
        <div className="text-xs uppercase tracking-[0.2em] text-[#9A8671] mb-3 text-center">COMPLETE A LOOK</div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/halter" className="hover:text-[#B37A5F] underline-offset-4 hover:underline">HALTER</Link>
          <Link href="/fishnet" className="hover:text-[#B37A5F] underline-offset-4 hover:underline">FISHNET</Link>
          <Link href="/academic" className="hover:text-[#B37A5F] underline-offset-4 hover:underline">ACADEMIC</Link>
          <span className="text-[#D4C9B8]">•</span>
          <Link href="/accessories/earrings" className="hover:text-[#B37A5F] underline-offset-4 hover:underline">All 12 Earrings</Link>
        </div>
      </div>

      {/* Related earrings — another beautiful mini gallery */}
      <div className="mb-12">
        <div className="flex items-baseline justify-between mb-5 px-1">
          <div>
            <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F]">EXPLORE MORE</div>
            <div className="font-display text-2xl tracking-tight">You might also love</div>
          </div>
          <Link href="/accessories/earrings" className="text-xs tracking-widest text-[#B37A5F] hover:underline hidden sm:block">
            ALL EARRINGS →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {related.map((rel) => (
            <Link key={rel.slug} href={`/accessories/earrings/${rel.slug}`} className="group block">
              <div className="elegant-card border border-[#D4C9B8] dark:border-[#3A3630] rounded-3xl overflow-hidden hover:border-[#B37A5F] transition-all">
                <EarringPhoto
                  primarySrc={rel.photo}
                  secondarySrc={rel.photoSecondary}
                  alt={rel.name}
                  nickname={rel.nickname}
                  aspect="aspect-[16/11]"
                  showVariantBadge={false}
                />
                <div className="px-5 py-4 text-sm">
                  <div className="font-medium tracking-tight">{rel.nickname}</div>
                  <div className="text-xs text-[#6F5A47] dark:text-[#C8B8A3] mt-0.5 line-clamp-1">{rel.name}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Refined prev/next footer navigation */}
      <div className="border-t border-[#D4C9B8] dark:border-[#3A3630] pt-8 flex flex-col sm:flex-row items-center justify-between gap-y-4 text-sm">
        {prevEarring ? (
          <Link href={`/accessories/earrings/${prevEarring.slug}`} className="group flex items-center gap-2 text-[#6F5A47] hover:text-[#B37A5F] transition-colors">
            <span className="text-lg group-hover:-translate-x-0.5 transition">←</span> {prevEarring.nickname}
          </Link>
        ) : <span />}

        <Link href="/accessories/earrings" className="text-xs tracking-[0.2em] text-[#B37A5F] hover:underline">
          ALL EARRINGS
        </Link>

        {nextEarring ? (
          <Link href={`/accessories/earrings/${nextEarring.slug}`} className="group flex items-center gap-2 text-[#6F5A47] hover:text-[#B37A5F] transition-colors">
            {nextEarring.nickname} <span className="text-lg group-hover:translate-x-0.5 transition">→</span>
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
