"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { X } from "lucide-react";
import { timeline, type Era } from "@/data/timeline";

export function Experience() {
  const [activeEra, setActiveEra] = useState<Era | null>(null);
  const [portalEra, setPortalEra] = useState<Era | null>(null);

  useEffect(() => {
    if (!portalEra) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setPortalEra(null); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", fn);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", fn); };
  }, [portalEra]);

  return (
    <section id="experience" className="min-h-screen py-24 px-6 lg:px-12 relative">
      <motion.h2
        className="font-display text-3xl md:text-5xl tracking-widest mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        OPERATIONAL HISTORY
      </motion.h2>

      <AnimatePresence>
        {portalEra && (
          <EraPortal
            key={portalEra.id}
            era={portalEra}
            onClose={() => setPortalEra(null)}
          />
        )}
      </AnimatePresence>

      <div className="relative max-w-[600px] mx-auto">
        <motion.div
          className="absolute left-4 top-0 w-px bg-gradient-to-b from-transparent via-nebula-cyan to-transparent"
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 2.0, ease: "easeOut" }}
          style={{ boxShadow: "0 0 8px var(--nebula-cyan)" }}
        />

        {timeline.map((era, i) => (
          <EraCard
            key={era.id}
            era={era}
            index={i}
            isActive={activeEra?.id === era.id && !portalEra}
            onEnterView={() => { if (!portalEra) setActiveEra(era); }}
            onLeaveView={() => {
              setTimeout(() => {
                setActiveEra((prev) => prev?.id === era.id ? null : prev);
              }, 600);
            }}
            onClick={() => setPortalEra(era)}
          />
        ))}
      </div>
    </section>
  );
}

function EraCard({ era, index, isActive, onEnterView, onLeaveView, onClick }: {
  era: Era; index: number; isActive: boolean;
  onEnterView: () => void; onLeaveView: () => void; onClick: () => void;
}) {
  const { ref, inView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView) onEnterView();
    else onLeaveView();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      data-cursor="hover"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      animate={{
        borderColor: isActive ? era.palette.accent : `${era.palette.accent}33`,
        boxShadow: isActive
          ? `0 0 40px ${era.palette.accent}44, 0 0 80px ${era.palette.accent}22`
          : "none",
      }}
      className="relative ml-10 mb-8 p-5 rounded-lg border
        bg-[var(--cosmos-deep)]/60 backdrop-blur-sm cursor-pointer transition-all duration-500"
    >
      <motion.span
        className="absolute -left-[22px] top-6 w-3 h-3 rounded-full"
        animate={{
          boxShadow: isActive
            ? `0 0 20px ${era.palette.accent}, 0 0 40px ${era.palette.accent}`
            : `0 0 8px ${era.palette.accent}`,
        }}
        style={{ background: era.palette.accent }}
      />

      <div
        className="inline-block font-mono text-xs tracking-widest px-2 py-0.5 rounded border mb-3"
        style={{ color: era.palette.accent, borderColor: `${era.palette.accent}55`, background: `${era.palette.accent}12` }}
      >
        {era.type}
      </div>

      <div className="font-mono text-xs tracking-wider text-[var(--text-muted)] mb-2">{era.period}</div>
      <h3 className="font-display text-xl tracking-wider mb-1">{era.role}</h3>
      <div className="font-mono text-sm text-[var(--text-secondary)] mb-4">
        {era.company} · {era.location}
      </div>

      <motion.div
        className="font-mono text-xs uppercase tracking-widest"
        animate={{ color: isActive ? era.palette.accent : "var(--text-muted)" }}
      >
        {isActive ? "CLICK FOR FULL DETAIL →" : "SCROLL TO REVEAL · CLICK FOR FULL DETAIL →"}
      </motion.div>
    </motion.div>
  );
}

function EraPortal({ era, onClose }: { era: Era; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: era.palette.bg }}
    >
      <div className="max-w-5xl mx-auto p-8 md:p-16 relative">
        <button
          onClick={onClose}
          data-cursor="hover"
          className="absolute top-8 right-8 text-[var(--text-secondary)] hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={28} />
        </button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="font-mono text-sm tracking-widest mb-4" style={{ color: era.palette.accent }}>
            {era.period} · {era.type}
          </div>
          <h2 className="font-display text-5xl md:text-7xl tracking-wider mb-3">{era.role}</h2>
          <div className="font-mono text-xl text-[var(--text-secondary)] mb-12">
            {era.company} · {era.location}
          </div>
          <p className="text-lg max-w-3xl mb-16 leading-relaxed text-[var(--text-secondary)]">
            {era.summary}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {era.achievements.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="p-6 rounded-lg border bg-black/20"
              style={{ borderColor: `${era.palette.accent}33` }}
            >
              <div className="text-3xl mb-3">{a.icon}</div>
              <h4 className="font-display text-xl tracking-wider mb-2" style={{ color: era.palette.accent }}>
                {a.title}
              </h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">{a.detail}</p>
              <div className="flex flex-wrap gap-2">
                {a.tags.map((t) => (
                  <span key={t} className="px-2 py-1 text-xs font-mono border rounded"
                    style={{ borderColor: `${era.palette.accent}55`, color: era.palette.accent }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid md:grid-cols-2 gap-12"
        >
          <div>
            <h5 className="font-mono text-xs tracking-widest mb-4 text-[var(--text-muted)]">USED DAILY</h5>
            <div className="flex flex-wrap gap-2">
              {era.daily.map((t) => (
                <span key={t} className="px-3 py-1 text-sm font-mono border border-[var(--border-subtle)] rounded">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-mono text-xs tracking-widest mb-4 text-[var(--text-muted)]">DEEPENED HERE</h5>
            <div className="flex flex-wrap gap-2">
              {era.deepened.map((t) => (
                <span key={t} className="px-3 py-1 text-sm font-mono border rounded"
                  style={{ borderColor: `${era.palette.accent}55`, color: era.palette.accent }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
