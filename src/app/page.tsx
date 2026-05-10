"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePersonaStore } from "@/store/personaStore";
import { useMounted } from "@/hooks/useMounted";
import { GateScreen } from "@/components/gate/GateScreen";
import { Experience } from "@/components/Experience";

export default function HomePage() {
  const hasEntered = usePersonaStore((s) => s.hasEntered);
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {!hasEntered ? (
        <motion.div key="gate" exit={{ opacity: 0 }}>
          <GateScreen />
        </motion.div>
      ) : (
        <motion.div
          key="experience"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8 } }}
        >
          <Experience />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
