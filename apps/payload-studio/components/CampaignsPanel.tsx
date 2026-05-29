"use client";

import { useState } from "react";

import { persona } from "@/lib/persona-client";
import { useStudio } from "@/lib/store";
import type { Campaign, CampaignChannel } from "@/lib/types";
import CampaignGenerator from "./CampaignGenerator";

const STATUS_COLOUR: Record<string, string> = {
  DRAFT: "var(--studio-text-dim)",
  SIMULATION: "var(--studio-warn)",
  AWAITING_APPROVAL: "var(--studio-warn)",
  APPROVED: "var(--studio-ok)",
  PUBLISHED: "var(--studio-accent)",
  REJECTED: "var(--studio-bad)",
};

export default function CampaignsPanel() {
  const campaigns = useStudio((s) => s.campaigns);
  const upsert = useStudio((s) => s.upsertCampaign);
  const remove = useStudio((s) => s.removeCampaign);

  const [slug, setSlug] = useState("");
  const [channel, setChannel] = useState<CampaignChannel>("instagram");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function withBusy<T>(key: string, fn: () => Promise<T>): Promise<T | null> {
    setBusy(key);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!slug.trim()) return;
    const res = await withBusy("create", () =>
      persona.createDraft({ slug: slug.trim(), channel }),
    );
    if (res) {
      upsert(res.campaign);
      setSlug("");
    }
  }

  async function onSimulate(c: Campaign) {
    const res = await withBusy("sim:" + c.id, () =>
      persona.simulate(c.id, { seed: c.slug }),
    );
    if (res) upsert(res.campaign);
  }

  async function onApprove(c: Campaign) {
    const approver = window.prompt(
      "Approver email (will be stored on the Campaign record):",
      "founder@kinform.local",
    );
    if (!approver) return;
    const res = await withBusy("approve:" + c.id, () =>
      persona.approve(c.id, approver),
    );
    if (res) upsert(res.campaign);
  }

  async function onPublish(c: Campaign) {
    const res = await withBusy("publish:" + c.id, () => persona.publish(c.id));
    if (res) upsert(res.campaign);
  }

  async function onReject(c: Campaign) {
    const reason = window.prompt("Rejection reason:");
    if (!reason) return;
    const res = await withBusy("reject:" + c.id, () =>
      persona.reject(c.id, reason),
    );
    if (res) upsert(res.campaign);
  }

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
      <CampaignGenerator />
      <section>
        <SectionTitle>New campaign</SectionTitle>
        <form
          onSubmit={onCreate}
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          <input
            placeholder="slug (e.g. fishnet-launch)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={inputStyle}
          />
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as CampaignChannel)}
            style={inputStyle}
          >
            <option value="instagram">instagram</option>
            <option value="tiktok">tiktok</option>
            <option value="email">email</option>
            <option value="print">print</option>
            <option value="other">other</option>
          </select>
          <button
            type="submit"
            disabled={busy === "create"}
            style={primaryButton}
          >
            {busy === "create" ? "Creating…" : "Create DRAFT"}
          </button>
        </form>
      </section>

      {error && (
        <div
          style={{
            padding: 8,
            border: "1px solid var(--studio-bad)",
            color: "var(--studio-bad)",
            fontSize: 12,
            borderRadius: 4,
          }}
        >
          {error}
        </div>
      )}

      <section>
        <SectionTitle>Campaigns ({campaigns.length})</SectionTitle>
        {campaigns.length === 0 && (
          <p style={{ fontSize: 12, color: "var(--studio-text-dim)" }}>
            No campaigns yet. Create one above to begin the agentic pipeline.
          </p>
        )}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {campaigns.map((c) => (
            <li
              key={c.id}
              style={{
                background: "var(--studio-panel-2)",
                border: "1px solid var(--studio-border)",
                borderRadius: 6,
                padding: 10,
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <strong>{c.slug}</strong>
                <span style={{ color: STATUS_COLOUR[c.status] ?? "var(--studio-text-dim)" }}>
                  {c.status}
                </span>
              </div>
              <div style={{ color: "var(--studio-text-dim)", marginBottom: 6 }}>
                {c.channel} · {c.id.slice(0, 8)}…
              </div>
              <div style={{ marginBottom: 6, whiteSpace: "pre-wrap" }}>{c.content}</div>
              {c.ctas.length > 0 && (
                <div style={{ color: "var(--studio-text-dim)" }}>
                  CTAs: {c.ctas.join(" · ")}
                </div>
              )}
              {c.hashtags.length > 0 && (
                <div style={{ color: "var(--studio-text-dim)", marginBottom: 6 }}>
                  {c.hashtags.join(" ")}
                </div>
              )}
              {c.approved_by && (
                <div style={{ color: "var(--studio-ok)", marginBottom: 6 }}>
                  ✓ approved by {c.approved_by}
                </div>
              )}
              {c.rejected_reason && (
                <div style={{ color: "var(--studio-bad)", marginBottom: 6 }}>
                  ✗ rejected: {c.rejected_reason}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {c.status === "DRAFT" && (
                  <button onClick={() => onSimulate(c)} disabled={busy === "sim:" + c.id} style={smallButton}>
                    {busy === "sim:" + c.id ? "Simulating…" : "Simulate"}
                  </button>
                )}
                {c.status === "AWAITING_APPROVAL" && (
                  <>
                    <button onClick={() => onApprove(c)} disabled={busy === "approve:" + c.id} style={smallButtonOk}>
                      Approve
                    </button>
                    <button onClick={() => onReject(c)} disabled={busy === "reject:" + c.id} style={smallButtonBad}>
                      Reject
                    </button>
                  </>
                )}
                {c.status === "APPROVED" && (
                  <button onClick={() => onPublish(c)} disabled={busy === "publish:" + c.id} style={smallButtonOk}>
                    Publish
                  </button>
                )}
                <button onClick={() => remove(c.id)} style={smallButtonDim}>
                  Forget
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: "0 0 8px 0",
        fontSize: 11,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "var(--studio-text-dim)",
      }}
    >
      {children}
    </h2>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--studio-bg)",
  border: "1px solid var(--studio-border)",
  color: "var(--studio-text)",
  padding: "6px 8px",
  fontSize: 12,
  fontFamily: "inherit",
  borderRadius: 4,
};

const primaryButton: React.CSSProperties = {
  background: "var(--studio-accent)",
  border: "none",
  color: "var(--studio-bg)",
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 4,
};

const smallButton: React.CSSProperties = {
  background: "var(--studio-accent-2)",
  border: "none",
  color: "var(--studio-text)",
  padding: "4px 8px",
  fontSize: 11,
  borderRadius: 4,
};

const smallButtonOk: React.CSSProperties = { ...smallButton, background: "var(--studio-ok)" };
const smallButtonBad: React.CSSProperties = { ...smallButton, background: "var(--studio-bad)" };
const smallButtonDim: React.CSSProperties = { ...smallButton, background: "transparent", border: "1px solid var(--studio-border)" };
