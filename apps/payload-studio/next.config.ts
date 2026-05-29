import type { NextConfig } from "next";

/**
 * KINFORM Payload Studio — Next.js 15 config.
 *
 * `transpilePackages` lets us import the shared TS governance module
 * directly from `packages/shared/ts` without a separate build step.
 */
const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kinform/torqued-graph"],
  experimental: {
    typedRoutes: false,
  },
  env: {
    NEXT_PUBLIC_PERSONA_GENAI_URL:
      process.env.NEXT_PUBLIC_PERSONA_GENAI_URL ?? "http://localhost:8000",
  },
};

export default config;
