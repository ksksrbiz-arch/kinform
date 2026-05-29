"use client";

import { useState } from "react";

import FileTree from "./FileTree";
import Editor from "./Editor";
import CampaignsPanel from "./CampaignsPanel";
import BootstrapButton from "./BootstrapButton";

export default function Studio() {
  const [tab, setTab] = useState<"files" | "campaigns">("files");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr 420px",
        gridTemplateRows: "44px 1fr",
        height: "100vh",
      }}
    >
      <header
        style={{
          gridColumn: "1 / 4",
          borderBottom: "1px solid var(--studio-border)",
          background: "var(--studio-panel)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 16,
          fontSize: 13,
        }}
      >
        <strong style={{ color: "var(--studio-accent)", letterSpacing: 1 }}>
          KINFORM
        </strong>
        <span style={{ color: "var(--studio-text-dim)" }}>
          Payload Studio · IDE
        </span>
        <div style={{ marginLeft: "auto" }}>
          <BootstrapButton />
        </div>
      </header>

      <aside
        style={{
          borderRight: "1px solid var(--studio-border)",
          background: "var(--studio-panel)",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--studio-border)",
          }}
        >
          <TabButton active={tab === "files"} onClick={() => setTab("files")}>
            Files
          </TabButton>
          <TabButton
            active={tab === "campaigns"}
            onClick={() => setTab("campaigns")}
          >
            Campaigns
          </TabButton>
        </div>
        {tab === "files" ? <FileTree /> : <CampaignSidebar />}
      </aside>

      <main style={{ overflow: "hidden", background: "var(--studio-bg)" }}>
        <Editor />
      </main>

      <aside
        style={{
          borderLeft: "1px solid var(--studio-border)",
          background: "var(--studio-panel)",
          overflow: "auto",
        }}
      >
        <CampaignsPanel />
      </aside>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: active ? "var(--studio-panel-2)" : "transparent",
        color: active ? "var(--studio-text)" : "var(--studio-text-dim)",
        border: "none",
        borderBottom: active
          ? "2px solid var(--studio-accent)"
          : "2px solid transparent",
        padding: "10px 8px",
        fontSize: 12,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {children}
    </button>
  );
}

function CampaignSidebar() {
  // Lightweight list of campaigns reusing the right-panel store hook.
  // The real action surface lives in CampaignsPanel on the right.
  return (
    <div style={{ padding: 12, color: "var(--studio-text-dim)", fontSize: 12 }}>
      Use the right panel to draft, simulate, approve, and publish campaigns.
      Approved or published campaigns ride along inside the compiled
      bootstrapper.
    </div>
  );
}
