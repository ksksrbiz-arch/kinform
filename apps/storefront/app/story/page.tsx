"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Link as LinkIcon } from "lucide-react";

const gestures = [
  {
    name: "HALTER",
    icon: LinkIcon,
    description:
      "The crisscross that holds and frames. Straps that originate from the sides and meet at the neck, creating geometry from structure.",
  },
  {
    name: "FISHNET",
    icon: Sparkles,
    description:
      "The boundary between sheer and opaque. A chevron seam and velvet piping that mark the line between exposure and coverage.",
  },
  {
    name: "ACADEMIC",
    icon: Heart,
    description:
      "The layered uniform reimagined. Three tiers, a lacing corset, and a ruffled blouse that reference lineage while declaring something entirely new.",
  },
];

const paragraphs = [
  "KINFORM was born from a simple observation between cousins: the clothes we reach for again and again are the ones that feel like an extension of our own rhythm — familiar in silhouette, quietly surprising in detail.",
  "The three debut pieces — HALTER, FISHNET, and ACADEMIC — each carry a signature gesture: crisscross straps that structure and frame the body, a chevron seam that defines architecture through contrast, and layered tiers that reference uniform and subculture in equal measure. These are not trends. They are statements with construction to match.",
  "We believe contemporary clothing can be bold without losing craft. That a bustier can be both structural and sensual. That a mesh yoke and velvet piping can share the same garment. That an academic uniform can be reimagined as something worth wearing beyond any campus.",
];

export default function StoryPage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 text-[10px] tracking-[0.25em] text-[#B37A5F] border border-[#B37A5F]/30 rounded-full">
            OUR STORY
          </div>
          <h1 className="font-display text-6xl md:text-8xl tracking-[-0.04em] leading-[0.9]">
            A Lineage<br />
            <span className="italic text-[#B37A5F]">in Form.</span>
          </h1>
        </motion.div>
      </section>

      {/* OPENING NARRATIVE */}
      <section className="max-w-2xl mx-auto px-6 py-12 space-y-6 text-[18px] leading-relaxed text-[#2C2722]">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            {p}
          </motion.p>
        ))}
      </section>

      {/* PULL QUOTE */}
      <section className="my-16 py-20 bg-[#2C2722] text-[#F8F4ED] overflow-hidden relative">
        <motion.div
          animate={{ x: [-100, 100], opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-0 right-0 h-px bg-[#B37A5F]/40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto px-8 text-center relative z-10"
        >
          <div className="font-display text-3xl md:text-5xl leading-tight tracking-[-0.02em]">
            &ldquo;The best clothing creates{" "}
            <span className="italic text-[#B37A5F]">quiet connections</span> — between people, between past and present, between the body and the world it moves through.&rdquo;
          </div>
        </motion.div>
      </section>

      {/* THREE GESTURES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="uppercase tracking-[0.25em] text-xs text-[#9A8671] mb-2">SIGNATURE GESTURES</div>
          <h2 className="font-display text-5xl md:text-6xl tracking-[-0.03em]">The Three Gestures</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {gestures.map((g, i) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-[#D4C9B8] rounded-3xl p-8 hover:border-[#B37A5F] transition-colors"
            >
              <g.icon className="h-9 w-9 text-[#B37A5F] mb-5" />
              <div className="text-[10px] tracking-[0.3em] text-[#9A8671] mb-2">
                / SIGNATURE / {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-display text-4xl tracking-tight mb-4">{g.name}</div>
              <p className="text-[#6F5A47] leading-relaxed text-sm">{g.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-[18px] leading-relaxed text-[#6F5A47] border-t border-[#D4C9B8]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          This is only the beginning. More pieces will follow the same language — always rooted in the belief that the best clothing makes us feel both more like ourselves and more connected to the world around us.
        </motion.p>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-[#F8F4ED] to-[#F1E9DF]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <h3 className="font-display text-5xl tracking-[-0.02em] mb-5">Step inside.</h3>
          <p className="text-[#6F5A47] mb-8">
            Explore the debut collection or join the early access list.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/designs" className="btn-primary group">
              See the Collection
              <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/request-sample" className="btn-secondary">
              Request Samples
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
