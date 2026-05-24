import { InterestForm } from "@/components/forms/InterestForm";

export const metadata = {
  title: "ACADEMIC — First Small-Batch Drop | KINFORM",
  description: "Pre-order ACADEMIC, the tiered corset ensemble with ruffled puffed-sleeve blouse, front-lacing corset vest, and three-tiered tartan mini skirt. First production run — made to order.",
};

export default function AcademicLandingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3">FIRST PRODUCTION RUN</div>
        <h1 className="font-display text-5xl sm:text-7xl tracking-[-0.04em] mb-4">ACADEMIC</h1>
        <p className="text-xl sm:text-2xl text-[#6F5A47]">The Academic Tiered Corset Ensemble</p>
      </div>

      <div className="prose prose-lg max-w-none text-[#2C2722] mb-10">
        <p>
          ACADEMIC is our anime-inspired multi-layered academic uniform set — a complete three-piece ensemble
          consisting of a ruffled puffed-sleeve cotton poplin blouse, a structured front-lacing underbust corset vest,
          and a three-tiered pleated tartan mini skirt.
        </p>
        <p>
          The blouse features a pointed dress collar and dramatic puffed short sleeves with elasticated ruffled cuffs.
          The corset vest laces with flat satin ribbon through four pairs of matte black metallic grommets. The
          high-waisted skirt is composed of three knife-pleated tiers of bias-cut tartan plaid for maximum volume and flare.
          Comes with a detachable woven lanyard and matching necktie. Made to order.
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

        <InterestForm defaultType="Pre-Order / First Run" piece="ACADEMIC" />
      </div>

      <div className="text-center text-sm text-[#6F5A47]">
        <p className="mb-1">Premium fabrics • Made to order • No waste</p>
        <p>Questions? Email <a href="mailto:hello@kinform.studio" className="underline">hello@kinform.studio</a></p>
      </div>
    </div>
  );
}
