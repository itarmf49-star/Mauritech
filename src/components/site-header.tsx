"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { defaultLocale, isLocale, localePath, locales, t, type Locale } from "@/lib/i18n";

type SiteHeaderProps = { locale?: Locale };

function stripLocaleFromPathname(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  const first = parts[0];
  if (isLocale(first)) {
    const rest = parts.slice(1).join("/");
    return rest.length ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function SiteHeader({ locale = defaultLocale }: SiteHeaderProps) {
  const { status } = useSession();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setSearchTerm(searchParams?.get("q") || "");
    setSearchCategory(searchParams?.get("categoryId") || "");
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCategories(data.categories || []);
      } catch {
        // تجاهل — القائمة المنسدلة تبقى فارغة إن تعذر التحميل
      }
    }
    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onHash() {
      setHash(window.location.hash || "");
    }
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    startTransition(() => setOpen(false));
  }, [pathname]);

  const isRtl = locale === "ar";
  const basePath = useMemo(() => stripLocaleFromPathname(pathname), [pathname]);

  const navLinks = useMemo(
    () => [
      { key: "navServices" as const, href: localePath(locale, "/services") },
      { key: "navAbout" as const, href: localePath(locale, "/about") },
      { key: "navContactLink" as const, href: localePath(locale, "/contact") },
    ],
    [locale],
  );

  function isActiveLink(href: string) {
    const raw = href.replace(/^\/(en|fr|ar)(?=\/|$)/, "") || "/";
    const [pathPart, hashPart] = raw.split("#");
    const path = pathPart?.length ? pathPart : "/";
    if (path === "/") {
      if (hashPart) return basePath === "/" && hash === `#${hashPart}`;
      return basePath === "/";
    }
    if (hashPart) return basePath === path && hash === `#${hashPart}`;
    return basePath === path || basePath.startsWith(`${path}/`);
  }

  function onSwitchLocale(next: Locale) {
    const query = searchParams?.toString();
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const nextHref = `${localePath(next, basePath)}${query ? `?${query}` : ""}${hash}`;
    router.push(nextHref);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = searchTerm.trim();
    const qs = new URLSearchParams();
    if (term) qs.set("q", term);
    if (searchCategory) qs.set("categoryId", searchCategory);
    const query = qs.toString();
    router.push(query ? `${localePath(locale, "/")}?${query}` : localePath(locale, "/"));
  }

  const [cartCount, setCartCount] = useState(0);
  const [siteLogo, setSiteLogo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadSiteSettings() {
      try {
        const res = await fetch("/api/site-settings");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setSiteLogo(data.logoUrl || null);
      } catch {
        // تجاهل — يبقى الشعار النصي الافتراضي
      }
    }
    void loadSiteSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const count = (data.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
          setCartCount(count);
        }
      } catch {
        // ignore cart load errors
      }
    }
    void loadCart();
    window.addEventListener("cart:updated", loadCart);
    return () => window.removeEventListener("cart:updated", loadCart);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* الشريط الأساسي: الشعار + البحث + الحساب/السلة */}
      <div className="bg-[#131921]">
        <div className="mx-auto max-w-7xl px-3 sm:px-5">
          <div className={["flex h-[64px] items-center gap-3 sm:gap-5", isRtl ? "flex-row-reverse" : ""].join(" ")}>
            <Link
              href={localePath(locale, "/")}
              className="shrink-0 inline-flex items-center gap-0.5 font-extrabold tracking-tight text-lg border border-transparent hover:border-white/30 rounded p-1.5"
              style={{ direction: "ltr" }}
              aria-label="MauriTech home"
            >
              {siteLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={siteLogo} alt="MauriTech" className="h-8 w-auto max-w-[150px] object-contain" />
              ) : (
                <>
                  <span className="text-white">Mauri</span>
                  <span className="text-[#3b82f6]">Tech</span>
                </>
              )}
            </Link>

            {/* Search bar — Amazon-style, prominent, centered in the header, with category dropdown */}
            <form onSubmit={submitSearch} className="hidden sm:flex flex-1 h-10 rounded-md overflow-hidden ring-1 ring-transparent focus-within:ring-2 focus-within:ring-[#FF9900]">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="hidden lg:block shrink-0 max-w-[150px] bg-[#F3F3F3] text-gray-700 text-xs font-medium px-2 border-e border-gray-300 focus:outline-none"
                aria-label={t(locale, "shopAllCategories")}
              >
                <option value="">{t(locale, "shopAllCategories")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t(locale, "shopSearchPlaceholder")}
                className="flex-1 min-w-0 px-3 text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 w-11 bg-[#FF9900] hover:bg-[#F3A847] flex items-center justify-center text-[#131921]"
                aria-label={t(locale, "shopAddToCart")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="m20 20-3-3" />
                </svg>
              </button>
            </form>

            <div className={["hidden md:flex items-center gap-1", isRtl ? "flex-row-reverse" : ""].join(" ")}>
              {locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onSwitchLocale(loc)}
                  className={[
                    "px-2.5 py-1 rounded text-xs font-extrabold tracking-widest border transition-colors",
                    loc === locale ? "border-white/70 text-white" : "border-transparent text-white/60 hover:text-white",
                  ].join(" ")}
                  aria-current={loc === locale}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {status === "unauthenticated" ? (
                <Link href={localePath(locale, "/login")} className="text-sm font-semibold text-white/90 hover:text-white leading-tight">
                  {t(locale, "navLogin")}
                </Link>
              ) : (
                <Link href={localePath(locale, "/portal-access")} className="text-sm font-semibold text-white/90 hover:text-white leading-tight">
                  {t(locale, "navPortal")}
                </Link>
              )}
              <Link
                href={localePath(locale, "/cart")}
                className="relative inline-flex items-center gap-1.5 text-white hover:text-white/80 transition"
                aria-label={t(locale, "cart")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0 6 0m-6 0h6m-6 0H3.375" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.375 21h11.25A2.25 2.25 0 0 0 19.875 18.75V6.375A2.25 2.25 0 0 0 17.625 4.125H6.375A2.25 2.25 0 0 0 4.125 6.375v12.375A2.25 2.25 0 0 0 6.375 21Z" />
                </svg>
                {cartCount > 0 ? (
                  <span className="absolute -top-1.5 -end-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FF9900] text-[10px] font-black text-black">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            </div>

            {/* Mobile controls */}
            <div className={["flex md:hidden items-center gap-2", isRtl ? "flex-row-reverse" : ""].join(" ")}>
              <Link href={localePath(locale, "/cart")} className="relative inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-2 text-white" aria-label={t(locale, "cart")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0 6 0m-6 0h6m-6 0H3.375" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.375 21h11.25A2.25 2.25 0 0 0 19.875 18.75V6.375A2.25 2.25 0 0 0 17.625 4.125H6.375A2.25 2.25 0 0 0 4.125 6.375v12.375A2.25 2.25 0 0 0 6.375 21Z" />
                </svg>
                {cartCount > 0 ? (
                  <span className="absolute -top-1.5 -end-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FF9900] text-[10px] font-black text-black">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                <div className="grid gap-1">
                  <span className={["h-0.5 w-5 bg-current transition", open ? "translate-y-1.5 rotate-45" : ""].join(" ")} />
                  <span className={["h-0.5 w-5 bg-current transition", open ? "opacity-0" : ""].join(" ")} />
                  <span className={["h-0.5 w-5 bg-current transition", open ? "-translate-y-1.5 -rotate-45" : ""].join(" ")} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={submitSearch} className="flex sm:hidden h-9 rounded-md overflow-hidden mb-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t(locale, "shopSearchPlaceholder")}
              className="flex-1 min-w-0 px-3 text-gray-900 placeholder-gray-500 focus:outline-none"
            />
            <button type="submit" className="shrink-0 w-11 bg-[#FF9900] flex items-center justify-center text-[#131921]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-3-3" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* الشريط الثانوي: روابط التصفح السريع */}
      <div className="bg-[#232F3E] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-3 sm:px-5">
          <nav className={["hidden md:flex items-center gap-1 h-10", isRtl ? "flex-row-reverse" : ""].join(" ")} aria-label="Main navigation">
            <Link
              href={localePath(locale, "/")}
              className={[
                "h-10 inline-flex items-center px-2.5 text-[13px] font-semibold transition-colors border-b-2",
                isActiveLink(localePath(locale, "/"))
                  ? "text-white border-[#FF9900]"
                  : "text-white/75 hover:text-white border-transparent hover:border-white/30",
              ].join(" ")}
            >
              {t(locale, "navHome")}
            </Link>
            {navLinks.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={[
                  "h-10 inline-flex items-center px-2.5 text-[13px] font-semibold transition-colors border-b-2",
                  isActiveLink(l.href)
                    ? "text-white border-[#FF9900]"
                    : "text-white/75 hover:text-white border-transparent hover:border-white/30",
                ].join(" ")}
              >
                {t(locale, l.key)}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={[
          "md:hidden overflow-hidden transition-all duration-300 bg-[#232F3E]",
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <div className="grid gap-1 pt-3">
            <Link
              href={localePath(locale, "/")}
              className={[
                "rounded-lg px-3 py-2 text-sm font-semibold transition",
                isActiveLink(localePath(locale, "/")) ? "text-white bg-white/10" : "text-white/85 hover:bg-white/5",
              ].join(" ")}
            >
              {t(locale, "navHome")}
            </Link>
            {navLinks.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-semibold transition",
                  isActiveLink(l.href) ? "text-white bg-white/10" : "text-white/85 hover:bg-white/5",
                ].join(" ")}
              >
                {t(locale, l.key)}
              </Link>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
            <div className={["flex items-center gap-2", isRtl ? "flex-row-reverse" : ""].join(" ")}>
              {locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onSwitchLocale(loc)}
                  className={[
                    "px-3 py-1 rounded-full text-xs font-extrabold tracking-widest border transition-colors",
                    loc === locale ? "border-white/70 text-white" : "border-white/15 text-white/75",
                  ].join(" ")}
                  aria-current={loc === locale}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
            {status === "unauthenticated" ? (
              <Link href={localePath(locale, "/login")} className="text-sm font-semibold text-white/90">
                {t(locale, "navLogin")}
              </Link>
            ) : (
              <Link href={localePath(locale, "/portal-access")} className="text-sm font-semibold text-white/90">
                {t(locale, "navPortal")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
