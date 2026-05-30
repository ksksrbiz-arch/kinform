"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scissors, MessageCircle, ArrowRight } from "lucide-react";

export function DualCTABlock() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="group relative bg-white border border-[#D4C9B8] rounded-3xl p-10 md:p-14 hover:border-[#B37A5F] transition-all overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#B37A5F]/10 rounded-full blur-3xl group-hover:bg-[#B37A5F]/20 transition-all" />
          <div className="relative">
            <Scissors className="h-10 w-10 text-[#B37A5F] mb-6" />
            <div className="text-xs tracking-[0.2em] text-[#9A8671] mb-2">FOR INDUSTRY</div>
            <h3 className="font-display text-5xl tracking-tight mb-4">The Atelier</h3>
            <p className="text-[#6F5A47] mb-8 leading-relaxed">
              Production-ready technical packages, automated grading, supplier-grade BOMs. Built for partners who care about precision.
            </p>
            <Link
              href="/atelier"
              className="inline-flex items-center gap-2 text-[#B37A5F] font-semibold text-sm tracking-wide group/link"
            >
              ENTER ATELIER
              <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="group relative bg-[#2C2722] text-white rounded-3xl p-10 md:p-14 hover:scale-[1.01] transition-all overflow-hidden"
        >
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#B37A5F]/30 rounded-full blur-3xl" />
          <div className="relative">
            <MessageCircle className="h-10 w-10 text-[#B37A5F] mb-6" />
            <div className="text-xs tracking-[0.2em] text-[#B37A5F] mb-2">FOR RETAIL</div>
            <h3 className="font-display text-5xl tracking-tight mb-4">Wholesale</h3>
            <p className="text-white/80 mb-8 leading-relaxed">
              Carry KINFORM in your boutique or showroom. Request our line sheets, pricing, and order minimums today.
            </p>
            <Link
              href="/wholesale"
              className="inline-flex items-center gap-2 text-white font-semibold text-sm tracking-wide group/link"
            >
              APPLY NOW
              <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
