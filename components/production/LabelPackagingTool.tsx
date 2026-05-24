"use client";

import { useState } from "react";
import { designs, getDesign } from "@/lib/designs";
import jsPDF from "jspdf";
import { toast } from "sonner";

export function LabelPackagingTool() {
  const [slug, setSlug] = useState("halter");
  const design = getDesign(slug)!;

  const [brandName, setBrandName] = useState("KINFORM");
  const [country, setCountry] = useState("Portugal");
  const [care, setCare] = useState("Machine wash cold, gentle. Dry flat. Do not bleach.");

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 25;

    doc.setFontSize(18);
    doc.text("LABEL & PACKAGING SPECIFICATION", margin, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`${design.fullName}`, margin, y);

    y += 12;
    doc.setFontSize(11);
    doc.text("PRIMARY LABEL (Woven / Printed)", margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.text([
      `Brand: ${brandName}`,
      "Style: " + design.fullName,
      "Size: [Size tag]",
      `Made in: ${country}`,
      "RN / CA Number: [Insert if required]",
      "Fiber Content: [To be filled per fabric]",
    ], margin, y);

    y += 35;
    doc.setFontSize(11);
    doc.text("CARE LABEL", margin, y);
    y += 7;
    doc.setFontSize(10);
    const careLines = doc.splitTextToSize(care, 170);
    doc.text(careLines, margin, y);

    y += 30;
    doc.setFontSize(11);
    doc.text("HANGTAG & PACKAGING", margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.text([
      "Hangtag: Kraft 300gsm, 2.5\" x 3.5\", string tie, one per unit",
      "Polybag: Recycled LDPE, size-appropriate, with vent holes",
      "Tissue: Acid-free, 1 sheet per garment",
      "Shipping carton: 10-15 units per carton (depending on style)",
    ], margin, y);

    doc.save(`KINFORM-${design.name}-Label-Packaging-Spec.pdf`);
    toast.success("Label spec PDF generated");
  };

  return (
    <div className="border border-[#D4C9B8] bg-white rounded-2xl p-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-[#9A8671]">Design</label>
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border p-2 rounded mt-1">
            {designs.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
          </select>

          <div className="mt-4">
            <label className="text-xs text-[#9A8671]">Brand Name on Label</label>
            <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full border p-2 rounded mt-1" />
          </div>

          <div className="mt-4">
            <label className="text-xs text-[#9A8671]">Country of Origin</label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border p-2 rounded mt-1" />
          </div>
        </div>

        <div>
          <label className="text-xs text-[#9A8671]">Care Instructions</label>
          <textarea
            value={care}
            onChange={(e) => setCare(e.target.value)}
            rows={5}
            className="w-full border p-3 rounded mt-1 text-sm"
          />
        </div>
      </div>

      <button onClick={downloadPDF} className="btn-primary w-full mt-6">
        Generate Label &amp; Packaging Specification PDF
      </button>
    </div>
  );
}
