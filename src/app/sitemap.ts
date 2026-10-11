import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes = ["/", "/about", "/concession", "/licence", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
