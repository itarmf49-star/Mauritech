"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Project } from "@/types/content";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type ProjectsGridProps = {
  items: Project[];
  locale: Locale;
};

export function ProjectsGrid({ items, locale }: ProjectsGridProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = ["all", "ip telephony", "security", "networking", "automation", "data center"];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((project) => {
      const haystack = [project.title, project.category, project.description, project.summary, ...(project.tags ?? [])]
        .join(" ")
        .toLowerCase();
      const queryOk = !q || haystack.includes(q);
      const filterOk = activeFilter === "all" || haystack.includes(activeFilter);
      return queryOk && filterOk;
    });
  }, [items, query, activeFilter]);

  return (
    <section className="container section" aria-labelledby="projects-title">
      <div className="row-between" style={{ gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
        <h2 id="projects-title">{t(locale, "projectsTitle")}</h2>
        <input
          className="input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, technologies, or categories"
          aria-label="Search projects"
          style={{ width: "min(420px, 100%)" }}
        />
      </div>
      <div className="hero-actions" style={{ marginTop: "0.1rem", marginBottom: "0.9rem" }}>
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={["pill", activeFilter === filter ? "pill-active" : ""].join(" ")}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="card-grid">
        {filtered.map((project, idx) => (
          <article
            key={project.id}
            className={["card", project.featured || idx === 0 ? "featured-project-card" : ""].join(" ")}
          >
            <Image
              src={project.image}
              alt={project.title}
              width={640}
              height={420}
              loading="lazy"
              sizes="(max-width: 900px) 100vw, 33vw"
            />
            <p className="eyebrow" style={{ marginTop: "0.65rem" }}>
              {project.category}
            </p>
            {project.badge ? <p className="project-badge">{project.badge}</p> : null}
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <Link href={`/${locale}/projects/${project.slug}`} className="btn btn-primary btn-sm">
              {t(locale, "projectViewDetails")}
            </Link>
          </article>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="muted">No results found. Try searching by IPBX, CCTV, data center, VoIP, VLAN, or automation.</p>
      ) : null}
    </section>
  );
}
