import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/content";
import { buildAlternates, SITE_URL } from "@/lib/seo/site";

// hreflang alternates per entry — buildAlternates returns the BCP-47 → URL map
// plus x-default; sitemap.languages expects only locale-keyed entries.
function languagesFor(path: string): Record<string, string> {
  const { languages } = buildAlternates("ko", path);
  return (languages ?? {}) as Record<string, string>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["/", "/contents", "/privacy", "/terms"];

  const slugs = await getAllBlogSlugs();
  const blogRoutes = slugs.map((slug) => {
    const path = `/contents/posts/${slug}`;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: languagesFor(path) },
    };
  });

  return [
    ...staticRoutes.map((path) => ({
      url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages: languagesFor(path) },
    })),
    ...blogRoutes,
  ];
}
