"use client";

import { useEffect, useState } from "react";

type PortalProject = {
  id: string;
  title: string;
  summary: string | null;
  status: string;
  progress: number;
};

export default function PortalProjectsPage() {
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/portal/projects", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { projects?: PortalProject[] }) => {
        if (cancelled) return;
        setProjects(data.projects ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="portal-page">
      <div className="portal-page-head">
        <h2 className="portal-page-title">My Projects</h2>
        <p className="muted">Track project status, progress timeline, and ongoing deployment activity.</p>
      </div>
      {loading ? <div className="portal-card"><p className="muted">Loading projects...</p></div> : null}
      <div className="card-grid">
        {projects.map((project) => (
          <article key={project.id} className="portal-card">
            <p className="portal-card-kicker">{project.status}</p>
            <h3 className="portal-card-title">{project.title}</h3>
            <p className="muted">{project.summary ?? "Project updates are available in your dashboard timeline."}</p>
            <p className="muted">Progress: {project.progress}%</p>
            <div className="progress-track" aria-hidden>
              <span className="progress-fill" style={{ width: `${project.progress}%` }} />
            </div>
          </article>
        ))}
        {!loading && projects.length === 0 ? <div className="portal-card"><p className="muted">No projects assigned yet.</p></div> : null}
      </div>
    </section>
  );
}
