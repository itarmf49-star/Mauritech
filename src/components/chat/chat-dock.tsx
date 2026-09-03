"use client";

import { useEffect, useRef, useState } from "react";
import { defaultLocale, t, type Locale } from "@/lib/i18n";

type ChatMessage = {
  id: string;
  content: string;
  senderType: "CUSTOMER" | "AGENT" | "SYSTEM" | "AI";
  senderName: string | null;
  isAi: boolean;
  createdAt: string;
};

type ChatDockProps = {
  locale?: Locale;
};

const SESSION_STORAGE_KEY = "mauritech-chat-session-id";
const POLL_INTERVAL_MS = 4000;

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const fresh = `guest-${crypto.randomUUID()}`;
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh);
    return fresh;
  } catch {
    // localStorage قد يكون معطلاً (وضع خاص) — نستخدم معرّفاً مؤقتاً لهذه الجلسة فقط
    return `guest-${Math.random().toString(36).slice(2)}`;
  }
}

export function ChatDock({ locale = defaultLocale }: ChatDockProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const sessionIdRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  async function loadMessages() {
    if (!sessionIdRef.current) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${encodeURIComponent(sessionIdRef.current)}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setMessages((data.messages || []).slice(-200));
    } catch {
      // نتجاهل فشل الاستطلاع المؤقت — سيُعاد المحاولة في الدورة التالية
    }
  }

  useEffect(() => {
    if (!open) return;
    void loadMessages();
    const interval = setInterval(loadMessages, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setDraft("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current, content, senderType: "CUSTOMER" }),
      });
      if (res.ok) await loadMessages();
    } catch {
      // نتجاهل — المستخدم يستطيع إعادة المحاولة
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-dock" aria-live="polite">
      <button type="button" className="chat-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {t(locale, "chatLive")}
      </button>

      {open ? (
        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <p className="chat-title">{t(locale, "chatTitle")}</p>
              <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>
                {t(locale, "chatSubtitle")}
              </p>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label={t(locale, "chatClose")}>
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble${m.senderType !== "CUSTOMER" ? " chat-bubble-agent" : ""}`}>
                {m.senderName && m.senderType !== "CUSTOMER" && (
                  <p className="chat-bubble-meta" style={{ fontWeight: 700 }}>{m.senderName}</p>
                )}
                <p className="chat-bubble-meta">{new Date(m.createdAt).toLocaleTimeString()}</p>
                <p className="chat-bubble-text">{m.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-form" onSubmit={sendMessage}>
            <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t(locale, "chatPlaceholder")} />
            <button className="btn btn-primary btn-sm" type="submit" disabled={sending || !draft.trim()}>
              {t(locale, "chatSend")}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
