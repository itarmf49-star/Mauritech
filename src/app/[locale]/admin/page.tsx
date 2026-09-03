import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { getStoreScope } from "@/lib/store-scope";
import { DollarSign, ShoppingCart, Users, Eye } from "lucide-react";
import { KpiCard, RevenueChart, StatusDonut, GoalBar } from "@/components/admin-ui/dashboard-widgets";

export const dynamic = "force-dynamic";

type AdminDashboardPageProps = { params: Promise<{ locale: string }> };

const STATUS_LABEL_KEYS: Record<string, string> = {
  PENDING: "adminPending",
  CONFIRMED: "adminConfirmed",
  PROCESSING: "adminProcessed",
  SHIPPED: "adminShipped",
  DELIVERED: "adminDelivered",
  CANCELLED: "adminCancelled",
  REFUNDED: "adminRefunded",
};

const MONTHS_AR = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];
const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default async function AdminDashboardPage({ params }: AdminDashboardPageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  let totalRevenue = 0;
  let totalOrders = 0;
  let totalCustomers = 0;
  let pageViews30d = 0;
  let monthlyRevenue: { label: string; value: number }[] = [];
  let statusBreakdown: { status: string; label: string; count: number }[] = [];
  let fulfillmentRate = 0;
  let stockRate = 0;
  let avgOrderValue = 0;
  let activeCustomerRate = 0;
  let isSuperAdmin = false;

  try {
    const session = await getServerSession(authOptions);
    const scope = session?.user
      ? await getStoreScope(session.user.id, session.user.role)
      : { isSuperAdmin: false, storeIds: [] as string[] };
    isSuperAdmin = scope.isSuperAdmin;
    const storeFilter = scope.isSuperAdmin ? undefined : { in: scope.storeIds.length ? scope.storeIds : ["__none__"] };

    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const since30d = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    const orderStoreWhere = storeFilter ? { storeId: storeFilter } : {};
    const productStoreWhere = storeFilter ? { storeId: storeFilter } : {};
    const customerWhere = {
      role: "CUSTOMER" as const,
      ...(storeFilter ? { orders: { some: { storeId: storeFilter } } } : {}),
    };

    const [revenueAgg, ordersCount, customersCount, pageViewsCount, ordersThisYear, statusGroups, deliveredCount, activeProducts, inStockProducts, customersWithOrders] =
      await Promise.all([
        prisma.order.aggregate({ _sum: { total: true }, where: orderStoreWhere }).catch(() => ({ _sum: { total: 0 } })),
        prisma.order.count({ where: orderStoreWhere }).catch(() => 0),
        prisma.user.count({ where: customerWhere }).catch(() => 0),
        // إحصائيات زيارات الموقع عامة على مستوى المنصة (غير مرتبطة بمتجر بعينه في المخطط الحالي).
        scope.isSuperAdmin ? prisma.pageView.count({ where: { createdAt: { gte: since30d } } }).catch(() => 0) : Promise.resolve(0),
        prisma.order.findMany({ where: { ...orderStoreWhere, createdAt: { gte: yearStart } }, select: { total: true, createdAt: true } }).catch(() => []),
        prisma.order.groupBy({ by: ["status"], _count: { _all: true }, where: orderStoreWhere }).catch(() => []),
        prisma.order.count({ where: { ...orderStoreWhere, status: "DELIVERED" } }).catch(() => 0),
        prisma.product.count({ where: { ...productStoreWhere, isActive: true } }).catch(() => 0),
        prisma.product.count({ where: { ...productStoreWhere, isActive: true, inventory: { quantity: { gt: 0 } } } }).catch(() => 0),
        prisma.user.count({ where: { ...customerWhere, orders: { some: storeFilter ? { storeId: storeFilter } : {} } } }).catch(() => 0),
      ]);

    totalRevenue = revenueAgg._sum.total ?? 0;
    totalOrders = ordersCount;
    totalCustomers = customersCount;
    pageViews30d = pageViewsCount;
    avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    fulfillmentRate = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0;
    stockRate = activeProducts > 0 ? Math.round((inStockProducts / activeProducts) * 100) : 0;
    activeCustomerRate = totalCustomers > 0 ? Math.round((customersWithOrders / totalCustomers) * 100) : 0;

    const months = locale === "ar" ? MONTHS_AR : MONTHS_FR;
    const monthTotals = new Array(12).fill(0);
    for (const o of ordersThisYear) {
      monthTotals[o.createdAt.getMonth()] += o.total;
    }
    monthlyRevenue = months.map((label, i) => ({ label, value: monthTotals[i] }));

    statusBreakdown = statusGroups.map((g) => ({
      status: g.status,
      label: t(locale, STATUS_LABEL_KEYS[g.status] as any),
      count: g._count._all,
    }));
  } catch (error) {
    console.error("ADMIN_DASHBOARD_FATAL_ERROR:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t(locale, "adminWelcomeBack")}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {t(locale, "adminWelcomeSubtitle")}
          {!isSuperAdmin && <span className="text-gray-400"> — {t(locale, "adminScopedToYourStore")}</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label={t(locale, "adminTotalRevenue")} value={`${totalRevenue.toLocaleString()} MRU`} trend={t(locale, "adminAvgOrderValue") + `: ${avgOrderValue.toLocaleString()}`} trendUp icon={<DollarSign className="h-4 w-4" strokeWidth={2.25} />} color="orange" />
        <KpiCard label={t(locale, "adminTotalOrders")} value={totalOrders.toLocaleString()} trend={`${fulfillmentRate}% ${t(locale, "adminDelivered")}`} trendUp={fulfillmentRate >= 50} icon={<ShoppingCart className="h-4 w-4" strokeWidth={2.25} />} color="navy" />
        <KpiCard label={t(locale, "adminTotalCustomers")} value={totalCustomers.toLocaleString()} trend={t(locale, "adminActive")} trendUp icon={<Users className="h-4 w-4" strokeWidth={2.25} />} color="teal" />
        <KpiCard label={t(locale, "adminPageViews")} value={pageViews30d.toLocaleString()} trend="30d" trendUp icon={<Eye className="h-4 w-4" strokeWidth={2.25} />} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900">{t(locale, "adminMonthlyOverview")}</h2>
          <p className="text-xs text-gray-400 mb-2">{t(locale, "adminMonthlyOverviewHint")}</p>
          <RevenueChart data={monthlyRevenue} currency="MRU" />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-1">{t(locale, "adminOrdersByStatus")}</h2>
            {statusBreakdown.length > 0 ? (
              <StatusDonut data={statusBreakdown} total={totalOrders} />
            ) : (
              <p className="text-gray-400 text-sm py-6 text-center">{t(locale, "adminNoData")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">{t(locale, "adminPerformanceGoals")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <GoalBar label={t(locale, "adminFulfillmentRate")} percent={fulfillmentRate} current={`${totalOrders} ${t(locale, "adminTotalOrders")}`} target="100%" color="#0FA37F" />
          <GoalBar label={t(locale, "adminStockRate")} percent={stockRate} current={t(locale, "adminInStock")} target="100%" color="#F4623A" />
          <GoalBar label={t(locale, "adminActiveCustomerRate")} percent={activeCustomerRate} current={`${totalCustomers} ${t(locale, "adminTotalCustomers")}`} target="100%" color="#3B4B8C" />
        </div>
      </div>
    </div>
  );
}
