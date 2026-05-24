"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { earrings } from "@/lib/earrings";

export default function EarringsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-20">
      <div className="mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F]">
          <Link href="/accessories" className="hover:underline">
            ACCESSORIES
          </Link>{" "}
          / EARRINGS
        </div>
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-[-0.04em] mt-1">
          Earrings
        </h1>
        <p className="max-w-lg mt-4 text-lg sm:text-xl text-[#6F5A47]">
          Twelve curated designs — from botanical sunflowers to abstract paint
          splashes. Each pair is a small statement.
        </p>
      </div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {earrings.map((earring, index) => (
          <Link
            key={earring.slug}
            href={`/accessories/earrings/${earring.slug}`}
            className="group block"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="elegant-card bg-white border border-[#D4C9B8] overflow-hidden rounded-3xl h-full flex flex-col hover:border-[#B37A5F] transition-all duration-300"
            >
              <div className="aspect-square bg-[#F1E9DF] relative flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="text-[10px] tracking-[0.3em] text-[#9A8671] mb-2">
                    {earring.id.toUpperCase()} / EARRING
                  </div>
                  <div className="font-display text-5xl sm:text-6xl tracking-[-0.02em] text-[#B37A5F]/70 group-hover:text-[#B37A5F] transition-colors">
                    {earring.nickname}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-display text-2xl sm:text-3xl tracking-[-0.02em] leading-tight">
                    {earring.nickname}
                  </h3>
                  <span className="text-xs font-mono text-[#9A8671] shrink-0 pt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm text-[#6F5A47] leading-snug line-clamp-2 flex-1">
                  {earring.name}
                </p>
                <div className="mt-auto pt-4 text-xs tracking-[0.15em] text-[#B37A5F] group-hover:underline">
                  VIEW DETAILS →
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      <div className="mt-16 text-center text-sm text-[#6F5A47]">
        All earrings are handcrafted with care.{" "}
        <Link
          href="/accessories"
          className="underline hover:text-[#B37A5F]"
        >
          Back to all accessories.
        </Link>
      </div>
    </div>
  );
}
