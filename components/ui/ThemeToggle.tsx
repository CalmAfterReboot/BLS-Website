"use client";

import { useTheme } from "@/hooks/useTheme";
import { usePageTransition } from "@/hooks/usePageTransition";
import styles from "@/styles/hud.module.css";

function SunIcon() {
  return (
    <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3 6.5 6.5 0 1 0 21 14.5Z"
        opacity="0.9"
      />
    </svg>
  );
}

type Props = { className?: string };

export function ThemeToggle({ className }: Props) {
  const { theme, toggleTheme } = useTheme();
  const { runTransition } = usePageTransition();

  return (
    <button
      type="button"
      className={[styles.themeBtn, className].filter(Boolean).join(" ")}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        void runTransition(() => {
          toggleTheme();
        });
      }}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      <span>{theme === "dark" ? "LIGHT" : "DARK"}</span>
    </button>
  );
}
