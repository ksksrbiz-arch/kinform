import { InterestForm } from "@/components/forms/InterestForm";

export const metadata = {
  title: "CLASP — First Small-Batch Drop | KINFORM",
  description: "Join the first production run of CLASP, our signature wrap top. Made to order in sustainable fabrics. Limited quantities.",
};

export default function ClaspLandingPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3">FIRST PRODUCTION RUN</div>
        <h1 className="font-display text-7xl tracking-[-0.04em] mb-4">CLASP</h1>
        <p className="text-2xl text-[#6F5A47]">The Signature Wrap Top</p>
      </div>

      <div className="prose prose-lg max-w-none text-[#2C2722] mb-10">
        <p>
          CLASP is our most loved silhouette — a sleeveless (or cap-sleeve) wrap top with a beautiful gathered waist knot and an asymmetrical hem that moves with you.
        </p>
        <p>
          Cut in soft, sustainable fabrics (Tencel or organic cotton), it drapes beautifully and feels like a second skin. Wear it with trousers, denim, or the matching bottom from the Aperture set.
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

        <InterestForm defaultType="Pre-Order / First Run" />
      </div>

      <div className="text-center text-sm text-[#6F5A47]">
        <p className="mb-1">Sustainable fabrics • Made to order • No waste</p>
        <p>Questions? Email <a href="mailto:hello@kinform.studio" className="underline">hello@kinform.studio</a></p>
      </div>
    </div>
  );
}
