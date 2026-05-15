import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { listCaseStudies } from "@/lib/case-studies";

export const metadata = {
  title: "Case Studies",
  description: "Field reports from production infrastructure work.",
};

export default function CaseStudiesIndexPage() {
  const studies = listCaseStudies();

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
            {"// CASE STUDIES — FIELD REPORTS"}
          </p>
        </header>

        <h1 className="font-sans font-semibold text-4xl text-text mb-4">Case Studies</h1>
        <p className="text-text-dim max-w-2xl mb-12">
          Long-form write-ups of production work — incidents, methodology, and discovery exercises.
        </p>

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
              <p className="text-sm text-text-dim leading-relaxed mb-4 line-clamp-4">
                {study.intro}
              </p>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-text-mute group-hover:text-accent-olive transition-colors uppercase tracking-wider">
                Read report <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
