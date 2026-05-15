"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent-olive bg-surface px-4 py-2 italic text-text-dim">
              {children}
            </blockquote>
          ),
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
