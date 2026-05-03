import styles from "@/styles/hud.module.css";

const ITEMS = [
  "AZURE",
  "KUBERNETES",
  "TERRAFORM",
  "AKS",
  "GITHUB ACTIONS",
  "GITOPS",
  "PROMETHEUS",
  "GRAFANA",
  "KEY VAULT",
  "POWERSHELL",
  "BASH",
  "SRE",
];

export function TechMarquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className={styles.marqueeWrap}>
      <div className={styles.marqueeTrack}>
        {doubled.map((label, i) => (
          <div key={`${label}-${i}`} className={styles.marqueeInner}>
            <span>{label}</span>
            <span className="text-[var(--dim)]" aria-hidden>
              {"//"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
