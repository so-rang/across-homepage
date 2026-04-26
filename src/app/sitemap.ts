import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://across.center";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/contents",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const blogRoutes = getAllBlogSlugs().map((slug) => ({
    url: `${SITE_URL}/contents/posts/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...blogRoutes,
  ];
}
