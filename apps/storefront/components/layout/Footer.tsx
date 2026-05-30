"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2C2722] text-[#F8F4ED] pt-16 pb-8 relative overflow-hidden">
      {/* Decorative animated line at top */}
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B37A5F] to-transparent"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Newsletter Block */}
        <div className="grid md:grid-cols-2 gap-12 pb-12 border-b border-[#F8F4ED]/10 mb-10">
          <div>
            <div className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-none mb-4">
              KIN<span className="italic text-[#B37A5F]">FORM</span>
            </div>
            <p className="text-[#F8F4ED]/70 max-w-sm leading-relaxed">
              Contemporary clothing for women who value connection, craft, and quiet intention.
            </p>
          </div>

          <div>
            <div className="text-xs tracking-[0.25em] text-[#B37A5F] mb-3">JOIN THE LIST</div>
            <p className="text-[#F8F4ED]/80 mb-5 text-sm">
              Be the first to know about new pieces, drops, and behind-the-scenes.
            </p>
            <Link
              href="/request-sample"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#B37A5F] text-white rounded-full hover:bg-white hover:text-[#2C2722] transition-all text-sm font-semibold group"
            >
              Get Early Access
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 mb-10 text-sm">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[#B37A5F] mb-3">EXPLORE</div>
            <div className="space-y-2">
              <Link href="/designs" className="block text-[#F8F4ED]/80 hover:text-white">The Collection</Link>
              <Link href="/designs/halter" className="block text-[#F8F4ED]/80 hover:text-white">HALTER</Link>
              <Link href="/designs/fishnet" className="block text-[#F8F4ED]/80 hover:text-white">FISHNET</Link>
              <Link href="/designs/academic" className="block text-[#F8F4ED]/80 hover:text-white">ACADEMIC</Link>
              <Link href="/story" className="block text-[#F8F4ED]/80 hover:text-white">Our Story</Link>
            </div>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.25em] text-[#B37A5F] mb-3">PARTNERS</div>
            <div className="space-y-2">
              <Link href="/wholesale" className="block text-[#F8F4ED]/80 hover:text-white">Wholesale</Link>
              <Link href="/request-sample" className="block text-[#F8F4ED]/80 hover:text-white">Request a Sample</Link>
              <Link href="/atelier/login" className="block text-[#F8F4ED]/80 hover:text-white">Atelier Portal</Link>
              <Link href="/accessories" className="block text-[#F8F4ED]/80 hover:text-white">Accessories</Link>
            </div>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.25em] text-[#B37A5F] mb-3">CONNECT</div>
            <div className="space-y-2">
              <a
                href="mailto:hello@kinform.studio"
                className="flex items-center gap-2 text-[#F8F4ED]/80 hover:text-white"
              >
                <Mail size={14} /> hello@kinform.studio
              </a>
              <a
                href="https://instagram.com/kinform"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#F8F4ED]/80 hover:text-white"
              >
                <span className="inline-block w-3.5 h-3.5 rounded border border-current" /> @kinform
              </a>
            </div>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.25em] text-[#B37A5F] mb-3">LEGAL</div>
            <div className="space-y-2 text-[#F8F4ED]/60">
              <div>© {year} KINFORM</div>
              <div>All rights reserved.</div>
              <div className="text-xs">Designed with care.</div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-[#F8F4ED]/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#F8F4ED]/50">
          <div>Crafted with intention. Made for connection.</div>
          <div className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#5C6B4E] animate-pulse" />
            All systems live.
          </div>
        </div>
      </div>
    </footer>
  );
}
