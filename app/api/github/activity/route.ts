import { NextResponse } from "next/server";

import {
  cacheHeaders,
  fetchUserActivity,
  GITHUB_USERNAME,
} from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await fetchUserActivity(10);
    return NextResponse.json(
      { events, username: GITHUB_USERNAME },
      { headers: cacheHeaders() }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: message, events: [], username: GITHUB_USERNAME },
      { status: 502, headers: cacheHeaders() }
    );
  }
}
