"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface FlatSketchImageProps {
  slug: string;
  name: string;
  number: string;
  className?: string;
  // Optional real image path, e.g. "/images/halter/halter-flat.png" (falls back to elegant SVG if missing)
  src?: string;
}

export function FlatSketchImage({ 
  slug, 
  name, 
  number, 
  className = "", 
  src 
}: FlatSketchImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Try common image paths if src not provided
  const imageSrc = src || `/images/${slug}/flat.png`;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`relative aspect-[4/3.1] bg-[#F8F4ED] dark:bg-[#252320] rounded-3xl overflow-hidden border border-[#D4C9B8] dark:border-[#3A3630] shadow-sm ${className}`}>
      {/* Elegant paper-like background */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4C9B8_0.5px,transparent_0.5px)] bg-[length:4px_4px] opacity-30 dark:opacity-10" />

      {imageSrc && !imageError ? (
        // Real Image with blur-up + reveal
        <motion.div
          initial={{ opacity: 0.4, scale: 0.96, filter: "blur(6px)" }}
          animate={{ 
            opacity: imageLoaded ? 1 : 0.6, 
            scale: imageLoaded ? 1 : 0.97,
            filter: imageLoaded ? "blur(0px)" : "blur(6px)"
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src={imageSrc}
            alt={`${name} Technical Flat Sketch`}
            fill
            className="object-contain p-4"
            onLoad={handleImageLoad}
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </motion.div>
      ) : (
        // Fallback: Beautiful animated SVG flat (from previous work)
        <div className="relative w-full h-full flex items-center justify-center p-6">
          <svg 
            viewBox="0 0 400 300" 
            className="w-4/5 h-4/5 text-[#B37A5F]/70 dark:text-[#C48A6E]/70"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <motion.g
              initial={{ pathLength: 0, opacity: 0.3 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            >
              <path d="M180 70 Q200 55 220 70" />
              <path d="M160 80 L240 80 L255 200 L145 200 Z" />
              <path d="M200 85 L200 195" />
              <path d="M190 100 Q200 110 210 100" />
              <path d="M190 130 Q200 140 210 130" />
              <path d="M160 85 Q130 100 125 140" />
              <path d="M240 85 Q270 100 275 140" />
              <circle cx="200" cy="165" r="8" />
              <path d="M193 165 Q200 175 207 165" />
            </motion.g>
          </svg>
          
          <div className="absolute bottom-4 text-center">
            <div className="font-mono text-[10px] tracking-[0.3em] text-[#9A8671] dark:text-[#A38F76] mb-1">
              {number} — TECHNICAL FLAT
            </div>
            <div className="font-display text-3xl tracking-tight text-[#B37A5F] dark:text-[#C48A6E]">
              {name}
            </div>
          </div>
        </div>
      )}

      {/* Subtle label overlay */}
      <div className="absolute top-4 left-4 text-[10px] font-mono tracking-[0.2em] text-[#9A8671] dark:text-[#A38F76] bg-[#F8F4ED]/80 dark:bg-[#1A1816]/80 px-2 py-0.5 rounded">
        FLAT SKETCH
      </div>
    </div>
  );
}
