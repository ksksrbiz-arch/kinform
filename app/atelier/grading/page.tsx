"use client";

import { SizeGradingTool } from "@/components/production/SizeGradingTool";
import { ProductionNav } from "@/components/layout/ProductionNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GradingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/atelier" 
          className="flex items-center gap-2 text-sm text-[#9A8671] hover:text-[#2C2722]"
        >
          <ArrowLeft size={16} /> Back to Atelier
        </Link>
        <ProductionNav />
      </div>

      <div className="mb-8">
        <h1 className="font-display text-6xl tracking-[-0.03em]">Size Grading Engine</h1>
        <p className="mt-2 text-lg text-[#6F5A47]">
          Live editable grading rules with automatic calculation across all sizes. Export professional spec sheets.
        </p>
      </div>

      <SizeGradingTool />
    </div>
  );
}
