"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductionPacketExporter } from "@/components/production/ProductionPacketExporter";
import { RecentActivity } from "@/components/production/RecentActivity";
import { ProductionNav } from "@/components/layout/ProductionNav";
import { getProductionStats } from "@/lib/actions";
import Link from "next/link";
import { 
  Package, 
  Scissors, 
  Ruler, 
  Tag, 
  DollarSign, 
  Users 
} from "lucide-react";

export default function AtelierPage() {
  const [stats, setStats] = useState({ totalInquiries: 0, newInquiries: 0, thisWeek: 0 });

  useEffect(() => {
    getProductionStats().then(setStats);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 pb-20">
      {/* Energetic Header for 16-30 crowd */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#B37A5F]/10 px-4 py-1 text-sm font-medium text-[#B37A5F] mb-4">
              INTERNAL STUDIO
            </div>
            <h1 className="font-display text-7xl md:text-8xl tracking-[-0.04em] leading-none">
              The Atelier
            </h1>
          </div>
          <ProductionNav />
        </div>
        <p className="max-w-md text-xl text-[#6F5A47]">
          Your creative production HQ. Everything you need to turn sketches into reality.
        </p>
      </div>

      {/* Stats - more dynamic with stagger */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
        }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {[
          { label: "Total Leads", value: stats.totalInquiries, color: "text-[#2C2722]" },
          { label: "New & Waiting", value: stats.newInquiries, color: "text-[#B37A5F]" },
          { label: "This Week", value: stats.thisWeek, color: "text-[#2C2722]" },
          { label: "Action Needed", value: stats.newInquiries, href: "/atelier/inquiries", cta: "Open →" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300 } }}
            className="group relative overflow-hidden rounded-3xl border border-[#D4C9B8] bg-white p-6 shadow-sm"
          >
            <div className="text-xs tracking-[0.1em] text-[#9A8671] mb-1.5">{stat.label}</div>
            <div className={`font-display text-6xl tracking-tighter ${stat.color}`}>
              {stat.value}
            </div>
            {stat.cta && (
              <Link href={stat.href!} className="mt-3 inline-flex items-center text-sm font-semibold text-[#B37A5F] group-hover:gap-1 transition-all">
                {stat.cta}
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#D4C9B8] rounded-xl p-5">
          <div className="text-xs text-[#9A8671]">TOTAL INQUIRIES</div>
          <div className="font-display text-4xl mt-1">{stats.totalInquiries}</div>
        </div>
        <div className="bg-white border border-[#D4C9B8] rounded-xl p-5">
          <div className="text-xs text-[#9A8671]">NEW / UNCONTACTED</div>
          <div className="font-display text-4xl mt-1 text-[#B37A5F]">{stats.newInquiries}</div>
        </div>
        <div className="bg-white border border-[#D4C9B8] rounded-xl p-5">
          <div className="text-xs text-[#9A8671]">THIS WEEK</div>
          <div className="font-display text-4xl mt-1">{stats.thisWeek}</div>
        </div>
        <Link
          href="/atelier/inquiries"
          className="bg-[#2C2722] text-white rounded-xl p-5 flex flex-col justify-center hover:bg-black transition-colors"
        >
          <div className="text-sm">MANAGE LEADS →</div>
          <div className="font-medium mt-1">Open Inquiries Dashboard</div>
        </Link>
      </div>

      {/* Modern Tool Grid - Youthful & Animated */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium tracking-tight">Production Tools</h2>
          <Link href="/atelier/inquiries" className="text-sm font-medium text-[#B37A5F] hover:underline flex items-center gap-1">
            All Leads <Users size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { href: "#techpack", icon: Package, title: "Tech Packs", desc: "Generate pro PDFs" },
            { href: "#bom", icon: Scissors, title: "Bill of Materials", desc: "Accurate costing" },
            { href: "#grading", icon: Ruler, title: "Size Grading", desc: "Auto-graded specs" },
            { href: "#labels", icon: Tag, title: "Labels & Pack", desc: "Branding assets" },
            { href: "/atelier/costs", icon: DollarSign, title: "Cost Database", desc: "Supplier pricing" },
            { href: "/atelier/inquiries", icon: Users, title: "Inquiries", desc: "Leads & tasks", highlight: true },
          ].map((tool, index) => (
            <motion.a
              key={index}
              href={tool.href}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group flex flex-col justify-between rounded-3xl border p-6 transition-all duration-200 hover:shadow-xl min-h-[160px] ${
                tool.highlight 
                  ? "border-[#B37A5F] bg-[#B37A5F] text-white" 
                  : "border-[#D4C9B8] bg-white hover:border-[#B37A5F]"
              }`}
            >
              <tool.icon className={`h-8 w-8 mb-8 ${tool.highlight ? "text-white" : "text-[#B37A5F] group-hover:scale-110 transition-transform"}`} />
              <div>
                <div className={`font-semibold text-lg tracking-tight ${tool.highlight ? "" : "group-hover:text-[#B37A5F]"}`}>
                  {tool.title}
                </div>
                <div className={`text-sm mt-0.5 ${tool.highlight ? "text-white/80" : "text-[#6F5A47]"}`}>
                  {tool.desc}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* One-Click Full Production Packet */}
      <div className="mb-12">
        <ProductionPacketExporter />
      </div>

      {/* Recent Activity */}
      <RecentActivity />

      <div className="mt-12 pt-8 border-t border-[#D4C9B8] text-center text-sm text-[#9A8671]">
        Full tools (Tech Packs, BOM, Size Grading, etc.) are available via the cards above. 
        Want dedicated tool pages? I can split them out in the next iteration.
      </div>
    </div>
  );
}
