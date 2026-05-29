"use client";

import { useMemo, useState } from "react";

import {
  GovernanceGateError,
  compileBootstrapper,
} from "@/lib/bootstrap-compiler";
import { useStudio } from "@/lib/store";
import { isCampaignReleasable } from "@/lib/types";

export default function BootstrapButton() {
  const files = useStudio((s) => s.files);
  const campaigns = useStudio((s) => s.campaigns);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { blockers, ready } = useMemo(() => {
    const blockers = campaigns.filter((c) => !isCampaignReleasable(c));
    return {
      blockers,
      ready: campaigns.length > 0 && blockers.length === 0,
    };
  }, [campaigns]);

  const title = ready
    ? `Compile bootstrapper with ${files.length} file(s) and ${campaigns.length} campaign(s).`
    : campaigns.length === 0
      ? "Draft and approve at least one campaign first."
      : `${blockers.length} campaign(s) still need human approval: ${blockers
          .map((c) => c.slug)
          .join(", ")}`;

  function onClick() {
    try {
      const { script, filename } = compileBootstrapper({ files, campaigns });
      const blob = new Blob([script], { type: "text/x-python" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setFeedback(`Compiled → ${filename}`);
      window.setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      if (err instanceof GovernanceGateError) {
        setFeedback(err.message);
      } else {
        setFeedback(err instanceof Error ? err.message : String(err));
      }
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {feedback && (
        <span
          style={{
            fontSize: 11,
            color: ready ? "var(--studio-ok)" : "var(--studio-warn)",
          }}
        >
          {feedback}
        </span>
      )}
      <button
        onClick={onClick}
        disabled={!ready}
        title={title}
        style={{
          background: ready ? "var(--studio-accent)" : "var(--studio-panel-2)",
          color: ready ? "var(--studio-bg)" : "var(--studio-text-dim)",
          border: "1px solid var(--studio-border)",
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 4,
          letterSpacing: 0.5,
        }}
      >
        Compile &amp; Download Bootstrapper
      </button>
    </div>
  );
}
