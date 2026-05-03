"use client";

import styles from "@/styles/hud.module.css";

export function ScanOverlay() {
  return (
    <div className={styles.scanRoot} aria-hidden>
      <div className={styles.scanLine} />
      <div className={styles.beam} />
    </div>
  );
}
