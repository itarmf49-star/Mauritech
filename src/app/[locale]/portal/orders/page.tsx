import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { ShoppingCart, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function PortalOrdersPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/login?next=/${locale}/portal/orders`);
  }

  const uid = typeof session.user.id === "string" ? Number(session.user.id) : session.user.id;

  let orders: any[] = [];
  try {
    if (uid && !isNaN(uid)) {
      orders = await prisma.portalProject.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 50,
      }).catch(() => []);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === "fr" ? "Mes Projets" : "مشاريعي"}
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-12 text-center shadow-md">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {locale === "fr" ? "Aucun projet" : "لا توجد مشاريع"}
          </h3>
          <p className="text-gray-600 font-medium">
            {locale === "fr" 
              ? "Vous n'avez pas encore de projets" 
              : "ليس لديك أي مشاريع حتى الآن"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md hover:border-yellow-500 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.name || (locale === "fr" ? "Projet sans nom" : "مشروع بدون اسم")}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "completed" 
                        ? "bg-green-500 text-white" 
                        : order.status === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}>
                      {order.status || (locale === "fr" ? "En cours" : "قيد التنفيذ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    {order.description || (locale === "fr" ? "Aucune description" : "لا يوجد وصف")}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      {new Date(order.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "ar-MA")}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    href={`/${locale}/portal/orders/${order.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 text-sm font-bold text-white hover:from-yellow-600 hover:to-yellow-700 transition shadow-md"
                  >
                    {locale === "fr" ? "Voir détails" : "عرض التفاصيل"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}