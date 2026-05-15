import type { HostBundle } from "@/types/audit-viewer";

interface CounterProps {
  label: string;
  count: number;
  tone: "blocker" | "warning" | "info";
}

function Counter({ label, count, tone }: CounterProps) {
  const colour =
    tone === "blocker" ? "border-l-status-blocker text-status-blocker"
    : tone === "warning" ? "border-l-status-warning text-status-warning"
    :                       "border-l-status-info text-status-info";
  return (
    <div className={`border border-border bg-surface p-5 border-l-4 ${colour}`}>
      <p className="font-mono text-xs text-text-mute uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="font-mono text-3xl">{count}</p>
    </div>
  );
}

export function FindingsSummary({ hosts }: { hosts: HostBundle[] }) {
  const totals = hosts.reduce(
    (acc, h) => {
      const f = h.workload?.FindingsSummary;
      if (!f) return acc;
      acc.blockers += f.Blockers || 0;
      acc.warnings += f.Warnings || 0;
      acc.info     += f.Info     || 0;
      return acc;
    },
    { blockers: 0, warnings: 0, info: 0 }
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Counter label="Blockers" count={totals.blockers} tone="blocker" />
      <Counter label="Warnings" count={totals.warnings} tone="warning" />
      <Counter label="Info"     count={totals.info}     tone="info" />
    </div>
  );
}
