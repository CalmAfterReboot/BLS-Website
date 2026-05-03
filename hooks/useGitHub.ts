"use client";

import useSWR from "swr";

import type {
  ActivityResponse,
  DeploymentsResponse,
  ReposResponse,
} from "@/types/github";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Request failed: ${r.status}`);
    return r.json();
  });

const POLL_MS = 300_000;

export function useGitHubRepos() {
  return useSWR<ReposResponse>("/api/github/repos", fetcher, {
    refreshInterval: POLL_MS,
    revalidateOnFocus: true,
  });
}

export function useGitHubActivity() {
  return useSWR<ActivityResponse>("/api/github/activity", fetcher, {
    refreshInterval: POLL_MS,
    revalidateOnFocus: true,
  });
}

export function useGitHubDeployments() {
  return useSWR<DeploymentsResponse>("/api/github/deployments", fetcher, {
    refreshInterval: POLL_MS,
    revalidateOnFocus: true,
  });
}
