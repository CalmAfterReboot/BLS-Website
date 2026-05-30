import { Activity, GitBranch, Cpu, MonitorSmartphone, type LucideIcon } from "lucide-react";

export type PlatformAccess = "PIN" | "MFA";

export interface Platform {
  slug: string;
  name: string;
  tagline: string;
  url: string;
  access: PlatformAccess;
  accessNote: string;
  summary: string;
  detail: string[];
  tech: string[];
  Icon: LucideIcon;
}

/**
 * The publicly-exposed BLS platform surfaces. Each one is reachable at its
 * own subdomain, gated by Cloudflare Zero Trust (Access). Grafana is the
 * recruiter-friendly surface (one-time PIN); the rest are operator-only (MFA).
 *
 * These URLs go live once the cluster-side cloudflared tunnel is deployed
 * (terraform apply + ArgoCD sync of the cloudflared chart).
 */
export const PLATFORMS: Platform[] = [
  {
    slug: "grafana",
    name: "Grafana",
    tagline: "Observability — dashboards, traces, logs, metrics",
    url: "https://grafana.bluelayersystems.com",
    access: "PIN",
    accessNote:
      "Open to recruiters. Enter any email at the Cloudflare challenge, receive a one-time PIN, and you're in for a 1-hour read-only session.",
    summary:
      "Live dashboards over the k3s platform — the LLM-gateway tracing / logs / metrics board with Loki, Tempo and Prometheus behind one OpenTelemetry pipeline.",
    detail: [
      "Grafana is the single pane over the platform's three observability signals. Prometheus scrapes metrics, Loki ingests logs, and Tempo stores distributed traces — all fed by one OpenTelemetry collector running as a DaemonSet, with tail-based sampling that keeps every error trace and every slow (>2s) request while sampling the rest at 10%.",
      "The headline board is “BLS LLM Gateway — Tracing, Logs, Metrics”: request rate by route, p95 latency by provider, live traces, and namespace logs — with click-through pivots between a trace and the exact logs that ran during its window.",
      "This is the one surface open to recruiters: a one-time PIN to any email grants a 1-hour, read-only session. No account, no install.",
    ],
    tech: ["Grafana", "Loki", "Tempo", "Prometheus", "OpenTelemetry"],
    Icon: Activity,
  },
  {
    slug: "argocd",
    name: "ArgoCD",
    tagline: "GitOps control plane",
    url: "https://argocd.bluelayersystems.com",
    access: "MFA",
    accessNote:
      "Operator access only (email + MFA, 24-hour session). The public route lands on a read-only RBAC account.",
    summary:
      "The GitOps control plane: every workload's sync/health state, the matrix ApplicationSet that fans charts across the cluster, and live Git-to-cluster diffs.",
    detail: [
      "ArgoCD is the GitOps control plane. Every workload on the cluster is reconciled from the platform repository — a matrix ApplicationSet fans Helm charts across the cluster, and each Application surfaces its sync state, health, and a live Git-to-cluster diff.",
      "The public route lands on a read-only viewonly account: inspect everything, but no sync, no app mutation, no exec. Operator changes happen behind MFA, and write-capable admin access stays on the local network only.",
    ],
    tech: ["ArgoCD", "Helm", "GitOps", "Kubernetes"],
    Icon: GitBranch,
  },
  {
    slug: "guacamole",
    name: "Apache Guacamole",
    tagline: "Clientless remote-desktop gateway",
    url: "https://guacamole.bluelayersystems.com/guacamole",
    access: "MFA",
    accessNote:
      "Operator access only. Runs on a separate, isolated hardened host; every session is authenticated before any target is reachable. Never on the recruiter PIN path.",
    summary:
      "Clientless remote desktop — RDP, VNC and SSH delivered entirely in the browser, no client install. An operator-only surface behind Cloudflare Access and per-session authentication.",
    detail: [
      "Apache Guacamole is a clientless remote-desktop gateway: RDP, VNC and SSH sessions rendered entirely in the browser, with nothing to install on the client. It is an operator-only surface, never on the recruiter path.",
      "Guacamole runs on its own hardened, isolated host, deliberately separate from the k3s cluster. Every session is gated by Cloudflare Access and authenticates before any target is reachable — defense in depth, not perimeter-only.",
    ],
    tech: ["Guacamole", "RDP", "VNC", "SSH"],
    Icon: MonitorSmartphone,
  },
  {
    slug: "gateway",
    name: "LLM Gateway",
    tagline: "OpenAI-compatible LLM routing",
    url: "https://gateway.bluelayersystems.com/docs",
    access: "MFA",
    accessNote:
      "Operator access at the edge (email one-time-PIN). The link opens the interactive API docs (Swagger UI) — viewable without a key; the API endpoints themselves are Bearer-token protected. The root path is a 401 by design (it's an API, not a dashboard).",
    summary:
      "An OpenAI-compatible API: FastAPI at the edge, LiteLLM routing across a homelab Ollama fleet and cloud providers, Redis-backed caching, OpenTelemetry on every request.",
    detail: [
      "The LLM Gateway is an OpenAI-compatible API: a thin FastAPI edge handles auth and request shaping, while LiteLLM routes completion requests across a homelab Ollama fleet and cloud providers, with Redis-backed caching and an OpenTelemetry span emitted on every request.",
      "It's an API rather than a browsable UI — the link reaches the gateway surface behind Cloudflare Access. Bearer-token auth at the backend means both the edge challenge and the API token must pass: defense in depth, not perimeter-only.",
    ],
    tech: ["FastAPI", "LiteLLM", "Redis", "OpenTelemetry"],
    Icon: Cpu,
  },
];

export function getPlatform(slug: string): Platform | undefined {
  return PLATFORMS.find((p) => p.slug === slug);
}
