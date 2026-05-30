"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StatementSection() {
  return (
    <section className="py-32 bg-[#2C2722] text-[#F8F4ED] overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto px-8 text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="font-display text-4xl md:text-6xl leading-tight tracking-[-0.02em]"
        >
          A new language of dressing — rooted in{" "}
          <span className="italic text-[#B37A5F]">connection</span>, crafted for the woman who values both{" "}
          <span className="italic text-[#B37A5F]">ease</span> and{" "}
          <span className="italic text-[#B37A5F]">intention</span>.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link
            href="/story"
            className="inline-flex items-center gap-2 mt-12 px-7 py-3 rounded-full border border-[#F8F4ED]/30 hover:bg-[#F8F4ED] hover:text-[#2C2722] transition-all text-sm tracking-wider group"
          >
            READ THE FULL STORY
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative animated lines */}
      <motion.div
        animate={{ x: [-100, 100], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-0 right-0 h-px bg-[#B37A5F]/40"
      />
      <motion.div
        animate={{ x: [100, -100], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-0 right-0 h-px bg-[#B37A5F]/40"
      />
    </section>
  );
}
