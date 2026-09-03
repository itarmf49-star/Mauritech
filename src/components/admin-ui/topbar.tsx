"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { localePath, locales, t, type Locale } from "@/lib/i18n";

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(fr|ar)(?=\/|$)/, "") || "/";
}

const QUICK_ACTIONS: { match: string; href: string; labelKey: "adminAddProduct" | "adminAddStore" | "adminAddOffer" | "adminAddStory" }[] = [
  { match: "/admin/products", href: "/admin/products", labelKey: "adminAddProduct" },
  { match: "/admin/stores", href: "/admin/stores", labelKey: "adminAddStore" },
  { match: "/admin/offers", href: "/admin/offers", labelKey: "adminAddOffer" },
  { match: "/admin/stories", href: "/admin/stories", labelKey: "adminAddStory" },
];

export function AdminTopbar({
  locale,
  onOpenSidebar,
}: {
  locale: Locale;
  onOpenSidebar: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const searchParams = useSearchParams();
  const base = stripLocale(pathname);

  function switchLocale(next: Locale) {
    const query = searchParams?.toString();
    router.push(`${localePath(next, base)}${query ? `?${query}` : ""}`);
  }

  const title = useMemo(() => {
    if (base === "/admin") return t(locale, "adminOverview");
    if (base.startsWith("/admin/messages")) return t(locale, "adminMessages");
    if (base.startsWith("/admin/invoices")) return t(locale, "adminInvoices");
    if (base.startsWith("/admin/customers")) return t(locale, "adminCustomers");
    if (base.startsWith("/admin/settings")) return t(locale, "adminSettings");
    if (base.startsWith("/admin/stores")) return t(locale, "adminStores");
    if (base.startsWith("/admin/services")) return t(locale, "adminServices");
    if (base.startsWith("/admin/products")) return t(locale, "adminProducts");
    if (base.startsWith("/admin/orders")) return t(locale, "adminOrders");
    if (base.startsWith("/admin/offers")) return t(locale, "adminOffers");
    if (base.startsWith("/admin/stories")) return t(locale, "adminStories");
    if (base.startsWith("/admin/inventory")) return t(locale, "adminInventory");
    if (base.startsWith("/admin/analytics")) return t(locale, "adminAnalytics");
    if (base.startsWith("/admin/requirements")) return t(locale, "adminRequirements");
    if (base.startsWith("/admin/chat")) return t(locale, "adminChat");
    if (base.startsWith("/admin/shipping")) return t(locale, "adminShipping");
    if (base.startsWith("/admin/studio")) return t(locale, "adminStudio");
    return t(locale, "adminOverview");
  }, [base, locale]);

  const quickAction = QUICK_ACTIONS.find((a) => base.startsWith(a.match));

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition shrink-0"
            onClick={onOpenSidebar}
            aria-label={t(locale, "adminOpenSidebar")}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-gray-900 font-bold text-[15px] md:hidden truncate">{title}</div>

          <div className="hidden md:flex relative items-center max-w-sm w-full">
            <Search className="absolute start-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t(locale, "adminSearch") + "..."}
              className="w-full h-10 ps-9 pe-14 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition"
            />
            <kbd className="absolute end-2 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
            {locales.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => switchLocale(loc)}
                className={`px-2 sm:px-2.5 h-8 rounded-md text-xs font-extrabold tracking-wider transition-colors ${
                  loc === locale ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-700"
                }`}
                aria-current={loc === locale}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          {quickAction && (
            <button
              type="button"
              onClick={() => router.push(localePath(locale, quickAction.href))}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition"
            >
              + {t(locale, quickAction.labelKey)}
            </button>
          )}
          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
            aria-label={t(locale, "adminNotifications")}
          >
            <Bell className="h-[18px] w-[18px]" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gray-900 grid place-items-center text-white text-xs font-bold shrink-0">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
