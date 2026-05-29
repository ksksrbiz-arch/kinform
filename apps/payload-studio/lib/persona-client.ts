/**
 * Thin fetch client for the PersonaGenAI FastAPI service.
 *
 * Lives in the browser — uses NEXT_PUBLIC_PERSONA_GENAI_URL. No SDK, no
 * react-query, no axios. Hard fails on non-2xx so the Studio surface can
 * decide how to render the error.
 */

import type { Campaign, CampaignChannel, SimulationVerdict } from "./types";

export interface GenerateRequest {
  dropId: string;
  days?: number;
  channel?: CampaignChannel;
  forceRegenerate?: boolean;
}

export interface GenerateResponse {
  simulationId: string;
  campaignId: string;
  status: string;
  draft: {
    title: string;
    content: string;
    ctas: string[];
    hashtags: string[];
    tone: string;
  };
  validation: { passed: boolean; errors: string[] };
  campaign: Campaign;
}

const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PERSONA_GENAI_URL) ||
  "http://localhost:8088";

async function call<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `PersonaGenAI ${init.method ?? "GET"} ${path} → ${res.status}: ${text}`,
    );
  }
  return (await res.json()) as T;
}

export const persona = {
  health(): Promise<{ status: string; llm_provider: string }> {
    return call("/health");
  },
  createDraft(opts: {
    slug: string;
    drop_id?: string | null;
    channel: CampaignChannel;
  }): Promise<{ campaign: Campaign }> {
    return call("/campaigns", {
      method: "POST",
      body: JSON.stringify(opts),
    });
  },
  simulate(
    id: string,
    opts: { seed?: string | null } = {},
  ): Promise<{ campaign: Campaign; final_verdict: SimulationVerdict }> {
    return call(`/campaigns/${id}/simulate`, {
      method: "POST",
      body: JSON.stringify({ seed: opts.seed ?? null }),
    });
  },
  approve(
    id: string,
    approver: string,
  ): Promise<{ campaign: Campaign }> {
    return call(`/campaigns/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ approver }),
    });
  },
  publish(id: string): Promise<{ campaign: Campaign }> {
    return call(`/campaigns/${id}/publish`, { method: "POST" });
  },
  reject(id: string, reason: string): Promise<{ campaign: Campaign }> {
    return call(`/campaigns/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
  get(id: string): Promise<{ campaign: Campaign }> {
    return call(`/campaigns/${id}`);
  },
  /**
   * One-shot create + simulate. See PersonaGenAI integration plan §3.1.
   * The server auto-generates a unique slug per (drop, channel, minute).
   */
  generate(opts: GenerateRequest): Promise<GenerateResponse> {
    return call("/campaigns/generate", {
      method: "POST",
      body: JSON.stringify({
        dropId: opts.dropId,
        days: opts.days ?? 14,
        channel: opts.channel ?? "instagram",
        forceRegenerate: opts.forceRegenerate ?? false,
      }),
    });
  },
};
