import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        "bg-panel": "var(--bg-panel)",
        "bg-card": "var(--bg-card)",
        accent: "var(--accent)",
        "text-bright": "var(--text-bright)",
        text: "var(--text)",
        muted: "var(--muted)",
        dim: "var(--dim)",
        red: "var(--red)",
      },
      transitionTimingFunction: {
        "skill-bar": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
