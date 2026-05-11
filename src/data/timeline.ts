export interface Achievement {
  icon: string;
  title: string;
  detail: string;
  tags: string[];
}

export interface EraPalette {
  accent: string;
  bg: string;
}

export interface Era {
  id: string;
  type: string;
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  achievements: Achievement[];
  daily: string[];
  deepened: string[];
  palette: EraPalette;
}

export const timeline: Era[] = [
  {
    id: "global4",
    type: "NOW",
    role: "Technical Operations Engineer",
    company: "Global4 Communications",
    period: "Sep 2025 – Present",
    location: "Carlisle, UK",
    summary:
      "Multi-tenant MSP delivering managed IT services to SME and mid-market UK clients. Sole technical escalation point for complex infrastructure incidents across Azure, Hyper-V, RDS/AVD, networking, and M365 across 50+ client tenants.",
    achievements: [
      {
        icon: "⚡",
        title: "Zero-Downtime AVD Migration",
        detail:
          "Executed live FSLogix VHD→VHDX migration on active AVD sessions with zero interruption. Root-caused desktop heap exhaustion on overloaded Terminal Server and resolved Entra ID/on-prem AD SID conflicts causing profile attach failures.",
        tags: ["AVD", "FSLogix", "Entra ID"],
      },
      {
        icon: "🔐",
        title: "Multi-Tenant Identity Engineering",
        detail:
          "Rebuilt AAD Connect connector space objects to restore failed user provisioning. Configured SCIM via Azure Enterprise Application including objectId→externalId attribute mapping. Managed Conditional Access, RBAC, MFA, and Intune across 50+ tenants.",
        tags: ["Entra ID", "Intune", "SCIM", "AAD Connect"],
      },
      {
        icon: "🌐",
        title: "SonicWall → DrayTek Migration",
        detail:
          "Scoped and executed SonicWall-to-DrayTek migration with active Azure S2S VPN tunnel termination. Documented IKE policy, shared keys, and NAT rules before cutover. Resolved DrayTek SSL VPN egress fault post-migration.",
        tags: ["DrayTek", "SonicWall", "Azure VPN", "S2S"],
      },
      {
        icon: "🛠",
        title: "PowerShell Automation Tooling",
        detail:
          "Built PowerShell tooling for Windows Server in-place upgrades via Azure Blob Storage SAS tokens. Deployed printers on Entra-joined AVD via Intune system-context scripts with no Active Directory dependency.",
        tags: ["PowerShell", "Azure Blob", "Intune", "Automation"],
      },
    ],
    daily: [
      "Azure",
      "Entra ID",
      "Intune",
      "Datto RMM",
      "Hyper-V",
      "AVD",
      "FSLogix",
      "DrayTek",
      "Meraki",
      "M365",
    ],
    deepened: ["Terraform", "GitHub Actions", "PowerShell", "Conditional Access"],
    palette: { accent: "#00D4FF", bg: "#010B12" },
  },
  {
    id: "carrs-group",
    type: "ENTERPRISE",
    role: "Senior IT Operations Analyst",
    company: "Carrs Group PLC",
    period: "Jul 2023 – Aug 2025",
    location: "Carlisle, UK",
    summary:
      "FTSE-listed agricultural and food group with 12+ UK sites. Owned infrastructure operations, multi-site AD DS, virtualisation, and engineering systems.",
    achievements: [
      {
        icon: "🏗",
        title: "Multi-Site AD DS Ownership",
        detail:
          "Administered multi-site Active Directory DS, GPOs, OU structure, and security group lifecycle across 12+ UK sites. Managed Hyper-V host clusters including VM provisioning, checkpoints, and DR runbooks.",
        tags: ["Active Directory", "GPO", "Hyper-V", "DR"],
      },
      {
        icon: "📋",
        title: "ITIL Change Control",
        detail:
          "Owned and delivered infrastructure upgrade and migration projects across multiple sites. Produced impact analysis, change records, and rollback plans aligned to ITIL change control methodology.",
        tags: ["ITIL", "Change Management", "Infrastructure"],
      },
      {
        icon: "🔧",
        title: "Engineering Systems Administration",
        detail:
          "Administered Autodesk Vault server and client deployments for engineering teams, including license server management and connectivity troubleshooting across all UK sites.",
        tags: ["Autodesk Vault", "Windows Server", "Licensing"],
      },
      {
        icon: "📚",
        title: "Operational Documentation",
        detail:
          "Authored and maintained operational documentation — runbooks, asset registers, change logs — adopted by other project engineers as the internal source of truth.",
        tags: ["Documentation", "Runbooks", "Knowledge Management"],
      },
    ],
    daily: [
      "Active Directory",
      "Hyper-V",
      "M365",
      "Windows Server",
      "Group Policy",
    ],
    deepened: ["ITIL", "Autodesk Vault", "DR Planning", "Change Control"],
    palette: { accent: "#7B4FFF", bg: "#08040F" },
  },
  {
    id: "mitie",
    type: "SUPPORT",
    role: "Help Desk Analyst",
    company: "Mitie",
    period: "Mar 2022 – Jul 2023",
    location: "Carlisle, UK",
    summary:
      "Frontline IT and operational support within a major UK facilities management contract.",
    achievements: [
      {
        icon: "📞",
        title: "SLA-Driven Incident Management",
        detail:
          "Triaged and escalated incidents across IT and estates systems within SLA. Coordinated with engineers and external contractors to drive issues to resolution.",
        tags: ["ITSM", "Incident Management", "SLA"],
      },
      {
        icon: "📣",
        title: "Major Incident Communications",
        detail:
          "Owned major incident communications — kept stakeholders informed under pressure and maintained accurate ticket trails for post-incident review.",
        tags: ["Major Incident", "Stakeholder Comms", "ITSM"],
      },
    ],
    daily: ["Windows", "M365", "ITSM", "Incident Management"],
    deepened: ["ITIL Foundation", "Escalation Management"],
    palette: { accent: "#FFB347", bg: "#100A02" },
  },
  {
    id: "nhs-contract",
    type: "FOUNDATION",
    role: "Windows 10 Deployment Engineer (Contract)",
    company: "STK — NHS Programme",
    period: "Jun 2021 – Dec 2021",
    location: "Carlisle, UK",
    summary:
      "Fixed-deadline mass deployment of Windows 10 across NHS endpoint estate.",
    achievements: [
      {
        icon: "🚀",
        title: "2,000+ Endpoint Deployment",
        detail:
          "Deployed Windows 10 across 2,000+ NHS endpoint devices using SCCM/Software Centre and GPO with a 99%+ success rate, on a fixed government deadline.",
        tags: ["SCCM", "Windows 10", "GPO", "NHS"],
      },
      {
        icon: "🔄",
        title: "Post-Migration Support",
        detail:
          "Delivered post-migration support and coordinated hardware replacements with NHS procurement to ensure full operational readiness.",
        tags: ["SCCM", "Endpoint Management", "Hardware"],
      },
    ],
    daily: ["SCCM", "Windows 10", "GPO"],
    deepened: ["Mass Deployment", "NHS Systems", "Endpoint Management"],
    palette: { accent: "#00FF88", bg: "#021008" },
  },
];
