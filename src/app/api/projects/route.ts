import { NextResponse } from "next/server";
import { projectsFallback } from "@/data/projects-fallback";

const GITHUB_USER = "CalmAfterReboot";
const MAX_DISPLAY = 8;
const ACCENTS = ["#00D4FF", "#7B4FFF", "#FFB347", "#FF6B9D", "#00FF88"];

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
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

    const projects = repos
      .filter((r) => !r.fork)
      .slice(0, MAX_DISPLAY)
      .map((repo, i) => {
        const fallback = projectsFallback.find((p) => p.name === repo.name);
        return {
          id: repo.id,
          name: repo.name,
          description: repo.description || fallback?.description || "",
          url: repo.html_url,
          stars: repo.stargazers_count,
          language: repo.language,
          topics: repo.topics || [],
          updatedAt: repo.updated_at,
          accent: ACCENTS[i % ACCENTS.length],
        };
      });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(projectsFallback);
  }
}
