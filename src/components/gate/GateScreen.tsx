"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Briefcase, Terminal, Hexagon, type LucideIcon } from "lucide-react";
import { usePersonaStore, type Persona } from "@/store/personaStore";
import { PersonaCard } from "./PersonaCard";
import { staggerContainer, slideUp, letterReveal } from "@/lib/motion-variants";

const TITLE = "BLUE LAYER SYSTEMS";

const personas: {
  id: Persona;
  label: string;
  sub: string;
  Icon: LucideIcon;
  accent: string;
}[] = [
  {
    id: "recruiter",
    label: "RECRUITER",
    sub: "I'm looking to hire",
    Icon: Briefcase,
    accent: "#00D4FF",
  },
  {
    id: "engineer",
    label: "ENGINEER",
    sub: "I want the technical depth",
    Icon: Terminal,
    accent: "#7B4FFF",
  },
  {
    id: "architect",
    label: "ARCHITECT",
    sub: "I want the system design",
    Icon: Hexagon,
    accent: "#FFB347",
  },
];

export function GateScreen() {
  const setPersona = usePersonaStore((s) => s.setPersona);
  const setHasEntered = usePersonaStore((s) => s.setHasEntered);
  const [exiting, setExiting] = useState<Persona>(null);

  const handleSelect = (p: Persona) => {
    if (exiting) return;
    setExiting(p);
    setPersona(p);
    setTimeout(() => setHasEntered(true), 1100);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "1") handleSelect("recruiter");
      if (e.key === "2") handleSelect("engineer");
      if (e.key === "3") handleSelect("architect");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.8, delay: exiting ? 0.4 : 0 }}
    >
      {/* Title */}
      <motion.h1
        className="font-display text-4xl sm:text-6xl md:text-7xl tracking-[0.15em] text-center mb-4"
        variants={staggerContainer(0.06, 0.8)}
        initial="hidden"
        animate="visible"
        aria-label={TITLE}
      >
        {TITLE.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={letterReveal}
            style={{
              display: char === " " ? "inline" : "inline-block",
              minWidth: char === " " ? "0.4em" : undefined,
            }}
          >
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="font-mono text-sm sm:text-base text-[var(--text-secondary)] tracking-widest mb-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        ENGINEERING INFRASTRUCTURE AT SCALE
      </motion.p>

      {/* Personas */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        variants={staggerContainer(0.12, 2.0)}
        initial="hidden"
        animate="visible"
        role="group"
        aria-label="Choose your perspective"
      >
        {personas.map((p) => (
          <motion.div key={p.id} variants={slideUp}>
            <PersonaCard
              {...p}
              onSelect={() => handleSelect(p.id)}
              isExiting={exiting === p.id}
              isOtherExiting={exiting !== null && exiting !== p.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Keyboard hint */}
      <motion.p
        className="font-mono text-xs text-[var(--text-muted)] mt-12 tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
      >
        PRESS 1 · 2 · 3 OR CLICK TO ENTER
      </motion.p>
    </motion.div>
  );
}
