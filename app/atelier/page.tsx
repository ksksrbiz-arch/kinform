import { TechPackGenerator } from "@/components/techpack/TechPackGenerator";

export const metadata = {
  title: "The Atelier | KINFORM",
  description: "Professional tech pack generator for the KINFORM debut collection. Production-ready PDFs for founders and manufacturers.",
};

export default function AtelierPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 pt-10 pb-20">
      <div className="max-w-2xl mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#9A8671]">PRODUCTION &amp; COLLABORATION</div>
        <h1 className="font-display text-7xl tracking-[-0.03em] mt-2">The Atelier</h1>
        <p className="mt-5 text-xl text-[#6F5A47]">
          Generate clean, professional technical packages for TETHER, CLASP, or APERTURE. 
          Customize fabrics, colorways, and notes — then download a print-ready PDF ready for your pattern maker or factory.
        </p>
      </div>

      <div id="generator">
        <TechPackGenerator />
      </div>

      {/* Future tools placeholder */}
      <div className="mt-20 pt-10 border-t border-[#D4C9B8]">
        <div className="uppercase text-xs tracking-widest text-[#9A8671] mb-3">COMING SOON</div>
        <h3 className="font-display text-4xl tracking-tight mb-4">Production Suite</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          {[
            "Graded spec sheets (XS–XXL)",
            "Bill of Materials (BOM) export",
            "Costing & supplier comparison tools",
            "Size chart generator with ease tables",
            "Label & packaging specifications",
            "Internal production dashboard",
          ].map((item, i) => (
            <div key={i} className="p-6 border border-[#D4C9B8] bg-white/50 rounded-lg">{item}</div>
          ))}
        </div>
        <p className="text-xs text-[#9A8671] mt-6">These tools will be available to approved production partners. Inquire via the form above.</p>
      </div>
    </div>
  );
}
