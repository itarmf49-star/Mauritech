// Admin-specific i18n system - completely independent from public site
type AdminLocale = "fr" | "ar";

const adminTranslations: Record<AdminLocale, Record<string, string>> = {
  fr: {
    adminOverview: "Tableau de bord",
    adminProjects: "Projets",
    adminMessages: "Messages",
    adminInvoices: "Factures",
    adminCustomers: "Clients",
    adminSettings: "Paramètres",
    adminAnalytics: "Statistiques",
    adminStudio: "Studio",
    adminProducts: "Produits",
    adminOrders: "Commandes",
    adminShipping: "Livraisons",
    adminRequests: "Demandes",
    adminLogout: "Déconnexion",
    adminDashboardTitle: "Tableau de bord Admin",
    adminBrand: "MauriTech Admin",
    adminWelcome: "Bon retour",
    adminSystemStatus: "Statut du système",
    adminOnline: "En ligne",
    adminVersion: "Version 1.0.0",
  },
  ar: {
    adminOverview: "لوحة التحكم",
    adminProjects: "المشاريع",
    adminMessages: "الرسائل",
    adminInvoices: "الفواتير",
    adminCustomers: "العملاء",
    adminSettings: "الإعدادات",
    adminAnalytics: "الإحصائيات",
    adminStudio: "الاستوديو",
    adminProducts: "المنتجات",
    adminOrders: "الطلبات",
    adminShipping: "الشحن",
    adminRequests: "الطلبات",
    adminLogout: "تسجيل الخروج",
    adminDashboardTitle: "لوحة تحكم المشرف",
    adminBrand: "MauriTech Admin",
    adminWelcome: "مرحباً بعودتك",
    adminSystemStatus: "حالة النظام",
    adminOnline: "متصل",
    adminVersion: "الإصدار 1.0.0",
  },
};

export function adminT(locale: AdminLocale, key: string): string {
  return adminTranslations[locale]?.[key] || key;
}

export function getAdminLocale(locale: string): AdminLocale {
  return (["fr", "ar"].includes(locale) ? locale : "fr") as AdminLocale;
}

export type { AdminLocale };