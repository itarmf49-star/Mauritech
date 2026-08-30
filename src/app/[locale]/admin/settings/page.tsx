import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { CompleteAdminSettings } from "@/components/admin/complete-admin-settings";
import { WhatsAppQRPairing } from "@/components/admin/whatsapp-qr-pairing";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AdminSettingsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <section className="admin-page">
      <h1 className="h1">{t(locale, "adminSettings")}</h1>
      <p className="muted mb-8">
        {locale === "fr" 
          ? "Gerez les parametres du site et liez WhatsApp" 
          : "إدارة إعدادات الموقع وربط واتساب"}
      </p>

      <div className="space-y-8">
        <WhatsAppQRPairing locale={locale as "fr" | "ar"} />
        <CompleteAdminSettings locale={locale as "fr" | "ar"} />
      </div>
    </section>
  );
}