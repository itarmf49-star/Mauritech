import Link from "next/link";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { deleteProject, createProject } from "@/actions/admin-actions";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AdminProjectsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const rows = await prisma.project.findMany({
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

  return (
    <section className="admin-page">
      <h1 className="h1">{t(locale, "adminProjects")}</h1>
      <p className="muted">{t(locale, "adminPublishedEntries")}</p>

      {/* نموذج إضافة مشروع جديد سريع */}
      <div style={{ background: "#111827", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem", border: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 style={{ color: "white", marginBottom: "1rem", fontSize: "1.1rem" }}>Add New Project</h3>
        <form action={createProject} style={{ display: "flex", gap: "10px" }}>
          <input 
            name="slug" 
            placeholder="Project Slug (e.g. mauri-project)" 
            required 
            style={{ padding: "0.6rem", borderRadius: "6px", flex: 1, background: "#000", color: "#fff", border: "1px solid #333" }}
          />
          <input 
            name="category" 
            placeholder="Category" 
            style={{ padding: "0.6rem", borderRadius: "6px", flex: 1, background: "#000", color: "#fff", border: "1px solid #333" }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: "0.6rem 1.5rem" }}>Add</button>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const title = p.translations.find((tr) => tr.locale === locale)?.title ?? 
                            p.translations.find((tr) => tr.locale === "en")?.title ?? p.slug;
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
                    <Link className="inline-link" href={`/${locale}/projects#project-${p.slug}`}>
                      {t(locale, "adminView")}
                    </Link>
                  </td>
                  <td style={{ display: "flex", gap: "10px" }}>
                    <Link className="inline-link" href={`/${locale}/admin/projects/${p.id}/edit`}>Edit</Link>
                    <form action={deleteProject.bind(null, p.id)}>
                      <button 
                        type="submit" 
                        className="inline-link" 
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                        onClick={(e) => !confirm("Are you sure?") && e.preventDefault()}
                      >
                        Delete
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
