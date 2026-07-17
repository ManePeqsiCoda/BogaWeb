import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? siteConfig.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
