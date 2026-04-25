import type { MetadataRoute } from "next";
import { projects, siteConfig } from "@/lib/content";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${siteConfig.siteUrl}/${locale}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [
    {
      url: `${siteConfig.siteUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...locales.flatMap((locale) => [
      { url: `${siteConfig.siteUrl}/${locale}/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
      { url: `${siteConfig.siteUrl}/${locale}/services`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.75 },
      { url: `${siteConfig.siteUrl}/${locale}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${siteConfig.siteUrl}/${locale}/industries`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${siteConfig.siteUrl}/${locale}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    ]),
    ...projectRoutes,
  ];
}
