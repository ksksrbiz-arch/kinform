/**
 * JSON (de)serialisation helpers for fields stored as `String` in the
 * Prisma schema (a necessity on SQLite — see `prisma/schema.prisma` notes).
 *
 * Use `encodeJson` on writes and `decodeJson<T>` on reads. Both helpers
 * tolerate `null` / `undefined` and round-trip cleanly with the Python
 * mirror in `packages/torqued-graph/python/kinform_torqued_graph/json.py`.
 */

export function encodeJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

export function encodeJsonNullable(value: unknown | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return JSON.stringify(value);
}

export function decodeJson<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

export function decodeJsonNullable<T>(raw: string | null | undefined): T | null {
  if (raw === null || raw === undefined) return null;
  return JSON.parse(raw) as T;
}
