"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { InterestForm } from "@/components/forms/InterestForm";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/designs", label: "Collection" },
  { href: "/clasp", label: "CLASP" },
  { href: "/story", label: "Story" },
  { href: "/atelier", label: "Atelier" },
  { href: "/request-sample", label: "Samples" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showInterest, setShowInterest] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F8F4ED]/95 backdrop-blur-lg border-b border-[#D4C9B8]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-display text-3xl tracking-[-0.04em] font-semibold text-[#2C2722]">
            KINFORM
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-sm tracking-[0.02em] font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#2C2722] hover:text-[#B37A5F] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowInterest(true)}
              className="btn-secondary text-sm px-6 py-2.5"
            >
              Request Access
            </button>
            <Link href="/designs" className="btn-primary text-sm">
              Explore Collection
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#2C2722] p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[60] bg-black/30"
              onClick={closeMobile}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute right-0 top-0 h-full w-4/5 max-w-[320px] bg-[#F8F4ED] border-l border-[#D4C9B8] p-8 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-10">
                  <span className="font-display text-2xl tracking-tight">KINFORM</span>
                  <button onClick={closeMobile} aria-label="Close menu">
                    <X size={22} />
                  </button>
                </div>

                <nav className="flex flex-col gap-6 text-lg font-medium tracking-tight mb-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobile}
                      className="py-1 border-b border-[#D4C9B8]/60"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/designs" onClick={closeMobile} className="py-1 border-b border-[#D4C9B8]/60">
                    Collection
                  </Link>
                </nav>

                <div className="space-y-3 pt-6 border-t border-[#D4C9B8]">
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                  <button
                    onClick={() => {
                      closeMobile();
                      setShowInterest(true);
                    }}
                    className="btn-secondary w-full justify-center"
                  >
                    Request Access
                  </button>
                  <Link href="/designs" className="btn-primary w-full justify-center" onClick={closeMobile}>
                    Explore the Collection
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Interest / Early Access Modal (shared) */}
      <Modal
        isOpen={showInterest}
        onClose={() => setShowInterest(false)}
        title="Join the KINFORM Community"
        size="md"
      >
        <p className="text-[#6F5A47] mb-8 text-[15px] leading-relaxed">
          Be among the first to receive the lookbook, early access to the collection, and updates on wholesale and production opportunities.
        </p>
        <InterestForm onSuccess={() => {
          // Modal will close via parent or form can signal
          setTimeout(() => setShowInterest(false), 1800);
        }} />
      </Modal>
    </>
  );
}
