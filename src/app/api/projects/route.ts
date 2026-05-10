import { NextResponse } from "next/server";
import { projectsFallback } from "@/data/projects-fallback";

const GITHUB_USER = "CalmAfterReboot";
const PINNED_NAMES = ["azure-landing-zone", "aks-platform", "litellm-gateway", "BLS-Website"];

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json(projectsFallback);
    }

    const repos: GithubRepo[] = await res.json();

    const accents = ["#00D4FF", "#7B4FFF", "#FFB347", "#FF6B9D", "#00FF88"];

    const pinned = PINNED_NAMES.map((name, i) => {
      const repo = repos.find((r) => r.name === name);
      if (!repo) return null;
      const fallback = projectsFallback.find((p) => p.name === name);
      return {
        id: repo.id,
        name: repo.name,
        description: repo.description || fallback?.description || "",
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
        accent: accents[i % accents.length],
      };
    }).filter(Boolean);

    const rest = repos
      .filter((r) => !PINNED_NAMES.includes(r.name))
      .slice(0, 4 - pinned.length)
      .map((repo, i) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || "",
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
        accent: accents[(pinned.length + i) % accents.length],
      }));

    return NextResponse.json([...pinned, ...rest]);
  } catch {
    return NextResponse.json(projectsFallback);
  }
}
