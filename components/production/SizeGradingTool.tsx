"use client";

import { useState, useMemo } from "react";
import { designs, getDesign } from "@/lib/designs";
import {
  SIZES,
  Size,
  calculateGradedSizes,
  getGradingRules,
  gradedSizesToCSV,
  GradeRule,
} from "@/lib/grading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export function SizeGradingTool() {
  const [selectedSlug, setSelectedSlug] = useState("tether");
  const design = getDesign(selectedSlug)!;

  const [rules, setRules] = useState(() => getGradingRules(selectedSlug)?.rules || []);

  // Recalculate when slug or rules change
  const gradedData = useMemo(() => {
    // Temporarily override rules for live editing
    const tempRules = { ...getGradingRules(selectedSlug)!, rules };
    // We monkey-patch for the calculation function (simple approach for MVP)
    (globalThis as any).__KINFORM_GRADING_OVERRIDE = tempRules;
    return calculateGradedSizes(selectedSlug);
  }, [selectedSlug, rules]);

  const handleRuleChange = (index: number, field: keyof GradeRule, value: number) => {
    const newRules = [...rules];
    (newRules[index] as any)[field] = value;
    setRules(newRules);
  };

  const resetRules = () => {
    setRules(getGradingRules(selectedSlug)?.rules || []);
    toast.info("Grading rules reset to defaults");
  };

  const exportCSV = () => {
    const csv = gradedSizesToCSV(selectedSlug, design.fullName);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KINFORM-${design.name}-Graded-Specs.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Graded spec CSV downloaded");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const margin = 16;
    let y = 18;

    doc.setFontSize(16);
    doc.text("KINFORM — GRADED MEASUREMENT CHART", margin, y);
    y += 7;
    doc.setFontSize(11);
    doc.text(`${design.fullName}  |  Base Size: M  |  Contemporary Relaxed Fit`, margin, y);

    y += 8;

    // Build table data
    const tableHead = ["Size", ...rules.map((r) => r.label)];
    const tableBody = SIZES.map((size) => {
      const row: (string | number)[] = [size];
      const sizeData = gradedData[size as keyof typeof gradedData];
      rules.forEach((rule) => {
        row.push(String(sizeData[rule.measurement]));
      });
      return row;
    });

    autoTable(doc, {
      startY: y,
      head: [tableHead],
      body: tableBody,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [240, 235, 225] },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text("All measurements in CM. Grade rules are editable above. For production use only.", margin, y);

    doc.save(`KINFORM-${design.name}-Graded-Specs.pdf`);
    toast.success("Graded spec PDF downloaded");
  };

  return (
    <div className="border border-[#D4C9B8] bg-white rounded-2xl p-8">
      {/* Header Controls */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-xs tracking-widest text-[#9A8671] mb-1">DESIGN</label>
          <select
            value={selectedSlug}
            onChange={(e) => {
              setSelectedSlug(e.target.value);
              // Reset rules when changing design
              setTimeout(() => setRules(getGradingRules(e.target.value)?.rules || []), 10);
            }}
            className="border border-[#D4C9B8] px-4 py-2 rounded-lg text-sm"
          >
            {designs.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.number} {d.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={resetRules} className="btn-secondary text-sm px-4 py-2">
          Reset Rules
        </button>

        <div className="flex-1" />

        <button onClick={exportCSV} className="btn-secondary text-sm">
          Export CSV
        </button>
        <button onClick={exportPDF} className="btn-primary text-sm">
          Export PDF
        </button>
      </div>

      {/* Live Editable Grade Rules */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-[#9A8671] mb-2">EDITABLE GRADE RULES (Base = M)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rules.map((rule, index) => (
            <div key={index} className="bg-[#F8F4ED] border border-[#D4C9B8] rounded-lg p-4 text-sm">
              <div className="font-medium mb-2">{rule.label}</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="text-[10px] text-[#9A8671]">Base (M)</div>
                  <input
                    type="number"
                    step="0.5"
                    value={rule.baseValue}
                    onChange={(e) => handleRuleChange(index, "baseValue", parseFloat(e.target.value))}
                    className="w-full border border-[#D4C9B8] px-2 py-1 rounded text-sm"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-[#9A8671]">+ Grade</div>
                  <input
                    type="number"
                    step="0.5"
                    value={rule.gradeUp}
                    onChange={(e) => handleRuleChange(index, "gradeUp", parseFloat(e.target.value))}
                    className="w-full border border-[#D4C9B8] px-2 py-1 rounded text-sm"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-[#9A8671]">- Grade</div>
                  <input
                    type="number"
                    step="0.5"
                    value={rule.gradeDown}
                    onChange={(e) => handleRuleChange(index, "gradeDown", parseFloat(e.target.value))}
                    className="w-full border border-[#D4C9B8] px-2 py-1 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#9A8671] mt-2">Changes update the chart below in real time. Export reflects current values.</p>
      </div>

      {/* Graded Size Chart */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F1E9DF]">
              <th className="px-4 py-3 text-left font-medium border border-[#D4C9B8]">Size</th>
              {rules.map((rule, i) => (
                <th key={i} className="px-3 py-3 text-center font-medium border border-[#D4C9B8] text-xs">
                  {rule.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((size) => (
              <tr key={size} className={size === "M" ? "bg-[#F8F4ED] font-medium" : ""}>
                <td className="px-4 py-2.5 border border-[#D4C9B8] font-semibold">{size}</td>
                {rules.map((rule, i) => (
                  <td key={i} className="px-3 py-2.5 text-center border border-[#D4C9B8] tabular-nums">
                    {gradedData[size]?.[rule.measurement] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-[#9A8671]">
        All values in centimeters. Base size M. These are starting recommendations — adjust per your fit model and fabric.
      </div>
    </div>
  );
}
