"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  accent?: string;
  onClick?: () => void;
  href?: string;
  download?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  accent = "var(--nebula-cyan)",
  onClick,
  href,
  download,
  className,
}: Props) {
  const base =
    "relative inline-flex items-center gap-2 px-6 py-3 font-mono text-sm tracking-wider transition-all duration-300 overflow-hidden group";

  const variants = {
    primary: "border text-current hover:text-[var(--cosmos-void)]",
    secondary: "border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-current hover:text-[var(--text-primary)]",
    ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  };

  const content = (
    <>
      {variant === "primary" && (
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: accent }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        download={download}
        data-cursor="hover"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(base, variants[variant], className)}
        style={{ borderColor: variant === "primary" ? accent : undefined, color: variant === "primary" ? accent : undefined }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      data-cursor="hover"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(base, variants[variant], className)}
      style={{ borderColor: variant === "primary" ? accent : undefined, color: variant === "primary" ? accent : undefined }}
    >
      {content}
    </motion.button>
  );
}
