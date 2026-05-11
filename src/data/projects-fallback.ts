import { projects as projectsConfig, identity } from "@/config/bls.config";

export interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  accent: string;
}

const ACCENTS = ["#00D4FF", "#7B4FFF", "#FFB347", "#FF6B9D", "#00FF88"];

export const projectsFallback: Project[] = projectsConfig.map((p, i) => ({
  id:          i + 1,
  name:        p.github_repo,
  description: p.short_desc,
  url:         `${identity.github}/${p.github_repo}`,
  stars:       0,
  language:    p.language,
  topics:      p.tags.map((t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
  updatedAt:   new Date().toISOString(),
  accent:      ACCENTS[i % ACCENTS.length],
}));
