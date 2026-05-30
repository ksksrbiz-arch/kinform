"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { designs } from "@/lib/designs";

const palette: Record<string, { from: string; to: string; accent: string }> = {
  halter: { from: "#F1E9DF", to: "#E8DCC9", accent: "#9A8671" },
  fishnet: { from: "#E5D8C5", to: "#D4C9B8", accent: "#B37A5F" },
  academic: { from: "#F8F4ED", to: "#E5D8C5", accent: "#6F5A47" },
};

export default function CollectionPage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-16 md:pt-24 pb-12 border-b border-[#D4C9B8]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-8 items-end"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 text-[10px] tracking-[0.25em] text-[#B37A5F] border border-[#B37A5F]/30 rounded-full">
              KINFORM DEBUT • 2026
            </div>
            <h1 className="font-display text-6xl md:text-8xl tracking-[-0.04em] leading-[0.9]">
              The<br />
              <span className="italic text-[#B37A5F]">Collection.</span>
            </h1>
          </div>
          <p className="text-xl text-[#6F5A47] leading-snug max-w-md md:justify-self-end">
            Three signature pieces. Each one a quiet manifesto. Built to be lived in, layered, and loved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex items-center gap-3 text-xs tracking-widest text-[#9A8671]"
        >
          <ArrowDown size={14} className="animate-bounce" /> SCROLL THROUGH THE PIECES
        </motion.div>
      </section>

      {/* PIECES — alternating editorial layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-24 space-y-32 md:space-y-40">
        {designs.map((design, index) => {
          const reverse = index % 2 === 1;
          const p = palette[design.slug] || palette.halter;
          return (
            <motion.div
              key={design.slug}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                reverse ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Visual */}
              <Link href={`/designs/${design.slug}`} className="block group">
                <div
                  className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#D4C9B8] group-hover:border-[#B37A5F] transition-colors"
                  style={{
                    background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <div
                      className="text-[10px] tracking-[0.3em] mb-4"
                      style={{ color: p.accent }}
                    >
                      / NO. {design.number} /
                    </div>
                    <div
                      className="font-display text-7xl md:text-[120px] tracking-[-0.04em]"
                      style={{ color: p.accent }}
                    >
                      {design.name}
                    </div>
                    <div
                      className="mt-6 text-xs uppercase tracking-[0.25em]"
                      style={{ color: p.accent }}
                    >
                      {design.category}
                    </div>
                  </motion.div>

                  {/* Floating tag */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-5 right-5 bg-[#2C2722] text-[#F8F4ED] text-[10px] tracking-widest px-3 py-1.5 rounded-full"
                  >
                    TAP TO EXPLORE
                  </motion.div>
                </div>
              </Link>

              {/* Copy */}
              <div className="space-y-6">
                <div>
                  <div className="text-xs tracking-[0.25em] text-[#9A8671] mb-2">
                    {design.category.toUpperCase()}
                  </div>
                  <h2 className="font-display text-6xl md:text-7xl tracking-[-0.03em] leading-none">
                    {design.fullName || `The ${design.name}`}
                  </h2>
                </div>

                <p className="text-lg text-[#2C2722] leading-relaxed">{design.longDesc}</p>

                <div className="border-l-2 border-[#B37A5F] pl-5 italic text-[#6F5A47] text-base">
                  &ldquo;{design.vibe}&rdquo;
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {design.colorways.slice(0, 4).map((c, i) => (
                    <span
                      key={i}
                      className="text-xs border border-[#D4C9B8] px-3 py-1 rounded-full text-[#6F5A47]"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex gap-3 flex-wrap">
                  <Link href={`/designs/${design.slug}`} className="btn-primary group">
                    Full Spec &amp; Details
                    <ArrowRight
                      size={14}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <Link href="/request-sample" className="btn-secondary">
                    Request Sample
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* FINAL */}
      <section className="border-t border-[#D4C9B8] py-24 px-6 text-center bg-gradient-to-b from-[#F8F4ED] to-[#F1E9DF]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <h3 className="font-display text-5xl tracking-[-0.02em] mb-5">Want the full set?</h3>
          <p className="text-[#6F5A47] mb-8">
            Each piece is designed to be worn alone — or together. Tell us what speaks to you.
          </p>
          <Link href="/request-sample" className="btn-primary px-10 py-3.5 group">
            Request Samples
            <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
