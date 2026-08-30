import { requireStaff } from "@/lib/admin-session";
import { getAdminLocale, type AdminLocale } from "@/lib/admin-i18n";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale: raw } = await params;
  const locale: AdminLocale = getAdminLocale(raw);

  await requireStaff(raw);

  return <AdminShell locale={locale}>{children}</AdminShell>;
}
