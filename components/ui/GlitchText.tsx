"use client";

import type { CSSProperties, ReactNode } from "react";

import styles from "@/styles/hud.module.css";

type Props = {
  children: ReactNode;
  as?: "span" | "h1" | "h2" | "strong";
  className?: string;
  style?: CSSProperties;
};

export function GlitchText({
  children,
  as: Tag = "span",
  className,
  style,
}: Props) {
  const text = typeof children === "string" ? children : "";
  return (
    <Tag
      className={[styles.glitch, className].filter(Boolean).join(" ")}
      data-text={text || undefined}
      style={style}
    >
      {children}
    </Tag>
  );
}
