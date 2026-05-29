/**
 * Server-side proxy to the PersonaGenAI service. Avoids CORS pain in
 * production deployments where the FastAPI host is internal-only.
 */

import { NextResponse } from "next/server";

const BASE = process.env.PERSONA_GENAI_URL
  ?? process.env.NEXT_PUBLIC_PERSONA_GENAI_URL
  ?? "http://localhost:8000";

async function passthrough(method: "GET" | "POST", path: string, body?: unknown) {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
  });
}

export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const qs = new URL(req.url).search;
  return passthrough("GET", "/" + path.join("/") + qs);
}

export async function POST(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  let body: unknown = undefined;
  try { body = await req.json(); } catch { /* empty body ok */ }
  return passthrough("POST", "/" + path.join("/"), body);
}
