import { InterestForm } from "@/components/forms/InterestForm";

export const metadata = {
  title: "APERTURE — First Small-Batch Drop | KINFORM",
  description: "Pre-order APERTURE, the bold long-sleeve statement piece with the signature triangular cutout. First production run — made to order.",
};

export default function ApertureLandingPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3">FIRST PRODUCTION RUN</div>
        <h1 className="font-display text-7xl tracking-[-0.04em] mb-4">APERTURE</h1>
        <p className="text-2xl text-[#6F5A47]">The Bold Statement Piece</p>
      </div>

      <div className="prose prose-lg max-w-none text-[#2C2722] mb-10">
        <p>
          APERTURE is our most architectural design — a long-sleeve high-neck top with a prominent triangular cutout at the chest and dramatic bell sleeves.
        </p>
        <p>
          The hem treatment allows it to function beautifully as a standalone piece or as part of a coordinated set. Cut in more structured fabrics for this first run, it makes a quiet but powerful statement.
        </p>
      </div>

      <div className="bg-white border border-[#D4C9B8] rounded-3xl p-8 md:p-10 mb-12">
        <div className="text-center mb-8">
          <div className="uppercase tracking-[0.15em] text-xs text-[#B37A5F] mb-2">LIMITED QUANTITIES</div>
          <h2 className="font-display text-4xl tracking-tight mb-3">Join the First Small-Batch Drop</h2>
          <p className="text-[#6F5A47]">
            We’re only making what’s ordered for our very first production run.<br />
            Ships in 6–8 weeks.
          </p>
        </div>

        <InterestForm defaultType="Pre-Order / First Run" piece="APERTURE" />
      </div>

      <div className="text-center text-sm text-[#6F5A47]">
        <p className="mb-1">Sustainable fabrics • Made to order • No waste</p>
        <p>Questions? Email <a href="mailto:hello@kinform.studio" className="underline">hello@kinform.studio</a></p>
      </div>
    </div>
  );
}
