import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { DynamicContentManager } from "@/components/admin/dynamic-content-manager";
import { ShopContentManager } from "@/components/admin/shop-content-manager";
import { AmazonCMS } from "@/components/admin/amazon-cms";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AdminContentPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <section className="admin-page">
      <h1 className="h1">
        {locale === "fr" ? "Contenu du Site" : "محتوى الموقع"}
      </h1>
      <p className="muted mb-8">
        {locale === "fr" 
          ? "Gerez le contenu dynamique du site public" 
          : "إدارة المحتوى الديناميكي للموقع العام"}
      </p>

      <div className="space-y-8">
        <AmazonCMS locale={locale as "fr" | "ar"} />
        <DynamicContentManager locale={locale as "fr" | "ar"} />
        <ShopContentManager locale={locale as "fr" | "ar"} />
      </div>
    </section>
  );
}