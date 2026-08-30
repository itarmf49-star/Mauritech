import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { ShoppingCart, FileText, MessageSquare, Bell, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function PortalOverviewPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/login?next=/${locale}/portal`);
  }

  const uid = typeof session.user.id === "string" ? Number(session.user.id) : session.user.id;

  // Fetch user stats
  let stats = {
    orders: 0,
    pendingOrders: 0,
    invoices: 0,
    pendingInvoices: 0,
    messages: 0,
    unreadMessages: 0,
  };

  try {
    if (uid && !isNaN(uid)) {
      const [ordersCount, invoicesCount, messagesCount] = await Promise.all([
        prisma.portalProject.count({ where: { userId: uid } }).catch(() => 0),
        prisma.invoice.count({ where: { account: { userId: uid } } }).catch(() => 0),
        prisma.message.count({ where: { userId: uid } }).catch(() => 0),
      ]);

      stats = {
        orders: ordersCount,
        pendingOrders: 0, // Would need actual status field
        invoices: invoicesCount,
        pendingInvoices: 0, // Would need actual status field
        messages: messagesCount,
        unreadMessages: 0, // Would need actual read status
      };
    }
  } catch (error) {
    console.error("Error fetching portal stats:", error);
  }

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-gray-600 font-medium">
          {locale === "fr" ? "Total" : "الإجمالي"}
        </span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 mt-1 font-medium">{label}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {locale === "fr" ? "Bienvenue" : "مرحباً"}, {session.user.name || session.user.email}
        </h1>
        <p className="text-gray-600 font-medium">
          {locale === "fr" 
            ? "Voici un aperçu de votre activité" 
            : "إليك نظرة عامة على نشاطك"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ShoppingCart}
          label={locale === "fr" ? "Projets" : "المشاريع"}
          value={stats.orders}
          color="bg-blue-500"
        />
        <StatCard
          icon={FileText}
          label={locale === "fr" ? "Factures" : "الفواتير"}
          value={stats.invoices}
          color="bg-green-500"
        />
        <StatCard
          icon={MessageSquare}
          label={locale === "fr" ? "Messages" : "الرسائل"}
          value={stats.messages}
          color="bg-purple-500"
        />
        <StatCard
          icon={Bell}
          label={locale === "fr" ? "Notifications" : "الإشعارات"}
          value={stats.unreadMessages}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {locale === "fr" ? "Actions rapides" : "إجراءات سريعة"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href={`/${locale}/portal/orders`}
            className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition"
          >
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span className="text-gray-900 font-medium">
              {locale === "fr" ? "Voir mes commandes" : "عرض طلباتي"}
            </span>
          </Link>
          <Link
            href={`/${locale}/portal/invoices`}
            className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition"
          >
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-gray-900 font-medium">
              {locale === "fr" ? "Payer mes factures" : "دفع فواتيري"}
            </span>
          </Link>
          <Link
            href={`/${locale}/portal/messages`}
            className="flex items-center gap-3 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition"
          >
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span className="text-gray-900 font-medium">
              {locale === "fr" ? "Contacter le support" : "اتصل بالدعم"}
            </span>
          </Link>
          <Link
            href={`/${locale}/portal/settings`}
            className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition"
          >
            <Bell className="w-5 h-5 text-yellow-600" />
            <span className="text-gray-900 font-medium">
              {locale === "fr" ? "Parametres" : "الإعدادات"}
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {locale === "fr" ? "Activité récente" : "النشاط الأخير"}
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: CheckCircle,
              color: "text-green-600",
              text: locale === "fr" ? "Projet #1234 complété" : "اكتمل المشروع #1234",
              time: locale === "fr" ? "Il y a 2 heures" : "منذ ساعتين"
            },
            {
              icon: FileText,
              color: "text-blue-600",
              text: locale === "fr" ? "Facture #5678 générée" : "تم إنشاء الفاتورة #5678",
              time: locale === "fr" ? "Il y a 1 jour" : "منذ يوم"
            },
            {
              icon: MessageSquare,
              color: "text-purple-600",
              text: locale === "fr" ? "Nouveau message du support" : "رسالة جديدة من الدعم",
              time: locale === "fr" ? "Il y a 3 jours" : "منذ 3 أيام"
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
              <div className="flex-1">
                <div className="text-gray-900 font-medium">{activity.text}</div>
                <div className="text-sm text-gray-600">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}