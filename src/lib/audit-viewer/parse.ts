import type { AnyDoc, HostBundle, InventoryDoc, WorkloadDoc } from "@/types/audit-viewer";

export type ParseResult =
  | { ok: true; doc: AnyDoc; hostname: string; kind: "inventory" | "workload" }
  | { ok: false; error: string; filename?: string };

export function classifyDoc(raw: unknown): ParseResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "JSON root is not an object" };
  }
  const obj = raw as Record<string, unknown>;
  const metadata = obj.Metadata as Record<string, unknown> | undefined;
  if (!metadata) return { ok: false, error: "Missing Metadata block" };

  const collector = String(metadata.CollectorName || "");
  const hostname = String(metadata.Hostname || "");
  if (!hostname) return { ok: false, error: "Metadata.Hostname missing" };

  if (collector === "collect-server-inventory") {
    return { ok: true, doc: obj as unknown as InventoryDoc, hostname, kind: "inventory" };
  }
  if (collector === "collect-workload-profile") {
    return { ok: true, doc: obj as unknown as WorkloadDoc, hostname, kind: "workload" };
  }
  return {
    ok: false,
    error: `Unrecognised CollectorName: ${collector || "(empty)"}`,
  };
}

export function mergeIntoBundles(
  existing: HostBundle[],
  result: Extract<ParseResult, { ok: true }>
): HostBundle[] {
  const key = result.hostname.toLowerCase();
  const idx = existing.findIndex((b) => b.hostname.toLowerCase() === key);
  if (idx === -1) {
    const fresh: HostBundle = { hostname: result.hostname };
    if (result.kind === "inventory") fresh.inventory = result.doc as InventoryDoc;
    else fresh.workload = result.doc as WorkloadDoc;
    return [...existing, fresh];
  }
  const next = [...existing];
  const current = { ...next[idx] };
  if (result.kind === "inventory") current.inventory = result.doc as InventoryDoc;
  else current.workload = result.doc as WorkloadDoc;
  next[idx] = current;
  return next;
}
