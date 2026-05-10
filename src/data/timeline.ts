export interface TimelineEntry {
  id: string;
  era: string;
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  tech: string[];
  accent: string;
}

export const timeline: TimelineEntry[] = [
  {
    id: "global4",
    era: "NOW",
    role: "Technical Operations Engineer",
    company: "Global4 Communications",
    period: "Sep 2025 – Present",
    location: "Carlisle, UK",
    summary:
      "Multi-tenant MSP delivering managed IT services to SME and mid-market UK clients. Sole technical escalation point for complex infrastructure incidents across Azure, Hyper-V, RDS/AVD, networking, and M365 across 50+ client tenants.",
    highlights: [
      "Second-to-third line escalation across 50+ tenants: change control (CR authorship, impact analysis, rollback planning), patch management across 500+ endpoints via Datto RMM, and post-sales technical scoping for AVD, Azure, and network proposals",
      "Root-caused desktop heap exhaustion on overloaded Terminal Server; executed live FSLogix VHD→VHDX migration on active AVD with zero session interruption; resolved Entra ID/on-prem AD SID conflicts causing profile attach failures",
      "Scoped SonicWall-to-DrayTek migration with active Azure S2S VPN tunnel termination — documented IKE policy, shared keys, and NAT rules before cutover; resolved DrayTek SSL VPN egress fault",
      "Rebuilt AAD Connect connector space objects to restore failed user provisioning; configured SCIM via Azure Enterprise Application including objectId→externalId attribute mapping; managed Conditional Access, RBAC, MFA, and Intune across tenants",
      "Built PowerShell tooling for Windows Server in-place upgrades via Azure Blob Storage SAS tokens; deployed printers on Entra-joined AVD via Intune system-context scripts (no AD dependency)",
    ],
    tech: ["Azure", "Hyper-V", "AVD", "FSLogix", "Entra ID", "Intune", "Datto RMM", "DrayTek", "Meraki", "Terraform", "GitHub Actions"],
    accent: "#00D4FF",
  },
  {
    id: "carrs-group",
    era: "ENTERPRISE",
    role: "Senior IT Operations Analyst",
    company: "Carrs Group PLC",
    period: "Jul 2023 – Aug 2025",
    location: "Carlisle, UK",
    summary:
      "FTSE-listed agricultural and food group with 12+ UK sites. Owned infrastructure operations, multi-site AD DS, virtualisation, and engineering systems.",
    highlights: [
      "Administered multi-site Active Directory DS, GPOs, OU structure, and security group lifecycle; managed Hyper-V host clusters including VM provisioning, checkpoints, and DR runbooks",
      "Owned and delivered infrastructure upgrade and migration projects across multiple sites — produced impact analysis, change records, and rollback plans aligned to ITIL change control",
      "Administered Autodesk Vault server and client deployments for engineering teams, including license server management and connectivity troubleshooting",
      "Authored and maintained operational documentation (runbooks, asset registers, change logs) adopted by other project engineers as the internal source of truth",
    ],
    tech: ["Active Directory", "Hyper-V", "M365", "Windows Server", "ITIL", "Group Policy", "Autodesk Vault"],
    accent: "#7B4FFF",
  },
  {
    id: "mitie",
    era: "SUPPORT",
    role: "Help Desk Analyst",
    company: "Mitie",
    period: "Mar 2022 – Jul 2023",
    location: "Carlisle, UK",
    summary:
      "Frontline IT and operational support within a major UK facilities management contract.",
    highlights: [
      "Triaged and escalated incidents across IT and estates systems within SLA; coordinated with engineers and external contractors to drive issues to resolution",
      "Owned major incident communications — kept stakeholders informed under pressure and maintained accurate ticket trails for post-incident review",
    ],
    tech: ["Windows", "M365", "ITSM", "Incident Management"],
    accent: "#FFB347",
  },
  {
    id: "nhs-contract",
    era: "FOUNDATION",
    role: "Windows 10 Deployment Engineer (Contract)",
    company: "Solution Through Knowledge — NHS Programme",
    period: "Jun 2021 – Dec 2021",
    location: "Carlisle, UK",
    summary:
      "Fixed-deadline mass deployment of Windows 10 across NHS endpoint estate.",
    highlights: [
      "Deployed Windows 10 across 2,000+ NHS endpoint devices using SCCM/Software Centre and GPO with a 99%+ success rate",
      "Delivered post-migration support and coordinated hardware replacements with NHS procurement",
    ],
    tech: ["SCCM", "Windows 10", "GPO", "NHS", "Endpoint Management"],
    accent: "#00FF88",
  },
];
