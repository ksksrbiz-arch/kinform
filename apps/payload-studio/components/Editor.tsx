"use client";

import { useEffect, useState } from "react";
import type { VFile } from "@/lib/vfs";

interface Props {
  file: VFile | null;
  onChange: (file: VFile) => void;
}

export default function Editor({ file, onChange }: Props) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setDraft(file?.content ?? "");
  }, [file?.path]);

  if (!file) {
    return (
      <div className="flex-1 p-6 text-white/40 text-sm">
        Select a file from the tree, or generate a campaign above.
      </div>
    );
  }

  function save() {
    if (!file) return;
    onChange({ ...file, content: draft, updatedAt: new Date().toISOString() });
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 py-2 border-y border-white/10 flex items-center gap-3 text-xs">
        <span className="font-mono text-kinform-torque">{file.path}</span>
        <span className="text-white/40 uppercase tracking-widest">{file.kind}</span>
        {file.approved && (
          <span className="ml-auto text-green-400">approved ✓</span>
        )}
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        spellCheck={false}
        className="flex-1 w-full bg-black/40 text-kinform-parchment font-mono text-sm p-4 outline-none resize-none"
      />
      <div className="px-4 py-2 border-t border-white/10 text-xs text-white/40">
        Auto-saves on blur · {draft.length} chars
      </div>
    </div>
  );
}
