/**
 * Fixture compiler — used by governance-check.mjs to drive the real
 * Polymorphic Bootstrapping Compiler end-to-end without a running browser.
 *
 * Usage: tsx compile-fixture.mts <output-path.py>
 */

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");

const { compileBootstrapper } = await import(
  path.join(ROOT, "apps/payload-studio/lib/bootstrap-compiler.ts")
);

const out = process.argv[2];
if (!out) {
  console.error("usage: tsx compile-fixture.mts <output-path.py>");
  process.exit(2);
}

const now = new Date().toISOString();
const result = compileBootstrapper({
  files: [
    { path: "README.md", content: "# Fixture workspace\n" },
    { path: "manifest.json", content: '{"brand":"KINFORM"}\n' },
  ],
  campaigns: [
    {
      id: "cam_fixture_0001",
      slug: "fixture-launch",
      status: "APPROVED",
      drop_id: null,
      content: "Drop in. Fixture. Wear the network.",
      ctas: ["Wear the network"],
      hashtags: ["#KINFORM", "#TorquedAffiliation"],
      channel: "instagram",
      approved_by: "ci@kinform.local",
      approved_at: now,
      published_at: null,
      rejected_reason: null,
      created_at: now,
      updated_at: now,
    },
  ],
});

writeFileSync(out, result.script, "utf-8");
console.log(`compiled ${out} (${result.script.length} bytes)`);
