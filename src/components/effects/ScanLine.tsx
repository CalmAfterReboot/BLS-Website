"use client";

import { motion } from "motion/react";

interface Props {
  color?: string;
}

export function ScanLine({ color = "var(--nebula-cyan)" }: Props) {
  return (
    <motion.div
      initial={{ scaleX: 0, originX: 0 }}
      animate={{ scaleX: [0, 1, 1, 0], originX: [0, 0, 1, 1] }}
      transition={{ duration: 1.0, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
      className="fixed top-1/2 left-0 right-0 h-px z-[60] pointer-events-none"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`,
      }}
    />
  );
}
