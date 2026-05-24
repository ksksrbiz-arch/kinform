import type { MetadataRoute } from "next";

const BASE_URL = "https://kinform.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Home — highest priority
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Collection overview
    {
      url: `${BASE_URL}/designs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Individual design detail pages (under /designs/[slug])
    {
      url: `${BASE_URL}/designs/halter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/designs/fishnet`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/designs/academic`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    // Standalone product landing pages (pre-order funnels)
    {
      url: `${BASE_URL}/halter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/fishnet`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/academic`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Accessories
    {
      url: `${BASE_URL}/accessories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/accessories/earrings`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Brand / editorial
    {
      url: `${BASE_URL}/story`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Trade / business
    {
      url: `${BASE_URL}/wholesale`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${BASE_URL}/request-sample`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Atelier login (public gate — not the protected dashboard)
    {
      url: `${BASE_URL}/atelier/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
