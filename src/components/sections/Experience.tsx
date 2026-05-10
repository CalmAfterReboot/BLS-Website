"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useInView } from "react-intersection-observer";
import { ChevronDown, ChevronUp } from "lucide-react";
import { timeline } from "@/data/timeline";
import { slideUp, staggerContainer } from "@/lib/motion-variants";

export function Experience() {
  const [expanded, setExpanded] = useState<string | null>("bls-current");
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="experience" className="py-24 px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--nebula-green)] mb-3">
            04 // EXPERIENCE
          </p>
          <h2 className="font-display text-4xl lg:text-5xl tracking-wider">THE TIMELINE</h2>
        </motion.div>

        <div className="relative">
          {/* Spine line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--border-subtle)]" />

          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-4 pl-16"
          >
            {timeline.map((entry) => {
              const isOpen = expanded === entry.id;

              return (
                <motion.div key={entry.id} variants={slideUp} className="relative">
                  {/* Timeline node */}
                  <div
                    className="absolute -left-[3.25rem] top-6 w-4 h-4 rounded-full border-2 transition-all duration-300"
                    style={{
                      borderColor: entry.accent,
                      background: isOpen ? entry.accent : "var(--cosmos-void)",
                      boxShadow: isOpen ? `0 0 12px ${entry.accent}` : "none",
                    }}
                  />

                  <div
                    className="border border-[var(--border-subtle)] bg-[var(--cosmos-deep)]/40 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300"
                    style={{ borderColor: isOpen ? `${entry.accent}40` : undefined }}
                  >
                    {/* Header */}
                    <button
                      data-cursor="hover"
                      onClick={() =>
                        setExpanded((prev) => (prev === entry.id ? null : entry.id))
                      }
                      className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <span
                            className="font-mono text-xs tracking-[0.2em] px-2 py-0.5 rounded border"
                            style={{
                              borderColor: `${entry.accent}40`,
                              color: entry.accent,
                              background: `${entry.accent}15`,
                            }}
                          >
                            {entry.era}
                          </span>
                          <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider">
                            {entry.period}
                          </span>
                        </div>
                        <h3 className="font-display text-xl tracking-wider mb-0.5">
                          {entry.role}
                        </h3>
                        <p className="font-body text-sm text-[var(--text-secondary)]">
                          {entry.company} · {entry.location}
                        </p>
                      </div>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-[var(--text-muted)] mt-1 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-[var(--text-muted)] mt-1 flex-shrink-0" />
                      )}
                    </button>

                    {/* Expanded body */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 border-t border-[var(--border-subtle)]">
                            <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed mt-4 mb-5">
                              {entry.summary}
                            </p>

                            {/* Highlights */}
                            <ul className="space-y-2 mb-5">
                              {entry.highlights.map((h) => (
                                <li
                                  key={h}
                                  className="flex items-start gap-3 font-body text-sm text-[var(--text-secondary)]"
                                >
                                  <span
                                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ background: entry.accent }}
                                  />
                                  {h}
                                </li>
                              ))}
                            </ul>

                            {/* Tech tags */}
                            <div className="flex flex-wrap gap-2">
                              {entry.tech.map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 border rounded font-mono text-[10px] tracking-wider text-[var(--text-secondary)]"
                                  style={{ borderColor: `${entry.accent}30` }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
