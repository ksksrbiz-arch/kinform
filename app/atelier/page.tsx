import { TechPackGenerator } from "@/components/techpack/TechPackGenerator";
import { BOMGenerator } from "@/components/production/BOMGenerator";
import Link from "next/link";

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

      {/* BOM Module — now live */}
      <div className="mt-16 pt-10 border-t border-[#D4C9B8]">
        <div className="mb-6">
          <div className="uppercase tracking-[0.15em] text-xs text-[#9A8671]">PRODUCTION AUTOMATION</div>
          <h2 className="font-display text-4xl tracking-tight mt-1">Bill of Materials Generator</h2>
        </div>
        <BOMGenerator />
      </div>

      {/* Internal Tools Links */}
      <div className="mt-12 pt-8 border-t border-[#D4C9B8] grid md:grid-cols-2 gap-6">
        <Link
          href="/atelier/inquiries"
          className="block p-8 border border-[#D4C9B8] rounded-2xl hover:border-[#B37A5F] group"
        >
          <div className="text-[#9A8671] text-xs tracking-widest mb-2">INTERNAL</div>
          <div className="font-display text-3xl group-hover:text-[#B37A5F]">Inquiries Dashboard →</div>
          <p className="mt-3 text-[#6F5A47]">View, manage, and export all form submissions. Update status and add follow-up notes.</p>
        </Link>

        <div className="p-8 border border-[#D4C9B8] rounded-2xl bg-white/40">
          <div className="text-[#9A8671] text-xs tracking-widest mb-2">NEXT UP</div>
          <div className="font-display text-3xl">Size Grading Engine</div>
          <p className="mt-3 text-[#6F5A47]">
            Automatic graded measurement tables and ease calculations. Coming in the next automation sprint.
          </p>
        </div>
      </div>
    </div>
  );
}
