"use client";

import { useEffect, useState } from "react";

import styles from "@/styles/hud.module.css";

type Props = {
  label: string;
  value: number;
  active: boolean;
};

export function ProgressBar({ label, value, active }: Props) {
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!active) {
      setW(0);
      return;
    }
    const id = requestAnimationFrame(() => setW(Math.min(100, Math.max(0, value))));
    return () => cancelAnimationFrame(id);
  }, [active, value]);

  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
        <span>{label}</span>
        <span className="text-dim">{value}%</span>
      </div>
      <div className={styles.progressTrack} data-active={active && w > 0 ? "true" : "false"}>
        <div
          className="relative h-full overflow-visible transition-[width] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${w}%` }}
        >
          <div className={`h-full w-full ${styles.progressFill}`} />
          <span className={styles.progressGlow} aria-hidden />
        </div>
      </div>
    </div>
  );
}
