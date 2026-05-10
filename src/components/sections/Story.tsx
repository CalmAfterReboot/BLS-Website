"use client";

import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { StatCounter } from "@/components/ui/StatCounter";
import { staggerContainer, slideUp, clipReveal } from "@/lib/motion-variants";

function Panel({
  title,
  era,
  children,
  delay = 0,
}: {
  title: string;
  era: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer(0.1, delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative border border-[var(--border-subtle)] bg-[var(--cosmos-deep)]/40 backdrop-blur-sm rounded-lg p-8 lg:p-10 overflow-hidden"
    >
      {/* Era label */}
      <motion.div
        variants={slideUp}
        className="font-mono text-xs tracking-[0.3em] text-[var(--text-muted)] mb-4"
      >
        {era}
      </motion.div>

      {/* Headline */}
      <motion.h3
        variants={clipReveal}
        className="font-display text-3xl lg:text-4xl tracking-wider mb-6"
      >
        {title}
      </motion.h3>

      {children}

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
        <div className="absolute top-0 right-0 w-full h-px bg-[var(--nebula-cyan)]" />
        <div className="absolute top-0 right-0 h-full w-px bg-[var(--nebula-cyan)]" />
      </div>
    </motion.div>
  );
}

export function Story() {
  return (
    <section id="story" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--nebula-cyan)] mb-3">01 // STORY</p>
          <h2 className="font-display text-4xl lg:text-5xl tracking-wider">THE OPERATOR</h2>
        </motion.div>

        <div className="space-y-8">
          {/* Panel 1 — Foundation */}
          <Panel era="ERA 01 // FOUNDATION" title="STARTED IN THE TRENCHES">
            <motion.div variants={slideUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { to: 50,   suffix: "+", label: "Client Tenants" },
                { to: 500,  suffix: "+", label: "Endpoints Managed" },
                { to: 2000, suffix: "+", label: "NHS Endpoints Deployed" },
                { to: 99,   suffix: "%", label: "Deployment Success" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <StatCounter to={stat.to} suffix={stat.suffix} />
                  <p className="font-mono text-xs text-[var(--text-muted)] mt-2 tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
            <motion.p variants={slideUp} className="font-body text-[var(--text-secondary)] leading-relaxed">
              Five years in the IT trenches — MSP support, on-site deployments, 3am incidents.
              Built the muscle memory that means cloud architecture is never theoretical.
            </motion.p>
          </Panel>

          {/* Panel 2 — Elevation */}
          <Panel era="ERA 02 // ELEVATION" title="MOVED TO THE CLOUD" delay={0.1}>
            <motion.p variants={slideUp} className="font-body text-[var(--text-secondary)] leading-relaxed mb-8">
              From FTSE-listed infrastructure to sole escalation point for 50+ MSP tenants.
              Azure, Hyper-V, AVD, FSLogix, Terraform, GitHub Actions — production, daily.
            </motion.p>

            {/* Cert roadmap */}
            <motion.div variants={staggerContainer(0.15)} className="flex flex-wrap gap-4">
              {[
                { label: "AZ-900",            status: "earned",      color: "#00FF88" },
                { label: "AZ-104",            status: "earned",      color: "#00FF88" },
                { label: "Terraform Assoc.",  status: "in-progress", color: "#FFB347" },
                { label: "AZ-400",            status: "next",        color: "#7B4FFF" },
              ].map((cert) => (
                <motion.div
                  key={cert.label}
                  variants={slideUp}
                  className="flex items-center gap-2 px-4 py-2 border rounded-full font-mono text-xs tracking-wider"
                  style={{
                    borderColor: `${cert.color}40`,
                    color: cert.color,
                    background: `${cert.color}10`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: cert.color }}
                  />
                  {cert.label}
                  <span className="text-[var(--text-muted)] normal-case">
                    {cert.status === "earned" ? "✓" : cert.status === "in-progress" ? "→" : "◦"}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </Panel>

          {/* Panel 3 — Mission */}
          <Panel era="ERA 03 // MISSION" title="BUILDING BLUE LAYER SYSTEMS" delay={0.2}>
            <motion.p variants={slideUp} className="font-body text-[var(--text-secondary)] leading-relaxed mb-8">
              Three production-grade portfolio projects. Terraform. AKS. LiteLLM.
              Deployed, security-scanned, cost-governed — built to the same standard as enterprise infrastructure.
            </motion.p>

            {/* Architecture flow */}
            <motion.div
              variants={staggerContainer(0.12)}
              className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-wider"
            >
              {[
                { label: "Proxmox Lab", color: "#FF6B9D" },
                "→",
                { label: "GitHub Actions", color: "#7B4FFF" },
                "→",
                { label: "Azure Landing Zone", color: "#00D4FF" },
                "→",
                { label: "AKS", color: "#00D4FF" },
                "→",
                { label: "AI Gateway", color: "#FFB347" },
              ].map((item, i) =>
                typeof item === "string" ? (
                  <motion.span key={i} variants={slideUp} className="text-[var(--text-muted)]">
                    {item}
                  </motion.span>
                ) : (
                  <motion.span
                    key={i}
                    variants={slideUp}
                    className="px-3 py-1 border rounded"
                    style={{
                      borderColor: `${item.color}40`,
                      color: item.color,
                      background: `${item.color}12`,
                    }}
                  >
                    {item.label}
                  </motion.span>
                )
              )}
            </motion.div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
