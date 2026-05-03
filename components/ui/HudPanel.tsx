import type { ReactNode } from "react";

import styles from "@/styles/hud.module.css";

type Variant = "default" | "large" | "double";

type Props = {
  children: ReactNode;
  label?: string;
  index?: string;
  variant?: Variant;
  className?: string;
  contentClassName?: string;
};

const clipClass: Record<Variant, string> = {
  default: styles.clipDefault,
  large: styles.clipLarge,
  double: styles.clipDouble,
};

export function HudPanel({
  children,
  label,
  index,
  variant = "default",
  className,
  contentClassName,
}: Props) {
  return (
    <div
      className={[styles.panel, clipClass[variant], styles.cornerAccent, className]
        .filter(Boolean)
        .join(" ")}
    >
      {(label || index) && (
        <div className={styles.panelHeader}>
          {index ? <span className={styles.panelIndex}>{index}</span> : null}
          {label ? <span>{label}</span> : null}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
