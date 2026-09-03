import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { defaultLocale, isLocale, localePath, t, type Locale } from "@/lib/i18n";
import { VideoShowcase } from "@/components/services/video-showcase";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const showcaseItems = services
    .flatMap((s) => ((s.videos as string[]) || []).map((url) => ({ url, title: locale === "ar" ? s.titleAr : s.titleFr })))
    .slice(0, 12);

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@type": "Organization", name: "MauriTech", url: "https://mauritech.tech" },
    serviceType: services.map((s) => (locale === "ar" ? s.titleAr : s.titleFr)).join(", "),
    areaServed: ["Mauritania"],
  };

  return (
    <main className="min-h-screen bg-[#EAEDED] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-6">
          <p className="text-[#007185] text-sm font-semibold">{t(locale, "navServices")}</p>
          <h1 className="text-3xl font-black text-gray-900 mt-1">{t(locale, "servicesTitle")}</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">{t(locale, "servicesSubtitle")}</p>
        </div>

        {showcaseItems.length > 0 && (
          <div className="mb-10">
            <VideoShowcase items={showcaseItems} />
          </div>
        )}

        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const title = locale === "ar" ? s.titleAr : s.titleFr;
              const description = locale === "ar" ? s.descriptionAr : s.descriptionFr;
              const videos = (s.videos as string[]) || [];
              return (
                <Link
                  key={s.id}
                  href={localePath(locale, `/services/${s.slug}`)}
                  className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 transition-all duration-300 flex flex-col"
                >
                  <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt={title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-5xl">{s.icon || "🔧"}</span>
                    )}
                    {videos.length > 0 && (
                      <span className="absolute top-3 end-3 bg-gray-900/80 text-white text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        🎬 {videos.length}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {s.icon && <span className="text-2xl mb-1">{s.icon}</span>}
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#007185] transition-colors">{title}</h2>
                    {description && <p className="text-gray-500 text-sm mt-1.5 line-clamp-2">{description}</p>}
                    <span className="text-[#007185] text-sm font-semibold mt-3">{t(locale, "heroFreeConsultation")} ›</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <div className="h-14 w-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300 text-2xl">🔧</div>
            <p className="text-gray-900 font-bold">{t(locale, "shopNoProductsTitle")}</p>
          </div>
        )}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
    </main>
  );
}
