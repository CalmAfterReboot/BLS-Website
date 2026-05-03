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
  "BLS-Website",
] as const;

export const WATCHED_REPOS = [...PINNED_REPOS_ORDER];

export const BLS_META: Record<
  string,
  { phase: string; description: string }
> = {
  "BLS-Website": {
    phase: "PORTFOLIO",
    description:
      "Production portfolio site for Blue Layer Systems. Built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and a Groq-powered AI assistant. Live at bluelayersystems.com.",
  },
  "bls-azure-landing-zone": {
    phase: "PROJECT 01",
    description:
      "Azure Landing Zone built with Terraform. Hub-spoke VNet topology, Azure Policy as code, remote state in Azure Storage, Checkov security scanning, Infracost cost estimation, and GitHub Actions CI/CD pipeline with plan/apply workflow.",
  },
  "bls-aks-platform": {
    phase: "PROJECT 02",
    description:
      "Production AKS cluster deployed via Terraform. GitOps with ArgoCD, Helm chart management, horizontal pod autoscaling, KEDA event-driven scaling, and namespace isolation. Mirrors k3s homelab setup.",
  },
  "bls-cicd-pipeline": {
    phase: "PROJECT 03",
    description:
      "Reusable GitHub Actions pipeline library for infrastructure delivery. Terraform plan/apply, Checkov policy enforcement, Infracost delta comments on PRs, and automated drift detection.",
  },
  "bls-observability-stack": {
    phase: "PROJECT 04",
    description:
      "Full observability platform using Prometheus, Grafana, and Loki. PromQL dashboards for infrastructure KPIs, alerting rules, SLI/SLO definitions, and incident response runbooks.",
  },
  "bls-policy-governance": {
    phase: "PROJECT 05",
    description:
      "Policy and compliance as code. OPA/Rego policies enforced at pipeline level, Azure Policy definitions for cloud guardrails, and automated compliance reporting across the BLS platform.",
  },
  "bls-ai-gateway": {
    phase: "PROJECT 06",
    description:
      "LLM routing gateway built with LiteLLM and FastAPI. Routes traffic across DeepSeek, Azure OpenAI, Anthropic, and Ollama on Proxmox homelab. Redis caching, PostgreSQL logging, cost tracking per model.",
  },
  "homelab-infrastructure": {
    phase: "HOMELAB",
    description:
      "Proxmox cluster with 128GB RAM, pfSense firewall, TP-Link managed switching, VLAN segmentation across 7 networks (10/20/30/40/50/99/200), Cloudflare Tunnel, and k3s for local Kubernetes workloads.",
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
