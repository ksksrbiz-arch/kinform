"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { designs, type Design, type DesignSlug, getDesign } from "@/lib/designs";
import { toast } from "sonner";

interface Props {
  initialDesignSlug?: DesignSlug;
}

export function TechPackGenerator({ initialDesignSlug }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<DesignSlug>(initialDesignSlug || "halter");
  const [fabric, setFabric] = useState("");
  const [colorway, setColorway] = useState("");
  const [notes, setNotes] = useState("");
  const [includeGrading, setIncludeGrading] = useState(true);

  const design = getDesign(selectedSlug)!;
  const currentFabric = fabric || design.suggestedFabrics[0];
  const currentColor = colorway || design.colorways[0];

  const handleDownload = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    let y = 22;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("KINFORM", margin, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("TECHNICAL PACKAGE  •  CONFIDENTIAL", pageWidth - margin - 58, y);

    y += 4;
    doc.setDrawColor(180, 165, 145);
    doc.line(margin, y, pageWidth - margin, y);

    y += 10;
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`${design.number}  ${design.name}`, margin, y);

    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(design.fullName, margin, y);

    y += 8;
    doc.setFontSize(9);
    doc.text(`Prepared: ${new Date().toLocaleDateString()}  |  Version 1.0  |  Recipient: ________________`, margin, y);

    // Overview
    y += 12;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("OVERVIEW", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(design.longDesc, pageWidth - margin * 2 - 10);
    doc.text(splitDesc, margin, y);

    y += splitDesc.length * 4.8 + 6;

    // Materials
    doc.setFont("helvetica", "bold");
    doc.text("MATERIALS & COLORWAY", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`Primary Fabric: ${currentFabric}`, margin, y);
    y += 5;
    doc.text(`Selected Colorway: ${currentColor}`, margin, y);
    y += 5;
    doc.text("Trims: Self-fabric ties, reinforced bar tacks, signature side label, 12L buttons (where applicable)", margin, y);

    y += 10;

    // Measurements table
    doc.setFont("helvetica", "bold");
    doc.text("MEASUREMENT SPECIFICATION (CM)", margin, y);
    y += 4;

    const sizes = Object.keys(design.measurements);
    const firstSize = sizes[0];
    const headers = ["Size", ...Object.keys(design.measurements[firstSize])];

    const body = sizes.map((size) => [
      size,
      ...Object.values(design.measurements[size]).map(String),
    ]);

    autoTable(doc, {
      startY: y,
      head: [headers],
      body,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [240, 235, 225], textColor: 60, fontStyle: "bold" },
      margin: { left: margin, right: margin },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // Construction
    doc.setFont("helvetica", "bold");
    doc.text("CONSTRUCTION NOTES", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const notesText = design.constructionNotes.join("  •  ");
    const splitNotes = doc.splitTextToSize(notesText, pageWidth - margin * 2);
    doc.text(splitNotes, margin, y);
    y += splitNotes.length * 4.5 + 6;

    if (notes) {
      doc.setFont("helvetica", "bold");
      doc.text("ADDITIONAL NOTES FROM REQUESTER", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const splitCustom = doc.splitTextToSize(notes, pageWidth - margin * 2);
      doc.text(splitCustom, margin, y);
      y += splitCustom.length * 4.5 + 6;
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      "KINFORM  •  This document is confidential and intended for production use only.  •  contact@kinform.studio",
      margin,
      doc.internal.pageSize.getHeight() - 12
    );

    // Second page — full construction + care
    doc.addPage();
    y = 25;
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.setFont("helvetica", "bold");
    doc.text(`${design.fullName} — FULL SPECIFICATIONS`, margin, y);

    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DETAILED CONSTRUCTION & ASSEMBLY", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    design.constructionNotes.forEach((note, idx) => {
      const line = `${idx + 1}. ${note}`;
      const split = doc.splitTextToSize(line, pageWidth - margin * 2);
      doc.text(split, margin, y);
      y += split.length * 5 + 3;
    });

    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("CARE INSTRUCTIONS", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const splitCare = doc.splitTextToSize(design.careInstructions, pageWidth - margin * 2);
    doc.text(splitCare, margin, y);

    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("FLAT SKETCH / TECHNICAL DRAWING", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text("Insert professional flat sketch here (high-resolution PNG or vector).", margin, y);
    doc.setDrawColor(200, 190, 175);
    doc.rect(margin, y + 4, pageWidth - margin * 2, 85);

    // Save
    const filename = `KINFORM-${design.name}-TECHPACK-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);

    toast.success("Tech Pack downloaded", {
      description: filename,
    });
  };

  return (
    <div className="border border-[#D4C9B8] bg-white rounded-2xl p-8 md:p-10">
      {/* Design selector */}
      <div className="mb-8">
        <label className="block text-xs tracking-widest mb-3 text-[#9A8671]">SELECT DESIGN</label>
        <div className="flex flex-wrap gap-2">
          {designs.map((d) => (
            <button
              key={d.slug}
              onClick={() => {
                setSelectedSlug(d.slug);
                setFabric("");
                setColorway("");
              }}
              className={`px-5 py-2 text-sm rounded-full border transition-all ${
                selectedSlug === d.slug
                  ? "bg-[#B37A5F] text-white border-[#B37A5F]"
                  : "border-[#D4C9B8] hover:bg-[#F1E9DF]"
              }`}
            >
              {d.number} {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
        {/* Options */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs tracking-widest mb-2 text-[#9A8671]">PRIMARY FABRIC</label>
            <select
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className="w-full border border-[#D4C9B8] bg-white p-3 rounded-lg text-sm"
            >
              {design.suggestedFabrics.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
              <option value="Custom / TBD">Custom / TBD (note below)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs tracking-widest mb-2 text-[#9A8671]">COLORWAY</label>
            <select
              value={colorway}
              onChange={(e) => setColorway(e.target.value)}
              className="w-full border border-[#D4C9B8] bg-white p-3 rounded-lg text-sm"
            >
              {design.colorways.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Custom">Custom (note below)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs tracking-widest mb-2 text-[#9A8671]">ADDITIONAL NOTES FOR FACTORY</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special trims, alternate hem finish, label placement, etc."
              className="w-full min-h-[110px] border border-[#D4C9B8] bg-white p-3 rounded-lg text-sm resize-y"
            />
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeGrading}
              onChange={(e) => setIncludeGrading(e.target.checked)}
              className="accent-[#B37A5F]"
            />
            Include full size grading notes in PDF
          </label>
        </div>

        {/* Live Preview */}
        <div className="bg-[#F8F4ED] border border-[#D4C9B8] rounded-xl p-6 text-sm">
          <div className="uppercase tracking-[0.15em] text-xs text-[#9A8671] mb-3">PDF PREVIEW</div>
          <div className="font-display text-3xl tracking-tight mb-1">{design.fullName}</div>
          <div className="text-[#6F5A47] mb-4 text-xs">v1.0 • {new Date().toLocaleDateString()}</div>

          <div className="space-y-2 text-xs leading-relaxed text-[#2C2722]">
            <div><strong>Fabric:</strong> {currentFabric}</div>
            <div><strong>Color:</strong> {currentColor}</div>
            {notes && <div><strong>Notes:</strong> {notes.slice(0, 110)}{notes.length > 110 ? "..." : ""}</div>}
          </div>

          <div className="mt-5 pt-4 border-t border-[#D4C9B8] text-[10px] text-[#9A8671]">
            Includes: overview • materials • measurement table • construction notes • care • custom fields
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-8 w-full btn-primary text-base py-4 text-center justify-center"
      >
        DOWNLOAD TECH PACK (PDF) — {design.name}
      </button>

      <p className="text-center text-[10px] text-[#9A8671] mt-3 tracking-wider">
        Professional, print-ready A4 document ready for your production partner
      </p>
    </div>
  );
}
