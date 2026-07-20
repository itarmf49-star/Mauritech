import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { VideoEmbed } from "@/components/sections/video-embed";
import { defaultLocale, isLocale, localePath, locales, t, type Locale } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import type { ProjectImage, ProjectTranslation, Localized } from "@/types/content";

export const dynamic = "force-dynamic";

// دالة آمنة لاستخراج النص المترجم وتجنب أخطاء النوع
function getTxt(obj: Localized | string | undefined, locale: string): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return (obj[locale] || obj["fr"] || "") as string;
}

const projectMetaInclude = { translations: true } satisfies Prisma.ProjectInclude;
type ProjectMetaPayload = Prisma.ProjectGetPayload<{ include: typeof projectMetaInclude }>;

const projectDetailInclude = {
  translations: true,
  images: { orderBy: { createdAt: "desc" as const } },
} satisfies Prisma.ProjectInclude;
type ProjectDetailPayload = Prisma.ProjectGetPayload<{ include: typeof projectDetailInclude }>;

type ProjectPageProps = {
  params: { locale: string; slug: string };
};

export async function generateStaticParams() {
  try {
    const slugs = await prisma.project.findMany({
      where: { isPublished: true },
      select: { slug: true },
      take: 500,
    });
    return locales.flatMap((locale) => slugs.map((p: { slug: string }) => ({ locale, slug: p.slug })));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  try {
    const project: ProjectMetaPayload | null = await prisma.project.findUnique({
      where: { slug },
      include: projectMetaInclude,
    });

    if (!project) return { title: t(locale, "project.notFound") };

    const tr = (project.translations as ProjectTranslation[]).find((x: any) => x.locale === locale);
    return {
      title: tr?.title ?? (typeof project.title === 'string' ? project.title : (project.title as any)?.[locale] ?? project.slug),
      description: tr?.description ?? (typeof project.description === 'string' ? project.description : (project.description as any)?.[locale] ?? ""),
    };
  } catch {
    return { title: t(locale, "navProjects"), description: t(locale, "metaDescription") };
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug, locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  let project: ProjectDetailPayload | null;
  try {
    project = await prisma.project.findUnique({
      where: { slug },
      include: projectDetailInclude,
    });
  } catch {
    project = null;
  }

  if (!project) {
    const fallback = getProjectBySlug(slug);
    if (fallback) {
      const isIpbx = fallback.slug === "enterprise-ipbx-office-voip-deployment";
      const projectSchema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: getTxt(fallback.title, locale),
        description: getTxt(fallback.description, locale),
        image: fallback.image,
        about: getTxt(fallback.category, locale),
      };
      
      return (
        <article className="container section">
          <section className="section" style={{ paddingTop: 0 }} aria-labelledby="project-hero">
            <p className="eyebrow">{getTxt(fallback.category, locale)}</p>
            {fallback.badge ? <p className="project-badge">{getTxt(fallback.badge, locale)}</p> : null}
            <h1 id="project-hero" className="h1">{getTxt(fallback.title, locale)}</h1>
            <p className="muted">{getTxt(fallback.overview, locale)}</p>
            <p style={{ marginTop: "0.75rem", fontSize: "1.05rem", maxWidth: "52rem", lineHeight: 1.55 }}>
              {getTxt(fallback.summary, locale)}
            </p>
          </section>
          
          {fallback.teamHighlight ? (
            <section className="section" style={{ paddingTop: 0 }}>
              <div className="project-team-highlight">
                <p style={{ margin: 0, lineHeight: 1.55 }}>{getTxt(fallback.teamHighlight, locale)}</p>
              </div>
            </section>
          ) : null}

          <section className="section" style={{ paddingTop: 0 }} aria-labelledby="project-site-photos">
            <h2 id="project-site-photos" className="h2">{t(locale, "project.gallery")}</h2>
            <div className="card-grid">
              {fallback.gallery.map((src, idx) => (
                <div key={src} className="card project-gallery-item" style={{ animationDelay: `${Math.min(idx * 0.055, 0.95)}s` }}>
                  <Image src={src} alt={getTxt(fallback.title, locale)} width={1200} height={700} sizes="(max-width: 1200px) 100vw, 1200px" />
                  {fallback.galleryCaptions?.[idx] ? <p className="project-gallery-caption">{fallback.galleryCaptions[idx]}</p> : null}
                </div>
              ))}
            </div>
          </section>

          <section className="section" style={{ paddingTop: 0 }}>
            <div className="card-grid">
              <article className="card"><h2 className="h2">Overview</h2><p>{getTxt(fallback.overview, locale)}</p></article>
              <article className="card"><h2 className="h2">Problem</h2><p>{getTxt(fallback.problem, locale)}</p></article>
              <article className="card"><h2 className="h2">Solution</h2><p>{getTxt(fallback.solution, locale)}</p></article>
              <article className="card"><h2 className="h2">Technologies</h2><p>{fallback.technologies.join(" • ")}</p></article>
              <article className="card"><h2 className="h2">Scope</h2><p>{fallback.scope.join(" • ")}</p></article>
              <article className="card"><h2 className="h2">Outcome</h2><p>{getTxt(fallback.outcome, locale)}</p></article>
            </div>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <Link className="btn btn-primary btn-md" href={`/${locale}/contact`}>{isIpbx ? "Request IPBX Consultation" : "Start a similar project"}</Link>
              <Link className="btn btn-ghost btn-md" href={localePath(locale, "/projects")}>Back to projects</Link>
            </div>
          </section>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
        </article>
      );
    }
    return (
      <article className="container section">
        <h1 className="h1">{t(locale, "project.notFound")}</h1>
        <p><Link href={localePath(locale, "/")}>{t(locale, "common.backToHome")}</Link></p>
      </article>
    );
  }

  return (
    <article className="container section">
       {/* تم تطبيق getTxt هنا لضمان استقرار العرض من قاعدة البيانات */}
       <h1 className="h1">{getTxt(project.title as any, locale)}</h1>
    </article>
  );
}
