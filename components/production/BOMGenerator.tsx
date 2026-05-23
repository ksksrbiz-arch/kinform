"use client";

import { useState } from "react";
import { designs, getDesign } from "@/lib/designs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface BOMLine {
  item: string;
  description: string;
  qtyPerUnit: number;
  unit: string;
  supplier?: string;
  notes?: string;
}

export function BOMGenerator() {
  const [selectedSlug, setSelectedSlug] = useState("tether");
  const [quantity, setQuantity] = useState(50);
  const [fabric, setFabric] = useState("");

  const design = getDesign(selectedSlug)!;
  const currentFabric = fabric || design.suggestedFabrics[0];

  // Very realistic starter BOMs per design (easy to expand later)
  const getBOM = (slug: string, fabricName: string): BOMLine[] => {
    const base: BOMLine[] = [
      { item: "Main Fabric", description: fabricName, qtyPerUnit: 1.8, unit: "m", supplier: "TBD", notes: "With 10% shrinkage allowance" },
      { item: "Thread", description: "100% polyester 40/2", qtyPerUnit: 35, unit: "m", supplier: "Coats" },
      { item: "Labels", description: "Care + Brand woven label", qtyPerUnit: 2, unit: "pcs", supplier: "TBD" },
      { item: "Hangtag", description: "Kraft 300gsm + string", qtyPerUnit: 1, unit: "pcs", supplier: "TBD" },
    ];

    if (slug === "tether") {
      base.push(
        { item: "Buttons", description: "12L corozo or horn", qtyPerUnit: 5, unit: "pcs" },
        { item: "Interfacing", description: "Lightweight fusible", qtyPerUnit: 0.3, unit: "m" }
      );
    }

    if (slug === "clasp") {
      base.push(
        { item: "Invisible zipper", description: "20cm", qtyPerUnit: 1, unit: "pcs" },
        { item: "Elastic tape (optional)", description: "6mm", qtyPerUnit: 0.4, unit: "m" }
      );
    }

    if (slug === "aperture") {
      base.push(
        { item: "Buttons / Hooks", description: "Back closure", qtyPerUnit: 3, unit: "pcs" },
        { item: "Horsehair / Boning", description: "For cutout structure", qtyPerUnit: 0.6, unit: "m" }
      );
    }

    return base;
  };

  const bomLines = getBOM(selectedSlug, currentFabric);

  const totalCostEstimate = bomLines.reduce((sum, line) => {
    const unitCost = line.item.includes("Fabric") ? 12 : line.item.includes("Button") ? 0.8 : 1.2;
    return sum + line.qtyPerUnit * unitCost * quantity;
  }, 0);

  const downloadCSV = () => {
    const headers = ["Item", "Description", "Qty per Unit", "Unit", "Total Qty", "Supplier", "Notes"];
    const rows = bomLines.map((line) => [
      line.item,
      line.description,
      line.qtyPerUnit,
      line.unit,
      (line.qtyPerUnit * quantity).toFixed(1),
      line.supplier || "",
      line.notes || "",
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KINFORM-${design.name}-BOM-Qty${quantity}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 18;
    let y = 20;

    doc.setFontSize(16);
    doc.text("KINFORM — BILL OF MATERIALS", margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`${design.fullName}  |  Production Qty: ${quantity}`, margin, y);

    y += 10;
    autoTable(doc, {
      startY: y,
      head: [["Item", "Description", "Per Unit", "Total Qty", "Unit"]],
      body: bomLines.map((l) => [
        l.item,
        l.description,
        l.qtyPerUnit,
        (l.qtyPerUnit * quantity).toFixed(1),
        l.unit,
      ]),
      theme: "grid",
      styles: { fontSize: 9 },
    });

    y = (doc as any).lastAutoTable.finalY + 12;
    doc.text(`Estimated material cost (rough): $${totalCostEstimate.toFixed(0)}`, margin, y);

    doc.save(`KINFORM-${design.name}-BOM-${quantity}units.pdf`);
    toast.success("BOM PDF downloaded");
  };

  return (
    <div className="border border-[#D4C9B8] bg-white rounded-2xl p-8">
      <div className="flex gap-4 mb-6">
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="border border-[#D4C9B8] px-4 py-2 rounded-lg"
        >
          {designs.map((d) => (
            <option key={d.slug} value={d.slug}>{d.number} {d.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-[#9A8671]">Production Qty</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className="w-24 border border-[#D4C9B8] px-3 py-2 rounded-lg"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs text-[#9A8671] mb-1">PRIMARY FABRIC</div>
        <select
          value={fabric}
          onChange={(e) => setFabric(e.target.value)}
          className="w-full border border-[#D4C9B8] p-3 rounded-lg"
        >
          {design.suggestedFabrics.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="text-left border-b border-[#D4C9B8]">
              <th className="py-2">Item</th>
              <th>Description</th>
              <th className="text-right">Per Unit</th>
              <th className="text-right">Total for {quantity}</th>
            </tr>
          </thead>
          <tbody>
            {bomLines.map((line, idx) => (
              <tr key={idx} className="border-b border-[#D4C9B8]/60">
                <td className="py-2 font-medium">{line.item}</td>
                <td className="text-[#6F5A47]">{line.description}</td>
                <td className="text-right tabular-nums">{line.qtyPerUnit} {line.unit}</td>
                <td className="text-right tabular-nums font-medium">
                  {(line.qtyPerUnit * quantity).toFixed(1)} {line.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        <button onClick={downloadCSV} className="btn-secondary flex-1">
          Download CSV (Excel ready)
        </button>
        <button onClick={downloadPDF} className="btn-primary flex-1">
          Download BOM PDF
        </button>
      </div>

      <p className="text-xs text-center text-[#9A8671] mt-4">
        Rough material cost estimate: <span className="font-medium text-[#2C2722]">${totalCostEstimate.toFixed(0)}</span> (update unit costs in code)
      </p>
    </div>
  );
}
