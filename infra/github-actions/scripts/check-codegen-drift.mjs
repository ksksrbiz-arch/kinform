#!/usr/bin/env node
/**
 * Codegen drift check.
 *
 * Regenerates `apps/persona-genai/openapi.json` and
 * `packages/shared/src/generated/persona-api.ts` into temp files, then diffs
 * them against the committed copies. Fails with an actionable message if
 * either file is stale so CI can block merges that forget to run
 * `npm run gen:types`.
 */
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const REPO = resolve(new URL("../../..", import.meta.url).pathname);
const COMMITTED_OPENAPI = join(REPO, "apps/persona-genai/openapi.json");
const COMMITTED_TS = join(REPO, "packages/shared/src/generated/persona-api.ts");

const tmp = mkdtempSync(join(tmpdir(), "kinform-codegen-"));
const freshOpenapi = join(tmp, "openapi.json");
const freshTs = join(tmp, "persona-api.ts");

function run(cmd, opts = {}) {
    return execSync(cmd, { cwd: REPO, stdio: ["ignore", "pipe", "pipe"], ...opts }).toString();
}

try {
    const dump = run("python3 -m kinform_persona.openapi_dump", {
        cwd: join(REPO, "apps/persona-genai"),
    });
    writeFileSync(freshOpenapi, dump);

    run(`npx --no-install openapi-typescript "${freshOpenapi}" -o "${freshTs}"`);

    const expectedOpenapi = readFileSync(COMMITTED_OPENAPI, "utf8");
    const expectedTs = readFileSync(COMMITTED_TS, "utf8");
    const actualOpenapi = readFileSync(freshOpenapi, "utf8");
    const actualTs = readFileSync(freshTs, "utf8");

    let drift = false;
    if (expectedOpenapi.trim() !== actualOpenapi.trim()) {
        console.error("[codegen-drift] apps/persona-genai/openapi.json is stale.");
        drift = true;
    }
    if (expectedTs.trim() !== actualTs.trim()) {
        console.error("[codegen-drift] packages/shared/src/generated/persona-api.ts is stale.");
        drift = true;
    }

    if (drift) {
        console.error("\nFix: run `npm run gen:types` and commit the regenerated files.");
        process.exit(1);
    }
    console.log("[codegen-drift] OK — OpenAPI spec and generated TS types are up to date.");
} finally {
    rmSync(tmp, { recursive: true, force: true });
}
