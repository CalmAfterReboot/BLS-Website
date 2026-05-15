import type { InventoryDoc } from "@/types/audit-viewer";

interface RowProps { label: string; value: unknown; }

function Row({ label, value }: RowProps) {
  return (
    <div className="grid grid-cols-[10rem_1fr] gap-2 border-b border-border py-1.5 last:border-b-0">
      <dt className="font-mono text-xs text-text-mute uppercase tracking-wider">{label}</dt>
      <dd className="font-mono text-xs text-text-dim break-words">
        {value === null || value === undefined || value === ""
          ? "—"
          : typeof value === "object"
          ? JSON.stringify(value)
          : String(value)}
      </dd>
    </div>
  );
}

function asRecord(v: unknown): Record<string, unknown> {
  return (v && typeof v === "object" ? (v as Record<string, unknown>) : {});
}

export function InventoryPanel({ doc }: { doc: InventoryDoc }) {
  const os = asRecord(doc.OperatingSystem);
  const hw = asRecord(doc.Hardware);
  const net = asRecord(doc.Network);
  const volumes = (doc.Volumes || []) as Array<Record<string, unknown>>;
  const adapters = (net.Adapters || []) as Array<Record<string, unknown>>;

  return (
    <div className="space-y-6">
      <section>
        <h4 className="font-mono text-xs text-accent-olive uppercase tracking-wider mb-2">
          OS
        </h4>
        <dl>
          <Row label="Caption"      value={os.Caption} />
          <Row label="Version"      value={os.Version} />
          <Row label="Architecture" value={os.Architecture} />
          <Row label="Uptime (d)"   value={os.UptimeDays} />
          <Row label="Memory MB"    value={os.TotalVisibleMemoryMB} />
        </dl>
      </section>

      <section>
        <h4 className="font-mono text-xs text-accent-olive uppercase tracking-wider mb-2">
          Hardware
        </h4>
        <dl>
          <Row label="Manufacturer" value={hw.Manufacturer} />
          <Row label="Model"        value={hw.Model} />
          <Row label="Domain"       value={hw.Domain} />
          <Row label="CPU"          value={hw.CPUName} />
          <Row label="Cores"        value={hw.CPUCores} />
          <Row label="Memory (GB)"  value={hw.TotalPhysicalMemoryGB} />
          <Row label="Virtual"      value={String(hw.Virtual ?? "")} />
        </dl>
      </section>

      <section>
        <h4 className="font-mono text-xs text-accent-olive uppercase tracking-wider mb-2">
          Volumes
        </h4>
        <div className="border border-border">
          <table className="w-full font-mono text-xs">
            <thead className="bg-surface-2 text-text-mute uppercase tracking-wider">
              <tr>
                <th className="text-left px-2 py-1">Drive</th>
                <th className="text-left px-2 py-1">Label</th>
                <th className="text-right px-2 py-1">Size GB</th>
                <th className="text-right px-2 py-1">Free GB</th>
                <th className="text-right px-2 py-1">Free %</th>
              </tr>
            </thead>
            <tbody className="text-text-dim">
              {volumes.map((v, i) => (
                <tr key={i} className={i % 2 ? "bg-surface" : ""}>
                  <td className="px-2 py-1">{String(v.DriveLetter ?? "")}</td>
                  <td className="px-2 py-1">{String(v.Label ?? "")}</td>
                  <td className="px-2 py-1 text-right">{String(v.SizeGB ?? "")}</td>
                  <td className="px-2 py-1 text-right">{String(v.FreeSpaceGB ?? v.FreeGB ?? "")}</td>
                  <td className="px-2 py-1 text-right">{String(v.FreePercent ?? "")}</td>
                </tr>
              ))}
              {volumes.length === 0 && (
                <tr><td className="px-2 py-2 text-text-mute" colSpan={5}>No volumes reported.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4 className="font-mono text-xs text-accent-olive uppercase tracking-wider mb-2">
          Network
        </h4>
        <dl>
          <Row label="Hostname" value={net.Hostname} />
          <Row label="FQDN"     value={net.FQDN} />
        </dl>
        <div className="mt-2 space-y-2">
          {adapters.map((a, i) => (
            <div key={i} className="border border-border bg-surface p-3">
              <p className="font-mono text-xs text-text-dim uppercase tracking-wider mb-1">
                {String(a.Description ?? "Adapter")}
              </p>
              <p className="font-mono text-xs text-text-mute">MAC: {String(a.MACAddress ?? "")}</p>
              <p className="font-mono text-xs text-text-mute">
                IP: {Array.isArray(a.IPAddresses) ? (a.IPAddresses as unknown[]).join(", ") : ""}
              </p>
              <p className="font-mono text-xs text-text-mute">
                DNS: {Array.isArray(a.DNSServers) ? (a.DNSServers as unknown[]).join(", ") : ""}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
