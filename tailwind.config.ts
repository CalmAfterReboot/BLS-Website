import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        // legacy aliases retained for any not-yet-migrated components
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        body:    ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Military / tactical palette
        base:      "#0a0a0b",
        surface:   "#14151a",
        "surface-2": "#1c1e26",
        border:    "#2a2d3a",
        text: {
          DEFAULT: "#e6e6e1",
          dim:     "#9b9c97",
          mute:    "#6a6b67",
        },
        accent: {
          olive:    "#7a8450",
          "olive-dim": "#555c38",
          amber:    "#c08a3e",
          rust:     "#a14b3a",
          steel:    "#4a5568",
        },
        status: {
          blocker: "#a14b3a",
          warning: "#c08a3e",
          info:    "#4a5568",
          ok:      "#7a8450",
        },
        // Legacy cosmos/nebula aliases mapped to new tokens so any
        // not-yet-migrated components still resolve sensibly.
        cosmos: {
          void:    "#0a0a0b",
          deep:    "#14151a",
          mid:     "#1c1e26",
          surface: "#14151a",
        },
        nebula: {
          cyan:    "#7a8450",
          violet:  "#7a8450",
          gold:    "#c08a3e",
          rose:    "#a14b3a",
          green:   "#7a8450",
        },
      },
    },
  },
  plugins: [],
};

export default config;
