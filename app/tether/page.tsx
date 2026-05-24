import { InterestForm } from "@/components/forms/InterestForm";

export const metadata = {
  title: "TETHER — First Small-Batch Drop | KINFORM",
  description: "Pre-order TETHER, the collared shirt with the signature vertical tie detail. First production run — made to order in limited quantities.",
};

export default function TetherLandingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3">FIRST PRODUCTION RUN</div>
        <h1 className="font-display text-5xl sm:text-7xl tracking-[-0.04em] mb-4">TETHER</h1>
        <p className="text-xl sm:text-2xl text-[#6F5A47]">The Signature Collared Shirt</p>
      </div>

      <div className="prose prose-lg max-w-none text-[#2C2722] mb-10">
        <p>
          TETHER is our modern take on the classic collared shirt — featuring a continuous vertical tie detail that runs down the center front and a subtle waist knot accent.
        </p>
        <p>
          It has a relaxed yet elevated fit, making it incredibly versatile. Wear it buttoned up for a polished look or open over a tank for something more casual. Made to order in sustainable fabrics.
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

        <InterestForm defaultType="Pre-Order / First Run" piece="TETHER" />
      </div>

      <div className="text-center text-sm text-[#6F5A47]">
        <p className="mb-1">Sustainable fabrics • Made to order • No waste</p>
        <p>Questions? Email <a href="mailto:hello@kinform.studio" className="underline">hello@kinform.studio</a></p>
      </div>
    </div>
  );
}
