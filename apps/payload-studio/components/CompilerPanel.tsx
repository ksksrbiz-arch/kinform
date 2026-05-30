"use client";

import { useState } from "react";
import { compile, type CompilerArtifact } from "@/lib/compiler";
import type { VFS } from "@/lib/vfs";

interface Props {
  vfs: VFS;
}

export default function CompilerPanel({ vfs }: Props) {
  const [projectName, setProjectName] = useState("kinform");
  const [productionOnly, setProductionOnly] = useState(false);
  const [note, setNote] = useState("");
  const [lastArtifact, setLastArtifact] = useState<CompilerArtifact | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unapproved = vfs.files.filter((f) => !f.approved).length;

  function onCompile() {
    setError(null);
    try {
      if (productionOnly && unapproved > 0) {
        throw new Error(
          `${unapproved} file(s) lack human approval. Approve them in the IDE or uncheck production-only.`,
        );
      }
      const artifact = compile(vfs, { projectName, productionOnly, note });
      setLastArtifact(artifact);

      const blob = new Blob([artifact.pythonSource], { type: "text/x-python" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = artifact.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs uppercase tracking-widest text-white/40">
        Polymorphic Bootstrapping Compiler
      </h2>

      <label className="block text-xs">
        <span className="text-white/60">Project name</span>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value.replace(/[^a-z0-9\-]/gi, "-"))}
          className="mt-1 w-full bg-black/40 border border-white/10 rounded px-2 py-1 font-mono text-sm"
        />
      </label>

      <label className="block text-xs">
        <span className="text-white/60">Header note (optional)</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-white/80">
        <input
          type="checkbox"
          checked={productionOnly}
          onChange={(e) => setProductionOnly(e.target.checked)}
        />
        Production-only (refuse to compile unapproved files)
      </label>

      <button
        onClick={onCompile}
        className="w-full bg-kinform-torque text-black font-semibold py-2 rounded hover:opacity-90"
      >
        Compile & Download Bootstrapper
      </button>

      {error && (
        <pre className="text-xs text-red-400 whitespace-pre-wrap">{error}</pre>
      )}

      {lastArtifact && (
        <div className="text-xs text-white/70 border border-white/10 rounded p-3 space-y-1">
          <div className="font-mono text-kinform-torque">{lastArtifact.filename}</div>
          <div>Files embedded: {lastArtifact.fileCount}</div>
          <div>Approved: {lastArtifact.approvedCount}</div>
          <div>Unapproved (staged): {lastArtifact.unapprovedCount}</div>
          <div>Rules version: {lastArtifact.rulesVersion}</div>
          <div>Size: {(lastArtifact.bytes / 1024).toFixed(1)} KB</div>
        </div>
      )}

      <div className="text-[11px] text-white/40 leading-relaxed pt-2 border-t border-white/10">
        The generated script uses only the Python stdlib, validates the
        embedded governance rules version, and writes unapproved files under
        <code className="font-mono"> ./staging/</code>. It is idempotent —
        re-runs only rewrite changed files.
      </div>
    </div>
  );
}
