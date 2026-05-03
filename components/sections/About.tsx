"use client";

import { motion } from "framer-motion";

import { HudPanel } from "@/components/ui/HudPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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

const TIMELINE = [
  {
    title: "TechOps / MSP Engineer",
    org: "Global4 Communications",
    period: "2022–PRESENT",
    status: "success" as const,
  },
  {
    title: "Senior IT Operations Analyst",
    org: "Carrs Group",
    period: "2020–2022",
    status: "pending" as const,
  },
  {
    title: "Windows 10 Deployment Engineer",
    org: "STK (NHS Contract)",
    period: "2019–2020",
    status: "pending" as const,
  },
];

export function About() {
  const { ref, inView } = useScrollReveal();

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-24 px-[clamp(1rem,5vw,3rem)] pb-[clamp(3rem,8vw,7rem)] pt-[clamp(0rem,calc(8vw_-_6.25rem),0.75rem)]"
    >
      <SectionHeader index="01" title="ABOUT" />

      <motion.div
        className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]"
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={container}
      >
        <motion.div variants={item}>
          <HudPanel variant="double" contentClassName="p-6 md:p-8">
            <div className="mb-6">
              <StatusBadge status="success" label="OPEN TO WORK — UK REMOTE / HYBRID" />
            </div>
            <div className="space-y-4 text-[clamp(0.95rem,2vw,1.05rem)] leading-relaxed text-text">
              <p>
                I am Mihai, operating under the Blue Layer Systems brand. I design and
                operate cloud platforms with a bias for measurable reliability, clean
                governance, and operability at 03:00.
              </p>
              <p>
                My work spans Azure landing zones, Kubernetes platforms, Terraform
                modules, and CI/CD rails that keep teams shipping without sacrificing
                guardrails.
              </p>
              <p>
                I bring an MSP-grade sense of ownership: documentation, monitoring, and
                handover are part of the deliverable—not an afterthought.
              </p>
            </div>
          </HudPanel>
        </motion.div>

        <div className="flex flex-col gap-6">
          <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              ["3+", "YRS EXP"],
              ["AZ-104", "CERTIFIED"],
              ["15+", "TOOLS"],
              ["128GB", "RAM LAB"],
            ].map(([a, b]) => (
              <HudPanel key={b} contentClassName="p-4 text-center">
                <p className="font-display text-2xl font-semibold text-text-bright md:text-3xl">
                  {a}
                </p>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                  {b}
                </p>
              </HudPanel>
            ))}
          </motion.div>

          <motion.div variants={item}>
            <HudPanel label="EXPERIENCE // TIMELINE" index="LOG" contentClassName="p-5 md:p-6">
              <ul className="space-y-5">
                {TIMELINE.map((row) => (
                  <li
                    key={row.title}
                    className="flex gap-3 border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="mt-1 shrink-0">
                      <StatusBadge
                        status={row.status === "success" ? "success" : "pending"}
                        aria-label={row.status === "success" ? "Current role" : "Past role"}
                      />
                    </div>
                    <div>
                      <p className="font-display text-lg font-medium text-text-bright">
                        {row.title}
                      </p>
                      <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">
                        {row.org} · {row.period}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </HudPanel>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
