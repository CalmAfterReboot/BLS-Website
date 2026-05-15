import React from "react";

type Primitive = string | number | boolean | null | undefined;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isPrimitive(v: unknown): v is Primitive {
  return (
    v === null ||
    v === undefined ||
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  );
}

function humaniseKey(key: string): string {
  if (!key) return "";
  // Split on camelCase / PascalCase boundaries, on _ / - / spaces, and on
  // ALLCAPS → Camel transitions.
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced
    .split(/\s+/)
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function isPercentKey(key: string): boolean {
  return /Pct$|Percent$/i.test(key);
}

function formatPrimitive(value: Primitive, key?: string): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-text-mute">—</span>;
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "number") {
    if (key && isPercentKey(key)) return `${value}%`;
    return String(value);
  }
  if (typeof value === "string") {
    if (value.length === 0) return <span className="text-text-mute">—</span>;
    return value;
  }
  return String(value);
}

function rowBg(index: number): string {
  return index % 2 === 0 ? "bg-surface" : "bg-surface-2";
}

/* -------- Rule 4 — array of primitives -------- */
function PrimitiveList({ items }: { items: Primitive[] }) {
  return (
    <ul className="font-mono text-xs text-text-dim list-disc pl-5 space-y-0.5 marker:text-accent-olive">
      {items.map((item, i) => (
        <li key={i}>{formatPrimitive(item)}</li>
      ))}
    </ul>
  );
}

/* -------- Rule 3 — array of objects -------- */
function ObjectTable({ rows }: { rows: Record<string, unknown>[] }) {
  // Union of all keys across all rows, preserving first-seen order.
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      if (!seen.has(k)) {
        seen.add(k);
        keys.push(k);
      }
    }
  }

  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full font-mono text-xs">
        <thead className="bg-surface-2 text-text-mute uppercase tracking-wider">
          <tr>
            {keys.map((k) => (
              <th key={k} className="text-left px-2 py-1 border-b border-border whitespace-nowrap">
                {humaniseKey(k)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-text-dim">
          {rows.map((row, i) => (
            <tr key={i} className={rowBg(i)}>
              {keys.map((k) => (
                <td
                  key={k}
                  className="px-2 py-1 border-b border-border last:border-b-0 align-top"
                >
                  <CellValue value={row[k]} fieldKey={k} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Cell renderer used inside object tables — defers to the appropriate rule
   for nested structures. */
function CellValue({ value, fieldKey }: { value: unknown; fieldKey: string }) {
  if (isPrimitive(value)) return <>{formatPrimitive(value, fieldKey)}</>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-text-mute">—</span>;
    if (value.every(isPrimitive)) {
      return <>{(value as Primitive[]).map((v) => formatPrimitive(v)).join(", ")}</>;
    }
    if (value.every(isPlainObject)) {
      return <ObjectTable rows={value as Record<string, unknown>[]} />;
    }
    // Mixed array — render each item on its own row.
    return (
      <ul className="space-y-1">
        {value.map((v, i) => (
          <li key={i}>
            <CellValue value={v} fieldKey={fieldKey} />
          </li>
        ))}
      </ul>
    );
  }
  if (isPlainObject(value)) {
    return <KeyValueTable obj={value} nested />;
  }
  return <span className="text-text-mute">—</span>;
}

/* -------- Rule 2 — plain object as key-value table -------- */
function KeyValueTable({
  obj,
  nested = false,
}: {
  obj: Record<string, unknown>;
  nested?: boolean;
}) {
  const entries = Object.entries(obj);
  if (entries.length === 0) return <span className="text-text-mute">—</span>;

  return (
    <div className={nested ? "border-l border-border pl-2" : "border border-border"}>
      <table className="w-full font-mono text-xs">
        <tbody className="text-text-dim">
          {entries.map(([k, v], i) => (
            <tr key={k} className={rowBg(i)}>
              <th
                scope="row"
                className="text-left px-2 py-1 align-top border-b border-border last:border-b-0 text-text-mute uppercase tracking-wider w-1/3 whitespace-nowrap"
              >
                {humaniseKey(k)}
              </th>
              <td className="px-2 py-1 align-top border-b border-border last:border-b-0 break-words">
                <CellValue value={v} fieldKey={k} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------- Public entry — applies all four rules -------- */
export function EvidenceView({ evidence }: { evidence: unknown }) {
  // Rule 1 — null / undefined → render nothing.
  if (evidence === null || evidence === undefined) return null;

  if (Array.isArray(evidence)) {
    if (evidence.length === 0) {
      return (
        <p className="font-mono text-xs text-text-mute italic">No evidence rows.</p>
      );
    }
    if (evidence.every(isPlainObject)) {
      return <ObjectTable rows={evidence as Record<string, unknown>[]} />;
    }
    if (evidence.every(isPrimitive)) {
      return <PrimitiveList items={evidence as Primitive[]} />;
    }
    // Mixed array — fall back to per-item rendering with the same rules.
    return (
      <div className="space-y-2">
        {evidence.map((item, i) => (
          <div key={i}>
            <EvidenceView evidence={item} />
          </div>
        ))}
      </div>
    );
  }

  if (isPlainObject(evidence)) {
    return <KeyValueTable obj={evidence} />;
  }

  // Lone primitive — render it on its own line.
  return (
    <p className="font-mono text-xs text-text-dim">
      {formatPrimitive(evidence as Primitive)}
    </p>
  );
}
