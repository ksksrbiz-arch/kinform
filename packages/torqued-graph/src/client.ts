/**
 * Singleton Prisma client.
 *
 * Next.js dev mode hot-reloads modules, which would otherwise leak Prisma
 * client instances. We stash the instance on `globalThis` in non-production
 * environments so HMR reuses it.
 */
import { PrismaClient } from "../prisma/generated/client";

declare global {
  // eslint-disable-next-line no-var
  var __kinformPrisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__kinformPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__kinformPrisma = prisma;
}

export type { PrismaClient } from "../prisma/generated/client";
