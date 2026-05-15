"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { DropZone } from "@/components/tools/audit-viewer/DropZone";
import { FindingsSummary } from "@/components/tools/audit-viewer/FindingsSummary";
import { FindingsList } from "@/components/tools/audit-viewer/FindingsList";
import { HostCard } from "@/components/tools/audit-viewer/HostCard";
import { AnonymiseToggle } from "@/components/tools/audit-viewer/AnonymiseToggle";
import { DemoDataButton } from "@/components/tools/audit-viewer/DemoDataButton";
import { classifyDoc, mergeIntoBundles } from "@/lib/audit-viewer/parse";
import { createContext, maskHostBundle } from "@/lib/audit-viewer/anonymise";
import { DEMO_INVENTORY, DEMO_WORKLOAD } from "@/data/audit-viewer-demo";
import type { HostBundle } from "@/types/audit-viewer";

interface ParseError {
  filename: string;
  message: string;
}

export default function AuditViewerPage() {
  const [bundles, setBundles] = useState<HostBundle[]>([]);
  const [errors, setErrors] = useState<ParseError[]>([]);
  const [anonymise, setAnonymise] = useState(false);
  const [howOpen, setHowOpen] = useState(false);

  const displayed: HostBundle[] = useMemo(() => {
    if (!anonymise) return bundles;
    const ctx = createContext(bundles);
    return bundles.map((b) => maskHostBundle(b, ctx));
  }, [bundles, anonymise]);

  const handleFiles = async (files: File[]) => {
    const fresh: ParseError[] = [];
    let next = bundles;
    for (const file of files) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        const result = classifyDoc(json);
        if (!result.ok) {
          fresh.push({ filename: file.name, message: result.error });
          continue;
        }
        next = mergeIntoBundles(next, result);
      } catch (err) {
        fresh.push({
          filename: file.name,
          message: err instanceof Error ? err.message : "Could not parse JSON",
        });
      }
    }
    setBundles(next);
    setErrors(fresh);
  };

  const loadDemo = () => {
    let next: HostBundle[] = [];
    next = mergeIntoBundles(next, {
      ok: true,
      doc: DEMO_INVENTORY,
      hostname: DEMO_INVENTORY.Metadata.Hostname || "HOST-DEMO-01",
      kind: "inventory",
    });
    next = mergeIntoBundles(next, {
      ok: true,
      doc: DEMO_WORKLOAD,
      hostname: DEMO_WORKLOAD.Metadata.Hostname || "HOST-DEMO-01",
      kind: "workload",
    });
    setBundles(next);
    setErrors([]);
  };

  const clearAll = () => {
    setBundles([]);
    setErrors([]);
  };

  const hasData = bundles.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1 font-mono text-xs text-text-mute hover:text-accent-olive transition-colors uppercase tracking-wider mb-6"
        >
          <ArrowLeft size={12} /> Tools
        </Link>

        <header className="border-t border-b border-border py-2 mb-6">
          <p className="font-mono text-xs text-accent-olive tracking-widest uppercase">
            {"// AUDIT VIEWER"}
          </p>
        </header>

        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-text mb-3">
          Estate Audit Viewer
        </h1>
        <p className="text-text-dim max-w-3xl mb-4">
          Renders JSON output from the BLS Estate Discovery PowerShell collectors. Everything runs
          in your browser — no upload, no persistence, no telemetry.
        </p>

        <button
          onClick={() => setHowOpen((v) => !v)}
          className="font-mono text-xs text-accent-olive uppercase tracking-wider hover:underline mb-6"
        >
          {howOpen ? "[ - ] Hide" : "[ + ] How this works"}
        </button>
        {howOpen && (
          <div className="border border-border bg-surface p-4 mb-8 font-mono text-xs text-text-dim space-y-2">
            <p>
              Two PowerShell collectors run on a Windows server with local admin:
              <span className="text-text"> collect-server-inventory.ps1 </span>
              gathers OS / hardware / network / volumes;
              <span className="text-text"> collect-workload-profile.ps1 </span>
              gathers SQL, IIS, RDS licensing, services, scheduled tasks, and emits structured
              findings tagged BLOCKER / WARN / INFO.
            </p>
            <p>
              Each collector writes a JSON file. Drop both files for a host (or many hosts) into
              the viewer. The page merges them by Metadata.Hostname and renders findings,
              inventory, and workload side by side.
            </p>
            <p>
              The collectors never make network calls. The viewer never uploads. The full
              code is below for review.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <AnonymiseToggle enabled={anonymise} onChange={setAnonymise} />
          <DemoDataButton onLoad={loadDemo} />
          {hasData && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-3 py-2 border border-border text-text-dim font-mono text-xs uppercase tracking-wider hover:border-accent-rust hover:text-accent-rust transition-colors"
            >
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>

        <div className="mb-8">
          <DropZone onFiles={handleFiles} />
        </div>

        {errors.length > 0 && (
          <div className="border border-status-warning border-l-4 bg-surface p-3 mb-6">
            <p className="font-mono text-xs text-status-warning uppercase tracking-wider mb-2">
              Parse errors
            </p>
            <ul className="font-mono text-xs text-text-dim space-y-1">
              {errors.map((e, i) => (
                <li key={i}>
                  <span className="text-text">{e.filename}</span>: {e.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasData ? (
          <div className="space-y-10">
            <section>
              <p className="font-mono text-xs text-text-mute uppercase tracking-wider mb-3">
                {"// FINDINGS SUMMARY"}
              </p>
              <FindingsSummary hosts={displayed} />
            </section>

            <section>
              <p className="font-mono text-xs text-text-mute uppercase tracking-wider mb-3">
                {"// FINDINGS"}
              </p>
              <FindingsList hosts={displayed} />
            </section>

            <section>
              <p className="font-mono text-xs text-text-mute uppercase tracking-wider mb-3">
                {"// HOSTS"} <span className="text-text">[{displayed.length}]</span>
              </p>
              <div className="space-y-3">
                {displayed.map((h) => (
                  <HostCard key={h.hostname} host={h} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="border border-border bg-surface p-6 mb-10">
            <p className="font-mono text-xs text-text-mute uppercase tracking-wider mb-2">
              {"// EMPTY"}
            </p>
            <p className="text-text-dim mb-4">
              No data loaded. Drop inventory + workload JSONs above, or load the demo data to see a populated dashboard.
            </p>
            <DemoDataButton onLoad={loadDemo} />
          </div>
        )}

        <section className="mt-16 border-t border-border pt-8">
          <p className="font-mono text-xs text-text-mute uppercase tracking-wider mb-3">
            {"// DOWNLOAD COLLECTORS"}
          </p>
          <p className="text-text-dim mb-4">
            Run these scripts on a Windows server with local admin. They write a JSON file you can
            drop into this viewer. Source is plain PowerShell — review before running.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/tools/audit-viewer/collect-server-inventory.ps1"
              download
              className="inline-flex items-center gap-2 px-3 py-2 border border-border bg-surface text-text font-mono text-xs uppercase tracking-wider hover:border-accent-olive hover:text-accent-olive transition-colors"
            >
              <Download size={12} /> collect-server-inventory.ps1
            </a>
            <a
              href="/tools/audit-viewer/collect-workload-profile.ps1"
              download
              className="inline-flex items-center gap-2 px-3 py-2 border border-border bg-surface text-text font-mono text-xs uppercase tracking-wider hover:border-accent-olive hover:text-accent-olive transition-colors"
            >
              <Download size={12} /> collect-workload-profile.ps1
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
