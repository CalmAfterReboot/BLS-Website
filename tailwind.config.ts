import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      colors: {
        cosmos: {
          void:    "var(--cosmos-void)",
          deep:    "var(--cosmos-deep)",
          mid:     "var(--cosmos-mid)",
          surface: "var(--cosmos-surface)",
        },
        nebula: {
          cyan:    "var(--nebula-cyan)",
          violet:  "var(--nebula-violet)",
          gold:    "var(--nebula-gold)",
          rose:    "var(--nebula-rose)",
          green:   "var(--nebula-green)",
        },
      },
      boxShadow: {
        "glow-cyan":   "0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.15)",
        "glow-violet": "0 0 20px rgba(123, 79, 255, 0.4), 0 0 40px rgba(123, 79, 255, 0.15)",
        "glow-gold":   "0 0 20px rgba(255, 179, 71, 0.35), 0 0 40px rgba(255, 179, 71, 0.12)",
        "glow-rose":   "0 0 20px rgba(255, 107, 157, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "breathe":    "breathe 6s ease-in-out infinite",
        "spin-slow":  "spin 20s linear infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%":      { opacity: "1",   transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
