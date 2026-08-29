"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin-ui/admin-shell";
import { defaultLocale, isLocale, t, type Locale } from "@/lib/i18n";

type ChatSession = {
  sessionId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  status: string;
  assignedTo: string | null;
  aiHandled: boolean;
  updatedAt: string;
  _count: { messages: number };
};

type ChatMessage = {
  id: string;
  senderType: string;
  senderName: string | null;
  content: string;
  isAi: boolean;
  isRead: boolean;
  createdAt: string;
};

export default function AdminChatPage() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function loadSessions() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chat", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(sessionId: string) {
    try {
      const res = await fetch(`/api/admin/chat?sessionId=${sessionId}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages || []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    void loadSessions();
    const interval = setInterval(loadSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      void loadMessages(selectedSessionId);
      const interval = setInterval(() => {
        if (selectedSessionId) void loadMessages(selectedSessionId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function selectSession(session: ChatSession) {
    setSelectedSessionId(session.sessionId);
    setCurrentSession(session);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSessionId || !newMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: selectedSessionId, content: newMessage.trim(), senderType: "AGENT", senderName: "Admin" }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setNewMessage("");
      await loadMessages(selectedSessionId);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  }

  async function updateSession(data: any) {
    if (!selectedSessionId) return;
    try {
      const res = await fetch("/api/admin/chat", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: selectedSessionId, ...data }),
      });
      if (!res.ok) return;
      const result = await res.json();
      setCurrentSession(result.session);
      await loadSessions();
    } catch (e) {
      console.error(e);
    }
  }

  const activeSessions = sessions.filter((s) => s.status === "ACTIVE");
  const closedSessions = sessions.filter((s) => s.status !== "ACTIVE");

  return (
    <AdminShell locale={locale}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{t(locale, "adminChatTitle")}</h1>
          <p className="text-white/50 text-sm mt-1">{t(locale, "adminChatSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">{t(locale, "adminChatActiveSessions")} ({activeSessions.length})</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {activeSessions.map((s) => (
                  <div
                    key={s.sessionId}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${selectedSessionId === s.sessionId ? "bg-[#3b82f6]/10 border border-[#3b82f6]/20" : "bg-white/5 border border-white/5 hover:bg-white/10"}`}
                    onClick={() => selectSession(s)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-white/90 text-sm font-medium truncate">{s.customerName || s.customerEmail || "Guest"}</div>
                      {s.aiHandled && <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">AI</span>}
                    </div>
                    <div className="text-white/40 text-xs mt-1">{s._count.messages} {t(locale, "adminChatMessages").toLowerCase()}</div>
                  </div>
                ))}
                {activeSessions.length === 0 && <p className="text-white/40 text-sm">{t(locale, "adminNoData")}</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">{t(locale, "adminChatClosedSessions")} ({closedSessions.length})</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {closedSessions.map((s) => (
                  <div
                    key={s.sessionId}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${selectedSessionId === s.sessionId ? "bg-[#3b82f6]/10 border border-[#3b82f6]/20" : "bg-white/5 border border-white/5 hover:bg-white/10"}`}
                    onClick={() => selectSession(s)}
                  >
                    <div className="text-white/70 text-sm font-medium truncate">{s.customerName || s.customerEmail || "Guest"}</div>
                    <div className="text-white/40 text-xs mt-1">{s.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 flex flex-col" style={{ minHeight: "500px" }}>
            {selectedSessionId && currentSession ? (
              <>
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">{currentSession.customerName || currentSession.customerEmail || "Guest"}</div>
                    <div className="text-white/40 text-xs">{currentSession.sessionId}</div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="input text-xs py-1 px-2"
                      value={currentSession.status}
                      onChange={(e) => void updateSession({ status: e.target.value })}
                    >
                      <option value="ACTIVE">{t(locale, "adminChatStatusActive")}</option>
                      <option value="CLOSED">{t(locale, "adminChatStatusClosed")}</option>
                      <option value="ARCHIVED">{t(locale, "adminChatStatusArchived")}</option>
                      <option value="TRANSFERRED">{t(locale, "adminChatStatusTransferred")}</option>
                    </select>
                    <button
                      className={`text-xs px-3 py-1 rounded-lg border ${currentSession.aiHandled ? "border-red-500/25 text-red-400 bg-red-400/5" : "border-[#3b82f6]/25 text-[#3b82f6] bg-[#3b82f6]/5"}`}
                      onClick={() => void updateSession({ aiHandled: !currentSession.aiHandled })}
                    >
                      {t(locale, "adminChatAIToggle")}: {currentSession.aiHandled ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.senderType === "CUSTOMER" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        m.isAi ? "bg-blue-500/10 border border-blue-500/20 text-blue-300" :
                        m.senderType === "CUSTOMER" ? "bg-white/10 border border-white/10 text-white/80" :
                        "bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6]"
                      }`}>
                        {m.senderName && <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">{m.senderName}</div>}
                        <div className="text-sm">{m.content}</div>
                        <div className="text-[10px] opacity-50 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex gap-3">
                  <input
                    className="input flex-1"
                    placeholder={t(locale, "adminChatMessages") + "..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                    {sending ? t(locale, "adminLoading") : t(locale, "adminSend")}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/40">
                {t(locale, "adminNoData")}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
