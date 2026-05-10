"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { ScannerTransition } from "./ScannerTransition";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { usePersonaStore } from "@/store/personaStore";
import { Menu, X, Download, RotateCcw } from "lucide-react";

const NAV_ITEMS = [
  { id: "story",      label: "Story" },
  { id: "skills",     label: "Skills" },
  { id: "projects",   label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact",    label: "Contact" },
] as const;

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scanning, setScanning] = useState<string | null>(null);
  const reset = usePersonaStore((s) => s.reset);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (id: string) => {
    setScanning(id);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    setTimeout(() => setScanning(null), 1100);
    setMobileOpen(false);
  };

  return (
    <>
      {scanning && <ScannerTransition />}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "backdrop-blur-xl bg-[var(--cosmos-deep)]/80 border-b border-[var(--border-subtle)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <button
            data-cursor="hover"
            onClick={() => navigate("hero")}
            className="font-display text-xl tracking-[0.25em] flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--nebula-cyan)] animate-pulse" />
            BLS
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                data-cursor="hover"
                onClick={() => navigate(item.id)}
                className="relative font-mono text-sm tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
              >
                {item.label.toUpperCase()}
                <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-[var(--nebula-cyan)] transition-all duration-500 shadow-glow-cyan" />
              </button>
            ))}
            <ThemeSwitcher />
            <button
              data-cursor="hover"
              onClick={reset}
              title="Switch persona"
              className="text-[var(--text-muted)] hover:text-[var(--nebula-cyan)] transition-colors"
            >
              <RotateCcw size={14} />
            </button>
            <a
              href="/cv"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="flex items-center gap-2 px-4 py-2 border border-[var(--nebula-cyan)] text-[var(--nebula-cyan)] font-mono text-sm tracking-wider hover:bg-[var(--nebula-cyan)] hover:text-[var(--cosmos-void)] transition-all duration-300 hover:shadow-glow-cyan"
            >
              <Download size={14} />
              CV
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            data-cursor="hover"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-[var(--text-primary)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-[var(--cosmos-void)]/95 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
        >
          {NAV_ITEMS.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              onClick={() => navigate(item.id)}
              className="font-display text-3xl tracking-widest py-4"
            >
              {item.label.toUpperCase()}
            </motion.button>
          ))}
          <motion.a
            href="/cv"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center gap-2 px-6 py-3 border border-[var(--nebula-cyan)] text-[var(--nebula-cyan)] font-mono text-sm tracking-wider"
          >
            <Download size={14} />
            DOWNLOAD CV
          </motion.a>
        </motion.div>
      )}
    </>
  );
}
