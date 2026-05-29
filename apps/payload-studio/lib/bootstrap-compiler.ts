/**
 * Polymorphic Bootstrapping Compiler.
 *
 * Takes the Studio workspace (VFS + APPROVED/PUBLISHED campaigns) and emits a
 * single self-contained Python 3.9+ script. Running that script in an empty
 * directory recreates the workspace deterministically — without any network,
 * pip, or third-party dependencies.
 *
 * Strategy:
 *   1. Serialise { files, campaigns, metadata } → JSON.
 *   2. Encode that JSON as Base64 (UTF-8 safe, embeddable in a Python string).
 *   3. Inject the Base64 into a Python template that uses only the stdlib
 *      (base64, json, hashlib, pathlib, argparse) to materialise files.
 *
 * Idempotence:
 *   The unpacker computes a SHA-256 of every payload entry and only rewrites
 *   files whose hash doesn't match what's already on disk. Re-running the
 *   script is therefore a no-op once the workspace is in sync.
 *
 * Safety:
 *   - Every path is checked to stay inside the output directory (no `..`,
 *     no absolute paths).
 *   - Refuses to compile unless EVERY campaign is APPROVED or PUBLISHED.
 *     This is the "human-in-the-loop" gate Phase 4 also enforces in CI.
 */

import type { Campaign, VFile } from "./types";
import { isCampaignReleasable } from "./types";

export interface BootstrapPayload {
  version: 1;
  brand: string;
  system: string;
  compiled_at: string;
  files: VFile[];
  campaigns: Campaign[];
}

export class GovernanceGateError extends Error {
  constructor(
    message: string,
    readonly blockers: { id: string; slug: string; status: string }[],
  ) {
    super(message);
    this.name = "GovernanceGateError";
  }
}

export interface CompileInput {
  files: VFile[];
  campaigns: Campaign[];
}

export interface CompileResult {
  script: string;
  filename: string;
  payload: BootstrapPayload;
}

