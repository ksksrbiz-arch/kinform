"use client";

import { useState, useRef } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { getDesign, designs } from "@/lib/designs";
import { TechPackGenerator } from "@/components/techpack/TechPackGenerator";
import { Modal } from "@/components/ui/Modal";
import { FlatSketchImage } from "@/components/ui/FlatSketchImage";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/ui/ScrollReveal";
import { ArrowLeft, ArrowRight, Download, Ruler, Scissors, Palette } from "lucide-react";
import { useParams } from "next/navigation";

export default function DesignDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const design = getDesign(slug);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showTechPack, setShowTechPack] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax on hero image
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  if (!design) return notFound();

  // Find related designs (the other two)
  const related = designs.filter((d) => d.slug !== design.slug);

  return (
    <div className="relative">
      {/* ======== HERO — Full-bleed with parallax ======== */}
      <section ref={heroRef} className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <FlatSketchImage slug={design.slug} name={design.name} number={design.number} className="rounded-none border-0 w-full h-full" />
        </motion.div>

        {/* Gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F4ED] via-[#F8F4ED]/40 to-transparent" />

        {/* Hero text at bottom */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pb-12 md:pb-16 w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Link href="/designs" className="text-sm tracking-[0.15em] text-[#6F5A47] hover:text-[#B37A5F] inline-flex items-center gap-2 mb-6 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition" /> COLLECTION
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <div className="uppercase tracking-[0.25em] text-xs text-[#B37A5F] mb-2">{design.category}</div>
            <h1 className="font-display text-6xl sm:text-8xl md:text-[110px] tracking-[-0.045em] leading-[0.85]">
              {design.fullName}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ======== MAIN CONTENT ======== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8">

        {/* Vibe statement — big italic pull quote */}
        <ScrollReveal className="py-16 md:py-20 border-b border-[#D4C9B8]">
          <p className="font-display text-3xl sm:text-4xl md:text-5xl italic leading-tight tracking-[-0.02em] text-[#2C2722] max-w-3xl">
            &ldquo;{design.vibe}&rdquo;
          </p>
        </ScrollReveal>

        {/* Description + Key Details — Two-column on desktop */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 py-16 md:py-24 border-b border-[#D4C9B8]">
          <ScrollReveal>
            <h2 className="font-display text-4xl tracking-tight mb-6">About This Design</h2>
            <p className="text-lg leading-relaxed text-[#2C2722]">{design.longDesc}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h3 className="font-medium tracking-[0.15em] text-xs text-[#9A8671] mb-5">KEY DETAILS</h3>
            <StaggerReveal className="space-y-3">
              {design.keyDetails.map((detail, i) => (
                <StaggerItem key={i}>
                  <div className="flex gap-3 text-[15px] text-[#2C2722]">
                    <span className="text-[#B37A5F] mt-2 block w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    {detail}
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </ScrollReveal>
        </div>

        {/* ======== FABRICS & COLORWAYS — Visual cards ======== */}
        <div className="py-16 md:py-24 border-b border-[#D4C9B8]">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-5">
                <Scissors size={18} className="text-[#B37A5F]" />
                <h3 className="font-medium tracking-[0.15em] text-xs text-[#9A8671]">SUGGESTED FABRICS</h3>
              </div>
              <div className="space-y-3">
                {design.suggestedFabrics.map((f, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 6, backgroundColor: "#F1E9DF" }}
                    className="border border-[#D4C9B8] rounded-2xl px-6 py-4 text-[15px] text-[#2C2722] cursor-default transition-colors"
                  >
                    {f}
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="flex items-center gap-3 mb-5">
                <Palette size={18} className="text-[#B37A5F]" />
                <h3 className="font-medium tracking-[0.15em] text-xs text-[#9A8671]">COLORWAYS</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {design.colorways.map((c, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.97 }}
                    className="border border-[#D4C9B8] rounded-full px-6 py-3 text-sm text-[#6F5A47] cursor-default"
                  >
                    {c}
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ======== MEASUREMENTS — Interactive table ======== */}
        <ScrollReveal className="py-16 md:py-24 border-b border-[#D4C9B8]">
          <div className="flex items-center gap-3 mb-6">
            <Ruler size={18} className="text-[#B37A5F]" />
            <h3 className="font-medium tracking-[0.15em] text-xs text-[#9A8671]">MEASUREMENTS (CM) — Click a size to highlight</h3>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="text-left bg-[#F1E9DF] rounded-t-xl">
                  <th className="py-3 px-4 font-medium rounded-tl-xl">Size</th>
                  {Object.keys(design.measurements.XS || {}).map((key) => (
                    <th key={key} className="py-3 px-4 font-medium capitalize last:rounded-tr-xl">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(design.measurements).map(([size, specs]) => {
                  const isSelected = selectedSize === size;
                  return (
                    <motion.tr
                      key={size}
                      onClick={() => setSelectedSize(isSelected ? null : size)}
                      animate={{
                        backgroundColor: isSelected ? "rgba(179, 122, 95, 0.1)" : "transparent",
                      }}
                      whileHover={{ backgroundColor: "rgba(179, 122, 95, 0.05)" }}
                      className="cursor-pointer border-t border-[#D4C9B8] transition-all"
                    >
                      <td className={`py-3 px-4 font-semibold ${isSelected ? "text-[#B37A5F]" : ""}`}>{size}</td>
                      {Object.values(specs).map((val, idx) => (
                        <td key={idx} className="py-3 px-4 tabular-nums">{val}</td>
                      ))}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#9A8671] mt-3 leading-snug">{design.measurementNotes}</p>
        </ScrollReveal>

        {/* ======== CONSTRUCTION NOTES — Staggered reveal ======== */}
        <div className="py-16 md:py-24 border-b border-[#D4C9B8]">
          <ScrollReveal>
            <h3 className="font-display text-4xl tracking-tight mb-8">How It's Made</h3>
          </ScrollReveal>
          <StaggerReveal className="space-y-4 max-w-3xl">
            {design.constructionNotes.map((note, i) => (
              <StaggerItem key={i}>
                <div className="flex gap-4 text-[15px] text-[#2C2722]">
                  <span className="text-[#B37A5F] font-mono text-sm mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p className="leading-relaxed">{note}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <ScrollReveal delay={0.2} className="mt-10 p-6 rounded-2xl bg-[#F1E9DF] border border-[#D4C9B8]">
            <p className="text-sm text-[#6F5A47]"><strong className="text-[#2C2722]">Care:</strong> {design.careInstructions}</p>
          </ScrollReveal>
        </div>

        {/* ======== TECH PACK CTA ======== */}
        <div id="techpack" className="py-16 md:py-24 border-b border-[#D4C9B8]">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="uppercase text-xs tracking-[0.2em] text-[#B37A5F] mb-3">PRODUCTION READY</div>
              <h2 className="font-display text-5xl tracking-tight">Generate Tech Pack</h2>
              <p className="mt-3 text-[#6F5A47]">Customize fabrics and notes. Get a professional PDF for your pattern maker or factory.</p>
            </div>
          </ScrollReveal>

          {/* Desktop: inline generator */}
          <div className="hidden lg:block">
            <TechPackGenerator initialDesignSlug={design.slug} />
          </div>

          {/* Mobile: button opens modal */}
          <div className="lg:hidden text-center">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowTechPack(true)}
              className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2"
            >
              <Download size={18} /> Open Tech Pack Generator
            </motion.button>
          </div>
        </div>

        {/* ======== RELATED DESIGNS ======== */}
        <div className="py-16 md:py-24">
          <ScrollReveal>
            <h3 className="font-display text-4xl tracking-tight mb-8 text-center">Continue Exploring</h3>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((d, i) => (
              <ScrollReveal key={d.slug} delay={i * 0.1}>
                <Link href={`/designs/${d.slug}`} className="group block">
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="border border-[#D4C9B8] rounded-3xl overflow-hidden bg-white hover:border-[#B37A5F] transition-colors"
                  >
                    <div className="aspect-[16/9] bg-[#F1E9DF] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-[10px] tracking-[0.3em] text-[#9A8671] mb-1">{d.number}</div>
                        <div className="font-display text-5xl md:text-6xl tracking-tight text-[#B37A5F]/60 group-hover:text-[#B37A5F] transition-colors">
                          {d.name}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="font-display text-2xl mb-2">{d.fullName}</div>
                      <p className="text-sm text-[#6F5A47] line-clamp-2">{d.shortDesc}</p>
                      <div className="mt-4 text-xs tracking-[0.15em] text-[#B37A5F] group-hover:underline flex items-center gap-1">
                        VIEW <ArrowRight size={12} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* ======== FLOATING MOBILE CTA ======== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#F8F4ED]/95 backdrop-blur-lg border-t border-[#D4C9B8] p-4 safe-area-pb">
        <div className="flex gap-3">
          <Link href={`/atelier/techpack`} className="btn-primary flex-1 text-center justify-center py-3">
            Tech Pack
          </Link>
          <Link href="/request-sample" className="btn-secondary flex-1 text-center justify-center py-3">
            Request Sample
          </Link>
        </div>
      </div>

      {/* Mobile tech pack modal */}
      <Modal
        isOpen={showTechPack}
        onClose={() => setShowTechPack(false)}
        title={`Tech Pack — ${design.name}`}
        size="lg"
      >
        <TechPackGenerator initialDesignSlug={design.slug} />
      </Modal>
    </div>
  );
}
