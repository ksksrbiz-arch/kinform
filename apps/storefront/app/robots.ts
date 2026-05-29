import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the production portal out of search indexes
        disallow: ["/atelier/", "/api/"],
      },
    ],
    sitemap: "https://kinform.studio/sitemap.xml",
    host: "https://kinform.studio",
  };
}
