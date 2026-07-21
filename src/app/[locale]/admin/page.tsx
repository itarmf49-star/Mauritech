import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { DashboardCard } from "@/components/admin-ui/dashboard-card";
import { DataTable } from "@/components/admin-ui/data-table";
import { FolderKanban, MessageSquare, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

// --- مكونات عرض الخلايا ---
const MessageFromCell = ({ name, email }: { name: string; email: string | null }) => (
  <div>
    <div className="font-bold text-white/90">{name}</div>
    <div className="text-white/55 text-xs">{email ?? "-"}</div>
  </div>
);

const MessageSubjectCell = ({ subject, isRead }: { subject: string | null; isRead: boolean }) => (
  <div className="flex items-center gap-2">
    <span className={isRead ? "text-white/70" : "text-[#F5C542]"}>{subject ?? "-"}</span>
    {!isRead ? <span className="text-[10px] font-extrabold tracking-widest text-[#F5C542] px-2 py-0.5 bg-[#F5C542]/10 rounded-full">NEW</span> : null}
  </div>
);

const ProjectStatusCell = ({ isPublished, locale }: { isPublished: boolean; locale: Locale }) => (
  <span className={["inline-flex px-2.5 py-1 rounded-lg border text-xs font-medium", isPublished ? "border-[#F5C542]/25 text-[#F5C542] bg-[#F5C542]/5" : "border-white/10 text-white/55 bg-white/5"].join(" ")}>
    {isPublished ? t(locale, "adminYes") : t(locale, "adminNo")}
  </span>
);

type AdminDashboardPageProps = { params: Promise<{ locale: string }> };

export default async function AdminDashboardPage({ params }: AdminDashboardPageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  let stats = { messages: 0, projects: 0, revenue: 0 };
  let recentMessages: any[] = [];
  let recentProjects: any[] = [];

  try {
    const [messagesCount, projectsCount, revenueAgg, msgs, projs] = await Promise.all([
      prisma.contactMessage.count().catch(() => 0),
      prisma.project.count().catch(() => 0),
      prisma.billingInvoice.aggregate({ _sum: { total: true } }).catch(() => ({ _sum: { total: 0 } })),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 8 }).catch(() => []),
      prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }).catch(() => []),
    ]);

    stats = { messages: messagesCount, projects: projectsCount, revenue: revenueAgg?._sum?.total ?? 0 };
    
    recentMessages = msgs.map((m) => ({
      id: m.id,
      from: <MessageFromCell name={m.name} email={m.email} />,
      subject: <MessageSubjectCell subject={m.subject} isRead={m.isRead} />
    }));

    recentProjects = projs.map((p) => ({
      id: p.id,
      slug: <span className="font-bold text-white/90">{p.slug}</span>,
      status: <ProjectStatusCell isPublished={p.isPublished} locale={locale} />
    }));
  } catch (error) {
    console.error("ADMIN_DASHBOARD_FATAL_ERROR:", error);
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-white pt-24 lg:pt-10 px-4 md:px-8 pb-10 relative overflow-hidden">
      
      {/* تأثير الإضاءة الزرقاء المتوهجة (Fiber Optic Glow) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <section className="space-y-8 max-w-[1600px] mx-auto relative z-10">
        
        {/* الترحيب */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">{t(locale, "adminOpsOverview")}</h1>
          <p className="text-white/40 text-sm">نظام التحكم المركزي Mauritech - لوحة المراقبة النشطة</p>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title={t(locale, "adminCmsProjects")} value={stats.projects.toString()} icon={<FolderKanban className="h-6 w-6 text-blue-400" />} />
          <DashboardCard title={t(locale, "adminContactMessages")} value={stats.messages.toString()} icon={<MessageSquare className="h-6 w-6 text-green-400" />} />
          <DashboardCard title={t(locale, "adminRevenue")} value={`${stats.revenue.toLocaleString()} MRU`} icon={<DollarSign className="h-6 w-6 text-[#F5C542]" />} sub="Total revenue" />
        </div>

        {/* الجداول الزجاجية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-blue-500/30 transition-all duration-500">
            <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              {t(locale, "adminRecentMessages")}
            </h2>
            <div className="bg-black/20 rounded-2xl p-2">
              <DataTable 
                empty={t(locale, "adminNoMessages")} 
                rows={recentMessages} 
                columns={[{ key: "from", header: t(locale, "adminFrom") }, { key: "subject", header: t(locale, "adminSubject") }]} 
              />
            </div>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-indigo-500/30 transition-all duration-500">
            <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-indigo-400" />
              {t(locale, "adminRecentProjects")}
            </h2>
            <div className="bg-black/20 rounded-2xl p-2">
              <DataTable 
                empty={t(locale, "adminNoProjects")} 
                rows={recentProjects} 
                columns={[{ key: "slug", header: "Slug" }, { key: "status", header: t(locale, "adminPublished") }]} 
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
