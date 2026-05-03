"use client";

import { motion } from "framer-motion";

import { HudPanel } from "@/components/ui/HudPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const NODES = [
  { k: "GITHUB", v: "CalmAfterReboot", href: "https://github.com/CalmAfterReboot" },
  { k: "DOMAIN", v: "bluelayersystems.com", href: "https://bluelayersystems.com" },
  { k: "LOCATION", v: "Carlisle, UK", href: null },
  { k: "STATUS", v: "OPEN TO WORK", href: null },
] as const;

const ROLES = [
  "Cloud Engineer",
  "DevOps Engineer",
  "Platform Engineer",
  "Site Reliability Engineer",
];

const MAIL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_CONTACT_EMAIL
    ? `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`
    : "mailto:hello@bluelayersystems.com";

export function Contact() {
  const { ref, inView } = useScrollReveal();

  return (
    <section
      id="contact"
      ref={ref}
      className="scroll-mt-24 px-[clamp(1rem,5vw,3rem)] py-[clamp(3rem,8vw,7rem)]"
    >
      <SectionHeader index="04" title="CONTACT" />

      <motion.div
        className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2"
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="flex flex-col gap-6">
          <HudPanel label="CONTACT // NODES" index="NET" contentClassName="p-5 md:p-6">
            <ul className="space-y-4">
              {NODES.map((row) => (
                <li
                  key={row.k}
                  className="flex flex-col gap-1 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                    {row.k}
                  </span>
                  {row.href ? (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all font-mono text-sm text-text hover:text-[var(--accent-bright)]"
                    >
                      {row.v}
                    </a>
                  ) : (
                    <span className="font-mono text-sm text-text">{row.v}</span>
                  )}
                </li>
              ))}
            </ul>
          </HudPanel>

          <HudPanel label="TARGETING // PANEL" index="TGT" contentClassName="p-5 md:p-6">
            <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
              ROLES
            </p>
            <ul className="mb-6 space-y-2">
              {ROLES.map((r) => (
                <li key={r} className="flex items-center gap-2 text-text">
                  <span className="text-accent">›</span>
                  {r}
                </li>
              ))}
            </ul>
            <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
              COMP RANGE
            </p>
            <p className="font-display text-xl text-text-bright">
              £45,000–£65,000
            </p>
            <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">
              UK REMOTE / HYBRID
            </p>
          </HudPanel>
        </div>

        <HudPanel variant="large" label="OUTBOUND // CTA" index="TX" contentClassName="flex min-h-[280px] flex-col justify-between p-6 md:p-8">
          <div>
            <StatusBadge status="success" label="CHANNEL OPEN" />
            <p className="mt-6 max-w-md text-lg leading-relaxed text-text">
              If you are hiring for platform, cloud, or reliability work, send a
              transmission with the role brief and stack. I respond to concise,
              specific signals.
            </p>
          </div>
          <a
            href={MAIL}
            className="group relative mt-8 inline-flex w-full items-center justify-center overflow-hidden border border-[var(--border-hi)] bg-[var(--accent-dim)] px-6 py-4 font-mono text-[0.75rem] uppercase tracking-[0.22em] text-text transition-colors hover:text-[var(--bg)] sm:w-auto"
          >
            <span className="absolute inset-0 z-0 bg-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-10">SEND TRANSMISSION</span>
          </a>
        </HudPanel>
      </motion.div>
    </section>
  );
}
