"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { X } from "lucide-react";
import { timeline, type Era } from "@/data/timeline";

export function Experience() {
  const [overlayEra, setOverlayEra] = useState<Era | null>(null);
  const [portalEra, setPortalEra]   = useState<Era | null>(null);

  useEffect(() => {
    if (!portalEra) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setPortalEra(null); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", fn);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", fn); };
  }, [portalEra]);

  useEffect(() => {
    if (!overlayEra || portalEra) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOverlayEra(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [overlayEra, portalEra]);

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

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        {/* LEFT — cards column */}
        <div className="relative w-full lg:w-[380px] flex-shrink-0">
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
              isActive={overlayEra?.id === era.id && !portalEra}
              onEnterView={() => { if (!portalEra) setOverlayEra(era); }}
              onLeaveView={() => {
                setTimeout(() => {
                  setOverlayEra((prev) => prev?.id === era.id ? null : prev);
                }, 600);
              }}
              onClick={() => { setOverlayEra(null); setPortalEra(era); }}
            />
          ))}
        </div>

        {/* RIGHT — sticky panel */}
        <div className="flex-1 sticky top-24">
          <AnimatePresence mode="wait">
            {overlayEra && !portalEra && (
              <EraPanel
                key={overlayEra.id}
                era={overlayEra}
                onClose={() => setOverlayEra(null)}
                onEnterFull={() => { setPortalEra(overlayEra); setOverlayEra(null); }}
              />
            )}
          </AnimatePresence>
        </div>
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
      {/* Timeline node aligned to spine */}
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
        {isActive ? "CLICK TO GO DEEPER →" : "CLICK FOR FULL DETAIL →"}
      </motion.div>
    </motion.div>
  );
}

function EraPanel({ era, onClose, onEnterFull }: {
  era: Era; onClose: () => void; onEnterFull: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${era.palette.bg}F2, ${era.palette.bg}FA)`,
        border: `1px solid ${era.palette.accent}44`,
        backdropFilter: "blur(28px)",
        boxShadow: `0 24px 80px ${era.palette.accent}18`,
      }}
    >
      <div className="h-[2px] w-full" style={{ background: era.palette.accent, boxShadow: `0 0 20px ${era.palette.accent}` }} />

      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="font-mono text-xs tracking-[0.25em] mb-2 opacity-60" style={{ color: era.palette.accent }}>
              {era.period}
            </div>
            <h3 className="font-display text-3xl tracking-wider mb-1" style={{ color: era.palette.accent }}>
              {era.role}
            </h3>
            <p className="font-mono text-sm text-[var(--text-secondary)]">
              {era.company} · {era.location}
            </p>
          </div>
          <button
            onClick={onClose}
            data-cursor="hover"
            className="text-[var(--text-muted)] hover:text-white transition-colors mt-1 flex-shrink-0 ml-4"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-px mb-6 opacity-20" style={{ background: era.palette.accent }} />

        <p className="text-sm leading-[1.8] text-[var(--text-primary)] mb-8">{era.summary}</p>

        <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-muted)] uppercase mb-4">
          Key Achievements
        </p>
        <div className="space-y-4 mb-8">
          {era.achievements.slice(0, 4).map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex gap-4 p-4 rounded-lg border"
              style={{ borderColor: `${era.palette.accent}22`, background: `${era.palette.accent}06` }}
            >
              <span className="text-2xl flex-shrink-0">{a.icon}</span>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{a.title}</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {a.detail.split(".")[0]}.
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-muted)] uppercase mb-3">
          Daily Stack
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {era.daily.slice(0, 9).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-mono rounded border"
              style={{ borderColor: `${era.palette.accent}40`, color: era.palette.accent, background: `${era.palette.accent}08` }}
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={onEnterFull}
          data-cursor="hover"
          className="w-full py-4 font-mono text-sm tracking-widest border rounded-lg transition-all duration-300 hover:bg-white/5"
          style={{ borderColor: era.palette.accent, color: era.palette.accent }}
        >
          ENTER THIS ERA FULLY →
        </button>
      </div>
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
