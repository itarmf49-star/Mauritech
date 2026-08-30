import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { InventoryManagement } from "@/components/admin/inventory-management";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AdminInventoryPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <section className="admin-page">
      <h1 className="h1">
        {locale === "fr" ? "Inventaire" : "المخزون"}
      </h1>
      <p className="muted mb-8">
        {locale === "fr" 
          ? "Gerez votre inventaire de produits" 
          : "إدارة مخزون المنتجات"}
      </p>

      <InventoryManagement locale={locale as "fr" | "ar"} />
    </section>
  );
}
