"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getDesign, designs } from "@/lib/designs";
import { TechPackGenerator } from "@/components/techpack/TechPackGenerator";
import { Modal } from "@/components/ui/Modal";

import { useParams } from "next/navigation";

export default function DesignDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const design = getDesign(slug);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showTechPack, setShowTechPack] = useState(false);

  if (!design) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-8 pt-10 pb-24">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <Link href="/designs" className="text-sm tracking-widest hover:text-[#B37A5F] inline-flex items-center gap-1 group">
          <span className="group-hover:-translate-x-0.5 transition">←</span> BACK TO COLLECTION
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-x-12 gap-y-10">
        {/* Left: Visual + name — Enhanced */}
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[4/3.1] bg-[#F8F4ED] dark:bg-[#252320] rounded-3xl flex items-center justify-center border border-[#D4C9B8] dark:border-[#3A3630] overflow-hidden mb-6 shadow-sm relative"
            >
              {/* High-quality animated flat sketch placeholder */}
              <div className="relative w-full h-full flex items-center justify-center p-6">
                <svg 
                  viewBox="0 0 400 300" 
                  className="w-4/5 h-4/5 text-[#B37A5F]/70 dark:text-[#C48A6E]/70"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  {/* Simple elegant fashion flat representation - can be replaced with real art */}
                  <motion.g
                    initial={{ pathLength: 0, opacity: 0.3 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                  >
                    {/* Collar / Neck */}
                    <path d="M180 70 Q200 55 220 70" />
                    {/* Body */}
                    <path d="M160 80 L240 80 L255 200 L145 200 Z" />
                    {/* Vertical tie detail (signature element) */}
                    <path d="M200 85 L200 195" />
                    <path d="M190 100 Q200 110 210 100" />
                    <path d="M190 130 Q200 140 210 130" />
                    {/* Sleeves */}
                    <path d="M160 85 Q130 100 125 140" />
                    <path d="M240 85 Q270 100 275 140" />
                    {/* Waist knot accent */}
                    <circle cx="200" cy="165" r="8" />
                    <path d="M193 165 Q200 175 207 165" />
                  </motion.g>
                </svg>
                
                <div className="absolute bottom-4 text-center">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-[#9A8671] mb-1">{design.number} — TECHNICAL FLAT</div>
                  <div className="font-display text-3xl tracking-tight text-[#B37A5F] dark:text-[#C48A6E]">{design.name}</div>
                </div>
              </div>
            </motion.div>

            <div className="text-xs text-[#9A8671] tracking-widest">DETAILS &amp; SPECIFICATIONS BELOW — SCROLL TO GENERATE TECH PACK</div>
          </div>
        </div>

        {/* Right: Copy + specs — Animated sections */}
        <div className="lg:col-span-2 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="uppercase tracking-[0.2em] text-xs text-[#9A8671]">{design.category}</div>
            <h1 className="font-display text-7xl tracking-[-0.03em] leading-none mt-1 mb-5">{design.fullName}</h1>
            <p className="text-xl text-[#6F5A47] leading-snug">{design.longDesc}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-medium tracking-widest text-xs mb-4 text-[#2C2722]">KEY DETAILS</h4>
            <ul className="space-y-3 text-[15px] text-[#2C2722]">
              {design.keyDetails.map((detail, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-3"
                >
                  <span className="text-[#B37A5F] mt-1.5 block w-1 h-1 rounded-full bg-current flex-shrink-0" />
                  {detail}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h4 className="font-medium tracking-widest text-xs mb-4 text-[#2C2722]">SUGGESTED FABRICS</h4>
            <div className="flex flex-wrap gap-2">
              {design.suggestedFabrics.map((f, i) => (
                <motion.span 
                  key={i} 
                  whileHover={{ scale: 1.05, backgroundColor: "#F8F4ED" }}
                  className="inline-block text-sm border border-[#D4C9B8] px-5 py-1.5 rounded-full text-[#6F5A47] cursor-default"
                >
                  {f}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Measurement table — Interactive + Animated */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="font-medium tracking-widest text-xs mb-4 text-[#2C2722]">MEASUREMENTS (CM) — Click a size to highlight</h4>
            <div className="overflow-x-auto">
              <table className="tech-table w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-3 font-medium">Size</th>
                    {Object.keys(design.measurements.XS || {}).map((key) => (
                      <th key={key} className="py-2 px-3 font-medium capitalize">{key}</th>
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
                        whileHover={{ backgroundColor: "rgba(179, 122, 95, 0.06)" }}
                        animate={{ 
                          backgroundColor: isSelected ? "rgba(179, 122, 95, 0.12)" : "transparent",
                          scale: isSelected ? 1.01 : 1 
                        }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer border-t"
                      >
                        <td className={`py-2.5 px-3 font-medium transition-colors ${isSelected ? 'text-[#B37A5F] font-semibold' : ''}`}>
                          {size}
                        </td>
                        {Object.values(specs).map((val, idx) => (
                          <td key={idx} className="py-2.5 px-3 border-t tabular-nums">{val}</td>
                        ))}
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#9A8671] mt-2 leading-snug">{design.measurementNotes}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-4 border-t border-[#D4C9B8]"
          >
            <Link href="/atelier" className="btn-primary w-full justify-center text-base py-4">Generate Customized Tech Pack for {design.name}</Link>
            <p className="text-center text-xs text-[#9A8671] mt-3">Opens the Atelier tool pre-filled with this design</p>
          </motion.div>
        </div>
      </div>

      {/* Construction notes — Staggered */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 max-w-3xl"
      >
        <h3 className="font-display text-3xl tracking-tight mb-6">Construction Notes</h3>
        <ul className="space-y-4 text-[15px] text-[#2C2722]">
          {design.constructionNotes.map((note, i) => (
            <motion.li 
              key={i} 
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="pl-6 border-l-2 border-[#D4C9B8]"
            >
              {note}
            </motion.li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-[#6F5A47]"><strong>Care:</strong> {design.careInstructions}</p>
      </motion.div>

      {/* Tech Pack — Desktop inline + Mobile bottom sheet trigger */}
      <div id="techpack" className="mt-20 pt-10 border-t border-[#D4C9B8]">
        <div className="max-w-2xl mb-8">
          <div className="uppercase text-xs tracking-[0.2em] text-[#B37A5F]">PRODUCTION READY</div>
          <h2 className="font-display text-5xl tracking-tight mt-2">Generate Tech Pack</h2>
          <p className="mt-3 text-[#6F5A47]">Customize fabrics and notes. Download a clean, professional PDF for your pattern maker or factory.</p>
        </div>

        {/* Desktop: Always visible */}
        <div className="hidden lg:block">
          <TechPackGenerator initialDesignSlug={design.slug} />
        </div>

        {/* Mobile: Floating button + Modal */}
        <div className="lg:hidden">
          <button 
            onClick={() => setShowTechPack(true)}
            className="btn-primary w-full py-4 text-base"
          >
            Open Tech Pack Generator
          </button>
        </div>
      </div>

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
