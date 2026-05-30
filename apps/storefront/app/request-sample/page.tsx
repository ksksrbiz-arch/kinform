"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { InterestForm } from "@/components/forms/InterestForm";

export default function RequestSamplePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 pb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#9A8671] hover:text-[#2C2722] mb-8 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 text-[10px] tracking-[0.25em] text-[#B37A5F] border border-[#B37A5F]/30 rounded-full">
            <Sparkles size={11} /> SAMPLES
          </div>
          <h1 className="font-display text-6xl md:text-7xl tracking-[-0.04em] leading-[0.95] mb-5">
            Request a<br />
            <span className="italic text-[#B37A5F]">Sample.</span>
          </h1>
          <p className="text-lg text-[#6F5A47] max-w-lg mx-auto">
            We&apos;re happy to send physical samples of HALTER, FISHNET, and ACADEMIC to qualified stylists, editors, and retail partners.
          </p>
        </motion.div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-[#D4C9B8] rounded-3xl p-7 md:p-10 shadow-sm"
        >
          <InterestForm defaultType="Sample Request" allowAttachments />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center space-y-1 text-sm text-[#6F5A47]"
        >
          <p>Samples are limited and sent at our discretion.</p>
          <p>Typical response time: 3–7 business days.</p>
        </motion.div>
      </section>
    </div>
  );
}
