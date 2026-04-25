"use client";

import { useEffect, useState } from "react";

type PortalDocument = {
  id: string;
  title: string;
  fileType: string | null;
  url: string;
  sizeBytes: number | null;
  createdAt: string;
};

function prettySize(v: number | null) {
  if (!v) return "-";
  if (v > 1024 * 1024) return `${(v / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.ceil(v / 1024)} KB`;
}

export default function PortalDocumentsPage() {
  const [documents, setDocuments] = useState<PortalDocument[]>([]);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/portal/documents", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { documents?: PortalDocument[] }) => {
        if (!cancelled) setDocuments(data.documents ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="portal-page">
      <div className="portal-page-head">
        <h2 className="portal-page-title">Documents and Downloads</h2>
        <p className="muted">Download project files, handover documents, and customer deliverables.</p>
      </div>
      <div className="card-grid">
        {documents.map((doc) => (
          <article key={doc.id} className="portal-card">
            <p className="portal-card-kicker">{doc.fileType ?? "Document"}</p>
            <h3 className="portal-card-title">{doc.title}</h3>
            <p className="muted">Size: {prettySize(doc.sizeBytes)}</p>
            <p className="muted">{new Date(doc.createdAt).toLocaleDateString()}</p>
            <a className="btn btn-ghost btn-sm" href={doc.url}>
              Download
            </a>
          </article>
        ))}
        {documents.length === 0 ? <div className="portal-card"><p className="muted">No documents available yet.</p></div> : null}
      </div>
    </section>
  );
}
