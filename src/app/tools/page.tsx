import Link from "next/link";
import { ArrowLeft, ArrowRight, Wrench } from "lucide-react";

export const metadata = {
  title: "Tools",
  description: "Internal utilities built for production infrastructure work.",
};

interface Tool {
  slug: string;
  href: string;
  name: string;
  description: string;
  status: "BETA" | "STABLE" | "PLANNED";
  tech: string[];
}

const TOOLS: Tool[] = [
  {
    slug: "audit-viewer",
    href: "/tools/audit-viewer",
    name: "Estate Audit Viewer",
    description:
      "Renders JSON output from the BLS Estate Discovery PowerShell collectors. Drag-and-drop, no upload, no persistence.",
    status: "BETA",
    tech: ["TypeScript", "React", "Tailwind"],
  },
];

function StatusBadge({ status }: { status: Tool["status"] }) {
  const colour =
    status === "STABLE"  ? "border-l-status-ok text-status-ok"
    : status === "BETA"   ? "border-l-status-warning text-status-warning"
    :                       "border-l-status-info text-status-info";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 border border-border ${colour} border-l-2 font-mono text-[10px] uppercase tracking-wider`}
    >
      [ {status} ]
    </span>
  );
}

export default function ToolsIndexPage() {
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
            {"// TOOLS — INTERNAL UTILITIES"}
          </p>
        </header>

        <h1 className="font-sans font-semibold text-4xl text-text mb-4">Tools</h1>
        <p className="text-text-dim max-w-2xl mb-12">
          Browser-side utilities I&apos;ve built for production work. No upload, no persistence,
          source-readable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.href}
              data-cursor="hover"
              className="group block border border-border bg-surface p-5 hover:border-accent-olive transition-colors"
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Wrench size={14} className="text-text-mute flex-shrink-0" />
                  <span className="font-sans font-medium text-text truncate">
                    {tool.name}
                  </span>
                </div>
                <StatusBadge status={tool.status} />
              </div>
              <p className="text-sm text-text-dim leading-relaxed mb-4">
                {tool.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tool.tech.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 border border-border font-mono text-[10px] text-text-dim uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-text-mute group-hover:text-accent-olive transition-colors uppercase tracking-wider">
                Open tool <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
