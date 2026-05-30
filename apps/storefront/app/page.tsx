import Link from "next/link";
import { InterestForm } from "@/components/forms/InterestForm";
import { earrings } from "@/lib/earrings";
import { EarringPhoto } from "@/components/ui/EarringPhoto";
import { PreOrderTeaser } from "@/components/preorder/PreOrderTeaser";
import { HomeHero } from "@/components/HomeHero";
import { SignatureCollection } from "@/components/SignatureCollection";
import { MarqueeTape } from "@/components/MarqueeTape";
import { StatementSection } from "@/components/StatementSection";
import { DualCTABlock } from "@/components/DualCTABlock";

export default function KinformHome() {
  return (
    <>
      <HomeHero />

      {/* Marquee tape — adds bold movement between hero and collection */}
      <MarqueeTape />

      {/* Collection — Premium & Animated (client island for motion) */}
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

        <SignatureCollection />

        <div className="mt-8 text-center md:hidden">
          <Link href="/designs" className="btn-secondary">View Full Lookbook →</Link>
        </div>
      </section>

      {/* Multi-piece Pre-Order Teaser — LIVE social proof + dynamic urgency */}
      <PreOrderTeaser />

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

      {/* Philosophy — bold statement section, dark background */}
      <StatementSection />

      {/* Dual CTA — Atelier (for industry) + Wholesale (for retail) */}
      <DualCTABlock />

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
