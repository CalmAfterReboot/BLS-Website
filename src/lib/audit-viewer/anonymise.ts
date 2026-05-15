import type { HostBundle } from "@/types/audit-viewer";

const IPV4_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

export interface AnonymiseContext {
  hostnameMap: Map<string, string>;
}

export function createContext(hosts: HostBundle[]): AnonymiseContext {
  const hostnameMap = new Map<string, string>();
  hosts
    .map((h) => h.hostname)
    .filter(Boolean)
    .sort()
    .forEach((h, i) => {
      hostnameMap.set(h.toLowerCase(), `HOST-${String(i + 1).padStart(2, "0")}`);
    });
  return { hostnameMap };
}

function maskString(value: string, ctx: AnonymiseContext): string {
  let out = value;

  // IPv4 addresses
  out = out.replace(IPV4_RE, "xxx.xxx.xxx.xxx");

  // Hostnames (case-insensitive, longest first to avoid partial overlap)
  const hostnames = Array.from(ctx.hostnameMap.entries()).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [real, mask] of hostnames) {
    const re = new RegExp(`\\b${real.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    out = out.replace(re, mask);
  }

  // Domain values (heuristic: anything looking like a *.local or *.lan or *.corp)
  out = out.replace(/\b[a-z0-9-]+\.(?:local|lan|corp|internal|priv)\b/gi, "example.local");

  // Backslash-style usernames DOMAIN\user
  out = out.replace(/\b[A-Z0-9-]{1,32}\\[A-Za-z0-9._-]{1,64}\b/g, "DOMAIN\\user");

  return out;
}

export function maskValue(value: unknown, ctx: AnonymiseContext): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return maskString(value, ctx);
  if (Array.isArray(value)) return value.map((v) => maskValue(v, ctx));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = maskValue(v, ctx);
    }
    return out;
  }
  return value;
}

export function maskHostBundle(host: HostBundle, ctx: AnonymiseContext): HostBundle {
  const masked = maskValue(host, ctx) as HostBundle;
  // Make sure the top-level hostname field uses the masked alias even if the
  // raw hostname was missing from the recursive walk (defensive).
  const aliased = ctx.hostnameMap.get(host.hostname.toLowerCase());
  return { ...masked, hostname: aliased || masked.hostname };
}
