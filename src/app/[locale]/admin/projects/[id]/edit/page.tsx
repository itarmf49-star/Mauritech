import Link from "next/link";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import type { ProjectImage, ProjectTranslation } from "@prisma/client";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string; id: string }> };

export default async function AdminEditProjectPage({ params }: PageProps) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  let project: Awaited<ReturnType<typeof prisma.project.findUnique>>;
  try {
    project = await prisma.project.findUnique({
      where: { id },
      include: {
        translations: true,
        images: { orderBy: { createdAt: "desc" } },
      },
    });
  } catch {
    project = null;
  }

  if (!project) {
    return (
      <section className="admin-page">
        <h1 className="h1">Project not found</h1>
        <Link className="inline-link" href={`/${locale}/admin/projects`}>
          {t(locale, "common.backToHome")}
        </Link>
      </section>
    );
  }

  const mapTr = (loc: string) =>
    (project.translations as ProjectTranslation[]).find((tr: ProjectTranslation) => tr.locale === loc) ?? null;

  return (
    <section className="admin-page">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <h1 className="h1">{t(locale, "adminProjects")}</h1>
        <Link className="btn btn-ghost btn-md" href={`/${locale}/admin/projects`}>
          {t(locale, "common.backToHome")}
        </Link>
      </div>

      <p className="muted">Edit translations and images.</p>

      <ProjectForm
        locale={locale as "en" | "fr" | "ar"}
        initial={{
          id: project.id,
          slug: project.slug,
          category: project.category,
          isPublished: project.isPublished,
          translations: {
            en: mapTr("en") ? { title: mapTr("en")!.title, description: mapTr("en")!.description } : undefined,
            fr: mapTr("fr") ? { title: mapTr("fr")!.title, description: mapTr("fr")!.description } : undefined,
            ar: mapTr("ar") ? { title: mapTr("ar")!.title, description: mapTr("ar")!.description } : undefined,
          },
          images: (project.images as ProjectImage[]).map((img: ProjectImage) => ({ id: img.id, url: img.url })),
        }}
      />
    </section>
  );
}

