import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, KeyRound } from "lucide-react";
import { PLATFORMS, getPlatform, type PlatformAccess } from "@/data/platforms";

export function generateStaticParams() {
  return PLATFORMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const platform = getPlatform(slug);
  if (!platform) return { title: "Platform" };
  return { title: `${platform.name} — Platform`, description: platform.tagline };
}

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

export default async function PlatformDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const platform = getPlatform(slug);
  if (!platform) notFound();

  const { name, tagline, url, access, accessNote, detail, tech, Icon } = platform;

  return (
    <div className="min-h-screen pt-20 pb-24 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/platform"
          className="inline-flex items-center gap-1 font-mono text-xs text-text-mute hover:text-accent-olive transition-colors uppercase tracking-wider mb-8"
        >
          <ArrowLeft size={12} /> All platforms
        </Link>

        <header className="border-t border-b border-border py-2 mb-10">
          <p className="font-mono text-xs text-accent-olive tracking-widest uppercase">
            {"// PLATFORM"}
          </p>
        </header>

        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Icon size={22} className="text-accent-olive flex-shrink-0" />
            <h1 className="font-sans font-semibold text-4xl text-text">{name}</h1>
          </div>
          <div className="pt-2">
            <AccessBadge access={access} />
          </div>
        </div>
        <p className="text-text-dim mb-8">{tagline}</p>

        {/* Open / authenticate */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="group flex items-center justify-between border border-border border-l-2 border-l-accent-olive bg-surface p-4 mb-3 hover:border-accent-olive transition-colors"
        >
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-wider text-text mb-1">
              Open &amp; authenticate
            </p>
            <p className="font-mono text-[12px] text-accent-olive lowercase tracking-wide break-all">
              {url.replace("https://", "")}
            </p>
          </div>
          <ArrowUpRight
            size={18}
            className="text-text-mute group-hover:text-accent-olive transition-colors flex-shrink-0 ml-3"
          />
        </a>

        {/* Access note */}
        <div className="flex items-start gap-2 mb-10 text-text-mute">
          <KeyRound size={13} className="flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">{accessNote}</p>
        </div>

        {/* Detail */}
        <div className="space-y-4 mb-10">
          {detail.map((para, i) => (
            <p key={i} className="text-text-dim leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Stack */}
        <div className="border-t border-border pt-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-mute mb-2">
            Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tech.map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.5 border border-border font-mono text-[10px] text-text-dim uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
