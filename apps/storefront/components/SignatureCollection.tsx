"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const signatures = [
  { name: "HALTER", desc: "Structured cropped bustier with crisscross halter neck and geometric face-taping across the bodice panels.", slug: "halter" },
  { name: "FISHNET", desc: "Sheer mesh yoke meets high-contrast sweetheart bodice with velvet chevron piping and sport-inspired hem band.", slug: "fishnet" },
  { name: "ACADEMIC", desc: "Three-piece anime-academic ensemble: ruffled blouse, front-lacing corset vest, and tiered tartan mini skirt.", slug: "academic" },
];

export function SignatureCollection() {
  return (
    <motion.div 
      className="grid md:grid-cols-3 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {signatures.map((d, i) => (
        <Link 
          key={i} 
          href={`/designs/${d.slug}`} 
          className="group block"
        >
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -12 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="elegant-card bg-white border border-[#D4C9B8] p-6 sm:p-9 rounded-3xl h-full flex flex-col justify-between hover:border-[#B37A5F] transition-all duration-300"
          >
            <div>
              <div className="uppercase text-[10px] tracking-[0.25em] text-[#B37A5F] mb-3">0{i+1} / SIGNATURE</div>
              <div className="inline-block mb-2 px-3 py-0.5 text-[10px] font-medium bg-[#B37A5F] text-white rounded-full tracking-wider">
                PRE-ORDER FIRST DROP
              </div>
              <h3 className="font-display text-5xl sm:text-7xl tracking-[-0.03em] mb-6 group-hover:text-[#B37A5F] transition-colors">{d.name}</h3>
            </div>
            <p className="text-[#6F5A47] text-[15px] leading-snug pr-4">{d.desc}</p>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
}
