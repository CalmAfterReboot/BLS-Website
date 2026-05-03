export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  pushed_at: string;
}

export interface GitHubActivityItem {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: { message: string; sha: string }[];
    ref?: string;
    ref_type?: string;
    action?: string;
    pull_request?: { title: string; html_url: string };
    release?: { name: string; tag_name: string };
  };
}

export type DeploymentState =
  | "success"
  | "failure"
  | "error"
  | "pending"
  | "in_progress"
  | "queued"
  | "waiting"
  | "inactive"
  | "none";

export interface RepoDeploymentStatus {
  repo: string;
  state: DeploymentState;
}

export interface ProcessedRepo extends GitHubRepo {
  phase: string;
  blsDescription: string;
}

export interface ReposResponse {
  repos: ProcessedRepo[];
  username: string;
}

export interface ActivityResponse {
  events: GitHubActivityItem[];
  username: string;
}

export interface DeploymentsResponse {
  deployments: RepoDeploymentStatus[];
  username: string;
}
