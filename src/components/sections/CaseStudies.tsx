import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { listCaseStudies } from "@/lib/case-studies";

export function CaseStudies() {
  const studies = listCaseStudies();

  return (
    <section id="case-studies" className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="border-t border-b border-border py-2 mb-10">
          <p className="font-mono text-xs text-accent-olive tracking-widest uppercase">
            {"// CASE STUDIES — FIELD REPORTS"}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              data-cursor="hover"
              className="group block border border-border bg-surface p-5 hover:border-accent-olive transition-colors"
            >
              <div className="flex items-start gap-2 mb-3">
                <FileText size={14} className="text-text-mute flex-shrink-0 mt-1" />
                <span className="font-sans font-medium text-text">{study.title}</span>
              </div>
              <p className="text-sm text-text-dim leading-relaxed mb-4 line-clamp-3">
                {study.intro}
              </p>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-text-mute group-hover:text-accent-olive transition-colors uppercase tracking-wider">
                Read report <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/case-studies"
            data-cursor="hover"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-mute hover:text-accent-olive transition-colors uppercase tracking-wider"
          >
            View all case studies <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </section>
  );
}
