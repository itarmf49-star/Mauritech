import Link from "next/link";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { deleteProject, createProject } from "@/actions/admin-actions";
import { Plus, Eye, Pencil, Trash2, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AdminProjectsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  let rows = [];
  let dbError = null;
  try {
    rows = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: {
        id: true,
        slug: true,
        category: true,
        isPublished: true,
        translations: { select: { locale: true, title: true } },
        images: { select: { url: true }, take: 1, orderBy: { createdAt: "desc" } },
      },
    });
  } catch (error: any) {
    dbError = error;
    // Return empty array if database is unavailable
    rows = [];
  }

  return (
    <section className="admin-page">
      <h1 className="h1">{t(locale, "adminProjects")}</h1>
      <p className="muted">{t(locale, "adminPublishedEntries")}</p>

      {dbError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400">
            {locale === "fr" 
              ? "Erreur de connexion a la base de donnees. Les donnees ne sont pas disponibles." 
              : "خطأ في الاتصال بقاعدة البيانات. البيانات غير متاحة."}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Code: {dbError?.code || "UNKNOWN"}
          </p>
        </div>
      )}

      {/* نموذج إضافة مشروع جديد سريع */}
      <div className="bg-white p-6 rounded-xl border border-yellow-500/30 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Plus className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {locale === "fr" ? "Ajouter un projet" : "إضافة مشروع"}
          </h3>
        </div>
        <form action={createProject} className="flex gap-3">
          <input
            name="slug"
            placeholder={locale === "fr" ? "Slug du projet (ex: mauri-project)" : "معرف المشروع (مثال: mauri-project)"}
            required
            className="flex-1 bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            name="category"
            placeholder={locale === "fr" ? "Categorie" : "الفئة"}
            className="flex-1 bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button type="submit" className="btn btn-primary flex items-center gap-2 px-6">
            <Plus className="w-4 h-4" />
            {locale === "fr" ? "Ajouter" : "إضافة"}
          </button>
        </form>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t(locale, "adminTitle")}</th>
              <th>{t(locale, "adminCategory")}</th>
              <th>{t(locale, "adminPublished")}</th>
              <th>{t(locale, "adminPublic")}</th>
              <th>{t(locale, "adminActions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const title = p.translations.find((tr) => tr.locale === locale)?.title ?? 
                            p.translations.find((tr) => tr.locale === "fr")?.title ?? p.slug;
              const thumb = p.images[0]?.url ?? null;

              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      {thumb ? <img src={thumb} alt="" style={{ width: 44, height: 32, objectFit: "cover", borderRadius: 6 }} /> : null}
                      <div>
                        <div>{title}</div>
                        <div className="muted" style={{ fontSize: "0.85rem" }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.category ?? "-"}</td>
                  <td>{p.isPublished ? t(locale, "adminYes") : t(locale, "adminNo")}</td>
                  <td>
                    <Link 
                      className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition" 
                      href={`/${locale}/projects#project-${p.slug}`}
                    >
                      <Eye className="w-4 h-4" />
                      {t(locale, "adminView")}
                    </Link>
                  </td>
                  <td className="flex items-center gap-2">
                    <Link 
                      className="p-2 hover:bg-yellow-500/20 rounded-lg text-yellow-400 transition" 
                      href={`/${locale}/admin/projects/${p.id}/edit`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <form action={deleteProject.bind(null, p.id)}>
                      <button 
                        type="submit" 
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition"
                        onClick={(e) => !confirm(locale === "fr" ? "Etes-vous sur?" : "هل أنت متأكد؟") && e.preventDefault()}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="muted">{t(locale, "adminNoProjects")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
