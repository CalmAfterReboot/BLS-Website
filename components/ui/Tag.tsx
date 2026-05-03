import type { ReactNode } from "react";

import styles from "@/styles/hud.module.css";

export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={[styles.tag, className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
