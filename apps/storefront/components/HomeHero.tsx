"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HomeHero() {
  return (
    <section className="min-h-[92vh] flex items-center relative overflow-hidden border-b border-[#D4C9B8] gradient-animated">
      {/* Decorative radial glow behind hero text */}
      <div className="hero-glow absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Decorative floating orbs */}
      <div className="orb orb-clay animate-float w-64 h-64 top-20 -left-20 opacity-60" aria-hidden="true" />
      <div className="orb orb-paper animate-float-slow w-96 h-96 bottom-0 right-0 opacity-40" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-16 pb-20 text-center w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-block px-5 py-1.5 mb-8 text-xs tracking-[0.2em] border border-[#B37A5F]/40 rounded-full text-[#B37A5F] font-medium"
        >
          DEBUT COLLECTION 2026
        </motion.div>

        <h1 className="font-display text-[clamp(3.5rem,15vw,9rem)] leading-[0.88] tracking-[-0.055em] mb-6">
          KINFORM
        </h1>

        <p className="max-w-lg mx-auto text-xl sm:text-2xl md:text-3xl text-[#6F5A47] tracking-[-0.01em] mb-12">
          Three original designs.<br />For the ones who move differently.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="#collection" 
            className="btn-primary text-base px-8 sm:px-12 py-4 text-lg font-semibold"
          >
            Explore the Collection
          </Link>
          <Link 
            href="#join" 
            className="btn-secondary text-base px-8 sm:px-10 py-4 text-lg"
          >
            Request Early Access
          </Link>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] text-[#9A8671] flex items-center gap-4">
        SCROLL TO BEGIN
        <div className="w-px h-6 bg-[#D4C9B8]" />
      </div>
    </section>
  );
}