/** Base64-encode a UTF-8 string safely in both browser and Node. */
function toBase64(utf8: string): string {
  if (typeof btoa === "function") {
    // Convert to binary string first (btoa requires latin-1).
    const bytes = new TextEncoder().encode(utf8);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  // Node fallback (used in tests)
  return Buffer.from(utf8, "utf-8").toString("base64");
}

/** Split a long string into fixed-width chunks for nice Python source layout. */
function chunkBase64(b64: string, width = 76): string {
  const lines: string[] = [];
  for (let i = 0; i < b64.length; i += width) {
    lines.push(b64.slice(i, i + width));
  }
  return lines.map((l) => `    "${l}"`).join("\n");
}

export function compileBootstrapper(input: CompileInput): CompileResult {
  // --- governance gate -----------------------------------------------------
  const blockers = input.campaigns
    .filter((c) => !isCampaignReleasable(c))
    .map((c) => ({ id: c.id, slug: c.slug, status: c.status }));
  if (blockers.length > 0) {
    throw new GovernanceGateError(
      `Cannot compile bootstrapper: ${blockers.length} campaign(s) are not yet ` +
        `APPROVED or PUBLISHED.`,
      blockers,
    );
  }
  if (input.campaigns.length === 0) {
    throw new GovernanceGateError(
      "Cannot compile bootstrapper: no campaigns staged. Draft and approve at " +
        "least one campaign before compiling.",
      [],
    );
  }

  // --- payload -------------------------------------------------------------
  const payload: BootstrapPayload = {
    version: 1,
    brand: "KINFORM",
    system: "KINFORM-AEO",
    compiled_at: new Date().toISOString(),
    files: input.files,
    campaigns: input.campaigns,
  };

  const json = JSON.stringify(payload);
  const b64 = toBase64(json);
  const chunked = chunkBase64(b64);

  const script = renderPythonTemplate(chunked, payload);
  const filename = `kinform-bootstrapper-${stamp(payload.compiled_at)}.py`;
  return { script, filename, payload };
}

function stamp(iso: string): string {
  // 2026-05-29T12:34:56.789Z → 20260529-123456
  return iso.replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
}

function renderPythonTemplate(
  base64Chunks: string,
  payload: BootstrapPayload,
): string {
  const fileCount = payload.files.length;
  const campaignCount = payload.campaigns.length;
  const header = [
    "#!/usr/bin/env python3",
    `# KINFORM-AEO bootstrapper — compiled ${payload.compiled_at}`,
    `# Files: ${fileCount} | Campaigns (APPROVED/PUBLISHED): ${campaignCount}`,
    "# Self-contained. Requires Python 3.9+. No third-party packages.",
    "#",
    "# Usage:",
    "#   python3 kinform-bootstrapper-*.py [--out ./kinform-workspace] [--force]",
    "#",
    "# Re-running with the same payload is a no-op (idempotent).",
  ].join("\n");

  // Use a raw triple-quoted string with sentinel-protected indentation.
  // The Python template below intentionally does NOT use f-strings or .format
  // so the JS-side {} braces don't need escaping.
  return `${header}

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import sys
from pathlib import Path

PAYLOAD_B64 = (
${base64Chunks}
)

EXPECTED_BRAND = "KINFORM"
EXPECTED_SYSTEM = "KINFORM-AEO"


def _load_payload() -> dict:
    raw = base64.b64decode(PAYLOAD_B64.encode("ascii"))
    data = json.loads(raw.decode("utf-8"))
    if data.get("brand") != EXPECTED_BRAND or data.get("system") != EXPECTED_SYSTEM:
        raise SystemExit("Refusing to unpack: payload brand/system mismatch.")
    return data


def _safe_join(root: Path, rel: str) -> Path:
    if rel.startswith("/") or ".." in Path(rel).parts:
        raise SystemExit("Refusing to unpack: unsafe path " + repr(rel))
    target = (root / rel).resolve()
    if root.resolve() not in target.parents and target != root.resolve():
        raise SystemExit("Refusing to unpack: path escapes output root " + repr(rel))
    return target


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _write_if_changed(target: Path, content: bytes, force: bool) -> str:
    if target.exists() and not force:
        if _sha256(target.read_bytes()) == _sha256(content):
            return "skip"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(content)
    return "write"


def unpack(out: Path, force: bool) -> int:
    payload = _load_payload()
    out.mkdir(parents=True, exist_ok=True)

    wrote = 0
    skipped = 0
    for entry in payload.get("files", []):
        path = entry["path"]
        body = entry["content"].encode("utf-8")
        target = _safe_join(out, path)
        action = _write_if_changed(target, body, force)
        if action == "write":
            wrote += 1
            print("write  " + path)
        else:
            skipped += 1

    # Campaign records ship as one JSON file per campaign under campaigns/.
    for c in payload.get("campaigns", []):
        slug = c.get("slug") or c.get("id")
        body = (json.dumps(c, indent=2, sort_keys=True) + "\\n").encode("utf-8")
        target = _safe_join(out, "campaigns/" + slug + ".json")
        action = _write_if_changed(target, body, force)
        if action == "write":
            wrote += 1
            print("write  campaigns/" + slug + ".json")
        else:
            skipped += 1

    # Manifest of what just happened.
    manifest = {
        "brand": payload["brand"],
        "system": payload["system"],
        "compiled_at": payload["compiled_at"],
        "files": [e["path"] for e in payload.get("files", [])],
        "campaigns": [
            {"id": c["id"], "slug": c["slug"], "status": c["status"]}
            for c in payload.get("campaigns", [])
        ],
    }
    manifest_bytes = (json.dumps(manifest, indent=2, sort_keys=True) + "\\n").encode("utf-8")
    _write_if_changed(_safe_join(out, ".kinform-bootstrap.json"), manifest_bytes, force=True)

    print("done   wrote=" + str(wrote) + " skipped=" + str(skipped))
    return 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Unpack a KINFORM-AEO bootstrapper payload into a directory."
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=Path("./kinform-workspace"),
        help="Output directory (default: ./kinform-workspace).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite files even when the on-disk hash matches.",
    )
    args = parser.parse_args(argv)
    return unpack(args.out, args.force)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
`;
}
