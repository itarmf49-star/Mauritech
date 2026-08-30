import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { WhatsAppChatInterface } from "@/components/admin/whatsapp-chat-interface";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AdminWhatsAppPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <section className="admin-page">
      <h1 className="h1">WhatsApp</h1>
      <p className="muted mb-8">
        {locale === "fr" 
          ? "Communiquez avec vos clients via WhatsApp" 
          : "تواصل مع عملائك عبر واتساب"}
      </p>

      <WhatsAppChatInterface locale={locale as "fr" | "ar"} />
    </section>
  );
}