import type { ISourceOptions } from "@tsparticles/engine";
import type { SpaceTheme } from "@/store/themeStore";

const themeColors: Record<SpaceTheme, string[]> = {
  nebula:    ["#00D4FF", "#7B4FFF", "#FF6B9D", "#FFB347", "#FFFFFF"],
  storm:     ["#00FF88", "#88FFFF", "#FFFFFF", "#AAAAAA"],
  blueprint: ["#0066CC", "#4499FF", "#0044AA", "#88BBFF"],
  void:      ["#FFFFFF", "#CCCCCC", "#888888", "#444444"],
};

export const buildParticlesConfig = (theme: SpaceTheme): ISourceOptions => ({
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  fullScreen: { enable: false },
  particles: {
    number: {
      value: 80,
      density: { enable: true, width: 1200, height: 800 },
    },
    color: { value: themeColors[theme] },
    opacity: {
      value: { min: 0.1, max: 0.7 },
      animation: { enable: true, speed: 0.4, sync: false },
    },
    size: { value: { min: 0.5, max: 2.4 } },
    move: {
      enable: true,
      speed: { min: 0.1, max: 0.4 },
      direction: "none",
      random: true,
      outModes: { default: "out" },
    },
    links: { enable: false },
  },
  detectRetina: true,
});
