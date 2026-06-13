import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { EquipmentAdmin } from "@/components/admin/equipment-admin";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminEquipmentPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  return <EquipmentAdmin locale={locale} />;
}
