"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDesign, designs } from "@/lib/designs";
import { TechPackGenerator } from "@/components/techpack/TechPackGenerator";

import { useParams } from "next/navigation";

export default function DesignDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const design = getDesign(slug);

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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-[4/3.1] bg-[#F1E9DF] rounded-3xl flex items-center justify-center border border-[#D4C9B8] overflow-hidden mb-6 shadow-sm"
            >
              {/* TODO: Replace with real professional flat sketch */}
              <div className="text-center p-8">
                <div className="font-mono text-xs tracking-[0.3em] text-[#9A8671] mb-1">{design.number} — TECHNICAL DRAWING</div>
                <div className="font-display text-[92px] leading-none tracking-[-0.04em] text-[#B37A5F]/60">{design.name}</div>
                <p className="mt-4 text-sm max-w-[260px] mx-auto text-[#6F5A47]">Insert your professional flat sketch here<br />(/public/images/{design.slug}/{design.slug}-flat.png)</p>
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

          {/* Measurement table — Animated */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="font-medium tracking-widest text-xs mb-4 text-[#2C2722]">MEASUREMENTS (CM)</h4>
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
                  {Object.entries(design.measurements).map(([size, specs]) => (
                    <tr key={size}>
                      <td className="py-2.5 px-3 font-medium border-t">{size}</td>
                      {Object.values(specs).map((val, idx) => (
                        <td key={idx} className="py-2.5 px-3 border-t tabular-nums">{val}</td>
                      ))}
                    </tr>
                  ))}
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

      {/* Inline Tech Pack Generator — Featured */}
      <div id="techpack" className="mt-20 pt-10 border-t border-[#D4C9B8]">
        <div className="max-w-2xl mb-8">
          <div className="uppercase text-xs tracking-[0.2em] text-[#B37A5F]">PRODUCTION READY</div>
          <h2 className="font-display text-5xl tracking-tight mt-2">Generate Tech Pack</h2>
          <p className="mt-3 text-[#6F5A47]">Customize fabrics and notes. Download a clean, professional PDF for your pattern maker or factory.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <TechPackGenerator initialDesignSlug={design.slug} />
        </motion.div>
      </div>
    </div>
  );
}
