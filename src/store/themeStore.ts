import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SpaceTheme = "nebula" | "storm" | "blueprint" | "void";

interface ThemeState {
  theme: SpaceTheme;
  setTheme: (t: SpaceTheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "nebula",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "bls-theme" }
  )
);
