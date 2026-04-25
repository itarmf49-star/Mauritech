import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

type SettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortalSettingsPage({ params }: SettingsPageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? "";
  const profile = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, phone: true, info: true },
      })
    : null;

  return (
    <section className="portal-page">
      <div className="portal-page-head">
        <h2 className="portal-page-title">{t(locale, "portal.settings")}</h2>
        <p className="muted">{t(locale, "portalSettingsHint")}</p>
      </div>
      <div className="portal-card">
        <p className="muted">{t(locale, "portalSettingsHint")}</p>
        <p className="muted">Name: {profile?.name ?? "-"}</p>
        <p className="muted">Email: {profile?.email ?? "-"}</p>
        <p className="muted">Phone: {profile?.phone ?? "-"}</p>
        <p className="muted">Profile notes: {profile?.info ?? "-"}</p>
      </div>
    </section>
  );
}

