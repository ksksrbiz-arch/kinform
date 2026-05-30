"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MarqueeTapeProps {
  items?: string[];
  variant?: "dark" | "light";
}

export function MarqueeTape({
  items = ["CONTEMPORARY FORMS", "QUIET CONNECTIONS", "MADE TO LAST", "DESIGNED FOR EVERY DAY"],
  variant = "dark",
}: MarqueeTapeProps) {
  const bg = variant === "dark" ? "bg-[#2C2722] text-[#F8F4ED]" : "bg-[#F1E9DF] text-[#2C2722]";
  return (
    <section className={`${bg} py-5 overflow-hidden border-y border-[#D4C9B8]`}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap text-3xl md:text-4xl font-display tracking-tight"
      >
        {[...Array(6)].map((_, dup) => (
          <span key={dup} className="flex items-center">
            {items.map((it, i) => (
              <span key={i} className="mx-8 flex items-center gap-8">
                {it}
                <Sparkles size={20} className="text-[#B37A5F]" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
