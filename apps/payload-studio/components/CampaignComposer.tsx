"use client";

import { useState } from "react";
import { approve, simulate, type SimulationReport } from "@/lib/personaClient";
import type { VFile } from "@/lib/vfs";

interface Props {
  onCampaignReady: (file: VFile) => void;
}

export default function CampaignComposer({ onCampaignReady }: Props) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("halter-drop-1");
  const [title, setTitle] = useState("HALTER Drop 1");
  const [audience, setAudience] = useState("founding members");
  const [category, setCategory] = useState("hoodie");
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [approver, setApprover] = useState("");

  async function runSimulate() {
    setErr(null);
    setBusy(true);
    try {
      const r = await simulate({
        slug, title, audience, product_category: category,
      });
      setReport(r);
      writeFile(r, false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function runApprove() {
    if (!report?.campaign_id) return;
    if (!approver.trim()) {
      setErr("Approver name required.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      // Two-step: simulation → approved → production.
      await approve(report.campaign_id, approver, "approve");
      await approve(report.campaign_id, approver, "approve");
      writeFile(report, true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function writeFile(r: SimulationReport, approved: boolean) {
    const path = `/campaigns/${r.draft.slug}.json`;
    onCampaignReady({
      path,
      kind: "campaign",
      content: JSON.stringify(
        {
          draft: r.draft,
          governance: r.governance,
          analytics: r.analytics,
          campaignId: r.campaign_id ?? null,
        },
        null,
        2,
      ),
      approved,
      campaignId: r.campaign_id ?? undefined,
      updatedAt: new Date().toISOString(),
    });
  }

  if (!open) {
    return (
      <div className="px-4 py-2 border-b border-white/10 flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="text-xs uppercase tracking-widest text-kinform-torque hover:opacity-80"
        >
          + New campaign via PersonaGenAI
        </button>
      </div>
    );
  }

  return (
    <div className="border-b border-white/10 p-4 space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug"
          className="bg-black/40 border border-white/10 rounded px-2 py-1 font-mono text-xs" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs" />
        <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience"
          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Product category"
          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs" />
      </div>

      <div className="flex gap-2">
        <button
          onClick={runSimulate}
          disabled={busy}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
        >
          {busy ? "Simulating…" : "Simulate"}
        </button>
        {report?.campaign_id && (
          <>
            <input
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
              placeholder="approver email"
              className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs flex-1"
            />
            <button
              onClick={runApprove}
              disabled={busy || !report.governance.ok}
              className="px-3 py-1 bg-kinform-torque text-black rounded text-xs disabled:opacity-50"
              title={report.governance.ok ? "Approve → Production" : "Fix governance violations first"}
            >
              Approve → Production
            </button>
          </>
        )}
        <button
          onClick={() => { setOpen(false); setReport(null); setErr(null); }}
          className="ml-auto text-white/40 text-xs"
        >
          close
        </button>
      </div>

      {err && <pre className="text-xs text-red-400 whitespace-pre-wrap">{err}</pre>}

      {report && (
        <div className="text-xs space-y-1 border border-white/10 rounded p-3">
          <div className="font-mono text-kinform-torque">{report.draft.content}</div>
          <div className="text-white/50">
            governance: {report.governance.ok ? "ok" : `${report.governance.violations.length} violations`}
            {" · "}
            risk={report.analytics.risk_score.toFixed(2)} · CTR≈{report.analytics.predicted_ctr.toFixed(3)}
          </div>
          {report.governance.violations.map((v) => (
            <div key={v.code} className="text-red-400">⚠ {v.code}: {v.message}</div>
          ))}
        </div>
      )}
    </div>
  );
}
