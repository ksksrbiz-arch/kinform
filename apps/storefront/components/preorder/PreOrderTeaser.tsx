import { getPreOrderStats } from "@/lib/actions";
import { SocialProof } from "./SocialProof";
import Link from "next/link";

/**
 * PreOrderTeaser — Server Component
 * Fetches live pre-order stats and renders beautiful social proof + CTAs.
 * Used on the homepage.
 */
export async function PreOrderTeaser() {
  const stats = await getPreOrderStats();

  return (
    <section className="section max-w-5xl mx-auto px-4 sm:px-8 text-center section-gradient">
      <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-2">LIMITED FIRST PRODUCTION RUN</div>
      <h2 className="font-display text-4xl sm:text-5xl tracking-[-0.03em] mb-3">The First Drop is Now Open for Pre-Order</h2>

      <div className="max-w-2xl mx-auto mb-8">
        <SocialProof
          totalPreOrders={stats.totalPreOrders}
          pieceCounts={stats.pieceCounts}
          spotsLeft={stats.spotsLeft}
          batchLimit={stats.batchLimit}
          isLoading={false}
        />
      </div>

      <p className="text-[#6F5A47] dark:text-[#C8B8A3] max-w-lg mx-auto mb-8 text-lg">
        We’re only producing what’s actually ordered. No waste. No guessing. 
        Choose your piece and secure your spot in the first small batch.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="#halter-preorder" className="btn-primary text-base px-8 py-3.5">Pre-Order HALTER</Link>
        <Link href="#fishnet-preorder" className="btn-primary text-base px-8 py-3.5">Pre-Order FISHNET</Link>
        <Link href="#academic-preorder" className="btn-primary text-base px-8 py-3.5">Pre-Order ACADEMIC</Link>
      </div>

      <p className="text-xs text-[#9A8671] dark:text-[#A38F76] mt-5 tracking-wider">
        Ships in 6–8 weeks • Limited quantities • Made to order
      </p>
    </section>
  );
}
