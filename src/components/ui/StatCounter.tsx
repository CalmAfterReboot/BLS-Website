"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

interface Props {
  to: number;
  suffix?: string;
  duration?: number;
}

export function StatCounter({ to, suffix = "", duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(to * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(to);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);

  return (
    <motion.span
      ref={ref}
      className="font-display text-5xl md:text-6xl text-[var(--nebula-cyan)] tabular-nums"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {value}
      {suffix}
    </motion.span>
  );
}
