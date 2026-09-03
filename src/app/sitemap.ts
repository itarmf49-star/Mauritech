import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";
import { locales } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await prisma.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }).catch(() => []);

  const serviceRoutes = locales.flatMap((locale) =>
    services.map((s) => ({
      url: `${siteConfig.siteUrl}/${locale}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  );

  return [
    ...locales.map((locale) => ({
      url: `${siteConfig.siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    })),
    ...locales.flatMap((locale) => [
      { url: `${siteConfig.siteUrl}/${locale}/services`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.75 },
      { url: `${siteConfig.siteUrl}/${locale}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${siteConfig.siteUrl}/${locale}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    ]),
    ...serviceRoutes,
  ];
}
