"use client";

import { useState } from "react";
import { designs, getDesign } from "@/lib/designs";
import { calculateGradedSizes, getGradingRules, gradedSizesToCSV, SIZES } from "@/lib/grading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { toast } from "sonner";

export function ProductionPacketExporter() {
  const [selectedSlug, setSelectedSlug] = useState("tether");
  const [isGenerating, setIsGenerating] = useState(false);

  const design = getDesign(selectedSlug)!;

  const generateAllPDFs = async () => {
    setIsGenerating(true);
    const zip = new JSZip();

    try {
      // 1. Tech Pack (simplified version)
      const techPack = new jsPDF();
      techPack.setFontSize(16);
      techPack.text(`KINFORM - ${design.fullName} Tech Pack`, 20, 20);
      techPack.setFontSize(11);
      techPack.text(design.longDesc, 20, 35);
      zip.file(`${design.name}-TechPack.pdf`, techPack.output("blob"));

      // 2. BOM (simplified)
      const bom = new jsPDF();
      bom.setFontSize(16);
      bom.text(`KINFORM - ${design.fullName} BOM`, 20, 20);
      bom.setFontSize(11);
      bom.text("Bill of Materials - See full generator for details", 20, 35);
      zip.file(`${design.name}-BOM.pdf`, bom.output("blob"));

      // 3. Graded Specs
      const graded = new jsPDF();
      const rules = getGradingRules(selectedSlug);
      graded.setFontSize(16);
      graded.text(`KINFORM - ${design.fullName} Graded Specs`, 20, 20);

      const gradedData = calculateGradedSizes(selectedSlug);
      const tableHead = ["Size", ...(rules?.rules.map(r => r.label) || [])];
      const tableBody = SIZES.map(size => [size, ...(rules?.rules.map(r => gradedData[size][r.measurement]) || [])]);

      autoTable(graded, {
        startY: 30,
        head: [tableHead],
        body: tableBody,
        theme: "grid",
        styles: { fontSize: 8 }
      });
      zip.file(`${design.name}-Graded-Specs.pdf`, graded.output("blob"));

      // 4. Label & Packaging
      const labels = new jsPDF();
      labels.setFontSize(16);
      labels.text(`KINFORM - ${design.fullName} Labels & Packaging`, 20, 20);
      labels.setFontSize(11);
      labels.text("Primary Label + Care Instructions - See full generator", 20, 35);
      zip.file(`${design.name}-Labels-Packaging.pdf`, labels.output("blob"));

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `KINFORM-${design.name}-Full-Production-Packet.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Full Production Packet ZIP downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate packet. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border border-[#D4C9B8] bg-white rounded-2xl p-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="uppercase text-xs tracking-widest text-[#9A8671]">ONE-CLICK EXPORT</div>
          <h3 className="font-display text-3xl tracking-tight">Full Production Packet</h3>
        </div>

        <select 
          value={selectedSlug} 
          onChange={e => setSelectedSlug(e.target.value)}
          className="border border-[#D4C9B8] px-4 py-2 rounded-lg"
        >
          {designs.map(d => (
            <option key={d.slug} value={d.slug}>{d.number} {d.name}</option>
          ))}
        </select>
      </div>

      <p className="text-[#6F5A47] mb-6">
        Generates a single ZIP file containing: Tech Pack + BOM + Graded Measurement Specs + Label &amp; Packaging for the selected design.
      </p>

      <button 
        onClick={generateAllPDFs} 
        disabled={isGenerating}
        className="btn-primary w-full py-4 text-base disabled:opacity-70"
      >
        {isGenerating ? "Generating Full Packet..." : `Download ${design.name} Production Packet (ZIP)`}
      </button>

      <p className="text-center text-xs text-[#9A8671] mt-3">
        Perfect for sending to factories or pattern makers.
      </p>
    </div>
  );
}
