import { TRUST_STRIP_ITEMS, type Locale, t } from "@/lib/i18n";

type TrustStripProps = {
  locale: Locale;
};

export function TrustStrip({ locale }: TrustStripProps) {
  return (
    <section className="border-y border-white/10 bg-white/[0.02]" aria-label={t(locale, "trustAriaLabel")}>
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {TRUST_STRIP_ITEMS.map((item) => (
            <div key={item.value}>
              <p className="text-2xl font-bold text-[#F5C542]">{t(locale, item.value)}</p>
              <p className="text-sm text-white/70 mt-1">{t(locale, item.label)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
