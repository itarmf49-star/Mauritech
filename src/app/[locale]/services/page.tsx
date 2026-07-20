import Link from "next/link";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { getServiceI18n } from "@/lib/service-i18n";
import { services } from "@/lib/content";
import type { Localized } from "@/types/content";

// دالة مساعدة لاستخراج النص بناءً على اللغة
function getTxt(obj: Localized | string | undefined, locale: string): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return (obj[locale] || obj["fr"] || "") as string;
}

type Props = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@type": "Organization", name: "MauriTech", url: "https://mauritech.tech" },
    serviceType: services
      .map((service) => {
        const i18n = getServiceI18n(service.id);
        return i18n ? t(locale, i18n.title) : getTxt(service.title, locale);
      })
      .join(", "),
    areaServed: ["Mauritania"],
  };

  return (
    <section className="container section">
      <p className="eyebrow">{t(locale, "navServices")}</p>
      <h1 className="h1">{t(locale, "servicesTitle")}</h1>
      <p className="muted">{t(locale, "servicesSubtitle")}</p>
      
      <div className="card-grid" style={{ marginTop: "1rem" }}>
        {services.map((service) => {
          const i18n = getServiceI18n(service.id);
          // استخراج النصوص بشكل آمن
          const title = i18n ? t(locale, i18n.title) : getTxt(service.title, locale);
          const description = i18n ? t(locale, i18n.description) : getTxt(service.description, locale);
          
          return (
            <article className="card" key={service.id}>
              <p className="eyebrow">{service.icon}</p>
              <h2 className="h2">{title}</h2>
              <p>{description}</p>
              <Link className="inline-link" href={`/${locale}/services/${service.id}`}>
                {t(locale, "heroFreeConsultation")}
              </Link>
            </article>
          );
        })}
      </div>
      
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} 
      />
    </section>
  );
}
