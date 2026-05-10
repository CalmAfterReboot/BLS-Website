import type { Variants } from "motion/react";

export const fadeInOut: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.4 } },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

export const slideUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 18 } },
};

export const letterReveal: Variants = {
  hidden:  { opacity: 0, y: 40, rotateX: -90 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const clipReveal: Variants = {
  hidden:  { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 1.0, ease: [0.7, 0, 0.3, 1] } },
};

export const portalExpand: Variants = {
  collapsed: { scale: 1, opacity: 1 },
  expanded:  {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};
