"use client";

import { motion } from "framer-motion";

import { HudPanel } from "@/components/ui/HudPanel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CATEGORIES: { title: string; skills: { label: string; value: number }[] }[] = [
  {
    title: "Cloud & Infrastructure",
    skills: [
      { label: "Azure", value: 92 },
      { label: "Kubernetes", value: 85 },
      { label: "Terraform", value: 88 },
      { label: "AKS", value: 80 },
      { label: "Landing Zones", value: 85 },
    ],
  },
  {
    title: "CI/CD & DevOps",
    skills: [
      { label: "GitHub Actions", value: 90 },
      { label: "Argo CD", value: 78 },
      { label: "Helm", value: 82 },
      { label: "Release Pipelines", value: 88 },
      { label: "GitOps", value: 80 },
    ],
  },
  {
    title: "Networking & Security",
    skills: [
      { label: "Segmentation", value: 85 },
      { label: "Firewalls / NVA", value: 80 },
      { label: "Key Vault", value: 88 },
      { label: "Policy & RBAC", value: 82 },
      { label: "Private Endpoints", value: 86 },
    ],
  },
  {
    title: "Observability & Scripting",
    skills: [
      { label: "Prometheus", value: 78 },
      { label: "Grafana", value: 85 },
      { label: "PowerShell", value: 90 },
      { label: "Bash", value: 88 },
      { label: "SLO Monitoring", value: 84 },
    ],
  },
];

const CERTS = [
  { name: "AZ-104", status: "success" as const, label: "ACTIVE" },
  { name: "Terraform Associate", status: "pending" as const, label: "IN PROGRESS" },
  { name: "AZ-400", status: "pending" as const, label: "PLANNED" },
  { name: "AZ-305", status: "pending" as const, label: "PLANNED" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Skills() {
  const { ref, inView } = useScrollReveal();

  return (
    <section
      id="skills"
      ref={ref}
      className="scroll-mt-24 px-[clamp(1rem,5vw,3rem)] py-[clamp(3rem,8vw,7rem)]"
    >
      <SectionHeader index="03" title="SKILLS" />

      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2"
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={container}
      >
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.title} variants={item}>
            <HudPanel
              label={cat.title.toUpperCase()}
              index="GRID"
              contentClassName="p-5 md:p-6"
            >
              {cat.skills.map((s) => (
                <ProgressBar key={s.label} label={s.label} value={s.value} active={inView} />
              ))}
            </HudPanel>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mx-auto mt-10 max-w-6xl"
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={item}
      >
        <HudPanel label="CERTIFICATION ROADMAP" index="OPS" contentClassName="p-5 md:p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CERTS.map((c) => (
              <div
                key={c.name}
                className="border border-[var(--border)] bg-[var(--bg-panel)] p-4"
              >
                <p className="font-display text-lg text-text-bright">{c.name}</p>
                <div className="mt-2">
                  <StatusBadge status={c.status === "success" ? "success" : "pending"} label={c.label} />
                </div>
              </div>
            ))}
          </div>
        </HudPanel>
      </motion.div>
    </section>
  );
}
