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

export const projectsFallback: Project[] = [
  {
    id: 1,
    name: "azure-landing-zone",
    description:
      "Production Azure Landing Zone with Terraform, Policy, RBAC, and cost governance via Infracost.",
    url: "https://github.com/CalmAfterReboot/azure-landing-zone",
    stars: 0,
    language: "HCL",
    topics: ["terraform", "azure", "landing-zone", "infracost", "checkov"],
    updatedAt: new Date().toISOString(),
    accent: "#00D4FF",
  },
  {
    id: 2,
    name: "aks-platform",
    description:
      "AKS cluster with Helm charts, Ingress, TLS, RBAC, and GitHub Actions CI/CD.",
    url: "https://github.com/CalmAfterReboot/aks-platform",
    stars: 0,
    language: "HCL",
    topics: ["kubernetes", "aks", "helm", "github-actions", "azure"],
    updatedAt: new Date().toISOString(),
    accent: "#7B4FFF",
  },
  {
    id: 3,
    name: "litellm-gateway",
    description:
      "Self-hosted LiteLLM AI gateway on Proxmox with Ollama backend, cost tracking, and Cloudflare tunnel.",
    url: "https://github.com/CalmAfterReboot/litellm-gateway",
    stars: 0,
    language: "Python",
    topics: ["litellm", "ollama", "proxmox", "ai", "cloudflare"],
    updatedAt: new Date().toISOString(),
    accent: "#FFB347",
  },
  {
    id: 4,
    name: "BLS-Website",
    description:
      "This portfolio — cinematic Next.js 14 site with space nebula aesthetics, persona gate, and live GitHub integration.",
    url: "https://github.com/CalmAfterReboot/BLS-Website",
    stars: 0,
    language: "TypeScript",
    topics: ["nextjs", "typescript", "tailwind", "cloudflare"],
    updatedAt: new Date().toISOString(),
    accent: "#FF6B9D",
  },
];
