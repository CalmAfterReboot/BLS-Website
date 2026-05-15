"use client";

import { useEffect, useState } from "react";
import { ExternalLink, GitBranch } from "lucide-react";
import { projectsFallback, type Project } from "@/data/projects-fallback";

type ProjectStatus = "ACTIVE" | "PLANNED" | "COMPLETE";

function inferStatus(p: Project): ProjectStatus {
  // TODO: surface status from data layer once /api/projects exposes it
  if (!p.updatedAt) return "PLANNED";
  const days = (Date.now() - new Date(p.updatedAt).getTime()) / 86_400_000;
  if (days > 365) return "COMPLETE";
  return "ACTIVE";
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const colour =
    status === "ACTIVE"   ? "border-l-status-ok text-status-ok"
    : status === "PLANNED" ? "border-l-status-warning text-status-warning"
    :                        "border-l-status-info text-status-info";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 border border-border ${colour} border-l-2 font-mono text-[10px] uppercase tracking-wider`}
    >
      [ {status} ]
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const status = inferStatus(project);
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      className="group block border border-border bg-surface p-5 hover:border-accent-olive transition-colors"
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <GitBranch size={14} className="text-text-mute flex-shrink-0" />
          <span className="font-sans font-medium text-text truncate">
            {project.name}
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      <p className="text-sm text-text-dim leading-relaxed mb-4">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.topics.slice(0, 6).map((topic) => (
          <span
            key={topic}
            className="px-1.5 py-0.5 border border-border font-mono text-[10px] text-text-dim uppercase tracking-wider"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between font-mono text-xs text-text-mute uppercase tracking-wider">
        <span>{project.language || "—"}</span>
        <span className="inline-flex items-center gap-1 group-hover:text-accent-olive transition-colors">
          GitHub <ExternalLink size={11} />
        </span>
      </div>
    </a>
  );
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(projectsFallback);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="projects" className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="border-t border-b border-border py-2 mb-10">
          <p className="font-mono text-xs text-accent-olive tracking-widest uppercase">
            {"// PROJECTS — BLS PORTFOLIO"}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-10">
          <a
            href="https://github.com/CalmAfterReboot"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-mute hover:text-accent-olive transition-colors uppercase tracking-wider"
          >
            View all on GitHub <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </section>
  );
}
