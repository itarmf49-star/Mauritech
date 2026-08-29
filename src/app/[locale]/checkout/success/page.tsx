"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

export default function CheckoutSuccessPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const orderId = typeof params?.orderId === "string" ? params.orderId : "";

  return (
    <main className="min-h-screen bg-[#0B1220] py-10">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-white mb-2">{t(locale, "orderSuccess")}</h1>
          {orderId ? (
            <p className="text-white/70">
              {t(locale, "orderNumber")}: <span className="font-mono text-[#3b82f6]">{orderId}</span>
            </p>
          ) : null}
          <p className="text-white/60 mt-4">{t(locale, "orderConfirmation")}</p>
          <div className="flex gap-3 mt-8 justify-center">
            <Link href={`/${locale}/shop`} className="btn btn-primary">
              {t(locale, "orderContinueShopping")}
            </Link>
            <Link href={`/${locale}/orders`} className="btn">
              {t(locale, "orderViewOrders")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
