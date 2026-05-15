"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Server } from "lucide-react";
import type { HostBundle } from "@/types/audit-viewer";
import { InventoryPanel } from "./InventoryPanel";
import { WorkloadPanel } from "./WorkloadPanel";

export function HostCard({ host }: { host: HostBundle }) {
  const [open, setOpen] = useState(false);
  const f = host.workload?.FindingsSummary;

  return (
    <div className="border border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex items-center gap-3 px-4 py-3 bg-surface hover:bg-surface-2 transition-colors"
      >
        {open ? (
          <ChevronDown size={14} className="text-text-mute flex-shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-text-mute flex-shrink-0" />
        )}
        <Server size={14} className="text-text-mute flex-shrink-0" />
        <span className="font-mono text-sm text-text uppercase tracking-wider">
          {host.hostname}
        </span>
        <span className="ml-auto flex items-center gap-3 font-mono text-xs text-text-mute uppercase tracking-wider">
          {host.inventory ? <span className="text-status-ok">[INV]</span> : <span>[—]</span>}
          {host.workload  ? <span className="text-status-ok">[WKL]</span> : <span>[—]</span>}
          {f && (
            <>
              <span className="text-status-blocker">B {f.Blockers}</span>
              <span className="text-status-warning">W {f.Warnings}</span>
              <span className="text-status-info">I {f.Info}</span>
            </>
          )}
        </span>
      </button>

      {open && (
        <div className="border-t border-border p-4 bg-base">
          {!host.inventory && !host.workload ? (
            <p className="font-mono text-xs text-text-mute">No data for this host.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-xs text-text-mute uppercase tracking-wider mb-3">
                  {"// INVENTORY"}
                </p>
                {host.inventory ? (
                  <InventoryPanel doc={host.inventory} />
                ) : (
                  <p className="font-mono text-xs text-text-mute">
                    No inventory JSON loaded for this host.
                  </p>
                )}
              </div>
              <div>
                <p className="font-mono text-xs text-text-mute uppercase tracking-wider mb-3">
                  {"// WORKLOAD"}
                </p>
                {host.workload ? (
                  <WorkloadPanel doc={host.workload} />
                ) : (
                  <p className="font-mono text-xs text-text-mute">
                    No workload JSON loaded for this host.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
