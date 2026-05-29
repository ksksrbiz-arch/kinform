#!/usr/bin/env node
/**
 * KINFORM-AEO governance check.
 *
 * Runs as the `governance` CI job and via `npm run governance:check`. Pure
 * Node ESM, no third-party deps. Spawns `python3` only for the bootstrap
 * compiler end-to-end test.
 *
 * What it asserts:
 *
 *   1. TypeScript ↔ Python enum parity for every enum in `torqued-graph`.
 *   2. TypeScript ↔ Python branding parity (`BRAND`, `REQUIRED_HASHTAGS`,
 *      `APPROVED_CTAS`, `CONTENT_MAX_LENGTH`, `BANNED_PHRASES`).
 *   3. State-machine sanity: `CampaignStatus.APPROVED` is reachable only via
 *      AWAITING_APPROVAL (per `CampaignTransitions`).
 *   4. Polymorphic Bootstrapping Compiler end-to-end: compile a fixture
 *      payload via the real TS compiler (through tsx), execute the resulting
 *      Python with `python3`, and verify it materialises files idempotently.
 *
 * Exits non-zero with a human-readable report on any failure.
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");

const failures = [];
function fail(area, message) {
  failures.push({ area, message });
}
function section(name, fn) {
  process.stdout.write(`\n— ${name} —\n`);
  try {
    fn();
  } catch (err) {
    fail(name, err instanceof Error ? err.stack ?? err.message : String(err));
  }
}

// ---------------------------------------------------------------------------
// 1 + 3. Enum parity + state machine
// ---------------------------------------------------------------------------
section("enum parity (TS ↔ Python)", () => {
  const tsSrc = readFileSync(
    path.join(ROOT, "packages/torqued-graph/src/enums.ts"),
    "utf-8",
  );
  const pySrc = readFileSync(
    path.join(ROOT, "packages/torqued-graph/python/kinform_torqued_graph/enums.py"),
    "utf-8",
  );

  // Parse TS: every `export const FOO = { ... } as const;`
  const tsEnums = {};
  const tsRe = /export const (\w+) = \{([\s\S]*?)\} as const;/g;
  let m;
  while ((m = tsRe.exec(tsSrc))) {
    const name = m[1];
    if (name === "CampaignTransitions") continue;
    const bodyRe = /(\w+):\s*"([^"]+)"/g;
    const values = new Set();
    let b;
    while ((b = bodyRe.exec(m[2]))) values.add(b[2]);
    tsEnums[name] = values;
  }

  // Parse Python: every `class Foo:` block ending with `ALL: Final[frozenset[str]] = frozenset({...})`
  const pyEnums = {};
  const pyClassRe = /class (\w+):\n([\s\S]*?)(?=\n\nclass |\n\nCampaignTransitions|$)/g;
  while ((m = pyClassRe.exec(pySrc))) {
    const name = m[1];
    const body = m[2];
    const allMatch = body.match(/frozenset\(\s*\{([^}]+)\}\s*\)/);
    if (!allMatch) continue;
    const vals = [...allMatch[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    pyEnums[name] = new Set(vals);
  }

  for (const name of Object.keys(tsEnums)) {
    const ts = tsEnums[name];
    const py = pyEnums[name];
    if (!py) {
      fail("enums", `Python enums.py is missing class ${name}.`);
      continue;
    }
    const onlyTs = [...ts].filter((v) => !py.has(v));
    const onlyPy = [...py].filter((v) => !ts.has(v));
    if (onlyTs.length || onlyPy.length) {
      fail(
        "enums",
        `${name} mismatch — only in TS: [${onlyTs.join(", ")}], only in Python: [${onlyPy.join(", ")}]`,
      );
    } else {
      process.stdout.write(`  ok  ${name} (${ts.size} values)\n`);
    }
  }

  // State machine sanity: APPROVED has exactly one predecessor (AWAITING_APPROVAL)
  // and PUBLISHED has exactly one predecessor (APPROVED).
  const transRe = /CampaignTransitions[\s\S]*?\{([\s\S]*?)\n\}/;
  const transBlock = tsSrc.match(transRe);
  if (!transBlock) {
    fail("state-machine", "CampaignTransitions not found in TS source.");
    return;
  }
  const transitions = {};
  const lineRe = /^\s+(\w+):\s*\[(.*?)\],?$/gm;
  while ((m = lineRe.exec(transBlock[1]))) {
    const from = m[1];
    const tos = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    transitions[from] = tos;
  }
  const predecessorsOf = (target) =>
    Object.entries(transitions)
      .filter(([, tos]) => tos.includes(target))
      .map(([f]) => f);

  const approvedPreds = predecessorsOf("APPROVED");
  if (approvedPreds.length !== 1 || approvedPreds[0] !== "AWAITING_APPROVAL") {
    fail(
      "state-machine",
      `APPROVED must only be reachable from AWAITING_APPROVAL. Got: [${approvedPreds.join(", ")}]`,
    );
  } else {
    process.stdout.write("  ok  APPROVED gated by AWAITING_APPROVAL only\n");
  }

  const publishedPreds = predecessorsOf("PUBLISHED");
  if (publishedPreds.length !== 1 || publishedPreds[0] !== "APPROVED") {
    fail(
      "state-machine",
      `PUBLISHED must only be reachable from APPROVED. Got: [${publishedPreds.join(", ")}]`,
    );
  } else {
    process.stdout.write("  ok  PUBLISHED gated by APPROVED only\n");
  }
});

// ---------------------------------------------------------------------------
// 2. Branding parity
// ---------------------------------------------------------------------------
section("branding parity (TS ↔ Python)", () => {
  const ts = readFileSync(
    path.join(ROOT, "packages/shared/src/branding.ts"),
    "utf-8",
  );
  const py = readFileSync(
    path.join(ROOT, "packages/shared/python/kinform_shared/branding.py"),
    "utf-8",
  );

  // Extract string arrays from TS: REQUIRED_HASHTAGS, APPROVED_CTAS, BANNED_PHRASES
  function tsArray(name) {
    const re = new RegExp(`${name}[^=]*=\\s*\\[([\\s\\S]*?)\\]`, "m");
    const m = ts.match(re);
    if (!m) return null;
    return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  }
  function pyArray(name) {
    const re = new RegExp(`${name}[^=]*=\\s*\\(([\\s\\S]*?)\\)`, "m");
    const m = py.match(re);
    if (!m) return null;
    return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  }
  function compare(name, a, b) {
    if (!a || !b) {
      fail("branding", `${name}: failed to parse (ts=${!!a} py=${!!b})`);
      return;
    }
    if (a.length !== b.length || a.some((v, i) => v !== b[i])) {
      fail("branding", `${name} mismatch:\n    TS = ${JSON.stringify(a)}\n    PY = ${JSON.stringify(b)}`);
    } else {
      process.stdout.write(`  ok  ${name} (${a.length} entries)\n`);
    }
  }

  compare("REQUIRED_HASHTAGS", tsArray("REQUIRED_HASHTAGS"), pyArray("REQUIRED_HASHTAGS"));
  compare("APPROVED_CTAS", tsArray("APPROVED_CTAS"), pyArray("APPROVED_CTAS"));
  compare("BANNED_PHRASES", tsArray("BANNED_PHRASES"), pyArray("BANNED_PHRASES"));

  const tsMax = ts.match(/CONTENT_MAX_LENGTH\s*=\s*(\d+)/);
  const pyMax = py.match(/CONTENT_MAX_LENGTH:[^=]*=\s*(\d+)/);
  if (!tsMax || !pyMax || tsMax[1] !== pyMax[1]) {
    fail("branding", `CONTENT_MAX_LENGTH mismatch: TS=${tsMax?.[1]} PY=${pyMax?.[1]}`);
  } else {
    process.stdout.write(`  ok  CONTENT_MAX_LENGTH = ${tsMax[1]}\n`);
  }

  // BRAND.name + systemName + tagline + programme
  const tsBrand = {
    name: ts.match(/name:\s*"([^"]+)"/)?.[1],
    systemName: ts.match(/systemName:\s*"([^"]+)"/)?.[1],
    tagline: ts.match(/tagline:\s*"([^"]+)"/)?.[1],
    programme: ts.match(/programme:\s*"([^"]+)"/)?.[1],
  };
  const pyBrand = {
    name: py.match(/name:\s*Final\[str\]\s*=\s*"([^"]+)"/)?.[1],
    systemName: py.match(/system_name:\s*Final\[str\]\s*=\s*"([^"]+)"/)?.[1],
    tagline: py.match(/tagline:\s*Final\[str\]\s*=\s*"([^"]+)"/)?.[1],
    programme: py.match(/programme:\s*Final\[str\]\s*=\s*"([^"]+)"/)?.[1],
  };
  for (const k of Object.keys(tsBrand)) {
    if (tsBrand[k] !== pyBrand[k]) {
      fail("branding", `BRAND.${k} mismatch: TS=${tsBrand[k]} PY=${pyBrand[k]}`);
    } else {
      process.stdout.write(`  ok  BRAND.${k} = ${tsBrand[k]}\n`);
    }
  }
});

// ---------------------------------------------------------------------------
// 4. Bootstrap compiler end-to-end
// ---------------------------------------------------------------------------
section("bootstrap compiler end-to-end", () => {
  const compilerTs = path.join(ROOT, "apps/payload-studio/lib/bootstrap-compiler.ts");
  if (!existsSync(compilerTs)) {
    fail("bootstrap", `Compiler source not found at ${compilerTs}`);
    return;
  }

  const tmp = mkdtempSync(path.join(tmpdir(), "kinform-gov-"));
  try {
    // Use tsx (added as a root devDep) to execute a tiny script that calls the
    // compiler with a fixture and writes the .py to disk.
    const scriptPath = path.join(__dirname, "compile-fixture.mts");
    const outPy = path.join(tmp, "bootstrapper.py");
    const r = spawnSync(
      "npx",
      ["--yes", "tsx", scriptPath, outPy],
      { cwd: ROOT, encoding: "utf-8" },
    );
    if (r.status !== 0) {
      fail(
        "bootstrap",
        `tsx compile-fixture failed (status ${r.status})\n${r.stderr || r.stdout}`,
      );
      return;
    }
    process.stdout.write(`  ok  compiled ${outPy} (${readFileSync(outPy).length} bytes)\n`);

    // Run the bootstrapper twice in the same dir to assert idempotence.
    const outDir = path.join(tmp, "workspace");
    const run1 = spawnSync("python3", [outPy, "--out", outDir], { encoding: "utf-8" });
    if (run1.status !== 0) {
      fail("bootstrap", `First unpack failed:\n${run1.stderr || run1.stdout}`);
      return;
    }
    if (!run1.stdout.includes("write")) {
      fail("bootstrap", `Expected at least one write on first run. Output:\n${run1.stdout}`);
    } else {
      process.stdout.write(`  ok  first unpack produced writes\n`);
    }

    const run2 = spawnSync("python3", [outPy, "--out", outDir], { encoding: "utf-8" });
    if (run2.status !== 0) {
      fail("bootstrap", `Second unpack failed:\n${run2.stderr || run2.stdout}`);
      return;
    }
    if (run2.stdout.includes("write ")) {
      fail("bootstrap", `Second unpack was NOT idempotent. Output:\n${run2.stdout}`);
    } else {
      process.stdout.write(`  ok  second unpack idempotent (no writes)\n`);
    }

    // Verify the expected files exist and a campaign JSON was materialised.
    const expected = [
      "README.md",
      "campaigns/fixture-launch.json",
      ".kinform-bootstrap.json",
    ];
    for (const rel of expected) {
      if (!existsSync(path.join(outDir, rel))) {
        fail("bootstrap", `Expected file missing after unpack: ${rel}`);
      } else {
        process.stdout.write(`  ok  materialised ${rel}\n`);
      }
    }

    // Spot-check the campaign JSON content.
    const camp = JSON.parse(
      readFileSync(path.join(outDir, "campaigns/fixture-launch.json"), "utf-8"),
    );
    if (camp.status !== "APPROVED" || !camp.approved_by) {
      fail(
        "bootstrap",
        `Materialised campaign must be APPROVED with approver. Got status=${camp.status} approved_by=${camp.approved_by}`,
      );
    } else {
      process.stdout.write(`  ok  campaign APPROVED by ${camp.approved_by}\n`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
if (failures.length > 0) {
  process.stderr.write(`\n✗ governance check failed (${failures.length} issue(s)):\n`);
  for (const f of failures) {
    process.stderr.write(`  [${f.area}] ${f.message}\n`);
  }
  process.exit(1);
}
process.stdout.write("\n✓ governance check passed\n");
