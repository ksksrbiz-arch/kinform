"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { InterestForm } from "@/components/forms/InterestForm";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/designs", label: "Collection" },
  { href: "/accessories", label: "Accessories" },
  { href: "/story", label: "Story" },
  { href: "/atelier/login", label: "Atelier" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/request-sample", label: "Samples" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showInterest, setShowInterest] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#F8F4ED]/90 backdrop-blur-xl border-b border-[#D4C9B8] shadow-sm"
            : "bg-[#F8F4ED]/60 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-3xl tracking-[-0.04em] font-semibold text-[#2C2722] flex items-center"
          >
            KIN<span className="italic text-[#B37A5F]">FORM</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[#2C2722] hover:text-[#B37A5F] transition-colors py-1 group"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#B37A5F] origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowInterest(true)}
              className="btn-secondary text-xs px-5 py-2.5"
            >
              Request Access
            </button>
            <Link href="/request-sample" className="btn-primary text-xs px-6 py-2.5 group">
              Join the List
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
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
                  <span className="font-display text-2xl tracking-tight">
                    KIN<span className="italic text-[#B37A5F]">FORM</span>
                  </span>
                  <button onClick={closeMobile} aria-label="Close menu">
                    <X size={22} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 text-lg tracking-tight mb-auto">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMobile}
                        className="block py-3 border-b border-[#D4C9B8]/60 font-medium hover:text-[#B37A5F] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
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
                  <Link
                    href="/request-sample"
                    className="btn-primary w-full justify-center group"
                    onClick={closeMobile}
                  >
                    <Sparkles size={14} /> Join the Early List
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

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
