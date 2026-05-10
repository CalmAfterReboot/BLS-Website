"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useThemeStore, type SpaceTheme } from "@/store/themeStore";
import { Palette } from "lucide-react";

const themes: { id: SpaceTheme; label: string; color: string }[] = [
  { id: "nebula",    label: "NEBULA",    color: "#00D4FF" },
  { id: "storm",     label: "STORM",     color: "#00FF88" },
  { id: "blueprint", label: "BLUEPRINT", color: "#4499FF" },
  { id: "void",      label: "VOID",      color: "#888888" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        data-cursor="hover"
        onClick={() => setOpen((v) => !v)}
        className="text-[var(--text-secondary)] hover:text-[var(--nebula-cyan)] transition-colors"
        aria-label="Switch theme"
      >
        <Palette size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-8 z-50 bg-[var(--cosmos-deep)] border border-[var(--border-subtle)] rounded-lg p-2 min-w-[140px]"
          >
            {themes.map((t) => (
              <button
                key={t.id}
                data-cursor="hover"
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded font-mono text-xs tracking-wider hover:bg-[var(--cosmos-surface)] transition-colors"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: t.color,
                    boxShadow: theme === t.id ? `0 0 8px ${t.color}` : "none",
                  }}
                />
                <span
                  style={{
                    color: theme === t.id ? t.color : "var(--text-secondary)",
                  }}
                >
                  {t.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
