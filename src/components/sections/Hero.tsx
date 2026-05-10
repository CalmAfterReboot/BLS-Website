"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { MapPin, Wifi, Download, ArrowRight } from "lucide-react";
import { ServerRack } from "@/components/svg/ServerRack";
import { staggerContainer, letterReveal } from "@/lib/motion-variants";
import { usePersonaStore } from "@/store/personaStore";
import { personaContent } from "@/data/personas";

const NAME = "MIHAI FERENCZ";

const ROLES = [
  "Platform Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Site Reliability Engineer",
];

function useTypewriter(words: string[], typingMs = 90, deletingMs = 50, pauseMs = 1600) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wi % words.length];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && text === word) {
      t = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text === "") {
      setDeleting(false);
      setWi((w) => (w + 1) % words.length);
    } else if (deleting) {
      t = setTimeout(() => setText(word.slice(0, text.length - 1)), deletingMs);
    } else {
      t = setTimeout(() => setText(word.slice(0, text.length + 1)), typingMs);
    }
    return () => clearTimeout(t);
  }, [text, deleting, wi, words, typingMs, deletingMs, pauseMs]);

  return text;
}

export function Hero() {
  const persona = usePersonaStore((s) => s.persona);
  const typed = useTypewriter(ROLES);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  const content = persona ? personaContent[persona] : personaContent.recruiter;

  return (
    <section id="hero" ref={ref} className="min-h-screen flex items-center pt-20 pb-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 items-center">

          {/* Left column */}
          <div>
            {/* Name */}
            <motion.h1
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.1em] mb-4"
              variants={staggerContainer(0.04, 0.3)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              aria-label={NAME}
            >
              {NAME.split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterReveal}
                  style={{
                    display: char === " " ? "inline" : "inline-block",
                    minWidth: char === " " ? "0.3em" : undefined,
                  }}
                >
                  {char === " " ? " " : char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Typing role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="font-mono text-xl sm:text-2xl text-[var(--nebula-cyan)] mb-6 min-h-[2rem]"
            >
              {typed}
              <span className="animate-pulse ml-0.5">|</span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.4, duration: 0.7 }}
              className="font-body text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed mb-8"
            >
              Building observable, auditable infrastructure.
            </motion.p>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 mb-10 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--nebula-green)] animate-pulse shadow-[0_0_8px_var(--nebula-green)]" />
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={11} />
                Carlisle, UK
              </span>
              <span className="flex items-center gap-1.5">
                <Wifi size={11} />
                Remote / Hybrid
              </span>
              <span className="text-[var(--nebula-cyan)]">Full UK right to work</span>
              <a
                href="tel:07436784212"
                className="text-[var(--text-muted)] hover:text-[var(--nebula-cyan)] transition-colors"
              >
                07436 784212
              </a>
            </motion.div>

            {/* Persona tag */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.7, duration: 0.6 }}
              className="font-mono text-xs text-[var(--nebula-violet)] tracking-wider mb-8"
            >
              {content.heroTag}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="/cv"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--nebula-cyan)] text-[var(--nebula-cyan)] font-mono text-sm tracking-wider hover:bg-[var(--nebula-cyan)] hover:text-[var(--cosmos-void)] transition-all duration-300 hover:shadow-glow-cyan"
              >
                <Download size={14} />
                {content.heroPrimary}
              </a>
              <a
                href="#projects"
                data-cursor="hover"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono text-sm tracking-wider hover:border-[var(--nebula-violet)] hover:text-[var(--text-primary)] transition-all duration-300"
              >
                {content.heroSecondary}
                <ArrowRight size={14} />
              </a>
            </motion.div>
          </div>

          {/* Right column — server rack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 1.0 }}
            className="hidden lg:block"
          >
            <ServerRack />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
