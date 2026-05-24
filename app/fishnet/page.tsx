import { InterestForm } from "@/components/forms/InterestForm";

export const metadata = {
  title: "FISHNET — First Small-Batch Drop | KINFORM",
  description: "Pre-order FISHNET, the precision fishnet & chevron torso piece with sheer mesh yoke, velvet piping, and sport-inspired hem. First production run — made to order.",
};

export default function FishnetLandingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-12">
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3">FIRST PRODUCTION RUN</div>
        <h1 className="font-display text-5xl sm:text-7xl tracking-[-0.04em] mb-4">FISHNET</h1>
        <p className="text-xl sm:text-2xl text-[#6F5A47]">The Precision Fishnet & Chevron Torso Piece</p>
      </div>

      <div className="prose prose-lg max-w-none text-[#2C2722] mb-10">
        <p>
          FISHNET combines a sheer high-neck geometric power-mesh yoke with a structured, high-contrast sweetheart
          bodice — separated by plush matte velvet V-piping that defines the bold chevron architecture of the piece.
        </p>
        <p>
          Sculpted padded foam cups and vertical corset-style seams provide a supported, slimming silhouette, while
          the sport-inspired ribbed hem band with contrasting white stripes grounds the look with an edge.
          Made to order in premium nylon mesh and liquid satin or faux leather.
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

        <InterestForm defaultType="Pre-Order / First Run" piece="FISHNET" />
      </div>

      <div className="text-center text-sm text-[#6F5A47]">
        <p className="mb-1">Premium fabrics • Made to order • No waste</p>
        <p>Questions? Email <a href="mailto:hello@kinform.studio" className="underline">hello@kinform.studio</a></p>
      </div>
    </div>
  );
}
