import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/dev" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
