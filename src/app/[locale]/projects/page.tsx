import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { projects as fallbackProjects } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import type { ProjectTranslation } from "@prisma/client";

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

  const dbItems = rows.map(
    (p: ProjectListRow) => {
    const tr =
      p.translations.find((x: ProjectTranslation) => x.locale === locale) ??
      p.translations.find((x: ProjectTranslation) => x.locale === "en") ??
      null;
    return {
      id: p.id,
      slug: p.slug,
      title: tr?.title ?? p.title ?? p.slug,
      description: tr?.description ?? p.description ?? "",
      summary: tr?.description ?? p.description ?? "",
      overview: tr?.description ?? p.description ?? "",
      problem: "",
      solution: "",
      technologies: [],
      scope: [],
      outcome: "",
      gallery: [],
      image: p.images[0]?.url ?? p.imageUrl ?? "/images/hero-en.svg",
      youtubeId: p.videoUrl ?? "",
      category: p.category ?? "project",
    };
  });
  const bySlug = new Map<string, (typeof fallbackProjects)[number]>();
  for (const item of fallbackProjects) bySlug.set(item.slug, item);
  for (const item of dbItems) {
    if (!bySlug.has(item.slug)) {
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

