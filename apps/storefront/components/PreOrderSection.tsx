"use client";

import { motion } from "framer-motion";
import { InterestForm } from "@/components/forms/InterestForm";

interface PreOrderSectionProps {
  id: string;
  name: string;
  description: string;
  featured?: boolean;
}

export function PreOrderSection({ id, name, description, featured = false }: PreOrderSectionProps) {
  return (
    <section
      id={`${id}-preorder`}
      className={`section max-w-3xl mx-auto px-4 sm:px-8 text-center border-b border-[#D4C9B8] ${featured ? "bg-[#F8F4ED]" : ""}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        {featured && (
          <div className="uppercase tracking-[0.2em] text-xs text-[#B37A5F] mb-2">FIRST PRODUCTION RUN</div>
        )}
        <h2 className={`font-display tracking-[-0.03em] mb-4 ${featured ? "text-4xl sm:text-5xl md:text-6xl" : "text-3xl sm:text-4xl"}`}>
          {name} — First Small-Batch Drop
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-lg text-[#6F5A47] max-w-xl mx-auto mb-6 leading-relaxed"
        >
          {description}
        </motion.p>

        {featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-sm bg-white px-4 py-1 rounded-full border border-[#D4C9B8] mb-8"
          >
            Ships in 6–8 weeks • Only making what&apos;s ordered
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <InterestForm defaultType="Pre-Order / First Run" piece={name} />
        </motion.div>

        {featured && (
          <p className="text-xs text-[#9A8671] mt-4 tracking-wide">
            Limited quantities. First run opens soon.
          </p>
        )}
      </motion.div>
    </section>
  );
}
