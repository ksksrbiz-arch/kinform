"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { earrings, garmentEarringRecommendations } from "@/lib/earrings";
import { EarringPhoto } from "@/components/ui/EarringPhoto";

interface AccessoriesCrossSellProps {
  designName: string; // e.g. "HALTER" — used to look up tailored recommendations
  /** Optional explicit slug list to override the defaults in lib/earrings.ts */
  recommendedSlugs?: string[];
}

/**
 * AccessoriesCrossSell — "Complete the Look" section
 * 
 * Renders three contextually chosen earrings with real photography.
 * Beautiful micro-interactions, premium detail for conversion.
 * Used on the three main pre-order landing pages.
 */
export function AccessoriesCrossSell({ 
  designName, 
  recommendedSlugs 
}: AccessoriesCrossSellProps) {
  // Resolve the three recommended earrings for this garment
  const slugs = recommendedSlugs || garmentEarringRecommendations[designName.toUpperCase()] || [];
  const recommended = slugs
    .map(slug => earrings.find(e => e.slug === slug))
    .filter(Boolean) as typeof earrings;

  // Fallback to first three if nothing matched
  const displayEarrings = recommended.length === 3 
    ? recommended 
    : earrings.slice(0, 3);

  return (
    <div className="mt-14 pt-10 border-t border-[#D4C9B8] dark:border-[#3A3630]">
      <div className="text-center mb-8">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-1.5">COMPLETE THE LOOK</div>
        <h3 className="font-display text-3xl sm:text-4xl tracking-[-0.025em]">
          Pair {designName} with these earrings
        </h3>
        <p className="text-[#6F5A47] dark:text-[#C8B8A3] mt-2 text-sm max-w-xs mx-auto">
          Curated pairings that echo the same sculptural energy.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {displayEarrings.map((earring, index) => (
          <Link
            key={earring.slug}
            href={`/accessories/earrings/${earring.slug}`}
            className="group block"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="elegant-card bg-white dark:bg-[#1F1C19] border border-[#D4C9B8] dark:border-[#3A3630] rounded-3xl overflow-hidden h-full flex flex-col hover:border-[#B37A5F] dark:hover:border-[#C48A6E] transition-all duration-300"
            >
              {/* Real product photo with reveal + hover lift */}
              <div className="relative">
                <EarringPhoto
                  primarySrc={earring.photo}
                  secondarySrc={earring.photoSecondary}
                  alt={earring.name}
                  nickname={earring.nickname}
                  aspect="aspect-[4/3.2]"
                  showVariantBadge
                />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="font-display text-xl tracking-[-0.01em] leading-none">
                    {earring.nickname}
                  </div>
                  <div className="font-mono text-[10px] text-[#9A8671] dark:text-[#A38F76] shrink-0">
                    {earring.id.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-[#6F5A47] dark:text-[#C8B8A3] leading-snug line-clamp-2 flex-1">
                  {earring.name.replace(/^The /, "")}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between text-xs tracking-[0.15em] text-[#B37A5F] dark:text-[#C48A6E] group-hover:underline">
                  <span>VIEW DETAILS</span>
                  <span aria-hidden>→</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link 
          href="/accessories/earrings" 
          className="inline-flex items-center gap-2 text-sm tracking-[0.15em] text-[#B37A5F] dark:text-[#C48A6E] hover:underline"
        >
          BROWSE ALL 12 EARRINGS →
        </Link>
      </div>
    </div>
  );
}
