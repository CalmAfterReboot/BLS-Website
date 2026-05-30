import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { PLATFORMS, type PlatformAccess } from "@/data/platforms";

export const metadata = {
  title: "Platform",
  description:
    "Live access to the BLS platform — Grafana, ArgoCD, Guacamole, and the LLM Gateway — behind Cloudflare Zero Trust.",
};

function AccessBadge({ access }: { access: PlatformAccess }) {
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
          cluster. Open a surface to see what it is and how to get in.
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
            ArgoCD, Guacamole and the gateway are operator-only (MFA). Authentication happens at
            Cloudflare&apos;s edge first, then again at the backend — the cluster never trusts the
            network alone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLATFORMS.map(({ slug, name, tagline, access, summary, tech, Icon }) => (
            <Link
              key={slug}
              href={`/platform/${slug}`}
              data-cursor="hover"
              className="group flex flex-col border border-border bg-surface p-5 hover:border-accent-olive transition-colors"
            >
              <div className="flex items-start justify-between mb-1 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon size={15} className="text-text-mute flex-shrink-0" />
                  <span className="font-sans font-medium text-text truncate">{name}</span>
                </div>
                <AccessBadge access={access} />
              </div>

              <p className="font-mono text-[11px] text-text-mute lowercase tracking-wide mb-3">
                {tagline}
              </p>

              <p className="text-sm text-text-dim leading-relaxed mb-4">{summary}</p>

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
                View &amp; open <ArrowRight size={11} />
              </span>
            </Link>
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
