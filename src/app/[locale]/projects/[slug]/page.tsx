import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { VideoEmbed } from "@/components/sections/video-embed";
import { defaultLocale, isLocale, localePath, locales, t, type Locale } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import type { ProjectImage, ProjectTranslation } from "@prisma/client";

export const dynamic = "force-dynamic";

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
  const { slug, locale: raw } = params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  try {
    const project: ProjectMetaPayload | null = await prisma.project.findUnique({
      where: { slug },
      include: projectMetaInclude,
    });

    if (!project) {
      return { title: t(locale, "project.notFound") };
    }

    const tr =
      (project.translations as ProjectTranslation[]).find((x: ProjectTranslation) => x.locale === locale) ??
      (project.translations as ProjectTranslation[]).find((x: ProjectTranslation) => x.locale === "en") ??
      null;

    return {
      title: tr?.title ?? project.title ?? project.slug,
      description: tr?.description ?? project.description ?? "",
    };
  } catch {
    return { title: t(locale, "navProjects"), description: t(locale, "metaDescription") };
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug, locale: raw } = params;
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
        name: fallback.title,
        description: fallback.description,
        image: fallback.image,
        about: fallback.category,
      };
      return (
        <article className="container section">
          <section className="section" style={{ paddingTop: 0 }} aria-labelledby="project-hero">
            <p className="eyebrow">{fallback.category}</p>
            {fallback.badge ? <p className="project-badge">{fallback.badge}</p> : null}
            <h1 id="project-hero" className="h1">
              {fallback.title}
            </h1>
            <p className="muted">{fallback.overview}</p>
            <p style={{ marginTop: "0.75rem", fontSize: "1.05rem", maxWidth: "52rem", lineHeight: 1.55 }}>
              {fallback.summary}
            </p>
          </section>
          {fallback.teamHighlight ? (
            <section className="section" style={{ paddingTop: 0 }}>
              <div className="project-team-highlight">
                <p style={{ margin: 0, lineHeight: 1.55 }}>{fallback.teamHighlight}</p>
              </div>
            </section>
          ) : null}
          <section className="section" style={{ paddingTop: 0 }} aria-labelledby="project-site-photos">
            <h2 id="project-site-photos" className="h2">
              Site photography
            </h2>
            <div className="card-grid">
              {fallback.gallery.map((src, idx) => (
                <div
                  key={src}
                  className="card project-gallery-item"
                  style={{ animationDelay: `${Math.min(idx * 0.055, 0.95)}s` }}
                >
                  <Image src={src} alt={fallback.title} width={1200} height={700} sizes="(max-width: 1200px) 100vw, 1200px" />
                  {fallback.galleryCaptions?.[idx] ? (
                    <p className="project-gallery-caption">{fallback.galleryCaptions[idx]}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="card-grid">
              <article className="card">
                <h2 className="h2">Project overview</h2>
                <p>{fallback.overview}</p>
              </article>
              <article className="card">
                <h2 className="h2">Problem</h2>
                <p>{fallback.problem}</p>
              </article>
              <article className="card">
                <h2 className="h2">Solution</h2>
                <p>{fallback.solution}</p>
              </article>
              <article className="card">
                <h2 className="h2">Technologies used</h2>
                <p>{fallback.technologies.join(" • ")}</p>
              </article>
              <article className="card">
                <h2 className="h2">Deployment scope</h2>
                <p>{fallback.scope.join(" • ")}</p>
              </article>
              <article className="card">
                <h2 className="h2">Results and outcome</h2>
                <p>{fallback.outcome}</p>
              </article>
            </div>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <Link className="btn btn-primary btn-md" href={`/${locale}/contact`}>
                {isIpbx ? "Request IPBX Consultation" : "Start a similar project"}
              </Link>
              <Link className="btn btn-ghost btn-md" href={localePath(locale, "/projects")}>
                Back to projects
              </Link>
            </div>
            {isIpbx ? (
              <div className="cta-glass" style={{ marginTop: "1rem" }}>
                <div>
                  <h2 className="h2">Deploy modern business telephony with MauriTech</h2>
                  <p className="muted">
                    From office desk phones and internal routing to secure SIP and IPBX management, MauriTech delivers
                    complete enterprise telephony infrastructure.
                  </p>
                </div>
                <div className="cta-actions">
                  <Link className="btn btn-primary btn-md" href={`/${locale}/contact`}>
                    Request IPBX Consultation
                  </Link>
                </div>
              </div>
            ) : null}
          </section>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
        </article>
      );
    }
    return (
      <article className="container section">
        <h1 className="h1">{t(locale, "project.notFound")}</h1>
        <p className="muted">{t(locale, "project.notFoundHint")}</p>
        <p>
          <Link className="inline-link" href={localePath(locale, "/")}>
            {t(locale, "common.backToHome")}
          </Link>
        </p>
      </article>
    );
  }

  const tr =
    (project.translations as ProjectTranslation[]).find((x: ProjectTranslation) => x.locale === locale) ??
    (project.translations as ProjectTranslation[]).find((x: ProjectTranslation) => x.locale === "en") ??
    null;

  const title = tr?.title ?? project.title ?? project.slug;
  const description = tr?.description ?? project.description ?? "";
  const galleryImages = (project.images as ProjectImage[]).map((img: ProjectImage) => img.url).filter(Boolean);

  const videoHash = "#project-video";
  const videoHref = `${localePath(locale, `/projects/${project.slug}`)}${videoHash}`;
  const youtubeId = project.videoUrl ?? "";
  const videoThumbnail = youtubeId ? `https://i.ytimg.com/vi_webp/${youtubeId}/maxresdefault.webp` : null;
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    image: galleryImages[0] ?? videoThumbnail ?? undefined,
    about: t(locale, "project.title"),
  };

  return (
    <article className="container section">
      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="project-hero">
        <p className="eyebrow">{t(locale, "project.title")}</p>
        <h1 id="project-hero" className="h1">
          {title}
        </h1>
        <p className="muted">{description}</p>

        <div className="hero-actions" style={{ marginTop: "1rem" }}>
          {youtubeId ? (
            <Link className="btn btn-primary btn-md" href={videoHref}>
              {t(locale, "project.playVideo")}
            </Link>
          ) : null}
          <Link className="btn btn-ghost btn-md" href={localePath(locale, "/")}>
            {t(locale, "common.backToHome")}
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="project-gallery" style={{ paddingTop: 0 }}>
        <h2 id="project-gallery" className="h2">
          {t(locale, "project.gallery")}
        </h2>
        <div className="card-grid">
          {galleryImages.map((src) => (
            <div key={src} className="card">
              <Image
                src={src}
                alt={title}
                width={1200}
                height={700}
                priority={false}
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          ))}
          {videoThumbnail ? (
            <div className="card">
              <Image
                src={videoThumbnail}
                alt={`${t(locale, "project.videoAlt")}: ${title}`}
                width={1200}
                height={700}
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="section" aria-labelledby="project-content" style={{ paddingTop: 0 }}>
        <div className="card-grid">
          <article className="card">
            <h2 className="h2">Overview</h2>
            <p className="muted">{description}</p>
          </article>
          <article className="card">
            <h2 className="h2">Problem</h2>
            <p className="muted">Operational and security constraints required a robust and scalable deployment model.</p>
          </article>
          <article className="card">
            <h2 className="h2">Solution</h2>
            <p className="muted">MauriTech delivered a production-grade architecture with secure rollout and monitoring workflows.</p>
          </article>
        </div>
      </section>

      <section className="section" aria-labelledby="project-video" style={{ paddingTop: 0 }}>
        {youtubeId ? (
          <>
            <h2 id="project-video" className="h2">
              {t(locale, "projectVideo")}
            </h2>
            <VideoEmbed videoId={youtubeId} title={title} locale={locale} />
          </>
        ) : null}
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="cta-glass">
          <div>
            <h2 className="h2">Need a similar deployment?</h2>
            <p className="muted">MauriTech designs and executes secure infrastructure programs from planning to go-live support.</p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-primary btn-md" href={`/${locale}/contact`}>
              Contact MauriTech
            </Link>
            <Link className="btn btn-ghost btn-md" href={`/${locale}/projects`}>
              View more projects
            </Link>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
    </article>
  );
}

