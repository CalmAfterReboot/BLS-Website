"use client";

import { motion } from "motion/react";
import { ArrowRight, MapPin, Wifi } from "lucide-react";

const HANDLE = "CalmAfterReboot";
const POSITIONING =
  "Senior infrastructure engineer building production tooling for cloud and DevOps adjacent roles. UK-based.";
const LAST_UPDATED = "2026-05-15";
const NAV_CHIPS = [
  { id: "projects",     label: "Projects" },
  { id: "tools",        label: "Tools" },
  { id: "case-studies", label: "Case Studies" },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-20 pb-16 px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Classification banner */}
        <div className="border-t border-b border-border py-2 mb-10">
          <p className="font-mono text-xs text-accent-olive tracking-widest uppercase">
            {"// SYSTEM STATUS: OPERATIONAL"}
          </p>
        </div>

        {/* Handle */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="font-sans font-semibold text-4xl sm:text-5xl md:text-6xl text-text mb-6"
        >
          {HANDLE}
        </motion.h1>

        {/* Positioning */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="text-lg text-text-dim max-w-2xl leading-relaxed mb-10"
        >
          {POSITIONING}
        </motion.p>

        {/* Navigation chips */}
        <div className="flex flex-wrap gap-3 mb-16">
          {NAV_CHIPS.map((chip) => (
            <a
              key={chip.id}
              href={`#${chip.id}`}
              data-cursor="hover"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-surface text-text font-mono text-sm uppercase tracking-wider hover:border-accent-olive hover:text-accent-olive transition-colors"
            >
              {chip.label}
              <ArrowRight size={14} />
            </a>
          ))}
        </div>

        {/* Status line */}
        <div className="border-t border-border pt-4">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-text-mute uppercase tracking-wider">
            <div>
              <dt className="text-text-mute mb-1">Location</dt>
              <dd className="text-text-dim flex items-center gap-1.5">
                <MapPin size={11} />
                Carlisle, UK
              </dd>
            </div>
            <div>
              <dt className="text-text-mute mb-1">Focus</dt>
              <dd className="text-text-dim flex items-center gap-1.5">
                <Wifi size={11} />
                Platform / DevOps / SRE
              </dd>
            </div>
            <div>
              <dt className="text-text-mute mb-1">Last updated</dt>
              <dd className="text-text-dim">{LAST_UPDATED}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
