import type { MessageKey } from "@/lib/i18n";

/** Service slugs aligned with `content.ts` service ids. */
export const SERVICE_IDS = [
  "residential-internet",
  "home-wifi",
  "business-networks",
  "infrastructure",
  "fiber-optic",
  "maintenance",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

type ServiceI18nEntry = {
  title: MessageKey;
  description: MessageKey;
};

export const SERVICE_I18N: Record<ServiceId, ServiceI18nEntry> = {
  "residential-internet": { title: "serviceResidentialTitle", description: "serviceResidentialDesc" },
  "home-wifi": { title: "serviceHomeWifiTitle", description: "serviceHomeWifiDesc" },
  "business-networks": { title: "serviceBusinessTitle", description: "serviceBusinessDesc" },
  infrastructure: { title: "serviceInfrastructureTitle", description: "serviceInfrastructureDesc" },
  "fiber-optic": { title: "serviceFiberTitle", description: "serviceFiberDesc" },
  maintenance: { title: "serviceMaintenanceTitle", description: "serviceMaintenanceDesc" },
};

export function isServiceId(value: string): value is ServiceId {
  return (SERVICE_IDS as readonly string[]).includes(value);
}

export function getServiceI18n(serviceId: string): ServiceI18nEntry | undefined {
  return isServiceId(serviceId) ? SERVICE_I18N[serviceId] : undefined;
}
