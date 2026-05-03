import styles from "@/styles/hud.module.css";

type Props = {
  index: string;
  title: string;
  className?: string;
};

export function SectionHeader({ index, title, className }: Props) {
  return (
    <div className={[styles.sectionHeader, className].filter(Boolean).join(" ")}>
      <span className={styles.sectionIndex}>{index}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionLine} aria-hidden />
    </div>
  );
}
