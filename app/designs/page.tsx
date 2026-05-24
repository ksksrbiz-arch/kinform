"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { designs } from "@/lib/designs";

export default function CollectionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-20">
      <div className="mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F]">KINFORM DEBUT 2026</div>
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-[-0.04em] mt-1">The Collection</h1>
        <p className="max-w-md mt-4 text-lg sm:text-xl text-[#6F5A47]">Three signature pieces. Each one a quiet manifesto.</p>
      </div>

      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        {designs.map((design, index) => (
          <Link
            key={design.slug}
            href={`/designs/${design.slug}`}
            className="group block"
          >
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -12 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="elegant-card bg-white border border-[#D4C9B8] overflow-hidden rounded-3xl h-full flex flex-col hover:border-[#B37A5F] transition-all duration-300"
            >
              <div className="aspect-[16/11] bg-[#F1E9DF] relative flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="text-[10px] tracking-[0.3em] text-[#9A8671] mb-2">0{index + 1} TECHNICAL FLAT</div>
                  <div className="font-display text-7xl tracking-[-0.02em] text-[#B37A5F]/70 group-hover:text-[#B37A5F] transition-colors">
                    {design.name}
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-display text-4xl sm:text-5xl tracking-[-0.02em]">{design.name}</h3>
                  <span className="text-xs font-mono text-[#9A8671]">{design.number}</span>
                </div>
                <p className="text-[#6F5A47] leading-snug flex-1">{design.shortDesc}</p>
                <div className="mt-auto pt-6 text-xs tracking-[0.15em] text-[#B37A5F] group-hover:underline">VIEW DETAILS &amp; TOOLS →</div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      <div className="mt-16 text-center text-sm text-[#6F5A47]">
        Each piece is designed to be worn alone or layered. <Link href="/atelier" className="underline hover:text-[#B37A5F]">Generate a tech pack for production partners.</Link>
      </div>
    </div>
  );
}
