"use client";

import { useStudio } from "@/lib/store";

export default function Editor() {
  const active = useStudio((s) => s.activePath);
  const file = useStudio((s) =>
    active ? s.files.find((f) => f.path === active) ?? null : null,
  );
  const writeFile = useStudio((s) => s.writeFile);

  if (!file) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--studio-text-dim)",
          fontSize: 13,
        }}
      >
        Select a file in the left sidebar, or create one.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "32px 1fr",
        height: "100%",
      }}
    >
      <div
        style={{
          background: "var(--studio-panel)",
          borderBottom: "1px solid var(--studio-border)",
          padding: "8px 12px",
          fontSize: 12,
          color: "var(--studio-text-dim)",
        }}
      >
        {file.path}
      </div>
      <textarea
        value={file.content}
        onChange={(e) => writeFile(file.path, e.target.value)}
        spellCheck={false}
        style={{
          width: "100%",
          height: "100%",
          resize: "none",
          background: "var(--studio-bg)",
          color: "var(--studio-text)",
          border: "none",
          outline: "none",
          padding: 16,
          fontFamily: "inherit",
          fontSize: 13,
          lineHeight: 1.5,
        }}
      />
    </div>
  );
}
