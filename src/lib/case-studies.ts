import fs from "node:fs";
import path from "node:path";

export interface CaseStudyMeta {
  slug: string;
  file: string;
  title: string;
  intro: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

// Stable slug mapping. Filenames are numbered for chronological ordering on
// disk; URL slugs are human-readable.
const FILE_TO_SLUG: Record<string, string> = {
  "01-incident-vpn-rds-cascade.md":           "vpn-rds-cascade",
  "02-azure-migration-discovery-methodology.md": "azure-discovery-methodology",
};

function parseMeta(file: string, raw: string): CaseStudyMeta {
  const lines = raw.split("\n");
  const titleLine = lines.find((l) => l.startsWith("# ")) || "# Untitled";
  const title = titleLine.replace(/^#\s+/, "").trim();
  const introLine = lines.find((l) => l.trim().length > 0 && !l.startsWith("#")) || "";
  const intro = introLine.replace(/^\*\*[^*]+:\*\*\s*/, "").trim();
  return {
    slug: FILE_TO_SLUG[file] || file.replace(/\.md$/, ""),
    file,
    title,
    intro,
  };
}

export function listCaseStudies(): CaseStudyMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => parseMeta(file, fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")));
}

export function getCaseStudyBySlug(slug: string): { meta: CaseStudyMeta; body: string } | null {
  const studies = listCaseStudies();
  const meta = studies.find((s) => s.slug === slug);
  if (!meta) return null;
  const body = fs.readFileSync(path.join(CONTENT_DIR, meta.file), "utf8");
  return { meta, body };
}
