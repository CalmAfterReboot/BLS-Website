"use client";

import { motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Ctx = {
  runTransition: (fn: () => void | Promise<void>) => Promise<void>;
};

const PageTransitionContext = createContext<Ctx | null>(null);

const FADE_MS = 300;

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [blocking, setBlocking] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const runTransition = useCallback(async (fn: () => void | Promise<void>) => {
    setBlocking(true);
    setOpacity(1);
    await new Promise((r) => setTimeout(r, FADE_MS));
    await fn();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 40));
    setOpacity(0);
    await new Promise((r) => setTimeout(r, FADE_MS));
    setBlocking(false);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ runTransition }}>
      {children}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[200]"
        style={{
          background: "var(--bg)",
          pointerEvents: blocking ? "auto" : "none",
        }}
        initial={false}
        animate={{ opacity }}
        transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error(
      "usePageTransition must be used within PageTransitionProvider"
    );
  }
  return ctx;
}
