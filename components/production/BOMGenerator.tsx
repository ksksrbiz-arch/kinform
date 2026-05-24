"use client";

import { useState, useEffect } from "react";
import { designs, getDesign } from "@/lib/designs";
import { MaterialCost } from "@/lib/costs";
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
  const [selectedSlug, setSelectedSlug] = useState("halter");
  const [quantity, setQuantity] = useState(50);
  const [fabric, setFabric] = useState("");
  const [materialCosts, setMaterialCosts] = useState<MaterialCost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const design = getDesign(selectedSlug)!;
  const currentFabric = fabric || design.suggestedFabrics[0];

  // Fetch real material costs from the database
  useEffect(() => {
    fetch("/api/costs/materials")
      .then(res => res.json())
      .then(setMaterialCosts)
      .catch(() => {}); // fail silently if no costs yet
  }, []);

  // Very realistic starter BOMs per design (easy to expand later)
  const getBOM = (slug: string, fabricName: string): BOMLine[] => {
    const base: BOMLine[] = [
      { item: "Main Fabric", description: fabricName, qtyPerUnit: 1.8, unit: "m", supplier: "TBD", notes: "With 10% shrinkage allowance" },
      { item: "Thread", description: "100% polyester 40/2", qtyPerUnit: 35, unit: "m", supplier: "Coats" },
      { item: "Labels", description: "Care + Brand woven label", qtyPerUnit: 2, unit: "pcs", supplier: "TBD" },
      { item: "Hangtag", description: "Kraft 300gsm + string", qtyPerUnit: 1, unit: "pcs", supplier: "TBD" },
    ];

    if (slug === "halter") {
      base.push(
        { item: "Underwire", description: "Premium plastic-coated steel underwires", qtyPerUnit: 2, unit: "pcs" },
        { item: "YKK Zipper", description: "#3 YKK Concealed Separating Zipper", qtyPerUnit: 1, unit: "pcs" },
        { item: "Hook-and-Eye", description: "Flat dual hook-and-eye closure", qtyPerUnit: 1, unit: "set" },
        { item: "Interfacing", description: "Medium-weight fusible", qtyPerUnit: 0.2, unit: "m" }
      );
    }

    if (slug === "fishnet") {
      base.push(
        { item: "Velvet Piping", description: "1/8\" Matte Velvet Corded Piping", qtyPerUnit: 0.6, unit: "m" },
        { item: "YKK Zipper", description: "#3 Invisible Non-Separating Zipper", qtyPerUnit: 1, unit: "pcs" },
        { item: "Boning Strips", description: "Soft flexible plastic boning strips", qtyPerUnit: 4, unit: "pcs" },
        { item: "Ribbed Hem Band Elastic", description: "High-density woven elastic with stripes", qtyPerUnit: 0.3, unit: "m" }
      );
    }

    if (slug === "academic") {
      base.push(
        { item: "Grommets", description: "4mm Matte Black Metallic Eyelets (4 pairs)", qtyPerUnit: 8, unit: "pcs" },
        { item: "Satin Ribbon Lacing", description: "1/4\" Flat Black Satin Ribbon Cord", qtyPerUnit: 1.2, unit: "m" },
        { item: "Shirt Buttons", description: "11mm Tonal White Matrix Shirt Buttons", qtyPerUnit: 6, unit: "pcs" },
        { item: "YKK Zipper (Skirt)", description: "#3 YKK Invisible Zipper with Hook-and-Eye", qtyPerUnit: 1, unit: "pcs" },
        { item: "Lanyard + Badge", description: "Detachable black woven lanyard with clear vinyl ID badge", qtyPerUnit: 1, unit: "pcs" },
        { item: "Elastic (Cuff)", description: "6mm elasticated cuff band", qtyPerUnit: 0.4, unit: "m" }
      );
    }

    return base;
  };

  const bomLines = getBOM(selectedSlug, currentFabric);

  // Helper: find real cost from database
  const findRealCost = (itemDescription: string) => {
    return materialCosts.find(c => 
      itemDescription.toLowerCase().includes(c.materialName.toLowerCase()) ||
      c.materialName.toLowerCase().includes(itemDescription.toLowerCase())
    );
  };

  // Calculate accurate cost using database when available, fallback to estimates
  const totalCostEstimate = bomLines.reduce((sum, line) => {
    const realCost = findRealCost(line.description);
    let unitCost: number;

    if (realCost) {
      unitCost = realCost.costPerUnit;
    } else {
      // Fallback rough estimates
      unitCost = line.item.includes("Fabric") ? 12 : 
                 line.item.includes("Button") ? 0.8 : 1.2;
    }
    return sum + line.qtyPerUnit * unitCost * quantity;
  }, 0);

  const downloadCSV = async () => {
    setIsGenerating(true);
    // Small delay for perceived loading
    await new Promise(resolve => setTimeout(resolve, 350));

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
    setIsGenerating(false);
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 450));

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
              <th className="text-right">Unit Cost</th>
            </tr>
          </thead>
          <tbody>
            {bomLines.map((line, idx) => {
              const realCost = findRealCost(line.description);
              const unitCost = realCost ? realCost.costPerUnit : (line.item.includes("Fabric") ? 12 : line.item.includes("Button") ? 0.8 : 1.2);
              const source = realCost ? "DB" : "estimate";

              return (
                <tr key={idx} className="border-b border-[#D4C9B8]/60">
                  <td className="py-2 font-medium">{line.item}</td>
                  <td className="text-[#6F5A47]">{line.description}</td>
                  <td className="text-right tabular-nums">{line.qtyPerUnit} {line.unit}</td>
                  <td className="text-right tabular-nums font-medium">
                    {(line.qtyPerUnit * quantity).toFixed(1)} {line.unit}
                  </td>
                  <td className="text-right text-xs">
                    {realCost ? (
                      <span className="text-green-600 font-medium">
                        {realCost.currency} {unitCost} <span className="text-[10px]">({source})</span>
                      </span>
                    ) : (
                      <span className="text-[#9A8671]">~${unitCost} (est.)</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={downloadCSV} 
          disabled={isGenerating}
          className="btn-secondary flex-1 disabled:opacity-70"
        >
          {isGenerating ? "Generating..." : "Download CSV (Excel ready)"}
        </button>
        <button 
          onClick={downloadPDF} 
          disabled={isGenerating}
          className="btn-primary flex-1 disabled:opacity-70"
        >
          {isGenerating ? "Generating..." : "Download BOM PDF"}
        </button>
      </div>

      <p className="text-xs text-center text-[#9A8671] mt-4">
        Estimated material cost: <span className="font-medium text-[#2C2722]">${totalCostEstimate.toFixed(0)}</span> 
        {materialCosts.length > 0 && " (using real costs from database where available)"}
      </p>
    </div>
  );
}
