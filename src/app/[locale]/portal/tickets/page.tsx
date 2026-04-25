"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
};

export default function PortalTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/portal/tickets", { cache: "no-store" });
    const data = (await res.json()) as { tickets?: Ticket[] };
    setTickets(data.tickets ?? []);
  }

  useEffect(() => {
    let active = true;
    (async () => {
      await load();
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="portal-page">
      <div className="portal-page-head">
        <h2 className="portal-page-title">Support Tickets</h2>
        <p className="muted">Create and track support requests linked to your active infrastructure projects.</p>
      </div>
      <div className="portal-card">
        <form
          className="auth-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const t = title.trim();
            const d = description.trim();
            if (!t || !d) return;
            const res = await fetch("/api/portal/tickets", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ title: t, description: d }),
            });
            if (res.ok) {
              setTitle("");
              setDescription("");
              await load();
            }
          }}
        >
          <label className="field">
            <span className="field-label">Ticket title</span>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">Description</span>
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <button className="btn btn-primary btn-md" type="submit">
            Submit ticket
          </button>
        </form>
      </div>
      <div className="card-grid">
        {tickets.map((ticket) => (
          <article key={ticket.id} className="portal-card">
            <p className="portal-card-kicker">
              {ticket.status} • {ticket.priority}
            </p>
            <h3 className="portal-card-title">{ticket.title}</h3>
            <p>{ticket.description}</p>
            <p className="muted">{new Date(ticket.createdAt).toLocaleString()}</p>
          </article>
        ))}
        {!loading && tickets.length === 0 ? <div className="portal-card"><p className="muted">No support tickets yet.</p></div> : null}
      </div>
    </section>
  );
}
