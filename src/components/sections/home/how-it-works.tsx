import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type HowItWorksProps = {
  locale: Locale;
};

const steps = ["step1", "step2", "step3", "step4"] as const;

export function HowItWorks({ locale }: HowItWorksProps) {
  return (
    <section className="container mx-auto px-6 py-20" aria-labelledby="how-it-works-title">
      <div className="text-center mb-12">
        <p className="eyebrow">{t(locale, "howItWorksEyebrow")}</p>
        <h2 id="how-it-works-title" className="text-4xl font-bold text-white">
          {t(locale, "howItWorksTitle")}
        </h2>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <article
            key={step}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur relative"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F5C542]/20 text-[#F5C542] font-bold text-sm">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-white">{t(locale, `${step}Title`)}</h3>
            <p className="mt-2 text-gray-300 text-sm">{t(locale, `${step}Description`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
