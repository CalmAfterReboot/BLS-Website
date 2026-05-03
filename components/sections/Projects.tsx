"use client";

import { motion } from "framer-motion";

import { HudPanel } from "@/components/ui/HudPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tag } from "@/components/ui/Tag";
import { useGitHubDeployments, useGitHubRepos } from "@/hooks/useGitHub";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { DeploymentState, ProcessedRepo } from "@/types/github";

function deployBadge(state: DeploymentState | undefined): {
  status: "success" | "pending" | "failure";
  label: string;
} {
  switch (state) {
    case "success":
      return { status: "success", label: "DEPLOY // OK" };
    case "failure":
    case "error":
      return { status: "failure", label: "DEPLOY // FAIL" };
    case "in_progress":
    case "queued":
    case "waiting":
    case "pending":
      return { status: "pending", label: "DEPLOY // ACTIVE" };
    default:
      return { status: "pending", label: "DEPLOY // N/A" };
  }
}

function SkeletonCard() {
  return (
    <div className="animate-pulse border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <div className="mb-3 h-3 w-1/3 rounded bg-[var(--dim)]" />
      <div className="mb-2 h-5 w-2/3 rounded bg-[var(--dim)]" />
      <div className="mb-4 h-12 rounded bg-[var(--bg-panel)]" />
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded bg-[var(--bg-panel)]" />
        <div className="h-5 w-14 rounded bg-[var(--bg-panel)]" />
      </div>
    </div>
  );
}

function ProjectCard({
  repo,
  dep,
}: {
  repo: ProcessedRepo;
  dep: DeploymentState | undefined;
}) {
  const badge = deployBadge(dep);
  const topics = repo.topics?.slice(0, 6) ?? [];

  return (
    <HudPanel contentClassName="flex h-full flex-col p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-accent">
          {repo.phase}
        </span>
        <StatusBadge status={badge.status} label={badge.label} />
      </div>
      <h3 className="mb-2 break-all font-mono text-lg text-text-bright">{repo.name}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-text">{repo.blsDescription}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {topics.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">
        <span>{repo.language ?? "—"}</span>
        <span>★ {repo.stargazers_count}</span>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:text-[var(--accent-bright)]"
        >
          GITHUB →
        </a>
      </div>
    </HudPanel>
  );
}

const grid = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const cell = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Projects() {
  const { ref, inView } = useScrollReveal();
  const { data, isLoading, error } = useGitHubRepos();
  const { data: depData } = useGitHubDeployments();

  const depMap = new Map<string, DeploymentState>();
  depData?.deployments?.forEach((d) => depMap.set(d.repo, d.state));

  const repos = data?.repos ?? [];

  return (
    <section
      id="projects"
      ref={ref}
      className="scroll-mt-24 px-[clamp(1rem,5vw,3rem)] py-[clamp(3rem,8vw,7rem)]"
    >
      <SectionHeader index="02" title="PROJECTS" />

      {error ? (
        <p className="mx-auto max-w-6xl font-mono text-sm text-[var(--red)]">
          UNABLE TO REACH GITHUB FEED. ROUTES WILL RETRY ON REFRESH.
        </p>
      ) : null}

      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={grid}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} variants={cell}>
                <SkeletonCard />
              </motion.div>
            ))
          : repos.map((repo) => (
              <motion.div key={repo.id} variants={cell}>
                <ProjectCard repo={repo} dep={depMap.get(repo.name)} />
              </motion.div>
            ))}
      </motion.div>
    </section>
  );
}
