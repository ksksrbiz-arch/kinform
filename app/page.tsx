import Link from "next/link";

export default function KinformHome() {
  return (
    <>
      {/* Hero — warm, editorial, premium (global Header sits above) */}
      <section className="min-h-[88vh] flex items-center relative overflow-hidden border-b border-[#D4C9B8]">
        <div className="max-w-5xl mx-auto px-8 pt-12 pb-16 text-center">
          <div className="inline-block px-4 py-1 mb-6 text-[10px] tracking-[0.18em] text-[#9A8671] border border-[#D4C9B8] rounded-full">
            DEBUT COLLECTION • 2026
          </div>

          <h1 className="font-display text-[92px] md:text-[118px] leading-[0.86] tracking-[-0.045em] mb-5">
            KINFORM
          </h1>
          <p className="max-w-md mx-auto text-2xl text-[#6F5A47] tracking-[-0.01em] mb-11">
            Contemporary forms.<br />Quiet connections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#collection" className="btn-primary text-base px-10 py-3.5">Explore the Three Designs</Link>
            <Link href="#join" className="btn-secondary text-base px-8">Join the Early List</Link>
          </div>

          <div className="mt-20 text-[10px] tracking-[0.2em] text-[#9A8671] flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#D4C9B8]" /> SCROLL TO DISCOVER <div className="h-px w-10 bg-[#D4C9B8]" />
          </div>
        </div>
      </section>

      {/* Collection teaser */}
      <section id="collection" className="section max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-3">
          <div>
            <div className="uppercase text-[10px] tracking-[0.18em] text-[#9A8671] mb-1">THE DEBUT COLLECTION</div>
            <h2 className="font-display text-6xl md:text-7xl tracking-[-0.03em]">Three Signatures</h2>
          </div>
          <Link href="/designs" className="btn-secondary self-start md:self-auto">View Full Lookbook →</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "TETHER", desc: "Short-sleeve collared shirt with integrated vertical tie detail and waist knot accent.", slug: "tether" },
            { name: "CLASP", desc: "Sleeveless wrap top with gathered waist knot and asymmetrical hem. Feminine and versatile.", slug: "clasp" },
            { name: "APERTURE", desc: "Bold long-sleeve statement with triangular cutout, dramatic sleeves, and convertible hem.", slug: "aperture" },
          ].map((d, i) => (
            <Link key={i} href={`/designs/${d.slug}`} className="elegant-card group block bg-white border p-8 aspect-[4/3.15] flex flex-col justify-end hover:border-[#B37A5F]">
              <div className="text-[10px] tracking-[0.2em] text-[#9A8671] mb-2">0{i + 1} / SIGNATURE PIECE</div>
              <h3 className="font-display text-6xl tracking-[-0.02em] mb-4 group-hover:text-[#B37A5F] transition-colors">{d.name}</h3>
              <p className="text-[#6F5A47] leading-snug max-w-[32ch] pr-4">{d.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand philosophy teaser */}
      <section className="section border-y border-[#D4C9B8] bg-white/50">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <p className="text-2xl leading-tight tracking-[-0.01em] text-[#6F5A47]">
            A new language of dressing — rooted in connection, crafted for the woman who values both ease and intention.
          </p>
          <Link href="/story" className="inline-block mt-6 text-sm tracking-widest hover:text-[#B37A5F]">READ THE FULL STORY →</Link>
        </div>
      </section>

      {/* Atelier teaser */}
      <section className="section max-w-4xl mx-auto px-8 text-center border-b border-[#D4C9B8]">
        <div className="uppercase tracking-[0.15em] text-xs text-[#9A8671] mb-3">FOR FOUNDERS, MAKERS &amp; PARTNERS</div>
        <h3 className="font-display text-5xl tracking-tight mb-4">The Atelier</h3>
        <p className="text-lg text-[#6F5A47] max-w-lg mx-auto mb-8">
          Generate professional technical packages for any of the three designs. Production-ready PDFs with measurements, construction notes, and fabric guidance.
        </p>
        <Link href="/atelier" className="btn-primary">Open Tech Pack Generator</Link>
      </section>

      {/* Final CTA */}
      <section id="join" className="section max-w-xl mx-auto px-8 text-center">
        <h3 className="font-display text-5xl tracking-[-0.02em] mb-5">Be the first to know.</h3>
        <p className="text-[#6F5A47] text-lg mb-9">Early access to the collection, wholesale information, and production collaboration opportunities.</p>
        <Link href="/atelier" className="btn-primary text-base px-12">Enter the Atelier</Link>
      </section>
    </>
  );
}
