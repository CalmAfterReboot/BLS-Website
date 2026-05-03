"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";

import { HudPanel } from "@/components/ui/HudPanel";
import { GlitchText } from "@/components/ui/GlitchText";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useGitHubActivity } from "@/hooks/useGitHub";
import { usePageTransition } from "@/hooks/usePageTransition";
import styles from "@/styles/hud.module.css";

const ROLES = [
  "Platform Engineer",
  "Cloud Architect",
  "DevOps Engineer",
  "Infrastructure Builder",
  "SRE",
] as const;

function useTypewriter(
  words: readonly string[],
  typingMs = 95,
  deletingMs = 55,
  pauseMs = 1600
) {
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

function latestPushMessage(data: ReturnType<typeof useGitHubActivity>["data"]) {
  const ev = data?.events?.find((e) => e.type === "PushEvent");
  if (!ev) return null;
  const msg = ev.payload.commits?.[0]?.message?.split("\n")[0];
  const repo = ev.repo?.name;
  if (!msg && !repo) return null;
  return { msg: msg ?? "Push", repo: repo ?? "repo", when: ev.created_at };
}

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const typed = useTypewriter(ROLES);
  const { data: activity, isLoading } = useGitHubActivity();
  const push = useMemo(() => latestPushMessage(activity), [activity]);
  const { runTransition } = usePageTransition();

  const scrollTo = (id: string) => {
    void runTransition(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden pt-6"
    >
      <div
        className={[styles.heroGrid, "pointer-events-none absolute inset-0 -z-10"].join(" ")}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[clamp(0.5rem,4vw,2rem)] top-24 hidden h-[min(60vh,520px)] w-px bg-gradient-to-b from-transparent via-[var(--border-hi)] to-transparent lg:block"
        aria-hidden
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-[clamp(1rem,5vw,3rem)] pb-16 pt-8 lg:grid-cols-[1fr_min(320px,32%)] lg:items-start">
        <div>
          <div
            className={[styles.bootItem, "mb-6 flex flex-wrap items-center gap-4"].join(" ")}
            style={{ animationDelay: "0s" }}
          >
            <StatusBadge status="success" label="SYS ONLINE" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
              BLUE LAYER SYSTEMS v0.1.0 // NODE: CARLISLE-UK-01
            </span>
          </div>

          <p
            className={[styles.bootItem, "mb-4 font-mono text-[0.7rem] text-muted"].join(" ")}
            style={{ animationDelay: "0.2s" }}
          >
            &gt; INITIALISING PORTFOLIO_SYSTEM...
          </p>

          <motion.div style={{ y: nameY, opacity: nameOpacity }}>
            <GlitchText
              as="h1"
              className="mb-2 font-display font-bold leading-[0.95] tracking-[0.06em] text-text-bright [text-shadow:0_2px_0_rgba(0,0,0,0.45),0_12px_48px_rgba(0,0,0,0.35)]"
              style={{
                fontSize: "clamp(3.5rem, 12vw, 9rem)",
              }}
            >
              MIHAI
            </GlitchText>
          </motion.div>

          <p
            className={[styles.bootItem, "mb-6 min-h-[1.6em] font-mono text-[clamp(0.95rem,2.5vw,1.15rem)] text-text"].join(
              " "
            )}
            style={{ animationDelay: "0.4s" }}
          >
            <span className="text-muted">ROLE // </span>
            {typed}
            <span className="ml-0.5 inline-block h-[1.1em] w-px translate-y-0.5 bg-[var(--dim)]" />
          </p>

          <p
            className={[styles.bootItem, "mb-8 max-w-2xl text-[clamp(1rem,2.4vw,1.125rem)] leading-relaxed text-text"].join(
              " "
            )}
            style={{ animationDelay: "0.6s" }}
          >
            Building production-grade cloud infrastructure under the Blue Layer Systems
            brand. Azure · Kubernetes · Terraform · GitOps.
          </p>

          <div
            className={[styles.bootItem, "flex flex-col gap-3 sm:flex-row sm:items-center"].join(" ")}
            style={{ animationDelay: "0.8s" }}
          >
            <button
              type="button"
              onClick={() => scrollTo("projects")}
              className="group relative overflow-hidden border border-[var(--border-hi)] bg-[var(--accent-dim)] px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text transition-colors hover:text-[var(--bg)]"
            >
              <span className="absolute inset-0 z-0 bg-[var(--accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10">VIEW PROJECTS</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="border border-[var(--border)] bg-transparent px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text transition-colors hover:border-[var(--border-hi)] hover:text-text-bright"
            >
              GET IN TOUCH
            </button>
          </div>
        </div>

        <aside className={[styles.bootItem, "lg:pt-12"].join(" ")} style={{ animationDelay: "1s" }}>
          <HudPanel variant="default" label="LIVE // GIT EVENT" index="FEED" contentClassName="p-4">
            {isLoading ? (
              <p className="font-mono text-[0.7rem] text-muted">SCANNING PUBLIC FEED...</p>
            ) : push ? (
              <>
                <p className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                  LAST PUSH // {push.repo}
                </p>
                <p className="line-clamp-3 text-sm text-text">{push.msg}</p>
                <p className="mt-2 font-mono text-[0.65rem] text-dim">
                  {new Date(push.when).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </>
            ) : (
              <p className="font-mono text-[0.7rem] text-muted">NO RECENT PUSH EVENTS</p>
            )}
          </HudPanel>
        </aside>
      </div>
    </section>
  );
}
