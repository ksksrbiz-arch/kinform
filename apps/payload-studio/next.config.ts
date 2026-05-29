import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Studio talks to PersonaGenAI from the browser, so just pass the URL
  // through. Server-side rendering is unused for the editor itself.
  env: {
    NEXT_PUBLIC_PERSONA_GENAI_URL:
      process.env.NEXT_PUBLIC_PERSONA_GENAI_URL ?? "http://localhost:8088",
  },
};

export default nextConfig;
