import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const locales = ["fr", "ar"] as const;
const defaultLocale = "fr" as const;

function isLocale(value: string): value is (typeof locales)[number] {
  return locales.includes(value as (typeof locales)[number]);
}

const adminPaths = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAssetOrInternal =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".");

  if (isAssetOrInternal) {
    return NextResponse.next();
  }

  const parts = pathname.split("/").filter(Boolean);
  const maybeLocale = parts[0];
  if (!maybeLocale || !isLocale(maybeLocale)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Locale prefix extraction
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const locale = first && isLocale(first) ? first : defaultLocale;

  const isAdminRoute = pathname.startsWith(`/${locale}/admin`) || adminPaths.some((p) => pathname.startsWith(p));
  const isPortalRoute = pathname.includes("/portal");

  // Admin-specific isolation and protection
  if (isAdminRoute) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret-change-me",
    });

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Check for admin role
    if (token.role !== "ADMIN" && token.role !== "EDITOR") {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }

    // Add admin isolation headers
    const response = NextResponse.next();
    response.headers.set("x-admin-route", "true");
    response.headers.set("x-admin-isolation", "active");
    response.headers.set("x-frame-options", "DENY");
    response.headers.set("x-content-type-options", "nosniff");
    return response;
  }

  // Portal route protection
  if (isPortalRoute) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret-change-me",
    });

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

