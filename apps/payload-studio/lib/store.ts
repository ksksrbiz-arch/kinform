/**
 * Studio store: in-memory virtual filesystem + campaign registry.
 *
 * Persisted to localStorage so a refresh doesn't blow away in-progress drafts.
 * No server state, no streaming — the IDE is fully client-side and only ever
 * talks to the PersonaGenAI service for campaign mutations.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Campaign, VFile } from "./types";

interface StudioState {
  files: VFile[];
  campaigns: Campaign[];
  activePath: string | null;

  // VFS ops
  createFile: (path: string, content?: string) => void;
  writeFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  setActive: (path: string | null) => void;

  // Campaign ops
  upsertCampaign: (c: Campaign) => void;
  removeCampaign: (id: string) => void;
  clearCampaigns: () => void;
}

const SEED_FILES: VFile[] = [
  {
    path: "README.md",
    content:
      "# KINFORM Payload Studio\n\nDraft campaigns in the Campaigns panel.\nFiles created here ride along inside the compiled bootstrapper.\n",
  },
  {
    path: "manifest.json",
    content: JSON.stringify(
      {
        brand: "KINFORM",
        system: "KINFORM-AEO",
        notes: "Edit me. I'll be baked into the bootstrapper verbatim.",
      },
      null,
      2,
    ),
  },
];

export const useStudio = create<StudioState>()(
  persist(
    (set) => ({
      files: SEED_FILES,
      campaigns: [],
      activePath: SEED_FILES[0]?.path ?? null,

      createFile: (path, content = "") =>
        set((s) =>
          s.files.some((f) => f.path === path)
            ? s
            : {
                files: [...s.files, { path, content }],
                activePath: path,
              },
        ),

      writeFile: (path, content) =>
        set((s) => ({
          files: s.files.map((f) =>
            f.path === path ? { ...f, content } : f,
          ),
        })),

      deleteFile: (path) =>
        set((s) => ({
          files: s.files.filter((f) => f.path !== path),
          activePath: s.activePath === path ? null : s.activePath,
        })),

      setActive: (path) => set({ activePath: path }),

      upsertCampaign: (c) =>
        set((s) => {
          const idx = s.campaigns.findIndex((x) => x.id === c.id);
          if (idx === -1) return { campaigns: [...s.campaigns, c] };
          const next = s.campaigns.slice();
          next[idx] = c;
          return { campaigns: next };
        }),

      removeCampaign: (id) =>
        set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),

      clearCampaigns: () => set({ campaigns: [] }),
    }),
    {
      name: "kinform-payload-studio",
      version: 1,
    },
  ),
);
