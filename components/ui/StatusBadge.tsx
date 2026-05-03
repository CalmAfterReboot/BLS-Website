import styles from "@/styles/hud.module.css";

type Status = "success" | "pending" | "failure";

const dot: Record<Status, string> = {
  success: styles.dotGreen,
  pending: styles.dotAmber,
  failure: styles.dotRed,
};

type Props = {
  status: Status;
  label?: string;
  className?: string;
  "aria-label"?: string;
};

export function StatusBadge({ status, label, className, ...rest }: Props) {
  return (
    <span
      className={[styles.badge, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span className={[styles.dot, dot[status]].join(" ")} aria-hidden />
      {label ? <span>{label}</span> : null}
    </span>
  );
}
