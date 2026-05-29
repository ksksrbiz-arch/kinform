"use client";

import { motion } from "framer-motion";
import { TechPackGenerator } from "@/components/techpack/TechPackGenerator";
import { ProductionNav } from "@/components/layout/ProductionNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TechPackPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-8 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/atelier" 
          className="flex items-center gap-2 text-sm text-[#9A8671] hover:text-[#2C2722] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition" /> Back to Atelier
        </Link>
        <ProductionNav />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-6xl tracking-[-0.03em]">Tech Pack Generator</h1>
        <p className="mt-2 text-lg text-[#6F5A47]">
          Generate professional, production-ready technical packages for any of the three designs.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TechPackGenerator />
      </motion.div>
    </div>
  );
}
