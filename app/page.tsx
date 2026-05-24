"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { InterestForm } from "@/components/forms/InterestForm";

export default function KinformHome() {
  return (
    <>
      {/* Hero — Bold, youthful, cinematic */}
      <section className="min-h-[92vh] flex items-center relative overflow-hidden border-b border-[#D4C9B8] bg-[#F8F4ED]">
        <div className="max-w-5xl mx-auto px-8 pt-16 pb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block px-5 py-1.5 mb-8 text-xs tracking-[0.2em] border border-[#B37A5F]/40 rounded-full text-[#B37A5F] font-medium"
          >
            DEBUT COLLECTION 2026
          </motion.div>

          <h1 className="font-display text-[110px] md:text-[140px] leading-[0.82] tracking-[-0.055em] mb-6">
            KINFORM
          </h1>

          <p className="max-w-lg mx-auto text-2xl md:text-3xl text-[#6F5A47] tracking-[-0.01em] mb-12">
            Three original designs.<br />For the ones who move differently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#collection" 
              className="btn-primary text-base px-12 py-4 text-lg font-semibold"
            >
              Explore the Collection
            </Link>
            <Link 
              href="#join" 
              className="btn-secondary text-base px-10 py-4 text-lg"
            >
              Request Early Access
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] text-[#9A8671] flex items-center gap-4">
          SCROLL TO BEGIN
          <div className="w-px h-6 bg-[#D4C9B8]" />
        </div>
      </section>

      {/* Collection — Premium & Animated */}
      <section id="collection" className="section max-w-7xl mx-auto px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="uppercase text-xs tracking-[0.2em] text-[#B37A5F] mb-2">DEBUT COLLECTION</div>
            <h2 className="font-display text-7xl md:text-8xl tracking-[-0.04em]">Three Signatures</h2>
          </div>
          <Link href="/designs" className="hidden md:flex btn-secondary text-base items-center gap-2">
            Full Lookbook <span className="text-lg">→</span>
          </Link>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {[
            { name: "TETHER", desc: "Short-sleeve collared shirt with integrated vertical tie detail and waist knot accent.", slug: "tether" },
            { name: "CLASP", desc: "Sleeveless wrap top with gathered waist knot and asymmetrical hem. Feminine and versatile.", slug: "clasp" },
            { name: "APERTURE", desc: "Bold long-sleeve statement with triangular cutout, dramatic sleeves, and convertible hem.", slug: "aperture" },
          ].map((d, i) => (
            <Link 
              key={i} 
              href={`/designs/${d.slug}`} 
              className="group block"
            >
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -12 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="elegant-card bg-white border border-[#D4C9B8] p-9 rounded-3xl h-full flex flex-col justify-between hover:border-[#B37A5F] transition-all duration-300"
              >
                <div>
                  <div className="uppercase text-[10px] tracking-[0.25em] text-[#B37A5F] mb-3">0{i+1} / SIGNATURE</div>
                  <h3 className="font-display text-7xl tracking-[-0.03em] mb-6 group-hover:text-[#B37A5F] transition-colors">{d.name}</h3>
                </div>
                <p className="text-[#6F5A47] text-[15px] leading-snug pr-4">{d.desc}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/designs" className="btn-secondary">View Full Lookbook →</Link>
        </div>
      </section>

      {/* CLASP — First Small-Batch Pre-Order (Zero-Upfront Launch) */}
      <section id="clasp-preorder" className="section max-w-3xl mx-auto px-8 text-center border-b border-[#D4C9B8] bg-[#F8F4ED]">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-2">FIRST PRODUCTION RUN</div>
        <h2 className="font-display text-5xl md:text-6xl tracking-[-0.03em] mb-4">CLASP — First Small-Batch Drop</h2>
        
        <p className="text-lg text-[#6F5A47] max-w-xl mx-auto mb-6 leading-relaxed">
          Our signature wrap top with a flattering gathered waist knot and asymmetrical hem. 
          Cut in sustainable fabrics (Tencel or organic cotton options). Made to order in limited quantities.
        </p>

        <div className="inline-flex items-center gap-2 text-sm bg-white px-4 py-1 rounded-full border border-[#D4C9B8] mb-8">
          Ships in 6–8 weeks • Only making what’s ordered
        </div>

        <div className="max-w-md mx-auto">
          <InterestForm defaultType="Pre-Order / First Run" />
        </div>

        <p className="text-xs text-[#9A8671] mt-4 tracking-wide">
          Limited quantities. First run opens soon.
        </p>
      </section>

      {/* Philosophy — Confident & Modern */}
      <section className="section border-y border-[#D4C9B8] bg-white">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <p className="text-3xl md:text-4xl leading-tight tracking-[-0.015em] text-[#2C2722]">
            Clothing that feels like it already belongs to you.
          </p>
          <Link href="/story" className="mt-8 inline-block text-sm tracking-[0.15em] font-medium hover:text-[#B37A5F] transition-colors">THE STORY BEHIND IT →</Link>
        </div>
      </section>

      {/* Atelier Teaser — Now with real power */}
      <section className="section max-w-5xl mx-auto px-8 text-center border-b border-[#D4C9B8]">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3">FOR FOUNDERS, MAKERS &amp; PARTNERS</div>
        <h3 className="font-display text-6xl tracking-[-0.03em] mb-4">The Atelier</h3>
        <p className="max-w-md mx-auto text-lg text-[#6F5A47] mb-8">
          Production tools built for the ones actually making things. Tech packs, BOMs, grading, and real cost tracking.
        </p>
        <Link href="/atelier" className="btn-primary text-base px-14 py-4">Enter the Atelier</Link>
      </section>

      {/* Final CTA — Stronger */}
      <section id="join" className="section max-w-xl mx-auto px-8 text-center">
        <h3 className="font-display text-6xl tracking-[-0.03em] mb-6">Ready to move with us?</h3>
        <p className="text-[#6F5A47] text-lg mb-10 max-w-md mx-auto">
          Early access, wholesale, and production partnerships.
        </p>
        <Link href="/atelier" className="btn-primary text-lg px-16 py-4">Join the Movement</Link>
      </section>
    </>
  );
}
