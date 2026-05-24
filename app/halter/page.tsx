import { InterestForm } from "@/components/forms/InterestForm";
import { AccessoriesCrossSell } from "@/components/ui/AccessoriesCrossSell";

export const metadata = {
  title: "HALTER — First Small-Batch Drop | KINFORM",
  description: "Pre-order HALTER, the refined crossed-halter bustier with crisscross straps and geometric face-taping. First production run — made to order in limited quantities.",
};

export default function HalterLandingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3">FIRST PRODUCTION RUN</div>
        <h1 className="font-display text-5xl sm:text-7xl tracking-[-0.04em] mb-4">HALTER</h1>
        <p className="text-xl sm:text-2xl text-[#6F5A47]">The Refined Crossed-Halter Bustier</p>
      </div>

      <div className="prose prose-lg max-w-none text-[#2C2722] mb-10">
        <p>
          HALTER is our debut sculptural bustier — a structured, contemporary cropped top featuring an integrated
          crisscross halter neck and graphic geometric face-taping across the bodice panels.
        </p>
        <p>
          Wide, flat-laying self-fabric straps cross neatly over the chest and collarbone and secure at the back
          of the neck. The classic sweetheart neckline and demi-molded underwire cups make this a piece designed
          to be worn, shaped, and noticed. Made to order in premium Cotton Crepe or Scuba Knit.
        </p>
      </div>

      <div className="bg-white border border-[#D4C9B8] rounded-3xl p-8 md:p-10 mb-12">
        <div className="text-center mb-8">
          <div className="uppercase tracking-[0.15em] text-xs text-[#B37A5F] mb-2">LIMITED QUANTITIES</div>
          <h2 className="font-display text-4xl tracking-tight mb-3">Join the First Small-Batch Drop</h2>
          <p className="text-[#6F5A47]">
            We&apos;re only making what&apos;s ordered for our very first production run.<br />
            Ships in 6–8 weeks.
          </p>
        </div>

        <InterestForm defaultType="Pre-Order / First Run" piece="HALTER" />
      </div>

      <AccessoriesCrossSell 
        designName="HALTER"
        recommendations={[
          { name: "Architectural Hoops", desc: "Minimal gold-tone hoops" },
          { name: "Sunburst Studs", desc: "Small statement studs" },
          { name: "Chain Drops", desc: "Delicate long drops" },
        ]}
      />

      <div className="mt-10 text-center text-sm text-[#6F5A47]">
        <p className="mb-1">Premium fabrics • Made to order • No waste</p>
        <p>Questions? Email <a href="mailto:hello@kinform.studio" className="underline">hello@kinform.studio</a></p>
      </div>
    </div>
  );
}
