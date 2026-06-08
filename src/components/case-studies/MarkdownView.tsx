"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Children, isValidElement, type ReactNode } from "react";

// Flatten a React node tree to its text content, so a blockquote can be
// inspected for a leading alert marker (e.g. "[!DANGER]").
function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement(node)) {
    return nodeText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

const ALERTS = {
  DANGER: { wrap: "border-l-4 border-red-500 bg-red-500/10", label: "text-red-500", icon: "⛔" },
  WARNING: { wrap: "border-l-4 border-amber-500 bg-amber-500/10", label: "text-amber-500", icon: "⚠" },
} as const;

export function MarkdownView({ source }: { source: string }) {
  return (
    <article className="font-sans text-text leading-relaxed space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-text mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-sans font-medium text-2xl text-text mt-10 mb-3 border-t border-border pt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-sans font-medium text-xl text-text mt-6 mb-2">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-sans font-medium text-base text-text mt-4 mb-2 uppercase tracking-wider">
              {children}
            </h4>
          ),
          p:  ({ children }) => (
            <p className="text-text-dim leading-relaxed">{children}</p>
          ),
          a:  ({ href, children }) => (
            <a
              href={href}
              className="text-accent-olive underline decoration-accent-olive/40 hover:decoration-accent-olive"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-1 text-text-dim marker:text-accent-olive">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-1 text-text-dim marker:text-accent-olive">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => {
            // A blockquote whose first line is "[!DANGER]" or "[!WARNING]"
            // (on its own line) renders as a coloured alert callout.
            const items = Children.toArray(children);
            const head = nodeText(items[0]).trim().toUpperCase();
            const kind =
              head === "[!DANGER]" ? "DANGER" : head === "[!WARNING]" ? "WARNING" : null;
            if (kind) {
              const a = ALERTS[kind];
              return (
                <div className={`${a.wrap} px-4 py-3 my-4`}>
                  <p
                    className={`font-sans font-semibold uppercase tracking-wider text-sm mb-2 ${a.label}`}
                  >
                    {a.icon} {kind}
                  </p>
                  <div className="space-y-2 [&_p]:text-text-dim [&_strong]:text-text">
                    {items.slice(1)}
                  </div>
                </div>
              );
            }
            return (
              <blockquote className="border-l-2 border-accent-olive bg-surface px-4 py-2 italic text-text-dim">
                {children}
              </blockquote>
            );
          },
          code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) =>
            inline ? (
              <code className="font-mono text-sm bg-surface-2 text-text px-1 py-0.5 border border-border">
                {children}
              </code>
            ) : (
              <code className="font-mono text-sm text-text">{children}</code>
            ),
          pre: ({ children }) => (
            <pre className="font-mono text-sm bg-surface-2 border border-border p-4 overflow-x-auto text-text">
              {children}
            </pre>
          ),
          hr: () => <hr className="border-border my-8" />,
          strong: ({ children }) => <strong className="text-text font-semibold">{children}</strong>,
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm border border-border">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-surface-2 px-3 py-2 text-left text-text uppercase tracking-wider text-xs">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-text-dim">{children}</td>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
