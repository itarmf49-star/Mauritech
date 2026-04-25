"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/types/content";
import { services, siteConfig, testimonials } from "@/lib/content";

type BrandExpansionProps = {
  locale: Locale;
  projects: Project[];
};

const trustPillars = [
  "Secure Deployments",
  "Scalable Infrastructure",
  "Reliable Support",
  "Enterprise Standards",
  "Fast Response",
  "Future-Ready Solutions",
];

const stats = [
  { label: "Deployments completed", value: "50+" },
  { label: "Support availability", value: "24/7" },
  { label: "Infrastructure uptime", value: "99.9%" },
  { label: "Security posture", value: "Enterprise grade" },
];

export function BrandExpansion({ locale, projects }: BrandExpansionProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = ["all", "telephony", "security", "networking", "automation", "data center"];
  const searchableItems = useMemo(() => {
    const serviceItems = services.map((service) => ({
      type: "Service",
      title: service.title,
      description: service.description,
      href: `/${locale}${service.href}`,
    }));
    const projectItems = projects.map((project) => ({
      type: "Project",
      title: project.title,
      description: `${project.summary} ${(project.tags ?? []).join(" ")}`,
      href: `/${locale}/projects/${project.slug}`,
    }));
    const industryItems = ["Government", "Healthcare", "Education", "Retail", "Hospitality", "Industrial"]
      .map((name) => ({ type: "Industry", title: name, description: "Enterprise infrastructure deployment expertise", href: `/${locale}/industries` }));
    return [...serviceItems, ...projectItems, ...industryItems];
  }, [locale, projects]);

  const filteredSearch = useMemo(() => {
    const q = query.trim().toLowerCase();
    return searchableItems
      .filter((item) => {
        const h = `${item.type} ${item.title} ${item.description}`.toLowerCase();
        const queryOk = !q || h.includes(q);
        const filterOk = activeFilter === "all" || h.includes(activeFilter);
        return queryOk && filterOk;
      })
      .slice(0, 8);
  }, [activeFilter, query, searchableItems]);

  const orderedFeatured = useMemo(() => {
    const flagship = projects.find((project) => project.slug === "enterprise-ipbx-office-voip-deployment");
    const rest = projects.filter((project) => project.slug !== "enterprise-ipbx-office-voip-deployment");
    return flagship ? [flagship, ...rest] : projects;
  }, [projects]);

  return (
    <>
      <section className="container section">
        <p className="eyebrow">Search</p>
        <h2 className="h2">Find projects, services, and solution references instantly</h2>
        <input
          className="input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, services, or support topics"
          aria-label="Search projects and services"
          style={{ width: "min(520px, 100%)", marginBottom: "1rem" }}
        />
        <div className="hero-actions" style={{ marginTop: "-0.2rem", marginBottom: "0.9rem" }}>
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
          {filteredSearch.map((item) => (
            <article className="card" key={`${item.type}-${item.href}`}>
              <p className="eyebrow">{item.type}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link className="inline-link" href={item.href}>
                Open
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">About MauriTech</p>
        <h2 className="h2">Trusted infrastructure partner for Mauritania and West Africa</h2>
        <p className="muted">
          MauriTech helps organizations modernize with secure network engineering, cloud-ready infrastructure, and smart
          automation. We combine enterprise standards with local execution capability to deliver dependable operations.
        </p>
      </section>

      <section className="container section">
        <p className="eyebrow">Why choose MauriTech</p>
        <div className="card-grid">
          {trustPillars.map((item) => (
            <article className="card" key={item}>
              <h3>{item}</h3>
              <p>Designed for high availability, secure operations, and long-term business continuity.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="card-grid">
          {stats.map((item) => (
            <article className="card" key={item.label}>
              <p className="eyebrow">{item.label}</p>
              <h3>{item.value}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">Featured projects</p>
        <h2 className="h2">Built for real operational environments</h2>
        <div className="card-grid">
          {orderedFeatured.slice(0, 6).map((project, idx) => (
            <motion.article
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              key={project.id}
              className={["card", idx === 0 ? "featured-project-card" : ""].join(" ")}
            >
              <p className="eyebrow">{project.category}</p>
              {idx === 0 ? <p className="project-badge">{project.badge ?? "Enterprise Case Study"}</p> : null}
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <Link className={idx === 0 ? "btn btn-primary btn-sm" : "inline-link"} href={`/${locale}/projects/${project.slug}`}>
                {idx === 0 ? "Explore flagship case study" : "View full case study"}
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">Enterprise capabilities</p>
        <div className="card-grid">
          <article className="card"><h3>Infrastructure architecture</h3><p>Network, server, telephony, and security architecture aligned to enterprise standards.</p></article>
          <article className="card"><h3>Deployment workflow</h3><p>Assessment, design, rollout, validation, documentation, and managed support continuity.</p></article>
          <article className="card"><h3>Industries served</h3><p>Government, healthcare, logistics, education, hospitality, finance, and industrial operations.</p></article>
          <article className="card"><h3>Support and maintenance</h3><p>Preventive maintenance, incident response, health checks, and 24/7 escalation coverage.</p></article>
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">Client portal</p>
        <div className="cta-glass">
          <div>
            <h2 className="h2">Track projects, invoices, support, and communication in one place</h2>
            <p className="muted">
              Portal access provides project progress visibility, invoice downloads, secure messaging, and support
              requests through a unified experience.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-primary btn-md" href={`/${locale}/portal-access`}>
              Open portal
            </Link>
            <Link className="btn btn-ghost btn-md" href={`/${locale}/login`}>
              Portal login
            </Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">Testimonials</p>
        <div className="card-grid">
          {testimonials.map((item) => (
            <article className="card" key={item.id}>
              <p>&ldquo;{item.quote}&rdquo;</p>
              <h3>{item.name}</h3>
              <p className="muted">{item.role}</p>
            </article>
          ))}
          <article className="card">
            <h3>Support and response</h3>
            <p>Office hours: {siteConfig.officeHours}</p>
            <p>Availability: {siteConfig.availability}</p>
            <p>Response promise: {siteConfig.responseTime}</p>
          </article>
        </div>
      </section>
    </>
  );
}
