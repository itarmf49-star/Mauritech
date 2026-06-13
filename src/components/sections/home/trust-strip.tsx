import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type TrustStripProps = {
  locale: Locale;
};

const keys = ["trustItem1", "trustItem2", "trustItem3", "trustItem4"] as const;

export function TrustStrip({ locale }: TrustStripProps) {
  return (
    <section className="border-y border-white/10 bg-white/[0.02]" aria-label={t(locale, "trustAriaLabel")}>
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {keys.map((key) => (
            <div key={key}>
              <p className="text-2xl font-bold text-[#F5C542]">{t(locale, `${key}Value`)}</p>
              <p className="text-sm text-white/70 mt-1">{t(locale, `${key}Label`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
