import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Activity, GitBranch, Cpu, KeyRound } from "lucide-react";

export const metadata = {
  title: "Platform",
  description:
    "Live access to the BLS platform — Grafana, ArgoCD, and the LLM Gateway — behind Cloudflare Zero Trust.",
};

type Access = "PIN" | "MFA";

interface Platform {
  slug: string;
  name: string;
  url: string;
  description: string;
  access: Access;
  accessNote: string;
  tech: string[];
  Icon: typeof Activity;
}

const PLATFORMS: Platform[] = [
  {
    slug: "grafana",
    name: "Grafana — Observability",
    url: "https://grafana.bluelayersystems.com",
    description:
      "Live dashboards over the k3s platform: the LLM-gateway tracing / logs / metrics board, with Loki (logs), Tempo (traces) and Prometheus (metrics) wired as datasources through one OpenTelemetry pipeline.",
    access: "PIN",
    accessNote:
      "Open to recruiters. Enter any email at the Cloudflare challenge, receive a one-time PIN, and you're in for a 1-hour read-only session.",
    tech: ["Grafana", "Loki", "Tempo", "Prometheus", "OpenTelemetry"],
    Icon: Activity,
  },
  {
    slug: "argocd",
    name: "ArgoCD — GitOps Control Plane",
    url: "https://argocd.bluelayersystems.com",
    description:
      "The GitOps control plane: every workload's sync/health state, the matrix ApplicationSet that fans out across the cluster, and live Git-to-cluster diffs. Read-only viewonly account behind the edge.",
    access: "MFA",
    accessNote:
      "Operator access only (email + MFA, 24-hour session). The public route lands on a read-only RBAC account — no sync, no app mutation.",
    tech: ["ArgoCD", "Helm", "GitOps", "Kubernetes"],
    Icon: GitBranch,
  },
  {
    slug: "gateway",
    name: "LLM Gateway",
    url: "https://gateway.bluelayersystems.com",
    description:
      "An OpenAI-compatible LLM gateway: FastAPI at the edge, LiteLLM routing across a homelab Ollama fleet and cloud providers, Redis-backed caching, and OpenTelemetry spans on every request.",
    access: "MFA",
    accessNote:
      "Operator access only (email + MFA). The API itself is Bearer-token authenticated behind Cloudflare Access — defense in depth, both layers required.",
    tech: ["FastAPI", "LiteLLM", "Redis", "OpenTelemetry"],
    Icon: Cpu,
  },
];

function AccessBadge({ access }: { access: Access }) {
  const cfg =
    access === "PIN"
      ? { label: "ONE-TIME PIN", colour: "border-l-status-info text-status-info" }
      : { label: "OPERATOR MFA", colour: "border-l-status-warning text-status-warning" };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 border border-border ${cfg.colour} border-l-2 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap`}
    >
      [ {cfg.label} ]
    </span>
  );
}

export default function PlatformIndexPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-mono text-xs text-text-mute hover:text-accent-olive transition-colors uppercase tracking-wider mb-8"
        >
          <ArrowLeft size={12} /> Home
        </Link>

        <header className="border-t border-b border-border py-2 mb-10">
          <p className="font-mono text-xs text-accent-olive tracking-widest uppercase">
            {"// PLATFORM — LIVE ACCESS"}
          </p>
        </header>

        <h1 className="font-sans font-semibold text-4xl text-text mb-4">Platform</h1>
        <p className="text-text-dim max-w-2xl mb-6">
          The running BLS platform, exposed publicly through Cloudflare Zero Trust — no inbound
          port on the homelab, every request authenticated at the edge before it reaches the
          cluster. Pick a surface below.
        </p>

        {/* Access-model callout */}
        <div className="border border-border border-l-2 border-l-accent-olive bg-surface p-4 mb-12 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound size={14} className="text-accent-olive flex-shrink-0" />
            <span className="font-mono text-xs uppercase tracking-wider text-text">
              How access works
            </span>
          </div>
          <p className="text-sm text-text-dim leading-relaxed">
            Grafana is reviewer-friendly: a{" "}
            <span className="text-text">one-time PIN to any email</span>, 1-hour session, read-only.
            ArgoCD and the gateway are operator-only (MFA). Authentication happens at Cloudflare&apos;s
            edge first, then again at the backend — the cluster never trusts the network alone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map(({ slug, name, url, description, access, accessNote, tech, Icon }) => (
            <a
              key={slug}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group flex flex-col border border-border bg-surface p-5 hover:border-accent-olive transition-colors"
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon size={14} className="text-text-mute flex-shrink-0" />
                  <span className="font-sans font-medium text-text truncate">{name}</span>
                </div>
                <AccessBadge access={access} />
              </div>

              <p className="font-mono text-[11px] text-accent-olive lowercase tracking-wide mb-3 break-all">
                {url.replace("https://", "")}
              </p>

              <p className="text-sm text-text-dim leading-relaxed mb-4">{description}</p>

              <p className="text-xs text-text-mute leading-relaxed mb-4 border-l border-border pl-3">
                {accessNote}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 border border-border font-mono text-[10px] text-text-dim uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <span className="mt-auto inline-flex items-center gap-1 font-mono text-xs text-text-mute group-hover:text-accent-olive transition-colors uppercase tracking-wider">
                Open <ArrowUpRight size={11} />
              </span>
            </a>
          ))}
        </div>

        <p className="text-xs text-text-mute mt-10 max-w-2xl leading-relaxed">
          Surfaces are gated by Cloudflare Access — you&apos;ll meet the edge challenge before any
          page loads. If a link does not resolve yet, the tunnel is mid-deployment; access goes live
          once the cluster-side cloudflared daemon is synced.
        </p>
      </div>
    </div>
  );
}
