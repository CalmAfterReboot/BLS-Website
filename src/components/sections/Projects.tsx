"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Star, GitBranch, Code2 } from "lucide-react";
import { projectsFallback, type Project } from "@/data/projects-fallback";
import { staggerContainer, slideUp } from "@/lib/motion-variants";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      variants={slideUp}
      whileHover={{ y: -4 }}
      className="group relative block border border-[var(--border-subtle)] bg-[var(--cosmos-deep)]/50 backdrop-blur-sm rounded-lg p-6 transition-all duration-300 overflow-hidden"
    >
      {/* Accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, ${project.accent}12 0%, transparent 60%)`,
        }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch size={14} style={{ color: project.accent }} />
          <span
            className="font-display text-lg tracking-wider"
            style={{ color: project.accent }}
          >
            {project.name}
          </span>
        </div>
        <ExternalLink
          size={14}
          className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors"
        />
      </div>

      {/* Description */}
      <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.topics.slice(0, 5).map((topic) => (
          <span
            key={topic}
            className="px-2 py-0.5 border rounded font-mono text-[10px] tracking-wider"
            style={{
              borderColor: `${project.accent}30`,
              color: "var(--text-secondary)",
            }}
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 font-mono text-xs text-[var(--text-muted)]">
        {project.language && (
          <span className="flex items-center gap-1">
            <Code2 size={10} />
            {project.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star size={10} />
          {project.stars}
        </span>
      </div>

      {/* Active indicator */}
      <div
        className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
        style={{ background: project.accent }}
      />
    </motion.a>
  );
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(projectsFallback);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="projects" className="py-24 px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--nebula-gold)] mb-3">03 // PROJECTS</p>
          <h2 className="font-display text-4xl lg:text-5xl tracking-wider mb-4">LIVE SYSTEMS</h2>
          <p className="font-body text-[var(--text-secondary)] max-w-xl">
            Production-grade infrastructure projects. Each deployed, secured, and cost-governed.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <a
            href="https://github.com/CalmAfterReboot"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--text-muted)] hover:text-[var(--nebula-cyan)] transition-colors tracking-wider"
          >
            VIEW ALL ON GITHUB
            <ExternalLink size={12} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
