import type { WorkloadDoc } from "@/types/audit-viewer";

function asArray(v: unknown): Array<Record<string, unknown>> {
  return Array.isArray(v) ? (v as Array<Record<string, unknown>>) : [];
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="font-mono text-xs text-accent-olive uppercase tracking-wider mb-2">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-text-mute">[{count}]</span>
        )}
      </h4>
      {children}
    </section>
  );
}

export function WorkloadPanel({ doc }: { doc: WorkloadDoc }) {
  const sql = asArray(doc.SQLServer);
  const installed = asArray(doc.InstalledApps);
  const services = asArray(doc.Services);
  const listening = asArray(doc.ListeningPorts);
  const iis = asRecord(doc.IIS);
  const iisPools = asArray(iis.AppPools);
  const iisSites = asArray(iis.Sites);
  const rds = asRecord(doc.RDSLicensing);

  return (
    <div className="space-y-6">
      <Section title="SQL Server" count={sql.length}>
        {sql.length === 0 ? (
          <p className="font-mono text-xs text-text-mute">No SQL instances detected.</p>
        ) : (
          <ul className="font-mono text-xs text-text-dim space-y-1">
            {sql.map((s, i) => (
              <li key={i} className="border border-border bg-surface px-2 py-1">
                {String(s.InstanceName ?? "")} · v{String(s.Version ?? "")} · {String(s.Edition ?? "")}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="RDS Licensing">
        {Object.keys(rds).length === 0 ? (
          <p className="font-mono text-xs text-text-mute">RDS Licensing not installed.</p>
        ) : (
          <dl className="font-mono text-xs text-text-dim">
            <p>Mode: {String(rds.Mode ?? "—")}</p>
            <p>License server: {String(rds.LicenseServer ?? "—")}</p>
            <p>Issued CALs: {String(rds.IssuedCALs ?? "—")}</p>
            <p>Available CALs: {String(rds.AvailableCALs ?? "—")}</p>
          </dl>
        )}
      </Section>

      <Section title="IIS" count={iisSites.length}>
        {iisSites.length + iisPools.length === 0 ? (
          <p className="font-mono text-xs text-text-mute">IIS not installed.</p>
        ) : (
          <div className="space-y-2">
            {iisSites.length > 0 && (
              <div>
                <p className="font-mono text-[10px] text-text-mute uppercase tracking-wider mb-1">Sites</p>
                <ul className="font-mono text-xs text-text-dim space-y-1">
                  {iisSites.map((s, i) => (
                    <li key={i} className="border border-border bg-surface px-2 py-1">
                      {String(s.Name ?? "")} · {Array.isArray(s.Bindings) ? (s.Bindings as unknown[]).join(", ") : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {iisPools.length > 0 && (
              <div>
                <p className="font-mono text-[10px] text-text-mute uppercase tracking-wider mb-1">App pools</p>
                <ul className="font-mono text-xs text-text-dim space-y-1">
                  {iisPools.map((p, i) => (
                    <li key={i} className="border border-border bg-surface px-2 py-1">
                      {String(p.Name ?? "")} · runtime {String(p.ManagedRuntimeVersion ?? "")}
                      {p.Enable32Bit ? " · 32-bit" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Section>

      <Section title="Installed apps" count={installed.length}>
        {installed.length === 0 ? (
          <p className="font-mono text-xs text-text-mute">No applications discovered.</p>
        ) : (
          <div className="border border-border max-h-64 overflow-y-auto">
            <table className="w-full font-mono text-xs">
              <thead className="bg-surface-2 text-text-mute uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="text-left px-2 py-1">Name</th>
                  <th className="text-left px-2 py-1">Version</th>
                  <th className="text-left px-2 py-1">Publisher</th>
                </tr>
              </thead>
              <tbody className="text-text-dim">
                {installed.map((a, i) => (
                  <tr key={i} className={i % 2 ? "bg-surface" : ""}>
                    <td className="px-2 py-1">{String(a.DisplayName ?? "")}</td>
                    <td className="px-2 py-1">{String(a.DisplayVersion ?? "")}</td>
                    <td className="px-2 py-1">{String(a.Publisher ?? "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Services" count={services.length}>
        {services.length === 0 ? (
          <p className="font-mono text-xs text-text-mute">No services flagged.</p>
        ) : (
          <ul className="font-mono text-xs text-text-dim space-y-1">
            {services.map((s, i) => (
              <li key={i} className="border border-border bg-surface px-2 py-1">
                {String(s.Name ?? "")} · {String(s.StartName ?? "")} · {String(s.State ?? "")}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Listening ports" count={listening.length}>
        {listening.length === 0 ? (
          <p className="font-mono text-xs text-text-mute">No ports captured.</p>
        ) : (
          <ul className="font-mono text-xs text-text-dim space-y-1">
            {listening.map((p, i) => (
              <li key={i} className="border border-border bg-surface px-2 py-1">
                {String(p.LocalAddress ?? "")}:{String(p.LocalPort ?? "")} · {String(p.Process ?? "")}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
