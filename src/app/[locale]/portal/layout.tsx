import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { SimplifiedPortalLayout } from "@/components/portal/simplified-portal-layout";

type PortalLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PortalLayout({ children, params }: PortalLayoutProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/login?next=/${locale}/portal`);
  }

  return (
    <SimplifiedPortalLayout
      locale={locale as "fr" | "ar"}
      email={session.user.email ?? ""}
      userName={session.user.name ?? undefined}
    >
      {children}
    </SimplifiedPortalLayout>
  );
}
