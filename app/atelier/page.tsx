import { TechPackGenerator } from "@/components/techpack/TechPackGenerator";
import { BOMGenerator } from "@/components/production/BOMGenerator";
import { SizeGradingTool } from "@/components/production/SizeGradingTool";
import { LabelPackagingTool } from "@/components/production/LabelPackagingTool";
import { ProductionPacketExporter } from "@/components/production/ProductionPacketExporter";
import { ProductionNav } from "@/components/layout/ProductionNav";
import { getProductionStats } from "@/lib/actions";
import Link from "next/link";

export const metadata = {
  title: "The Atelier | KINFORM",
  description: "Professional tech pack generator for the KINFORM debut collection. Production-ready PDFs for founders and manufacturers.",
};

export default async function AtelierPage() {
  const stats = await getProductionStats();
  return (
    <div className="max-w-6xl mx-auto px-8 pt-10 pb-20">
      <div className="max-w-2xl mb-8">
        <div className="uppercase tracking-[0.2em] text-xs text-[#9A8671]">PRODUCTION &amp; COLLABORATION</div>
        <h1 className="font-display text-7xl tracking-[-0.03em] mt-2">The Atelier</h1>
        <p className="mt-4 text-xl text-[#6F5A47]">
          Internal production tools for KINFORM. All modules are designed to be used by the founder and approved partners.
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#D4C9B8] rounded-xl p-5">
          <div className="text-xs text-[#9A8671]">TOTAL INQUIRIES</div>
          <div className="font-display text-4xl mt-1">{stats.totalInquiries}</div>
        </div>
        <div className="bg-white border border-[#D4C9B8] rounded-xl p-5">
          <div className="text-xs text-[#9A8671]">NEW / UNCONTACTED</div>
          <div className="font-display text-4xl mt-1 text-[#B37A5F]">{stats.newInquiries}</div>
        </div>
        <div className="bg-white border border-[#D4C9B8] rounded-xl p-5">
          <div className="text-xs text-[#9A8671]">THIS WEEK</div>
          <div className="font-display text-4xl mt-1">{stats.thisWeek}</div>
        </div>
        <Link
          href="/atelier/inquiries"
          className="bg-[#2C2722] text-white rounded-xl p-5 flex flex-col justify-center hover:bg-black transition-colors"
        >
          <div className="text-sm">MANAGE LEADS →</div>
          <div className="font-medium mt-1">Open Inquiries Dashboard</div>
        </Link>
      </div>

      {/* Quick navigation + production status */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="#techpack" className="btn-secondary px-5 py-1.5 text-sm">Tech Packs</a>
          <a href="#bom" className="btn-secondary px-5 py-1.5 text-sm">Bill of Materials</a>
          <a href="#grading" className="btn-secondary px-5 py-1.5 text-sm">Size Grading</a>
          <a href="#labels" className="btn-secondary px-5 py-1.5 text-sm">Labels &amp; Packaging</a>
          <Link href="/atelier/costs" className="btn-secondary px-5 py-1.5 text-sm">Cost Database</Link>
        </div>
        <ProductionNav />
      </div>

      {/* One-Click Full Production Packet */}
      <div className="mb-8">
        <ProductionPacketExporter />
      </div>

      <div id="techpack">
        <TechPackGenerator />
      </div>

      {/* BOM Module — now live */}
      <div id="bom" className="mt-16 pt-10 border-t border-[#D4C9B8]">
        <div className="mb-6">
          <div className="uppercase tracking-[0.15em] text-xs text-[#9A8671]">PRODUCTION AUTOMATION</div>
          <h2 className="font-display text-4xl tracking-tight mt-1">Bill of Materials Generator</h2>
        </div>
        <BOMGenerator />
      </div>

      {/* Size Grading Engine — now live */}
      <div id="grading" className="mt-16 pt-10 border-t border-[#D4C9B8]">
        <div className="mb-6">
          <div className="uppercase tracking-[0.15em] text-xs text-[#9A8671]">PRODUCTION AUTOMATION</div>
          <h2 className="font-display text-4xl tracking-tight mt-1">Size Grading &amp; Spec Generator</h2>
          <p className="text-[#6F5A47] mt-2 max-w-2xl">
            Live editable grading rules with automatic calculation across XXS–XXL. Export professional graded measurement charts.
          </p>
        </div>
        <SizeGradingTool />
      </div>

      {/* Label & Packaging Spec */}
      <div id="labels" className="mt-16 pt-10 border-t border-[#D4C9B8]">
        <div className="mb-6">
          <div className="uppercase tracking-[0.15em] text-xs text-[#9A8671]">PRODUCTION AUTOMATION</div>
          <h2 className="font-display text-4xl tracking-tight mt-1">Label &amp; Packaging Specification</h2>
        </div>
        <LabelPackagingTool />
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
