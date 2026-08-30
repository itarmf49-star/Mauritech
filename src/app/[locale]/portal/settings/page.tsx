import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { SimplifiedSettings } from "@/components/portal/simplified-portal-settings";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function PortalSettingsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/login?next=/${locale}/portal/settings`);
  }

  return (
    <SimplifiedSettings
      locale={locale as "fr" | "ar"}
      email={session.user.email ?? ""}
      userName={session.user.name ?? undefined}
    />
  );
}
