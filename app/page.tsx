"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { InterestForm } from "@/components/forms/InterestForm";
import { earrings } from "@/lib/earrings";
import { EarringPhoto } from "@/components/ui/EarringPhoto";

export default function KinformHome() {
  return (
    <>
      {/* Hero — Bold, youthful, cinematic */}
      <section className="min-h-[92vh] flex items-center relative overflow-hidden border-b border-[#D4C9B8] gradient-animated">
        {/* Decorative radial glow behind hero text */}
        <div className="hero-glow absolute inset-0 pointer-events-none" aria-hidden="true" />

        {/* Decorative floating orbs */}
        <div className="orb orb-clay animate-float w-64 h-64 top-20 -left-20 opacity-60" aria-hidden="true" />
        <div className="orb orb-paper animate-float-slow w-96 h-96 bottom-0 right-0 opacity-40" aria-hidden="true" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-16 pb-20 text-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block px-5 py-1.5 mb-8 text-xs tracking-[0.2em] border border-[#B37A5F]/40 rounded-full text-[#B37A5F] font-medium"
          >
            DEBUT COLLECTION 2026
          </motion.div>

          <h1 className="font-display text-[clamp(3.5rem,15vw,9rem)] leading-[0.88] tracking-[-0.055em] mb-6">
            KINFORM
          </h1>

          <p className="max-w-lg mx-auto text-xl sm:text-2xl md:text-3xl text-[#6F5A47] tracking-[-0.01em] mb-12">
            Three original designs.<br />For the ones who move differently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#collection" 
              className="btn-primary text-base px-8 sm:px-12 py-4 text-lg font-semibold"
            >
              Explore the Collection
            </Link>
            <Link 
              href="#join" 
              className="btn-secondary text-base px-8 sm:px-10 py-4 text-lg"
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
      <section id="collection" className="section max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="uppercase text-xs tracking-[0.2em] text-[#B37A5F] mb-2">DEBUT COLLECTION</div>
            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-[-0.04em]">Three Signatures</h2>
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
            { name: "HALTER", desc: "Structured cropped bustier with crisscross halter neck and geometric face-taping across the bodice panels.", slug: "halter" },
            { name: "FISHNET", desc: "Sheer mesh yoke meets high-contrast sweetheart bodice with velvet chevron piping and sport-inspired hem band.", slug: "fishnet" },
            { name: "ACADEMIC", desc: "Three-piece anime-academic ensemble: ruffled blouse, front-lacing corset vest, and tiered tartan mini skirt.", slug: "academic" },
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
                className="elegant-card bg-white border border-[#D4C9B8] p-6 sm:p-9 rounded-3xl h-full flex flex-col justify-between hover:border-[#B37A5F] transition-all duration-300"
              >
                <div>
                  <div className="uppercase text-[10px] tracking-[0.25em] text-[#B37A5F] mb-3">0{i+1} / SIGNATURE</div>
                  <div className="inline-block mb-2 px-3 py-0.5 text-[10px] font-medium bg-[#B37A5F] text-white rounded-full tracking-wider">
                    PRE-ORDER FIRST DROP
                  </div>
                  <h3 className="font-display text-5xl sm:text-7xl tracking-[-0.03em] mb-6 group-hover:text-[#B37A5F] transition-colors">{d.name}</h3>
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

      {/* Multi-piece Pre-Order Teaser — Stronger CTA */}
      <section className="section max-w-5xl mx-auto px-4 sm:px-8 text-center section-gradient">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-2">LIMITED FIRST PRODUCTION RUN</div>
        <h2 className="font-display text-4xl sm:text-5xl tracking-[-0.03em] mb-3">The First Drop is Now Open for Pre-Order</h2>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-1 text-sm text-[#6F5A47] mb-4">
          <div><span className="font-semibold text-[#2C2722]">47</span> people have already joined the first run</div>
          <div><span className="font-semibold text-[#2C2722]">Only 23</span> spots left this batch</div>
        </div>
        
        <p className="text-[#6F5A47] max-w-lg mx-auto mb-8 text-lg">
          We’re only producing what’s actually ordered. No waste. No guessing. 
          Choose your piece and secure your spot in the first small batch.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { name: "HALTER", slug: "halter" },
            { name: "FISHNET", slug: "fishnet" },
            { name: "ACADEMIC", slug: "academic" },
          ].map((piece) => (
            <Link 
              key={piece.slug}
              href={`/#${piece.slug}-preorder`}
              className="block p-6 border border-[#D4C9B8] rounded-2xl hover:border-[#B37A5F] hover:bg-white transition-all group"
            >
              <div className="font-display text-3xl tracking-tight mb-2 group-hover:text-[#B37A5F] transition-colors">{piece.name}</div>
              <div className="text-sm text-[#B37A5F] font-medium">Pre-order this piece →</div>
            </Link>
          ))}
        </div>

        <p className="text-sm text-[#6F5A47]">
          All pieces ship together in 6–8 weeks. Limited quantities available.
        </p>
      </section>

      {/* HALTER — First Small-Batch Pre-Order */}
      <section id="halter-preorder" className="section max-w-3xl mx-auto px-4 sm:px-8 text-center border-b border-[#D4C9B8] bg-[#F8F4ED]">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-2">FIRST PRODUCTION RUN</div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] mb-4">HALTER — First Small-Batch Drop</h2>
        
        <p className="text-lg text-[#6F5A47] max-w-xl mx-auto mb-6 leading-relaxed">
          Our debut sculptural bustier with crisscross halter straps and geometric face-taping.
          Cut in heavy Cotton Crepe or Scuba Knit. Made to order in limited quantities.
        </p>

        <div className="inline-flex items-center gap-2 text-sm bg-white px-4 py-1 rounded-full border border-[#D4C9B8] mb-8">
          Ships in 6–8 weeks • Only making what’s ordered
        </div>

        <div className="max-w-md mx-auto">
          <InterestForm defaultType="Pre-Order / First Run" piece="HALTER" />
        </div>

        <p className="text-xs text-[#9A8671] mt-4 tracking-wide">
          Limited quantities. First run opens soon.
        </p>
      </section>

      {/* FISHNET Pre-Order */}
      <section id="fishnet-preorder" className="section max-w-3xl mx-auto px-4 sm:px-8 text-center border-b border-[#D4C9B8]">
        <h3 className="font-display text-3xl sm:text-4xl tracking-tight mb-3">FISHNET — First Small-Batch Drop</h3>
        <p className="text-[#6F5A47] mb-6">
          The sheer mesh yoke and chevron bustier with velvet piping and sport-inspired hem band.
          Edgy, structured, and made to order in limited quantities.
        </p>
        <div className="max-w-md mx-auto">
          <InterestForm defaultType="Pre-Order / First Run" piece="FISHNET" />
        </div>
      </section>

      {/* ACADEMIC Pre-Order */}
      <section id="academic-preorder" className="section max-w-3xl mx-auto px-4 sm:px-8 text-center border-b border-[#D4C9B8]">
        <h3 className="font-display text-3xl sm:text-4xl tracking-tight mb-3">ACADEMIC — First Small-Batch Drop</h3>
        <p className="text-[#6F5A47] mb-6">
          The anime-academic three-piece ensemble: ruffled blouse, front-lacing corset vest, and tiered tartan mini skirt.
          A complete statement set, made to order.
        </p>
        <div className="max-w-md mx-auto">
          <InterestForm defaultType="Pre-Order / First Run" piece="ACADEMIC" />
        </div>
      </section>

      {/* Accessories Upsell — Immediate Revenue Driver (now with real photos) */}
      <section className="section max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-1.5">COMPLETE THE LOOK</div>
          <h3 className="font-display text-4xl sm:text-5xl tracking-[-0.03em]">Accessories Now Available</h3>
          <p className="text-[#6F5A47] dark:text-[#C8B8A3] max-w-md mx-auto mt-3">
            Handcrafted statement earrings. Ships immediately. The perfect cash-flow companion to your pre-order garments.
          </p>
        </div>

        {/* Visual preview of four standout pieces */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8">
          {[earrings[0], earrings[5], earrings[6], earrings[10]].map((e, i) => (
            <Link key={i} href={`/accessories/earrings/${e.slug}`} className="group block">
              <div className="overflow-hidden rounded-2xl border border-[#D4C9B8] dark:border-[#3A3630] bg-white dark:bg-[#1F1C19] hover:border-[#B37A5F] transition">
                <EarringPhoto
                  primarySrc={e.photo}
                  secondarySrc={e.photoSecondary}
                  alt={e.name}
                  nickname={e.nickname}
                  aspect="aspect-[4/3]"
                  showVariantBadge={false}
                />
              </div>
              <div className="mt-2 text-center">
                <div className="font-medium text-sm tracking-tight">{e.nickname}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/accessories/earrings" 
            className="btn-primary text-base px-10 py-3.5 inline-flex items-center gap-2"
          >
            Shop All 12 Earrings →
          </Link>
          <p className="text-xs text-[#9A8671] dark:text-[#A38F76] mt-4 tracking-wider">
            12 ORIGINAL DESIGNS • LIGHTWEIGHT • PAIRS BEAUTIFULLY WITH HALTER, FISHNET &amp; ACADEMIC
          </p>
        </div>
      </section>

      {/* Philosophy — Confident & Modern */}
      <section className="section border-y border-[#D4C9B8] section-gradient">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-2xl sm:text-3xl md:text-4xl leading-tight tracking-[-0.015em] text-[#2C2722]">
            Clothing that feels like it already belongs to you.
          </p>
          <Link href="/story" className="mt-8 inline-block text-sm tracking-[0.15em] font-medium hover:text-[#B37A5F] transition-colors">THE STORY BEHIND IT →</Link>
        </div>
      </section>

      {/* Atelier Teaser — Now with real power */}
      <section className="section max-w-5xl mx-auto px-4 sm:px-8 text-center border-b border-[#D4C9B8]">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3">FOR FOUNDERS, MAKERS &amp; PARTNERS</div>
        <h3 className="font-display text-5xl sm:text-6xl tracking-[-0.03em] mb-4">The Atelier</h3>
        <p className="max-w-md mx-auto text-lg text-[#6F5A47] mb-8">
          Production tools built for the ones actually making things. Tech packs, BOMs, grading, and real cost tracking.
        </p>
        <Link href="/atelier" className="btn-primary text-base px-14 py-4">Enter the Atelier</Link>
      </section>

      {/* Final CTA — Stronger */}
      <section id="join" className="section max-w-xl mx-auto px-4 sm:px-8 text-center">
        <h3 className="font-display text-5xl sm:text-6xl tracking-[-0.03em] mb-6">Ready to move with us?</h3>
        <p className="text-[#6F5A47] text-lg mb-10 max-w-md mx-auto">
          Early access, wholesale, and production partnerships.
        </p>
        <Link href="/atelier" className="btn-primary text-lg px-16 py-4">Join the Movement</Link>
      </section>
    </>
  );
}
