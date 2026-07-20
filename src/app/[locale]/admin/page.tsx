import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { DashboardCard } from "@/components/admin-ui/dashboard-card";
import { DataTable } from "@/components/admin-ui/data-table";
import { FolderKanban, MessageSquare, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

// --- مكونات عرض الخلايا (Client Components) ---
// هذه المكونات تُمرر كـ JSX (عناصر React) وليس كدوال، لذا فهي قابلة للتسلسل
const MessageFromCell = ({ name, email }: { name: string; email: string | null }) => (
  <div>
    <div className="font-bold text-white/90">{name}</div>
    <div className="text-white/55 text-xs">{email ?? "-"}</div>
  </div>
);

const MessageSubjectCell = ({ subject, isRead }: { subject: string | null; isRead: boolean }) => (
  <div className="flex items-center gap-2">
    <span className={isRead ? "text-white/70" : "text-[#F5C542]"}>{subject ?? "-"}</span>
    {!isRead ? <span className="text-[10px] font-extrabold tracking-widest text-[#F5C542]">NEW</span> : null}
  </div>
);

const ProjectStatusCell = ({ isPublished, locale }: { isPublished: boolean; locale: Locale }) => (
  <span className={["inline-flex px-2 py-1 rounded-lg border text-xs", isPublished ? "border-[#F5C542]/25 text-[#F5C542]" : "border-white/10 text-white/55"].join(" ")}>
    {isPublished ? t(locale, "adminYes") : t(locale, "adminNo")}
  </span>
);

// --- الصفحة الرئيسية ---
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
    
    // تحويل البيانات لتناسب الجدول
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
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">{t(locale, "adminOpsOverview")}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard title={t(locale, "adminCmsProjects")} value={stats.projects.toString()} icon={<FolderKanban className="h-5 w-5" />} />
        <DashboardCard title={t(locale, "adminContactMessages")} value={stats.messages.toString()} icon={<MessageSquare className="h-5 w-5" />} />
        <DashboardCard title={t(locale, "adminRevenue")} value={`${stats.revenue.toLocaleString()} MRU`} icon={<DollarSign className="h-5 w-5" />} sub="Total revenue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold tracking-tight text-white">{t(locale, "adminRecentMessages")}</h2>
          <DataTable 
            empty={t(locale, "adminNoMessages")} 
            rows={recentMessages} 
            columns={[{ key: "from", header: t(locale, "adminFrom") }, { key: "subject", header: t(locale, "adminSubject") }]} 
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-extrabold tracking-tight text-white">{t(locale, "adminRecentProjects")}</h2>
          <DataTable 
            empty={t(locale, "adminNoProjects")} 
            rows={recentProjects} 
            columns={[{ key: "slug", header: "Slug" }, { key: "status", header: t(locale, "adminPublished") }]} 
          />
        </div>
      </div>
    </section>
  );
}
