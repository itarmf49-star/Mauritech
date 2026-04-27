export type PortalInvoiceStatus = "PAID" | "PENDING" | "OVERDUE";

export type PortalInvoice = {
  id: string;
  date: string; // YYYY-MM-DD
  status: PortalInvoiceStatus;
  amount: number;
  currency: string;
};

export type PortalMessage = {
  id: string;
  threadId: string;
  from: "CLIENT" | "ADMIN";
  body: string;
  createdAt: string; // ISO
};

export type PortalAccount = {
  userId: string;
  email: string | null;
  status: "ACTIVE" | "LIMITED";
};

export async function getInvoices(): Promise<PortalInvoice[]> {
  const res = await fetch("/api/portal/dashboard", { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  const payload = (await res.json()) as {
    recentInvoices: {
      id: string;
      amount: number;
      status: string;
      issuedAt: string;
    }[];
  };
  const rows = payload.recentInvoices ?? [];
  return rows.map((inv) => ({
    id: inv.id,
    date: new Date(inv.issuedAt).toISOString().slice(0, 10),
    status: inv.status?.toUpperCase() === "PAID" ? "PAID" : inv.status?.toUpperCase() === "OVERDUE" ? "OVERDUE" : "PENDING",
    amount: inv.amount,
    currency: "MRU",
  }));
}

export async function getMessages(): Promise<PortalMessage[]> {
  const res = await fetch("/api/portal/messages", { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  const payload = (await res.json()) as { messages: { id: string; content: string; isAdmin: boolean; createdAt: string }[] };
  const rows = payload.messages ?? [];
  return rows.map((m) => ({
    id: m.id,
    threadId: "thread_support",
    from: m.isAdmin ? "ADMIN" : "CLIENT",
    body: m.content,
    createdAt: m.createdAt,
  }));
}

export async function getAccount(userId: string, email: string | null): Promise<PortalAccount> {
  return { userId, email, status: email ? "ACTIVE" : "LIMITED" };
}

export type PortalDashboardResponse = {
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  recentInvoices: {
    id: string;
    amount: number;
    status: string;
    issuedAt: string;
  }[];
  lastMessage: { content: string; createdAt: string; isAdmin: boolean } | null;
  recentProjects: { id: string; title: string; status: string; progress: number }[];
  openTickets: number;
  documentsCount: number;
};

