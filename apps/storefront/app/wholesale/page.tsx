"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Store, Calendar, CreditCard } from "lucide-react";
import { InterestForm } from "@/components/forms/InterestForm";

const details = [
  {
    icon: Store,
    label: "MINIMUM FIRST ORDER",
    value: "12 units per style",
    note: "Flexible for launch partners",
  },
  {
    icon: Calendar,
    label: "LEAD TIME",
    value: "8–12 weeks",
    note: "From order confirmation",
  },
  {
    icon: CreditCard,
    label: "PAYMENT TERMS",
    value: "50/50 split",
    note: "Deposit + balance prior to shipment",
  },
];

export default function WholesalePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 pb-8">
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
            FOR RETAIL
          </div>
          <h1 className="font-display text-6xl md:text-7xl tracking-[-0.04em] leading-[0.95] mb-5">
            Carry<br />
            <span className="italic text-[#B37A5F]">KINFORM.</span>
          </h1>
          <p className="text-lg text-[#6F5A47] max-w-xl">
            Interested in carrying KINFORM in your store? Fill out the form below and we&apos;ll send line sheets, pricing, and order minimums.
          </p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-4 mb-12">
        {details.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
            className="bg-white border border-[#D4C9B8] rounded-2xl p-5"
          >
            <d.icon className="h-5 w-5 text-[#B37A5F] mb-3" />
            <div className="text-[10px] tracking-[0.2em] text-[#9A8671] mb-1">{d.label}</div>
            <div className="font-semibold mb-1">{d.value}</div>
            <div className="text-xs text-[#6F5A47]">{d.note}</div>
          </motion.div>
        ))}
      </div>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white border border-[#D4C9B8] rounded-3xl p-7 md:p-10 shadow-sm"
        >
          <InterestForm defaultType="Wholesale Inquiry" allowAttachments />
        </motion.div>
      </section>
    </div>
  );
}
