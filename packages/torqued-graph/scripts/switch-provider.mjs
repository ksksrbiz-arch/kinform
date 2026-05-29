#!/usr/bin/env node
/**
 * Switch the Prisma datasource provider line atomically.
 *
 * Usage:
 *   node scripts/switch-provider.mjs sqlite
 *   node scripts/switch-provider.mjs postgresql
 *
 * Prisma does not allow env-driven datasource providers, so we maintain this
 * one-line rewrite as the supported escape hatch for dev/prod parity.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ALLOWED = new Set(["sqlite", "postgresql"]);
const target = process.argv[2];

if (!ALLOWED.has(target)) {
  console.error(
    `Unknown provider "${target}". Use one of: ${[...ALLOWED].join(", ")}`,
  );
  process.exit(2);
}

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(here, "..", "prisma", "schema.prisma");
const original = readFileSync(schemaPath, "utf8");

const replaced = original.replace(
  /provider\s*=\s*"(sqlite|postgresql|mysql|sqlserver|cockroachdb|mongodb)"/,
  `provider = "${target}"`,
);

if (replaced === original) {
  console.error("No datasource provider line found to replace.");
  process.exit(1);
}

writeFileSync(schemaPath, replaced);
console.log(`Prisma datasource provider set to "${target}".`);
console.log("Remember to update DATABASE_URL accordingly and re-run migrations.");
