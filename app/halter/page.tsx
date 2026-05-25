import { InterestForm } from "@/components/forms/InterestForm";
import { AccessoriesCrossSell } from "@/components/ui/AccessoriesCrossSell";
import { getPreOrderStats } from "@/lib/actions";
import { SocialProof } from "@/components/preorder/SocialProof";

export const metadata = {
  title: "HALTER — First Small-Batch Drop | KINFORM",
  description: "Pre-order HALTER, the refined crossed-halter bustier with crisscross straps and geometric face-taping. First production run — made to order in limited quantities.",
};

export default async function HalterLandingPage() {
  const stats = await getPreOrderStats();
  const halterCount = stats.pieceCounts["HALTER"] || 0;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-10">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3">FIRST PRODUCTION RUN</div>
        <h1 className="font-display text-5xl sm:text-7xl tracking-[-0.04em] mb-4">HALTER</h1>
        <p className="text-xl sm:text-2xl text-[#6F5A47]">The Refined Crossed-Halter Bustier</p>
      </div>

      {/* Live social proof for this specific piece */}
      <div className="mb-10">
        <SocialProof
          totalPreOrders={stats.totalPreOrders}
          pieceCounts={{ HALTER: halterCount }}
          spotsLeft={stats.spotsLeft}
          batchLimit={stats.batchLimit}
          compact={false}
          isLoading={false}
        />
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
          <div className="uppercase tracking-[0.15em] text-xs text-[#B37A5F] mb-2">LIMITED QUANTITIES — MADE TO ORDER</div>
          <h2 className="font-display text-4xl tracking-tight mb-3">Secure Your Spot in the First Drop</h2>
          <p className="text-[#6F5A47]">
            We&apos;re only making what&apos;s ordered for our very first production run.<br />
            Ships in 6–8 weeks.
          </p>
        </div>

        <InterestForm defaultType="Pre-Order / First Run" piece="HALTER" />
      </div>

      <AccessoriesCrossSell designName="HALTER" />

      <div className="mt-10 text-center text-sm text-[#6F5A47]">
        <p className="mb-1">Premium fabrics • Made to order • No waste</p>
        <p>Questions? Email <a href="mailto:hello@kinform.studio" className="underline">hello@kinform.studio</a></p>
      </div>
    </div>
  );
}
