"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Finding, HostBundle, Severity } from "@/types/audit-viewer";

interface Row {
  hostname: string;
  finding: Finding;
}

const SEVERITY_ORDER: Record<Severity, number> = { BLOCKER: 0, WARN: 1, INFO: 2 };

function severityClass(s: Severity): string {
  if (s === "BLOCKER") return "border-l-status-blocker text-status-blocker";
  if (s === "WARN")    return "border-l-status-warning text-status-warning";
  return "border-l-status-info text-status-info";
}

export function FindingsList({ hosts }: { hosts: HostBundle[] }) {
  const [filter, setFilter] = useState<Severity | "ALL">("ALL");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const rows: Row[] = useMemo(() => {
    const all: Row[] = [];
    for (const h of hosts) {
      for (const f of h.workload?.Findings || []) {
        all.push({ hostname: h.hostname, finding: f });
      }
    }
    all.sort((a, b) => {
      const s = SEVERITY_ORDER[a.finding.Severity] - SEVERITY_ORDER[b.finding.Severity];
      if (s !== 0) return s;
      const host = a.hostname.localeCompare(b.hostname);
      if (host !== 0) return host;
      return a.finding.Category.localeCompare(b.finding.Category);
    });
    return all;
  }, [hosts]);

  const filtered = filter === "ALL" ? rows : rows.filter((r) => r.finding.Severity === filter);

  if (rows.length === 0) {
    return (
      <p className="font-mono text-sm text-text-mute uppercase tracking-wider">
        No findings parsed yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {(["ALL", "BLOCKER", "WARN", "INFO"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 border font-mono text-xs uppercase tracking-wider transition-colors ${
              filter === s
                ? "border-accent-olive text-accent-olive bg-surface"
                : "border-border text-text-dim hover:border-accent-olive hover:text-accent-olive"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="border border-border">
        {filtered.map((row, i) => {
          const key = `${row.hostname}-${i}`;
          const isOpen = !!open[key];
          return (
            <div
              key={key}
              className={`border-b border-border last:border-b-0 border-l-2 ${severityClass(row.finding.Severity)}`}
            >
              <button
                onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))}
                className="w-full text-left flex items-start gap-3 px-3 py-2 hover:bg-surface transition-colors"
              >
                {isOpen ? (
                  <ChevronDown size={14} className="mt-1 text-text-mute flex-shrink-0" />
                ) : (
                  <ChevronRight size={14} className="mt-1 text-text-mute flex-shrink-0" />
                )}
                <span className={`font-mono text-xs uppercase tracking-wider flex-shrink-0 ${severityClass(row.finding.Severity)} pr-2`}>
                  [{row.finding.Severity}]
                </span>
                <span className="font-mono text-xs text-text-mute uppercase tracking-wider flex-shrink-0 pr-2">
                  {row.hostname}
                </span>
                <span className="font-mono text-xs text-text-dim flex-shrink-0 pr-2">
                  {row.finding.Category}
                </span>
                <span className="text-sm text-text">{row.finding.Message}</span>
              </button>
              {isOpen && row.finding.Evidence !== undefined && (
                <pre className="font-mono text-xs bg-surface-2 text-text-dim p-3 overflow-x-auto border-t border-border">
                  {JSON.stringify(row.finding.Evidence, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
