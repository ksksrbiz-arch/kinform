"use client";

import { useEffect, useMemo, useState } from "react";
import FileTree from "@/components/FileTree";
import Editor from "@/components/Editor";
import CompilerPanel from "@/components/CompilerPanel";
import CampaignComposer from "@/components/CampaignComposer";
import {
  buildTree,
  emptyVFS,
  removeFile,
  seedVFS,
  upsertFile,
  type VFS,
  type VFile,
} from "@/lib/vfs";

const STORAGE_KEY = "kinform.payload-studio.v1";

function loadVFS(): VFS {
  if (typeof window === "undefined") return emptyVFS();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedVFS();
    const parsed = JSON.parse(raw) as VFS;
    if (!parsed.files) return seedVFS();
    return parsed;
  } catch {
    return seedVFS();
  }
}

function saveVFS(vfs: VFS): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vfs));
}

export default function Page() {
  const [vfs, setVFS] = useState<VFS>(emptyVFS());
  const [activePath, setActivePath] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadVFS();
    setVFS(loaded);
    setActivePath(loaded.files[0]?.path ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveVFS(vfs);
  }, [vfs, hydrated]);

  const tree = useMemo(() => buildTree(vfs), [vfs]);
  const active = vfs.files.find((f) => f.path === activePath) ?? null;

  function update(file: VFile) {
    setVFS((cur) => upsertFile(cur, file));
  }
  function remove(path: string) {
    setVFS((cur) => removeFile(cur, path));
    if (activePath === path) setActivePath(null);
  }
  function reset() {
    const seeded = seedVFS();
    setVFS(seeded);
    setActivePath(seeded.files[0]?.path ?? null);
  }

  return (
    <main className="grid grid-cols-12 gap-0 min-h-[calc(100vh-57px)]">
      <aside className="col-span-3 border-r border-white/10 p-3 overflow-y-auto">
        <FileTree
          root={tree}
          activePath={activePath}
          onSelect={setActivePath}
          onDelete={remove}
        />
        <button
          onClick={reset}
          className="mt-4 w-full text-xs uppercase tracking-widest text-white/50 hover:text-kinform-torque"
        >
          Reset workspace to seed
        </button>
      </aside>

      <section className="col-span-6 border-r border-white/10 flex flex-col">
        <CampaignComposer onCampaignReady={update} />
        <Editor file={active} onChange={update} />
      </section>

      <aside className="col-span-3 p-4 overflow-y-auto">
        <CompilerPanel vfs={vfs} />
      </aside>
    </main>
  );
}
