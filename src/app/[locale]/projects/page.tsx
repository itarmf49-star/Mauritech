import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { projects as fallbackProjects, networkingProjects, networkingProjectSlugs } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import type { ProjectTranslation } from "@prisma/client";
import type { Localized } from "@/types/content";

export const dynamic = "force-dynamic";

const projectsListInclude = {
  translations: true,
  images: { orderBy: { createdAt: "desc" as const }, take: 1 },
} satisfies Prisma.ProjectInclude;

type ProjectListRow = Prisma.ProjectGetPayload<{ include: typeof projectsListInclude }>;

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: t(locale, "navProjects"),
    description: t(locale, "metaDescription"),
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  let rows: ProjectListRow[] = [];
  try {
    rows = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: "desc" },
      include: projectsListInclude,
      take: 200,
    });
  } catch {
    rows = [];
  }

  const dbItems = rows.map((p: ProjectListRow) => {
    const tr =
      p.translations.find((x: ProjectTranslation) => x.locale === locale) ??
      p.translations.find((x: ProjectTranslation) => x.locale === "en") ??
      null;

    // تحويل البيانات من DB لتتطابق مع هيكل Localized
    const localizedTitle: Localized = {
      fr: (tr?.title || (typeof p.title === 'string' ? p.title : (p.title as any)?.fr) || p.slug),
      ar: ((p.title as any)?.ar || ""),
    };

    const localizedCategory: Localized = {
      fr: (typeof p.category === 'string' ? p.category : (p.category as any)?.fr || "Project"),
      ar: ((p.category as any)?.ar || "مشروع"),
    };

    return {
      id: p.id,
      slug: p.slug,
      title: localizedTitle,
      category: localizedCategory,
      description: { fr: tr?.description ?? "", ar: "" },
      summary: { fr: tr?.description ?? "", ar: "" },
      overview: { fr: tr?.description ?? "", ar: "" },
      problem: { fr: "", ar: "" },
      solution: { fr: "", ar: "" },
      technologies: [],
      scope: [],
      outcome: { fr: "", ar: "" },
      gallery: [],
      image: p.images[0]?.url ?? (p as any).imageUrl ?? "/images/hero-en.svg",
      youtubeId: (p as any).videoUrl ?? "",
    };
  });

  const bySlug = new Map<string, (typeof fallbackProjects)[number]>();
  
  // إضافة المشاريع المحلية
  for (const item of networkingProjects) {
    bySlug.set(item.slug, item);
  }
  
  // دمج مشاريع قاعدة البيانات
  for (const item of dbItems) {
    if (networkingProjectSlugs.has(item.slug) && !bySlug.has(item.slug)) {
      bySlug.set(item.slug, item as (typeof fallbackProjects)[number]);
    }
  }
  
  const items = Array.from(bySlug.values());

  return (
    <>
      <section className="container section">
        <h1 className="h1">{t(locale, "navProjects")}</h1>
        <p className="muted">{t(locale, "metaDescription")}</p>
      </section>
      <ProjectsGrid items={items} locale={locale} />
    </>
  );
}
