"use client";

import { useState, useEffect } from "react";
import { Users, ShoppingCart, MessageSquare, FileText, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  pendingOrders: number;
  totalMessages: number;
  unreadMessages: number;
  totalInvoices: number;
  pendingInvoices: number;
}

interface AdminDashboardOverviewProps {
  locale: "fr" | "ar";
}

export function AdminDashboardOverview({ locale }: AdminDashboardOverviewProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalInvoices: 0,
    pendingInvoices: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching stats from API
    setTimeout(() => {
      setStats({
        totalUsers: 156,
        activeUsers: 42,
        totalOrders: 89,
        pendingOrders: 12,
        totalMessages: 234,
        unreadMessages: 8,
        totalInvoices: 67,
        pendingInvoices: 5,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ icon: Icon, label, value, subtext, color }: any) => (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-gray-400">{subtext}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );

  const isRTL = locale === "ar";

  return (
    <div className="admin-dashboard-overview">
      <h2 className="h2 mb-6">
        {locale === "fr" ? "Vue d'ensemble" : "نظرة عامة"}
      </h2>

      {loading ? (
        <div className="admin-card p-12 text-center">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">
            {locale === "fr" ? "Chargement..." : "جاري التحميل..."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              label={locale === "fr" ? "Utilisateurs totaux" : "إجمالي المستخدمين"}
              value={stats.totalUsers}
              subtext={locale === "fr" ? "+12% ce mois" : "+12% هذا الشهر"}
              color="bg-blue-500"
            />
            <StatCard
              icon={ShoppingCart}
              label={locale === "fr" ? "Commandes totales" : "إجمالي الطلبات"}
              value={stats.totalOrders}
              subtext={locale === "fr" ? `${stats.pendingOrders} en attente` : `${stats.pendingOrders} معلقة`}
              color="bg-green-500"
            />
            <StatCard
              icon={MessageSquare}
              label={locale === "fr" ? "Messages" : "الرسائل"}
              value={stats.totalMessages}
              subtext={locale === "fr" ? `${stats.unreadMessages} non lus` : `${stats.unreadMessages} غير مقروء`}
              color="bg-purple-500"
            />
            <StatCard
              icon={FileText}
              label={locale === "fr" ? "Factures" : "الفواتير"}
              value={stats.totalInvoices}
              subtext={locale === "fr" ? `${stats.pendingInvoices} en attente` : `${stats.pendingInvoices} معلقة`}
              color="bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="admin-card p-6">
              <h3 className="h3 mb-4">
                {locale === "fr" ? "Activité récente" : "النشاط الأخير"}
              </h3>
              <div className="space-y-4">
                {[
                  { type: "order", text: locale === "fr" ? "Nouvelle commande #1234" : "طلب جديد #1234", time: locale === "fr" ? "Il y a 5 min" : "منذ 5 دقائق" },
                  { type: "message", text: locale === "fr" ? "Message de Jean Dupont" : "رسالة من Jean Dupont", time: locale === "fr" ? "Il y a 15 min" : "منذ 15 دقيقة" },
                  { type: "invoice", text: locale === "fr" ? "Facture #5678 payée" : "فاتورة #5678 مدفوعة", time: locale === "fr" ? "Il y a 1 heure" : "منذ ساعة" },
                  { type: "user", text: locale === "fr" ? "Nouvel utilisateur inscrit" : "مستخدم جديد مسجل", time: locale === "fr" ? "Il y a 2 heures" : "منذ ساعتين" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className={`p-2 rounded ${
                      activity.type === "order" ? "bg-green-500/20 text-green-400" :
                      activity.type === "message" ? "bg-purple-500/20 text-purple-400" :
                      activity.type === "invoice" ? "bg-orange-500/20 text-orange-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {activity.type === "order" && <ShoppingCart className="w-4 h-4" />}
                      {activity.type === "message" && <MessageSquare className="w-4 h-4" />}
                      {activity.type === "invoice" && <FileText className="w-4 h-4" />}
                      {activity.type === "user" && <Users className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{activity.text}</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card p-6">
              <h3 className="h3 mb-4">
                {locale === "fr" ? "Statut du système" : "حالة النظام"}
              </h3>
              <div className="space-y-4">
                {[
                  { label: locale === "fr" ? "Base de données" : "قاعدة البيانات", status: "ok", icon: CheckCircle },
                  { label: locale === "fr" ? "Serveur API" : "خادم API", status: "ok", icon: CheckCircle },
                  { label: locale === "fr" ? "Stockage" : "التخزين", status: "warning", icon: AlertCircle },
                  { label: locale === "fr" ? "Service email" : "خدمة البريد", status: "ok", icon: CheckCircle },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${
                        item.status === "ok" ? "text-green-400" : "text-yellow-400"
                      }`} />
                      <span className="text-sm text-white">{item.label}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.status === "ok" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {item.status === "ok" 
                        ? (locale === "fr" ? "Opérationnel" : "يعمل") 
                        : (locale === "fr" ? "Attention" : "تنبيه")
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-card p-6 mt-6">
            <h3 className="h3 mb-4">
              {locale === "fr" ? "Actions rapides" : "إجراءات سريعة"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="btn btn-primary">
                {locale === "fr" ? "Nouveau projet" : "مشروع جديد"}
              </button>
              <button className="btn btn-ghost">
                {locale === "fr" ? "Envoyer notification" : "إرسال إشعار"}
              </button>
              <button className="btn btn-ghost">
                {locale === "fr" ? "Voir les commandes" : "عرض الطلبات"}
              </button>
              <button className="btn btn-ghost">
                {locale === "fr" ? "Gérer les utilisateurs" : "إدارة المستخدمين"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}