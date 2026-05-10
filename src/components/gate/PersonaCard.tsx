"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { Persona } from "@/store/personaStore";

interface Props {
  id: Persona;
  label: string;
  sub: string;
  Icon: LucideIcon;
  accent: string;
  onSelect: () => void;
  isExiting: boolean;
  isOtherExiting: boolean;
}

export function PersonaCard({
  label,
  sub,
  Icon,
  accent,
  onSelect,
  isExiting,
  isOtherExiting,
}: Props) {
  return (
    <motion.button
      onClick={onSelect}
      data-cursor="hover"
      className="group relative w-full p-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--cosmos-deep)]/60 backdrop-blur-sm overflow-hidden text-left"
      whileHover={!isExiting ? { scale: 1.04, borderColor: accent } : undefined}
      whileTap={!isExiting ? { scale: 0.98 } : undefined}
      animate={
        isExiting
          ? {
              scale: 1.5,
              opacity: 0,
              transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1] },
            }
          : isOtherExiting
            ? { opacity: 0, scale: 0.9, transition: { duration: 0.4 } }
            : {}
      }
      style={{ transformOrigin: "center" }}
    >
      {/* Accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${accent}25 0%, transparent 70%)`,
          boxShadow: `0 0 40px ${accent}40, inset 0 0 20px ${accent}20`,
        }}
      />

      <Icon
        size={42}
        strokeWidth={1.2}
        className="mb-6 transition-colors duration-300"
        style={{ color: accent }}
      />

      <h2
        className="font-display text-2xl tracking-widest mb-2"
        style={{ color: accent }}
      >
        {label}
      </h2>
      <p className="font-mono text-sm text-[var(--text-secondary)] uppercase tracking-wider">
        {sub}
      </p>

      <div className="mt-6 flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
        <span>ENTER →</span>
      </div>
    </motion.button>
  );
}
