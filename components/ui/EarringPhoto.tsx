"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface EarringPhotoProps {
  primarySrc: string;
  secondarySrc?: string;
  alt: string;
  nickname: string;
  className?: string;
  /** Square by default for earrings; override for other uses */
  aspect?: string;
  /** Show subtle "2 angles" pill when secondary exists */
  showVariantBadge?: boolean;
  /** Enable click to toggle between primary/secondary (great for detail pages) */
  interactive?: boolean;
  /** Priority loading for above-the-fold heroes */
  priority?: boolean;
}

/**
 * EarringPhoto — Premium client-side product photo renderer
 * 
 * Features:
 * - Beautiful blur-up + scale reveal on load (matches FlatSketchImage aesthetic)
 * - Optional secondary image with smooth crossfade toggle (hover on cards, tap/click on detail)
 * - Elegant paper texture + border treatment consistent with the rest of the site
 * - Variant badge when .2 exists
 * - Graceful fallback if image missing (shows elegant placeholder with nickname)
 * - Fully responsive, dark mode friendly, accessible
 * 
 * Usage:
 *   <EarringPhoto primarySrc={e.photo} secondarySrc={e.photoSecondary} alt={e.name} nickname={e.nickname} />
 */
export function EarringPhoto({
  primarySrc,
  secondarySrc,
  alt,
  nickname,
  className = "",
  aspect = "aspect-square",
  showVariantBadge = true,
  interactive = false,
  priority = false,
}: EarringPhotoProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);

  const hasSecondary = !!secondarySrc;
  const currentSrc = showSecondary && secondarySrc ? secondarySrc : primarySrc;

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  const toggle = () => {
    if (interactive && hasSecondary) {
      setShowSecondary(!showSecondary);
    }
  };

  // Elegant fallback when photo not yet copied in
  if (error || !primarySrc) {
    return (
      <div
        className={`${aspect} bg-[#F8F4ED] dark:bg-[#252320] border border-[#D4C9B8] dark:border-[#3A3630] rounded-3xl overflow-hidden flex items-center justify-center relative ${className}`}
      >
        <div className="text-center px-6">
          <div className="text-[10px] tracking-[0.3em] text-[#9A8671] dark:text-[#A38F76] mb-1">
            PRODUCT PHOTO
          </div>
          <div className="font-display text-4xl tracking-[-0.02em] text-[#B37A5F] dark:text-[#C48A6E]">
            {nickname}
          </div>
          <div className="mt-3 text-[10px] text-[#9A8671] dark:text-[#A38F76]">
            Add photo to /public{primarySrc}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative ${aspect} bg-[#F8F4ED] dark:bg-[#252320] border border-[#D4C9B8] dark:border-[#3A3630] rounded-3xl overflow-hidden shadow-sm ${className}`}
      onClick={toggle}
      role={interactive && hasSecondary ? "button" : undefined}
      aria-label={interactive && hasSecondary ? `Toggle between views of ${nickname}` : undefined}
    >
      {/* Subtle paper grain */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4C9B8_0.4px,transparent_0.5px)] bg-[length:3px_3px] opacity-20 dark:opacity-10 pointer-events-none z-10" />

      {/* Primary / Secondary with smooth crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSrc}
          initial={{ opacity: 0.35, scale: 0.985, filter: "blur(8px)" }}
          animate={{
            opacity: loaded ? 1 : 0.6,
            scale: loaded ? 1 : 0.985,
            filter: loaded ? "blur(0px)" : "blur(8px)",
          }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src={currentSrc}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            onLoad={handleLoad}
            onError={handleError}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        </motion.div>
      </AnimatePresence>

      {/* Hover / interactive hint for secondary view */}
      {hasSecondary && showVariantBadge && (
        <div className="absolute top-3 right-3 z-20 text-[9px] font-mono tracking-[0.2em] bg-white/90 dark:bg-[#1A1816]/90 text-[#6F5A47] dark:text-[#C8B8A3] px-2 py-px rounded-full border border-[#D4C9B8] dark:border-[#3A3630] opacity-70 group-hover:opacity-100 transition-opacity">
          {showSecondary ? "ALT VIEW" : "2 ANGLES"}
        </div>
      )}

      {/* Tap indicator on interactive detail views (mobile friendly) */}
      {interactive && hasSecondary && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-widest text-[#9A8671] dark:text-[#A38F76] bg-white/80 dark:bg-[#1A1816]/80 px-3 py-0.5 rounded-full border border-[#D4C9B8] dark:border-[#3A3630] opacity-0 group-hover:opacity-100 transition-all text-center pointer-events-none">
          TAP TO SWITCH VIEW
        </div>
      )}

      {/* Subtle label for consistency */}
      <div className="absolute bottom-3 left-3 z-20 text-[10px] font-mono tracking-[0.2em] text-[#9A8671] dark:text-[#A38F76] bg-white/80 dark:bg-[#1A1816]/80 px-2 py-px rounded">
        {nickname.toUpperCase()}
      </div>
    </div>
  );
}
