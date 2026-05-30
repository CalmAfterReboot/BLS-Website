import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCaseStudyBySlug, listCaseStudies } from "@/lib/case-studies";
import { MarkdownView } from "@/components/case-studies/MarkdownView";

export function generateStaticParams() {
  return listCaseStudies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return { title: "Case Study Not Found" };
  return { title: study.meta.title, description: study.meta.intro };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  // Strip the leading H1 from the body — we render it ourselves in the banner
  // so the metadata stays visually distinct from the markdown content.
  const body = study.body.replace(/^#\s+.*\n+/, "");

  return (
    <div className="min-h-screen pt-20 pb-24 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-1 font-mono text-xs text-text-mute hover:text-accent-olive transition-colors uppercase tracking-wider mb-8"
        >
          <ArrowLeft size={12} /> Back to case studies
        </Link>

        <header className="border-t border-b border-border py-2 mb-8">
          <p className="font-mono text-xs text-accent-olive tracking-widest uppercase">
            {"// CASE STUDY — FIELD REPORT"}
          </p>
        </header>

        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-text mb-4 leading-tight">
          {study.meta.title}
        </h1>
        <p className="text-text-dim mb-10">{study.meta.intro}</p>

        <MarkdownView source={body} />

        <footer className="mt-16 border-t border-border pt-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1 font-mono text-xs text-text-mute hover:text-accent-olive transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={12} /> All case studies
          </Link>
        </footer>
      </div>
    </div>
  );
}
