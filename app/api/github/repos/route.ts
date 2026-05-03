import { NextResponse } from "next/server";

import {
  cacheHeaders,
  fetchUserRepos,
  GITHUB_USERNAME,
  sortAndEnrichRepos,
} from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const raw = await fetchUserRepos();
    const repos = sortAndEnrichRepos(raw);
    return NextResponse.json(
      { repos, username: GITHUB_USERNAME },
      { headers: cacheHeaders() }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: message, repos: [], username: GITHUB_USERNAME },
      { status: 502, headers: cacheHeaders() }
    );
  }
}
