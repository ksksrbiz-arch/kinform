"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { earrings } from "@/lib/earrings";
import { EarringPhoto } from "@/components/ui/EarringPhoto";

export default function EarringsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-20">
      {/* Refined header */}
      <div className="mb-10 sm:mb-14">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-1">
          <Link href="/accessories" className="hover:underline">ACCESSORIES</Link>{" "}
          / EARRINGS
        </div>
        <h1 className="font-display text-6xl sm:text-7xl md:text-[84px] tracking-[-0.045em] mt-1 leading-[0.92]">
          Earrings
        </h1>
        <p className="max-w-md mt-4 text-lg sm:text-xl text-[#6F5A47] dark:text-[#C8B8A3]">
          Twelve handcrafted statements. Each pair tells its own story — botanical, celestial, playful, or abstract.
        </p>
        <div className="mt-3 text-xs tracking-[0.2em] text-[#9A8671] dark:text-[#A38F76]">
          SHIPS IMMEDIATELY • LIGHTWEIGHT • PERFECT WITH THE FIRST DROP
        </div>
      </div>

      {/* Premium photo grid — dense yet elegant on all screen sizes */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: 0.028 } } }}
      >
        {earrings.map((earring, index) => (
          <Link
            key={earring.slug}
            href={`/accessories/earrings/${earring.slug}`}
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B37A5F] rounded-3xl"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="elegant-card bg-white dark:bg-[#1F1C19] border border-[#D4C9B8] dark:border-[#3A3630] overflow-hidden rounded-3xl h-full flex flex-col hover:border-[#B37A5F] dark:hover:border-[#C48A6E] transition-all duration-300"
            >
              {/* Real photography with beautiful reveal + hover scale */}
              <EarringPhoto
                primarySrc={earring.photo}
                secondarySrc={earring.photoSecondary}
                alt={earring.name}
                nickname={earring.nickname}
                aspect="aspect-square"
                showVariantBadge
              />

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-[21px] sm:text-2xl tracking-[-0.015em] leading-tight">
                      {earring.nickname}
                    </h3>
                    <p className="text-sm text-[#6F5A47] dark:text-[#C8B8A3] mt-1 leading-snug pr-1">
                      {earring.name.replace(/^The /, "")}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-[#9A8671] dark:text-[#A38F76] pt-1 shrink-0 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-auto pt-5 text-[11px] tracking-[0.18em] text-[#B37A5F] dark:text-[#C48A6E] group-hover:underline flex items-center gap-1">
                  VIEW THIS PAIR <span aria-hidden>→</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Footer note + back link */}
      <div className="mt-16 sm:mt-20 text-center">
        <p className="text-sm text-[#6F5A47] dark:text-[#C8B8A3]">
          All pieces are handcrafted in small batches. Lightweight enough for all-day wear.
        </p>
        <Link
          href="/accessories"
          className="mt-3 inline-block text-xs tracking-[0.2em] text-[#B37A5F] dark:text-[#C48A6E] hover:underline"
        >
          ← BACK TO ALL ACCESSORIES
        </Link>
      </div>
    </div>
  );
}
