/**
 * Thin client for the PersonaGenAI FastAPI service.
 *
 * Used by the Payload Studio UI and the /api/persona proxy route.
 */

const BASE = process.env.NEXT_PUBLIC_PERSONA_GENAI_URL ?? "http://localhost:8000";

export interface CampaignBrief {
  slug: string;
  title: string;
  audience: string;
  product_category: string;
  drop_slug?: string;
  extra_hashtags?: string[];
  creative_seed?: string;
}

export interface SimulationReport {
  draft: {
    slug: string;
    title: string;
    content: string;
    hashtags: string[];
    cta: { verb: string; url: string; label: string };
    rationale: string;
  };
  governance: {
    ok: boolean;
    rules_version: string;
    violations: { code: string; message: string; field: string }[];
    warnings: string[];
  };
  analytics: {
    predicted_ctr: number;
    predicted_reach: number;
    risk_score: number;
    notes: string;
  };
  promotable: boolean;
  campaign_id?: string | null;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`PersonaGenAI ${path} → ${r.status}: ${text}`);
  }
  return (await r.json()) as T;
}

export function preview(brief: CampaignBrief): Promise<SimulationReport> {
  return call("/campaigns/preview", { method: "POST", body: JSON.stringify(brief) });
}

export function simulate(brief: CampaignBrief): Promise<SimulationReport> {
  return call("/campaigns/simulate", { method: "POST", body: JSON.stringify(brief) });
}

export function approve(campaign_id: string, approver: string, decision: "approve" | "reject", note = "") {
  return call("/campaigns/approve", {
    method: "POST",
    body: JSON.stringify({ campaign_id, approver, decision, note }),
  });
}

export function health(): Promise<{ status: string; rules_version: string }> {
  return call("/health");
}
