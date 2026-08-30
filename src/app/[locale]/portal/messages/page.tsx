import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { MessageSquare, Send, Phone, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export default async function PortalMessagesPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/${locale}/login?next=/${locale}/portal/messages`);
  }

  const uid = typeof session.user.id === "string" ? Number(session.user.id) : session.user.id;

  let messages: any[] = [];
  try {
    if (uid && !isNaN(uid)) {
      messages = await prisma.message.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 50,
      }).catch(() => []);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === "fr" ? "Messages" : "الرسائل"}
        </h1>
      </div>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {locale === "fr" ? "WhatsApp" : "واتساب"}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {locale === "fr" ? "Réponse instantanée" : "رد فوري"}
              </p>
            </div>
          </div>
          <Link
            href="https://wa.me/222123456789"
            target="_blank"
            className="inline-flex items-center justify-center w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-bold text-white hover:from-green-600 hover:to-green-700 transition shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            {locale === "fr" ? "Ouvrir WhatsApp" : "فتح واتساب"}
          </Link>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {locale === "fr" ? "Appeler" : "اتصال"}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {locale === "fr" ? "Support téléphonique" : "الدعم الهاتفي"}
              </p>
            </div>
          </div>
          <Link
            href="tel:+2223344"
            className="inline-flex items-center justify-center w-full rounded-lg bg-gray-100 border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-200 transition"
          >
            <Phone className="w-4 h-4" />
            {locale === "fr" ? "+222 33 44" : "+222 33 44"}
          </Link>
        </div>
      </div>

      {/* Message History */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {locale === "fr" ? "Historique des messages" : "سجل الرسائل"}
        </h2>

        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              {locale === "fr" 
                ? "Aucun message" 
                : "لا توجد رسائل"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {msg.subject || (locale === "fr" ? "Sans sujet" : "بدون موضوع")}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 font-medium">
                      {msg.body}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "ar-MA")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Message Form */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {locale === "fr" ? "Envoyer un message" : "إرسال رسالة"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2 font-medium">
              {locale === "fr" ? "Sujet" : "الموضوع"}
            </label>
            <input
              type="text"
              className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder={locale === "fr" ? "Sujet de votre message..." : "موضوع رسالتك..."}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2 font-medium">
              {locale === "fr" ? "Message" : "الرسالة"}
            </label>
            <textarea
              rows={4}
              className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
              placeholder={locale === "fr" ? "Écrivez votre message..." : "اكتب رسالتك..."}
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 text-sm font-bold text-white hover:from-yellow-600 hover:to-yellow-700 transition shadow-md">
            <Send className="w-4 h-4" />
            {locale === "fr" ? "Envoyer" : "إرسال"}
          </button>
        </div>
      </div>
    </div>
  );
}
