"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center overflow-hidden border-b border-[#D4C9B8] gradient-animated"
    >
      {/* Decorative radial glow behind hero text */}
      <div className="hero-glow absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Animated decorative orbs (existing CSS) */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="orb orb-clay animate-float w-64 h-64 top-20 -left-20 opacity-60"
        aria-hidden="true"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="orb orb-paper animate-float-slow w-96 h-96 bottom-0 right-0 opacity-40"
        aria-hidden="true"
      />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-16 pb-20 text-center w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 text-[11px] tracking-[0.2em] text-[#B37A5F] border border-[#B37A5F]/30 rounded-full bg-white/50 backdrop-blur"
        >
          <Sparkles size={12} /> DEBUT COLLECTION • 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[clamp(3.5rem,15vw,9rem)] leading-[0.85] tracking-[-0.055em] mb-6"
        >
          KIN<span className="italic text-[#B37A5F]">FORM</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto text-xl sm:text-2xl md:text-3xl text-[#6F5A47] leading-tight mb-12"
        >
          Three original designs.<br />
          <span className="text-[#2C2722] font-medium">For the ones who move differently.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="#collection"
            className="btn-primary text-base px-8 sm:px-12 py-4 text-lg font-semibold group"
          >
            Explore the Collection
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#join"
            className="btn-secondary text-base px-8 sm:px-10 py-4 text-lg"
          >
            Request Early Access
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] text-[#9A8671] flex items-center gap-4"
      >
        <motion.div
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-6 bg-[#D4C9B8] origin-bottom"
        />
        SCROLL TO BEGIN
        <motion.div
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="w-px h-6 bg-[#D4C9B8] origin-top"
        />
      </motion.div>
    </section>
  );
}
