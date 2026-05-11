// ─────────────────────────────────────────────────────────────────────────────
// BLUE LAYER SYSTEMS — SITE CONTENT CONFIGURATION
// This is the ONLY file you edit to update site content.
// Push to main → Cloudflare deploys in ~90s.
//
// Data files (data/timeline.ts, data/skills.ts, etc.) are thin wrappers
// that transform this config into the shapes components expect.
// Never hardcode content in components — it lives here.
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
// IDENTITY
// ═══════════════════════════════════════════════════════════════

export const identity = {
  full_name:        "Mihai Gabriel",
  short_name:       "Mihai",
  brand:            "Blue Layer Systems",
  brand_short:      "BLS",
  role_title:       "Cloud & DevOps Engineer",
  email:            "mihai.ferencz@hotmail.com",
  phone:            "07436 784212",
  location:         "Carlisle, UK",
  github:           "https://github.com/CalmAfterReboot",
  github_handle:    "github.com/CalmAfterReboot",
  linkedin:         "https://linkedin.com/in/mihai-ferencz",
  linkedin_handle:  "linkedin.com/in/mihai-ferencz",
  portfolio:        "https://bluelayersystems.com",
  cal_booking:      "https://cal.com/mihai-ferencz",
  cv_path:          "/cv",
  footer_tagline:   "Engineering infrastructure that doesn't wake you up at 3am.",
  meta_description: "Cloud, Platform and DevOps Engineer. Building observable, auditable infrastructure at scale. 5+ years IT, 3+ years MSP, 50+ client tenants.",
};

// ═══════════════════════════════════════════════════════════════
// AVAILABILITY
// ═══════════════════════════════════════════════════════════════

export const availability = {
  open_to_work:  true,
  status_label:  "Available",
  work_type:     "Remote / Hybrid",
  right_to_work: "Full right to work in the UK",
  target_salary: "£55–65k",
  notice_period: "Immediately available",
  cert_ticker:   "AZ-900 ✓  ·  AZ-104 in progress  ·  Terraform Associate next  ·  Proxmox + AKS lab",
};

// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════

export const hero = {
  tagline: "Building observable, auditable infrastructure.",

  cycling_roles: [
    "Platform Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Site Reliability Engineer",
  ],

  stats: [
    { label: "Client Tenants",       value: 50,   suffix: "+" },
    { label: "Endpoints Managed",    value: 500,  suffix: "+" },
    { label: "Years in IT",          value: 5,    suffix: "+" },
    { label: "NHS Devices Deployed", value: 2000, suffix: "+" },
    { label: "Deployment Success",   value: 99,   suffix: "%+" },
  ],
};

// ═══════════════════════════════════════════════════════════════
// CERTIFICATIONS
// ═══════════════════════════════════════════════════════════════

export const certifications = [
  { name: "AZ-900", full_name: "Azure Fundamentals",          status: "passed" as const,      issued: "2024" },
  { name: "AZ-104", full_name: "Azure Administrator",         status: "in-progress" as const,  issued: "" },
  { name: "Terraform Associate", full_name: "HashiCorp Terraform Associate", status: "planned" as const, issued: "" },
];

// ═══════════════════════════════════════════════════════════════
// EXPERIENCE TIMELINE
// Newest first. Add roles by copying a block.
// ═══════════════════════════════════════════════════════════════

