/**
 * Virtual filesystem for the Payload Studio.
 *
 * Pure-data + pure-functions so it can be serialised, snapshotted, fed to
 * the Polymorphic Bootstrapping Compiler, and re-hydrated client-side.
 *
 * Files live in three logical "kinds":
 * - `campaign`  — JSON blobs validated against the PersonaGenAI contract.
 * - `governance`— editable copies of the cross-service rules (for review).
 * - `schema`    — product / asset schema overrides.
 * - `asset`     — arbitrary text assets (markdown, copy, etc).
 */

export type FileKind = "campaign" | "governance" | "schema" | "asset";

export interface VFile {
  /** POSIX path, always starts with "/". */
  path: string;
  kind: FileKind;
  /** UTF-8 contents. Binary assets are out of scope for v1. */
  content: string;
  /** Was this file produced by an approved campaign? */
  approved?: boolean;
  /** Optional pointer back to the PersonaGenAI campaign id. */
  campaignId?: string;
  /** Last-modified timestamp (ISO). */
  updatedAt: string;
}

export interface VFS {
  files: VFile[];
}

export function emptyVFS(): VFS {
  return { files: [] };
}

export function upsertFile(vfs: VFS, file: VFile): VFS {
  const idx = vfs.files.findIndex((f) => f.path === file.path);
  const next = [...vfs.files];
  if (idx >= 0) next[idx] = file;
  else next.push(file);
  next.sort((a, b) => a.path.localeCompare(b.path));
  return { files: next };
}

export function removeFile(vfs: VFS, path: string): VFS {
  return { files: vfs.files.filter((f) => f.path !== path) };
}

/** Build a nested tree representation for UI rendering. */
export interface TreeNode {
  name: string;
  path: string;
  children?: TreeNode[];
  file?: VFile;
}

export function buildTree(vfs: VFS): TreeNode {
  const root: TreeNode = { name: "/", path: "/", children: [] };
  for (const file of vfs.files) {
    const parts = file.path.split("/").filter(Boolean);
    let cursor = root;
    let acc = "";
    parts.forEach((part, i) => {
      acc += "/" + part;
      cursor.children ??= [];
      let next = cursor.children.find((c) => c.name === part);
      if (!next) {
        next = { name: part, path: acc };
        if (i < parts.length - 1) next.children = [];
        cursor.children.push(next);
      }
      if (i === parts.length - 1) next.file = file;
      cursor = next;
    });
  }
  const sort = (n: TreeNode) => {
    n.children?.sort((a, b) => {
      const ad = a.children ? 0 : 1;
      const bd = b.children ? 0 : 1;
      return ad - bd || a.name.localeCompare(b.name);
    });
    n.children?.forEach(sort);
  };
  sort(root);
  return root;
}

const SEED_GOVERNANCE = `# KINFORM Governance Rules (mirror)
#
# This file is an editable mirror of \`packages/shared\`. Reviewers can
# annotate it, but the authoritative version is enforced by the FastAPI
# service and the GitHub Actions pipeline. Mismatches block CI.
max_content_chars: 140
required_hashtags:
  - "#KINFORM"
  - "#TorquedAffiliation"
required_cta_verbs: [shop, wear, join, claim, drop, scan, tap]
banned_phrases:
  - "guaranteed returns"
  - "get rich quick"
  - "risk-free"
  - "no risk"
  - "miracle"
  - "passive income forever"
`;

const SEED_README = `# Welcome to the KINFORM Payload Studio

This workspace is your visual IDE for KINFORM-AEO. Edit governance rules,
draft campaigns, then click **Compile & Download Bootstrapper** to export
the entire state as a self-deploying Python script.

Approved campaigns are read-only icons (✓) in the tree.
`;

export function seedVFS(): VFS {
  const now = new Date().toISOString();
  return {
    files: [
      {
        path: "/README.md",
        kind: "asset",
        content: SEED_README,
        updatedAt: now,
      },
      {
        path: "/governance/rules.yaml",
        kind: "governance",
        content: SEED_GOVERNANCE,
        updatedAt: now,
      },
      {
        path: "/schema/product.json",
        kind: "schema",
        content: JSON.stringify(
          {
            $id: "kinform.product",
            fields: ["physicalId", "sku", "name", "category", "basePriceCents"],
          },
          null,
          2,
        ),
        updatedAt: now,
      },
    ],
  };
}
