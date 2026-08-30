import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { FileText, Download, CheckCircle, Clock, AlertCircle, CreditCard } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function PortalInvoicesPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/login?next=/${locale}/portal/invoices`);
  }

  const uid = typeof session.user.id === "string" ? Number(session.user.id) : session.user.id;

  type InvoiceRow = {
    id: string;
    date: string;
    status: "PAID" | "OVERDUE" | "PENDING";
    amount: number;
    currency: string;
  };

  let invoices: InvoiceRow[] = [];
  try {
    if (uid && !isNaN(uid)) {
      const invoicesRaw = await prisma.invoice.findMany({
        where: { account: { userId: uid } },
        orderBy: { issuedAt: "desc" },
        include: { account: true },
      });
      invoices = invoicesRaw.map((inv) => ({
        id: inv.id,
        date: inv.issuedAt?.toISOString().slice(0, 10) || "",
        status: (
          inv.status?.toUpperCase() === "PAID" ? "PAID" : inv.status?.toUpperCase() === "OVERDUE" ? "OVERDUE" : "PENDING"
        ),
        amount: inv.amount || 0,
        currency: "MRU",
      }));
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "OVERDUE":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-500 text-white";
      case "OVERDUE":
        return "bg-red-500 text-white";
      default:
        return "bg-yellow-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === "fr" ? "Mes Factures" : "فواتيري"}
        </h1>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-12 text-center shadow-md">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {locale === "fr" ? "Aucune facture" : "لا توجد فواتير"}
          </h3>
          <p className="text-gray-600 font-medium">
            {locale === "fr" 
              ? "Vous n'avez pas encore de factures" 
              : "ليس لديك أي فواتير حتى الآن"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md hover:border-yellow-500 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {getStatusIcon(invoice.status)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {locale === "fr" ? "Facture" : "فاتورة"} #{invoice.id.slice(0, 8)}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(invoice.status)}`}>
                      {invoice.status === "PAID" 
                        ? (locale === "fr" ? "Payée" : "مدفوعة") 
                        : invoice.status === "OVERDUE"
                        ? (locale === "fr" ? "En retard" : "متأخرة")
                        : (locale === "fr" ? "En attente" : "قيد الانتظار")
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      {invoice.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-gray-600" />
                      {invoice.amount.toLocaleString()} {invoice.currency}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {invoice.status !== "PAID" && (
                    <Link
                      href={`/${locale}/portal/invoices/${invoice.id}/pay`}
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 text-sm font-bold text-white hover:from-yellow-600 hover:to-yellow-700 transition shadow-md"
                    >
                      <CreditCard className="w-4 h-4" />
                      {locale === "fr" ? "Payer" : "دفع"}
                    </Link>
                  )}
                  <Link
                    href={`/${locale}/portal/invoices/${invoice.id}/pdf`}
                    className="inline-flex items-center justify-center rounded-lg bg-gray-100 border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-200 transition"
                  >
                    <Download className="w-4 h-4" />
                    {locale === "fr" ? "Télécharger" : "تحميل"}
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
