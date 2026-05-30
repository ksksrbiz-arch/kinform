/**
 * KINFORM — Server-side auth helpers
 *
 * Replaces the deprecated middleware.ts pattern.
 * Uses Next.js 16's recommended approach: check auth inline in
 * route handlers and server component layouts.
 */

import { cookies } from "next/headers";

/**
 * Check if the current request has a valid production auth session.
 * Call this at the top of any protected API route handler.
 *
 * Returns a 401 Response if not authenticated, or null if OK.
 */
export async function requireProductionAuth(): Promise<Response | null> {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("kinform_prod_auth")?.value === "true";

  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
