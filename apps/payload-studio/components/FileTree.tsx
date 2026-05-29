"use client";

import { useState } from "react";

import { useStudio } from "@/lib/store";

export default function FileTree() {
  const files = useStudio((s) => s.files);
  const active = useStudio((s) => s.activePath);
  const setActive = useStudio((s) => s.setActive);
  const createFile = useStudio((s) => s.createFile);
  const deleteFile = useStudio((s) => s.deleteFile);

  const [newPath, setNewPath] = useState("");

  return (
    <div style={{ padding: 8 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newPath.trim()) return;
          createFile(newPath.trim());
          setNewPath("");
        }}
        style={{ display: "flex", gap: 6, marginBottom: 8 }}
      >
        <input
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="new/file.md"
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          +
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {files
          .slice()
          .sort((a, b) => a.path.localeCompare(b.path))
          .map((f) => {
            const isActive = f.path === active;
            return (
              <li
                key={f.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 6px",
                  borderRadius: 4,
                  background: isActive ? "var(--studio-panel-2)" : "transparent",
                  color: isActive
                    ? "var(--studio-text)"
                    : "var(--studio-text-dim)",
                }}
              >
                <button
                  onClick={() => setActive(f.path)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    color: "inherit",
                    textAlign: "left",
                    fontSize: 12,
                    padding: 0,
                  }}
                >
                  {f.path}
                </button>
                <button
                  onClick={() => deleteFile(f.path)}
                  title="Delete"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--studio-text-dim)",
                    fontSize: 12,
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: "var(--studio-bg)",
  border: "1px solid var(--studio-border)",
  color: "var(--studio-text)",
  padding: "4px 8px",
  fontSize: 12,
  fontFamily: "inherit",
  borderRadius: 4,
};

const buttonStyle: React.CSSProperties = {
  background: "var(--studio-accent-2)",
  border: "none",
  color: "var(--studio-text)",
  padding: "4px 10px",
  fontSize: 12,
  borderRadius: 4,
};
