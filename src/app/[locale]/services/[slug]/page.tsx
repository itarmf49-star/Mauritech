import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { defaultLocale, isLocale, localePath, t, type Locale } from "@/lib/i18n";
import { VideoShowcase } from "@/components/services/video-showcase";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function ServiceDetailPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const service = await prisma.service.findUnique({ where: { slug, isActive: true } });
  if (!service) notFound();

  const title = locale === "ar" ? service.titleAr : service.titleFr;
  const description = locale === "ar" ? service.descriptionAr : service.descriptionFr;
  const features = (locale === "ar" ? service.featuresAr : service.featuresFr) || [];
  const videos = (service.videos as string[]) || [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: description || undefined,
    provider: { "@type": "Organization", name: "MauriTech", url: "https://mauritech.tech" },
    areaServed: "Mauritania",
  };

  return (
    <main className="min-h-screen bg-[#EAEDED] py-8">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <Link href={localePath(locale, "/services")} className="text-[#007185] text-sm font-semibold hover:underline">
          ‹ {t(locale, "navServices")}
        </Link>

        <div className="mt-4 flex items-start gap-4">
          {service.icon && <span className="text-4xl">{service.icon}</span>}
          <div>
            <h1 className="text-3xl font-black text-gray-900">{title}</h1>
            {description && <p className="text-gray-500 mt-2 max-w-2xl">{description}</p>}
          </div>
        </div>

        {videos.length > 0 ? (
          <div className="mt-8">
            <VideoShowcase items={videos.map((url) => ({ url, title }))} />
          </div>
        ) : service.image ? (
          <div className="mt-8 rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={service.image} alt={title} className="w-full max-h-[420px] object-cover" />
          </div>
        ) : null}

        {features.length > 0 && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t(locale, "howItWorksTitle")}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={localePath(locale, `/contact?intent=consultation&service=${service.slug}`)}
            className="px-6 py-3 rounded-full bg-[#FFA41C] hover:bg-[#FA8900] text-black font-bold text-sm transition"
          >
            {t(locale, "heroFreeConsultation")}
          </Link>
          <Link
            href={localePath(locale, "/contact")}
            className="px-6 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm transition"
          >
            {t(locale, "navContactLink")}
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
