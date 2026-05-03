import { NextResponse } from "next/server";

import {
  cacheHeaders,
  fetchWatchedDeployments,
  GITHUB_USERNAME,
} from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const deployments = await fetchWatchedDeployments();
    return NextResponse.json(
      { deployments, username: GITHUB_USERNAME },
      { headers: cacheHeaders() }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: message, deployments: [], username: GITHUB_USERNAME },
      { status: 502, headers: cacheHeaders() }
    );
  }
}