export const experience = [
  {
    id:          "global4",
    role:        "Technical Operations Engineer",
    company:     "Global4 Communications",
    location:    "Carlisle, UK",
    type:        "MSP",
    period:      "Sep 2025 → Present",
    period_sort: "2025-09",
    accent:      "#00D4FF",
    bg:          "#02040A",
    summary:     "Multi-tenant MSP delivering managed IT services to SME and mid-market UK clients. Sole technical escalation point for complex infrastructure incidents across Azure, Hyper-V, RDS/AVD, networking, and M365 across 50+ client tenants.",
    achievements: [
      {
        icon:   "🔥",
        title:  "RDS/AVD Heap Exhaustion Root-Cause",
        detail: "Root-caused desktop heap exhaustion on overloaded Terminal Server to accumulated disconnected sessions and an unexcluded AV scanner saturating shared I/O. Executed live FSLogix VHD→VHDX migration on an active AVD environment with zero session interruption. Audited mixed Entra ID/on-premises AD SID conflicts causing profile attach failures.",
        tags:   ["RDS", "AVD", "FSLogix", "Windows Server", "Performance"],
      },
      {
        icon:   "🌐",
        title:  "S2S VPN Firewall Migration Scoping",
        detail: "Assessed and documented SonicWall-to-DrayTek firewall migration with active Azure S2S VPN tunnel termination — scoped IKE policy, shared keys, and NAT rules before cutover to maintain Azure connectivity. Resolved DrayTek SSL VPN egress fault by enforcing correct interface binding.",
        tags:   ["DrayTek", "SonicWall", "Azure S2S VPN", "IPSec/IKE", "Networking"],
      },
      {
        icon:   "☁️",
        title:  "AAD Connect Connector Space Rebuild",
        detail: "Rebuilt AAD Connect connector space objects and forced delta sync to restore failed user provisioning. Configured SCIM provisioning for a third-party platform via Azure Enterprise Application including objectId→externalId attribute mapping. Managed Conditional Access, RBAC, MFA, and Intune policy across multi-tenant estate.",
        tags:   ["Entra ID", "AAD Connect", "SCIM", "Conditional Access", "Intune"],
      },
      {
        icon:   "🛠️",
        title:  "PowerShell & IaC Automation",
        detail: "Built PowerShell tooling for Windows Server in-place upgrades delivered via Azure Blob Storage SAS tokens. Deployed printers across Entra-joined AVD session hosts via Intune system-context scripts with no AD dependency.",
        tags:   ["PowerShell", "Intune", "Azure Blob", "Automation", "Change Control"],
      },
      {
        icon:   "⚙️",
        title:  "Patch & Change Management at Scale",
        detail: "Owned patch management cycles across 500+ endpoints via Datto RMM. CR authorship, impact analysis, and rollback planning for all change events. Post-sales technical scoping with sales team for AVD, Azure, and network upgrade proposals.",
        tags:   ["Datto RMM", "Patch Management", "Autotask PSA", "ITIL"],
      },
    ],
    stack: {
      daily:    ["Azure", "Entra ID", "Intune", "Hyper-V", "AVD", "FSLogix", "RDS", "Exchange Online", "DrayTek", "Cisco Meraki", "Sophos", "Datto RMM", "IT Glue", "Autotask PSA"],
      deepened: ["Terraform", "GitHub Actions", "Checkov", "Infracost", "SCIM", "S2S VPN design", "Hybrid identity"],
    },
  },
  {
    id:          "carrs",
    role:        "Senior IT Operations Analyst",
    company:     "Carrs Group PLC",
    location:    "Carlisle, UK",
    type:        "Enterprise",
    period:      "Jul 2023 → Aug 2025",
    period_sort: "2023-07",
    accent:      "#FFB347",
    bg:          "#050A02",
    summary:     "FTSE-listed agricultural and food group with 12+ UK sites. Owned infrastructure operations, multi-site AD DS, virtualisation platform, and engineering systems.",
    achievements: [
      {
        icon:   "🏭",
        title:  "Multi-Site Active Directory",
        detail: "Administered multi-site AD DS, GPOs, OU structure, and security group lifecycle across 12+ UK sites.",
        tags:   ["Active Directory", "GPO", "Multi-site", "Windows Server"],
      },
      {
        icon:   "⚙️",
        title:  "Hyper-V Infrastructure & DR",
        detail: "Managed Hyper-V host clusters — VM provisioning, checkpoints, live migrations, and DR runbooks. Full change control for infrastructure upgrades.",
        tags:   ["Hyper-V", "Virtualisation", "DR", "Change Control"],
      },
      {
        icon:   "🗄️",
        title:  "Autodesk Vault Administration",
        detail: "Owned Autodesk Vault server and client deployments for engineering teams including license server management and connectivity troubleshooting.",
        tags:   ["Autodesk Vault", "License Management", "Engineering Tools"],
      },
      {
        icon:   "📄",
        title:  "Operational Documentation",
        detail: "Authored and maintained runbooks, asset registers, and change logs adopted by other project engineers as the internal source of truth.",
        tags:   ["Documentation", "Runbooks", "ITIL"],
      },
    ],
    stack: {
      daily:    ["Active Directory", "Hyper-V", "Windows Server", "Autodesk Vault", "ITIL", "Group Policy"],
      deepened: ["Infrastructure architecture", "Multi-site networking", "Change management", "FTSE operational standards"],
    },
  },
  {
    id:          "mitie",
    role:        "Help Desk Analyst",
    company:     "Mitie",
    location:    "Carlisle, UK",
    type:        "Support",
    period:      "Mar 2022 → Jul 2023",
    period_sort: "2022-03",
    accent:      "#FF6B9D",
    bg:          "#0A0805",
    summary:     "Frontline IT and operational support within a major UK facilities management contract. Incident triage, escalation, and major incident communications.",
    achievements: [
      {
        icon:   "🎯",
        title:  "Incident Triage & Escalation",
        detail: "Triaged and escalated incidents across IT and estates systems within SLA — coordinated with engineers and external contractors to drive issues to resolution.",
        tags:   ["ITSM", "Incident Management", "SLA", "Escalation"],
      },
      {
        icon:   "📡",
        title:  "Major Incident Communications",
        detail: "Owned major incident communications — kept stakeholders informed under pressure and maintained accurate ticket trails for post-incident review.",
        tags:   ["Major Incident", "Stakeholder Management", "Documentation"],
      },
    ],
    stack: {
      daily:    ["ITSM tooling", "Incident management", "Stakeholder communication"],
      deepened: ["Operational resilience", "Customer communication under pressure", "SLA management"],
    },
  },
  {
    id:          "nhs",
    role:        "Windows 10 Deployment Engineer",
    company:     "Solution Through Knowledge — NHS Programme",
    location:    "Carlisle, UK",
    type:        "Contract",
    period:      "Jun 2021 → Dec 2021",
    period_sort: "2021-06",
    accent:      "#7B4FFF",
    bg:          "#040810",
    summary:     "Large-scale Windows 10 deployment across 2,000+ NHS endpoint devices on a fixed deadline. SCCM imaging, application packaging, user data migration, post-migration support, and hardware coordination with NHS procurement.",
    achievements: [
      {
        icon:   "🏥",
        title:  "2,000+ NHS Endpoints — 99%+ Success Rate",
        detail: "Deployed Windows 10 across clinical and administrative NHS estate on a fixed deadline using SCCM/Software Centre and GPO. Post-migration support and hardware replacements coordinated with NHS procurement.",
        tags:   ["SCCM", "Windows 10", "Endpoint", "NHS", "GPO"],
      },
    ],
    stack: {
      daily:    ["SCCM", "Windows 10", "Imaging", "Active Directory", "GPO"],
      deepened: ["Large-scale deployment", "Healthcare IT constraints", "Endpoint lifecycle management"],
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// PORTFOLIO PROJECTS
// GitHub API auto-fetches public repos. This provides richer
// descriptions shown in the project cards and portal views.
// ═══════════════════════════════════════════════════════════════

export const projects = [
  {
    id:           "azure-landing-zone",
    name:         "Azure Landing Zone",
    github_repo:  "azure-landing-zone",
    status:       "active",
    language:     "HCL",
    short_desc:   "Hub-spoke Azure Landing Zone with IaC, CI/CD, security scanning, and cost governance.",
    long_desc:    "Production-grade hub-spoke VNet topology built with Terraform. Remote state in Azure Storage with state locking. GitHub Actions pipeline with Checkov SAST (fails build on HIGH severity findings) and Infracost cost governance gate (fails build if delta exceeds £50/month). Azure Policy assignments enforce tagging and allowed regions.",
    why_built:    "To demonstrate production IaC patterns with real security and cost guardrails — not toy Terraform.",
    would_change: "Would add Workload Identity Federation to remove the service principal secret from CI/CD.",
    tags:         ["Terraform", "Azure", "GitHub Actions", "Checkov", "Infracost", "Hub-Spoke", "Azure Policy"],
  },
  {
    id:           "aks-platform",
    name:         "AKS Platform",
    github_repo:  "aks-platform",
    status:       "active",
    language:     "HCL",
    short_desc:   "Managed Kubernetes platform with Workload Identity, GitOps delivery, and container registry integration.",
    long_desc:    "AKS cluster with Workload Identity (replaces pod-managed identity), Azure Container Registry, and Helm-based application deployment. GitOps-style CD — application manifests in Git, cluster reconciles on merge. Secrets managed via Azure Key Vault CSI driver — no plaintext secrets in manifests.",
    why_built:    "Kubernetes is table stakes for Platform Engineering roles. Wanted a real cluster, not a minikube.",
    would_change: "Would add Karpenter for node autoscaling instead of cluster autoscaler.",
    tags:         ["AKS", "Kubernetes", "Helm", "Azure", "Workload Identity", "Key Vault", "GitOps"],
  },
  {
    id:           "llm-gateway",
    name:         "AI Gateway",
    github_repo:  "llm-gateway",
    status:       "active",
    language:     "Python",
    short_desc:   "LiteLLM routing layer across Azure OpenAI, DeepSeek, Anthropic, and Ollama with Cloudflare Worker front-end.",
    long_desc:    "FastAPI + LiteLLM gateway that routes inference requests across multiple LLM providers based on cost, latency, and compliance rules. Azure OpenAI for production/sensitive workloads. DeepSeek for cost-sensitive tasks. Ollama on Proxmox for offline/local fallback. Cloudflare Worker handles auth and rate limiting at the edge.",
    why_built:    "To operationalise LLM usage — route cheap tasks to cheap models, keep sensitive data on Azure OpenAI.",
    would_change: "Would add a semantic caching layer to reduce duplicate API calls.",
    tags:         ["LiteLLM", "FastAPI", "Cloudflare Workers", "Azure OpenAI", "Ollama", "Python", "Redis"],
  },
  {
    id:           "bls-website",
    name:         "BLS Website",
    github_repo:  "BLS-Website",
    status:       "active",
    language:     "TypeScript",
    short_desc:   "This portfolio — cinematic Next.js 14 site with space nebula aesthetics, persona gate, and live GitHub integration.",
    long_desc:    "Next.js 14 App Router portfolio with tsParticles nebula background, custom canvas galaxy cursor, persona gate (recruiter / engineer / architect), live GitHub projects API, and Cloudflare Pages deployment.",
    why_built:    "A portfolio that demonstrates frontend engineering, not just a PDF resume.",
    would_change: "Would add E2E tests with Playwright.",
    tags:         ["Next.js", "TypeScript", "Tailwind", "Cloudflare", "tsParticles"],
  },
];

// ═══════════════════════════════════════════════════════════════
// SKILLS CONSTELLATION
// x/y are SVG coordinates (0–1000 × 0–550 viewbox).
// proficiency: 1–5 (shown in tooltip on hover).
// Edges are auto-generated as a ring in data/skills.ts.
// ═══════════════════════════════════════════════════════════════

export const skills = [
  {
    constellation: "Cloud & IaC",
    color: "#00D4FF",
    nodes: [
      { label: "Azure",         x: 150, y: 150, proficiency: 5 },
      { label: "Terraform",     x: 230, y:  95, proficiency: 4 },
      { label: "Bicep",         x: 300, y: 155, proficiency: 3 },
      { label: "ARM Templates", x: 275, y: 220, proficiency: 3 },
      { label: "Azure Policy",  x: 185, y: 230, proficiency: 3 },
      { label: "Log Analytics", x: 120, y: 200, proficiency: 4 },
    ],
  },
  {
    constellation: "DevOps & CI/CD",
    color: "#7B4FFF",
    nodes: [
      { label: "GitHub Actions", x: 470, y: 110, proficiency: 4 },
      { label: "Docker",         x: 545, y:  70, proficiency: 4 },
      { label: "AKS",            x: 615, y: 120, proficiency: 3 },
      { label: "Helm",           x: 600, y: 200, proficiency: 3 },
      { label: "Checkov",        x: 510, y: 210, proficiency: 4 },
      { label: "Infracost",      x: 450, y: 190, proficiency: 4 },
    ],
  },
  {
    constellation: "Identity & Security",
    color: "#FF6B9D",
    nodes: [
      { label: "Entra ID",           x: 760, y: 130, proficiency: 5 },
      { label: "Intune",             x: 840, y:  90, proficiency: 5 },
      { label: "Conditional Access", x: 900, y: 150, proficiency: 4 },
      { label: "AAD Connect",        x: 870, y: 220, proficiency: 4 },
      { label: "SCIM",               x: 790, y: 240, proficiency: 3 },
      { label: "Sophos Central",     x: 730, y: 200, proficiency: 4 },
    ],
  },
  {
    constellation: "Networking",
    color: "#FFB347",
    nodes: [
      { label: "pfSense",      x: 155, y: 390, proficiency: 4 },
      { label: "DrayTek",      x: 235, y: 350, proficiency: 5 },
      { label: "Cisco Meraki", x: 310, y: 400, proficiency: 4 },
      { label: "UniFi",        x: 290, y: 470, proficiency: 4 },
      { label: "S2S VPN",      x: 200, y: 480, proficiency: 4 },
      { label: "VLANs",        x: 130, y: 450, proficiency: 5 },
    ],
  },
  {
    constellation: "Virtualisation & EUC",
    color: "#00FF88",
    nodes: [
      { label: "Hyper-V",   x: 490, y: 380, proficiency: 5 },
      { label: "Proxmox",   x: 570, y: 340, proficiency: 4 },
      { label: "AVD",       x: 640, y: 400, proficiency: 4 },
      { label: "FSLogix",   x: 620, y: 470, proficiency: 4 },
      { label: "RDS",       x: 535, y: 490, proficiency: 5 },
      { label: "VHD/VHDX",  x: 460, y: 460, proficiency: 4 },
    ],
  },
  {
    constellation: "Scripting & AI",
    color: "#FF9F43",
    nodes: [
      { label: "PowerShell", x: 800, y: 380, proficiency: 5 },
      { label: "Bash",       x: 875, y: 345, proficiency: 3 },
      { label: "Python",     x: 935, y: 400, proficiency: 3 },
      { label: "LiteLLM",   x: 910, y: 470, proficiency: 4 },
      { label: "Ollama",    x: 830, y: 490, proficiency: 3 },
      { label: "CF Workers", x: 760, y: 450, proficiency: 3 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// HOMELAB (engineer persona only)
// ═══════════════════════════════════════════════════════════════

export const homelab = {
  host:       "Proxmox VE 8.x",
  vms:        8,
  cpu:        "6-core Xeon",
  ram_gb:     128,
  storage_tb: 4,
  router:     "pfSense (Netgate)",
  switch:     "TP-Link managed (802.1Q trunking)",
  purpose:    "Used to validate Terraform modules, Ansible playbooks, and container networking before Azure deployment. Runs production-equivalent workloads.",

  vlans: [
    { id: 10,  name: "Management",      color: "#00D4FF" },
    { id: 20,  name: "Servers",         color: "#7B4FFF" },
    { id: 30,  name: "Trusted",         color: "#00FF88" },
    { id: 40,  name: "IoT",             color: "#FFB347" },
    { id: 50,  name: "Guest",           color: "#FF9F43" },
    { id: 99,  name: "DMZ",             color: "#FF6B9D" },
  ],

  services: [
    { name: "LiteLLM Gateway",   desc: "Python + Docker",  status: "running" as const },
    { name: "Ollama",            desc: "Go + Docker",      status: "running" as const },
    { name: "Grafana",           desc: "Grafana OSS",      status: "running" as const },
    { name: "Prometheus",        desc: "Prometheus",       status: "running" as const },
    { name: "Cloudflare Tunnel", desc: "cloudflared",      status: "running" as const },
    { name: "CI/CD Runners",     desc: "GitHub Actions",   status: "running" as const },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PERSONA CONTENT
// Controls CTAs and tags shown in the Hero section per persona.
// ═══════════════════════════════════════════════════════════════

export const personas = {
  recruiter: {
    heroPrimary:   "View CV",
    heroSecondary: "See Projects",
    heroTag:       "Open to opportunities · Full UK work rights · Carlisle / Remote",
    storyEmphasis: ["certs", "availability", "communication"],
    show_homelab:  false,
  },
  engineer: {
    heroPrimary:   "View Projects",
    heroSecondary: "See Homelab",
    heroTag:       "AZ-900 ✓ · AZ-104 in progress · Terraform Associate next · Proxmox + AKS lab",
    storyEmphasis: ["homelab", "depth", "architecture"],
    show_homelab:  true,
  },
  architect: {
    heroPrimary:   "System Design",
    heroSecondary: "See Projects",
    heroTag:       "Azure Landing Zone · AKS · LiteLLM Gateway · Full IaC",
    storyEmphasis: ["patterns", "scalability", "governance"],
    show_homelab:  false,
  },
};

// ═══════════════════════════════════════════════════════════════
// EDUCATION
// ═══════════════════════════════════════════════════════════════

export const education = [
  { qualification: "BTEC Level 2 — Information and Creative Technology", institution: "Carlisle College", period: "2020 – 2021", note: "" },
  { qualification: "GCSE Mathematics & English", institution: "", period: "", note: "Grade 4" },
  { qualification: "Qualified Emergency First Aider", institution: "", period: "", note: "" },
];

// ═══════════════════════════════════════════════════════════════
// THEME — default on first visit
// Options: nebula | storm | blueprint | void
// ═══════════════════════════════════════════════════════════════

export const theme = {
  default: "nebula" as const,
};
