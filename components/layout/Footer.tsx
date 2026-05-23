"use client";

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#D4C9B8] py-12 text-sm text-[#6F5A47]">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-y-10">
        <div>
          <div className="font-display text-2xl tracking-[-0.03em] text-[#2C2722] mb-3">KINFORM</div>
          <p className="max-w-xs leading-snug">
            Contemporary clothing for women who value connection, craft, and quiet intention.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 text-sm">
          <div>
            <div className="font-medium text-[#2C2722] mb-3 tracking-widest text-xs">EXPLORE</div>
            <div className="space-y-2">
              <Link href="/designs" className="block hover:text-[#B37A5F]">The Collection</Link>
              <Link href="/story" className="block hover:text-[#B37A5F]">Our Story</Link>
              <Link href="/atelier" className="block hover:text-[#B37A5F]">The Atelier</Link>
            </div>
          </div>

          <div>
            <div className="font-medium text-[#2C2722] mb-3 tracking-widest text-xs">CONNECT</div>
            <div className="space-y-2">
              <a href="mailto:hello@kinform.studio" className="block hover:text-[#B37A5F]">hello@kinform.studio</a>
              <a href="https://instagram.com/kinform" target="_blank" className="block hover:text-[#B37A5F]">Instagram</a>
              <Link href="/atelier#generator" className="block hover:text-[#B37A5F]">Request Access</Link>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 text-xs leading-relaxed pt-2 md:pt-0">
            © {year} KINFORM. All rights reserved.<br />
            Designed in the spirit of lineage.<br />
            <span className="text-[#9A8671]">This is a digital foundation — e-commerce and production tools coming soon.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
