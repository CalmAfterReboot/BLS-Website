import type {
  GitHubActivityItem,
  GitHubRepo,
  ProcessedRepo,
  RepoDeploymentStatus,
} from "@/types/github";

export const GITHUB_USERNAME =
  process.env.GITHUB_USERNAME?.trim() || "CalmAfterReboot";

export const PINNED_REPOS_ORDER = [
  "bls-azure-landing-zone",
  "bls-aks-platform",
  "bls-cicd-pipeline",
  "bls-observability-stack",
  "bls-policy-governance",
  "bls-ai-gateway",
  "homelab-infrastructure",
] as const;

export const WATCHED_REPOS = [...PINNED_REPOS_ORDER];

export const BLS_META: Record<
  string,
  { phase: string; description: string }
> = {
  "BLS-Website": {
    phase: "PORTFOLIO",
    description:
      "Production portfolio site for Blue Layer Systems — built with Next.js 14, TypeScript, Tailwind CSS, and a Groq-powered AI assistant. Deployed to Vercel at bluelayersystems.com.",
  },
  "bls-azure-landing-zone": {
    phase: "PROJECT 01",
    description:
      "Enterprise landing zone patterns: subscriptions, management groups, policy baselines, and network guardrails for Azure estates.",
  },
  "bls-aks-platform": {
    phase: "PROJECT 02",
    description:
      "Kubernetes platform on AKS: workload identity, ingress, cluster lifecycle, and hardened node pools for production services.",
  },
  "bls-cicd-pipeline": {
    phase: "PROJECT 03",
    description:
      "CI/CD rails with GitHub Actions and GitOps hooks—build, scan, promote, and trace releases end to end.",
  },
  "bls-observability-stack": {
    phase: "PROJECT 04",
    description:
      "Metrics, logs, and SLO-oriented dashboards wired for platform teams and incident response.",
  },
  "bls-policy-governance": {
    phase: "PROJECT 05",
    description:
      "Policy-as-code, guardrails, and compliance automation across cloud control planes.",
  },
  "bls-ai-gateway": {
    phase: "PROJECT 06",
    description:
      "Secure ingress and routing patterns for AI workloads and upstream API governance.",
  },
  "homelab-infrastructure": {
    phase: "HOMELAB",
    description:
      "Bare-metal and virtual lab for validating Terraform modules, GitOps flows, and observability before production rollouts.",
  },
};

const CACHE = { revalidate: 300 } as const;

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim();
  const base: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "BlueLayerSystems-Portfolio",
  };
  if (!token) return base;
  return { ...base, Authorization: `Bearer ${token}` };
}

export async function fetchUserRepos(): Promise<GitHubRepo[]> {
  const headers = githubHeaders();
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    { headers, next: CACHE }
  );
  if (!res.ok) {
    throw new Error(`GitHub repos error: ${res.status}`);
  }
  const data = (await res.json()) as GitHubRepo[];
  return data.filter((r) => !r.fork);
}

export function sortAndEnrichRepos(repos: GitHubRepo[]): ProcessedRepo[] {
  const byName = new Map(repos.map((r) => [r.name, r]));
  const pinned: ProcessedRepo[] = [];
  const seen = new Set<string>();

  for (const name of PINNED_REPOS_ORDER) {
    const r = byName.get(name);
    if (r) {
      const meta = BLS_META[name];
      pinned.push({
        ...r,
        phase: meta?.phase ?? "PROJECT",
        blsDescription:
          meta?.description ?? r.description ?? "Infrastructure component.",
      });
      seen.add(name);
    }
  }

  const rest = repos
    .filter((r) => !seen.has(r.name))
    .sort(
      (a, b) =>
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    )
    .map((r) => {
      const meta = BLS_META[r.name];
      return {
        ...r,
        phase: meta?.phase ?? "ARCHIVE",
        blsDescription:
          meta?.description ?? r.description ?? "Repository.",
      } satisfies ProcessedRepo;
    });

  return [...pinned, ...rest];
}

const ACTIVITY_TYPES = new Set([
  "PushEvent",
  "CreateEvent",
  "PullRequestEvent",
  "ReleaseEvent",
]);

export async function fetchUserActivity(
  limit = 10
): Promise<GitHubActivityItem[]> {
  const headers = githubHeaders();
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`,
    { headers, next: CACHE }
  );
  if (!res.ok) {
    throw new Error(`GitHub activity error: ${res.status}`);
  }
  const data = (await res.json()) as GitHubActivityItem[];
  return data.filter((e) => ACTIVITY_TYPES.has(e.type)).slice(0, limit);
}

async function latestDeploymentStatus(
  repo: string
): Promise<RepoDeploymentStatus> {
  const headers = githubHeaders();
  const base = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}`;
  const depRes = await fetch(`${base}/deployments?per_page=1`, {
    headers,
    next: CACHE,
  });
  if (!depRes.ok) {
    return { repo, state: "none" };
  }
  const deployments = (await depRes.json()) as { id: number }[];
  const latest = deployments[0];
  if (!latest) {
    return { repo, state: "none" };
  }
  const stRes = await fetch(
    `${base}/deployments/${latest.id}/statuses?per_page=1`,
    { headers, next: CACHE }
  );
  if (!stRes.ok) {
    return { repo, state: "pending" };
  }
  const statuses = (await stRes.json()) as { state: string }[];
  const top = statuses[0]?.state?.toLowerCase();
  const allowed: RepoDeploymentStatus["state"][] = [
    "success",
    "failure",
    "error",
    "pending",
    "in_progress",
    "queued",
    "waiting",
    "inactive",
  ];
  const state = allowed.includes(top as RepoDeploymentStatus["state"])
    ? (top as RepoDeploymentStatus["state"])
    : "pending";
  return { repo, state };
}

export async function fetchWatchedDeployments(): Promise<
  RepoDeploymentStatus[]
> {
  const results = await Promise.all(
    WATCHED_REPOS.map((repo) => latestDeploymentStatus(repo))
  );
  return results;
}

export function cacheHeaders(): HeadersInit {
  return {
    "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
  };
}
