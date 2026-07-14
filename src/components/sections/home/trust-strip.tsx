import { Locale, t } from "@/lib/i18n";

type TrustStripProps = {
  locale: Locale;
};

export function TrustStrip({
  locale,
}: TrustStripProps) {
  const items = [
    {
      title: t(locale, "trustItem1Title"),
      description: t(locale, "trustItem1Description"),
    },
    {
      title: t(locale, "trustItem2Title"),
      description: t(locale, "trustItem2Description"),
    },
    {
      title: t(locale, "trustItem3Title"),
      description: t(locale, "trustItem3Description"),
    },
    {
      title: t(locale, "trustItem4Title"),
      description: t(locale, "trustItem4Description"),
    },
  ];

  return (
    <section
      className="border-y border-white/10 bg-white/[0.02]"
      aria-label={t(locale, "trustAriaLabel")}
    >
      <div className="container mx-auto px-6 py-10">
        <div className="grid gap-6 md:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="text-center"
            >
              <h3 className="font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-white/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
