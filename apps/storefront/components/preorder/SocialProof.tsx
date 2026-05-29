"use client";

import React from "react";
import { motion } from "framer-motion";

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="tabular-nums"
    >
      {value}
    </motion.span>
  );
}

interface SocialProofProps {
  totalPreOrders: number;
  pieceCounts: Record<string, number>;
  spotsLeft: number;
  batchLimit: number;
  className?: string;
  compact?: boolean;
  isLoading?: boolean; // for client-side refetches / suspense fallbacks
}

/**
 * SocialProof — Maximum effort pre-order urgency + credibility component
 * 
 * Features:
 * - Animated count-up numbers (framer-motion)
 * - Per-piece breakdown when available
 * - Strong but elegant urgency language
 * - Works gracefully with 0 data (shows encouraging starter messaging)
 * - Fully responsive and dark-mode ready
 */
export function SocialProof({
  totalPreOrders,
  pieceCounts,
  spotsLeft,
  batchLimit,
  className = "",
  compact = false,
  isLoading = false,
}: SocialProofProps) {
  const hasData = totalPreOrders > 0;
  const progress = Math.min(Math.max((totalPreOrders / batchLimit) * 100, 0), 100);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`rounded-3xl border border-[#D4C9B8] dark:border-[#3A3630] bg-white/70 dark:bg-[#1F1C19]/70 p-6 sm:p-8 text-center ${className}`}>
        <div className="h-3 w-40 mx-auto bg-[#D4C9B8]/40 dark:bg-[#3A3630]/40 rounded mb-8 animate-pulse" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-10 gap-y-6">
          <div className="space-y-2">
            <div className="h-14 w-20 mx-auto bg-[#D4C9B8]/30 dark:bg-[#3A3630]/30 rounded animate-pulse" />
            <div className="h-3 w-32 mx-auto bg-[#D4C9B8]/30 dark:bg-[#3A3630]/30 rounded" />
          </div>
          <div className="space-y-2 sm:border-l sm:border-[#D4C9B8] dark:sm:border-[#3A3630] sm:pl-10">
            <div className="h-14 w-20 mx-auto bg-[#D4C9B8]/30 dark:bg-[#3A3630]/30 rounded animate-pulse" />
            <div className="h-3 w-36 mx-auto bg-[#D4C9B8]/30 dark:bg-[#3A3630]/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`text-xs text-[#6F5A47] dark:text-[#C8B8A3] ${className}`} aria-live="polite">
        {hasData ? (
          <>
            <span className="font-medium text-[#2C2722] dark:text-[#EDE8DF]"><AnimatedNumber value={totalPreOrders} /></span> have joined the first run.
            {" "}{spotsLeft > 0 && <span>Only <span className="font-medium">{spotsLeft}</span> spots left in this batch.</span>}
          </>
        ) : (
          "Be among the first to secure your place in the limited first production run."
        )}
      </div>
    );
  }

  // Beautiful zero state for launch
  if (!hasData) {
    return (
      <div className={`rounded-3xl border border-[#D4C9B8] dark:border-[#3A3630] bg-white/70 dark:bg-[#1F1C19]/70 p-6 sm:p-8 text-center ${className}`}>
        <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-4">THE FIRST DROP IS JUST BEGINNING</div>

        <div className="text-5xl sm:text-6xl font-display tracking-[-0.04em] tabular-nums text-[#2C2722] dark:text-[#EDE8DF] mb-2">
          <AnimatedNumber value={0} />
        </div>
        <div className="text-sm tracking-wider text-[#6F5A47] dark:text-[#C8B8A3] mb-6">HAVE JOINED SO FAR</div>

        <div className="max-w-sm mx-auto">
          <p className="text-[#6F5A47] dark:text-[#C8B8A3] text-sm leading-relaxed mb-4">
            This is the very start of the first small-batch production run.
            Every early order directly helps us make the collection.
          </p>
          <div className="text-xs text-[#9A8671] dark:text-[#A38F76]">
            Be one of the first {batchLimit} to secure your piece.
          </div>
        </div>

        {/* Subtle progress bar at 0 */}
        <div className="mt-8 h-1.5 w-full max-w-xs mx-auto bg-[#D4C9B8] dark:bg-[#3A3630] rounded-full overflow-hidden">
          <div className="h-full w-0 bg-[#B37A5F] transition-all" />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border border-[#D4C9B8] dark:border-[#3A3630] bg-white/70 dark:bg-[#1F1C19]/70 p-6 sm:p-8 text-center ${className}`}>
      <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-3" aria-label="Live pre-order status">
        REAL-TIME FIRST DROP STATUS
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-x-10 gap-y-6" aria-live="polite">
        {/* Total joined */}
        <div>
          <div className="text-5xl sm:text-6xl font-display tracking-[-0.04em] tabular-nums text-[#2C2722] dark:text-[#EDE8DF]">
            <AnimatedNumber value={totalPreOrders} />
          </div>
          <div className="mt-1 text-sm tracking-wider text-[#6F5A47] dark:text-[#C8B8A3]">
            HAVE JOINED THE FIRST RUN
          </div>
        </div>

        {/* Spots remaining */}
        <div className="sm:border-l sm:border-[#D4C9B8] dark:sm:border-[#3A3630] sm:pl-10">
          <div className="text-5xl sm:text-6xl font-display tracking-[-0.04em] tabular-nums text-[#B37A5F]">
            {spotsLeft}
          </div>
          <div className="mt-1 text-sm tracking-wider text-[#6F5A47] dark:text-[#C8B8A3]">
            SPOTS LEFT IN THIS BATCH OF {batchLimit}
          </div>
        </div>
      </div>

      {/* Progress bar toward batch limit */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="flex justify-between text-[10px] tracking-[0.2em] text-[#9A8671] dark:text-[#A38F76] mb-1.5 px-0.5">
          <span>FIRST BATCH FILLING</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-[#D4C9B8] dark:bg-[#3A3630] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#B37A5F] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Per-piece breakdown */}
      {Object.keys(pieceCounts).length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#D4C9B8] dark:border-[#3A3630]">
          <div className="text-xs tracking-[0.15em] text-[#9A8671] mb-3" aria-hidden="true">BY PIECE</div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm" aria-label="Pre-orders by design">
            {Object.entries(pieceCounts).map(([piece, count]) => (
              <li key={piece} className="font-medium">
                {piece} <span className="font-normal text-[#9A8671]">— {count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs text-[#9A8671] dark:text-[#A38F76] max-w-xs mx-auto">
        We’re only making what’s ordered. Every pre-order directly funds the first production run.
      </p>
    </div>
  );
}
