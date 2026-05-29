"use client";

/**
 * One-shot campaign generator UI.
 *
 * Wraps the PersonaGenAI `/campaigns/generate` endpoint introduced in the
 * integration plan. Renders a tiny form (drop id, channel, days) and shows
 * the resulting draft + validation block. Persists the returned campaign
 * into the Studio store so the rest of the IDE picks it up.
 */

import { useState } from "react";

import { persona, type GenerateResponse } from "@/lib/persona-client";
import { useStudio } from "@/lib/store";
import type { CampaignChannel } from "@/lib/types";

const CHANNELS: CampaignChannel[] = [
  "instagram",
  "tiktok",
  "email",
  "print",
  "other",
];

export default function CampaignGenerator() {
  const upsert = useStudio((s) => s.upsertCampaign);

  const [dropId, setDropId] = useState("");
  const [channel, setChannel] = useState<CampaignChannel>("instagram");
  const [days, setDays] = useState(14);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  async function onGenerate() {
    setBusy(true);
    setError(null);
    try {
      const res = await persona.generate({ dropId, channel, days });
      setResult(res);
      upsert(res.campaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  const canSubmit = dropId.trim().length > 0 && !busy;

  return (
    <section
      style={{
        border: "1px solid var(--studio-border)",
        borderRadius: 6,
        padding: 12,
        display: "grid",
        gap: 10,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <strong>One-shot generator</strong>
        <span style={{ fontSize: 11, color: "var(--studio-text-dim)" }}>
          POST /campaigns/generate
        </span>
      </header>

      <label style={{ display: "grid", gap: 4, fontSize: 12 }}>
        Drop ID
        <input
          value={dropId}
          onChange={(e) => setDropId(e.target.value)}
          placeholder="drop_…"
          spellCheck={false}
        />
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <label style={{ flex: 1, display: "grid", gap: 4, fontSize: 12 }}>
          Channel
          <select value={channel} onChange={(e) => setChannel(e.target.value as CampaignChannel)}>
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label style={{ width: 80, display: "grid", gap: 4, fontSize: 12 }}>
          Days
          <input
            type="number"
            min={1}
            max={365}
            value={days}
            onChange={(e) => setDays(Number(e.target.value) || 14)}
          />
        </label>
      </div>

      <button onClick={onGenerate} disabled={!canSubmit}>
        {busy ? "Generating…" : "Generate + simulate"}
      </button>

      {error && (
        <pre style={{ color: "var(--studio-bad)", fontSize: 11, whiteSpace: "pre-wrap" }}>
          {error}
        </pre>
      )}

      {result && (
        <article
          style={{
            borderTop: "1px solid var(--studio-border)",
            paddingTop: 10,
            display: "grid",
            gap: 6,
            fontSize: 12,
          }}
        >
          <div>
            <strong>{result.draft.title}</strong>{" "}
            <span style={{ color: "var(--studio-text-dim)" }}>· {result.status}</span>
          </div>
          <div style={{ fontFamily: "var(--studio-mono)" }}>{result.draft.content}</div>
          <div style={{ color: "var(--studio-text-dim)" }}>
            CTAs: {result.draft.ctas.join(" · ") || "—"}
          </div>
          <div style={{ color: "var(--studio-text-dim)" }}>
            Tags: {result.draft.hashtags.join(" ") || "—"}
          </div>
          <div style={{ color: "var(--studio-text-dim)" }}>tone: {result.draft.tone}</div>
          <div
            style={{
              color: result.validation.passed ? "var(--studio-ok)" : "var(--studio-bad)",
            }}
          >
            validation: {result.validation.passed ? "PASS" : "FAIL"}
            {result.validation.errors.length > 0 && (
              <ul style={{ margin: "4px 0 0 16px" }}>
                {result.validation.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ fontSize: 10, color: "var(--studio-text-dim)" }}>
            simulationId: {result.simulationId} · campaignId: {result.campaignId}
          </div>
        </article>
      )}
    </section>
  );
}
