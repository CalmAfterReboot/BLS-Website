export interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  pulseDelay: number;
}

export interface Constellation {
  id: string;
  name: string;
  color: string;
  nodes: SkillNode[];
  edges: [string, string][];
}

export const constellations: Constellation[] = [
  {
    id: "cloud-iac",
    name: "CLOUD & IaC",
    color: "#00D4FF",
    nodes: [
      { id: "azure",        label: "Azure",         x: 150, y: 150, pulseDelay: 0.0 },
      { id: "terraform",    label: "Terraform",     x: 230, y:  95, pulseDelay: 0.5 },
      { id: "bicep",        label: "Bicep",         x: 300, y: 155, pulseDelay: 1.0 },
      { id: "arm",          label: "ARM Templates", x: 275, y: 220, pulseDelay: 1.5 },
      { id: "azure-policy", label: "Azure Policy",  x: 185, y: 230, pulseDelay: 0.3 },
      { id: "log-analytics",label: "Log Analytics", x: 120, y: 200, pulseDelay: 0.8 },
    ],
    edges: [
      ["azure", "terraform"],
      ["terraform", "bicep"],
      ["bicep", "arm"],
      ["arm", "azure-policy"],
      ["azure-policy", "log-analytics"],
      ["log-analytics", "azure"],
    ],
  },
  {
    id: "devops-cicd",
    name: "DEVOPS & CI/CD",
    color: "#7B4FFF",
    nodes: [
      { id: "github-actions", label: "GitHub Actions", x: 470, y: 110, pulseDelay: 0.2 },
      { id: "docker",         label: "Docker",         x: 545, y:  70, pulseDelay: 0.7 },
      { id: "aks",            label: "AKS",            x: 615, y: 120, pulseDelay: 1.2 },
      { id: "helm",           label: "Helm",           x: 600, y: 200, pulseDelay: 0.4 },
      { id: "checkov",        label: "Checkov",        x: 510, y: 210, pulseDelay: 0.9 },
      { id: "infracost",      label: "Infracost",      x: 450, y: 190, pulseDelay: 1.4 },
    ],
    edges: [
      ["github-actions", "docker"],
      ["docker", "aks"],
      ["aks", "helm"],
      ["helm", "checkov"],
      ["checkov", "infracost"],
      ["infracost", "github-actions"],
    ],
  },
  {
    id: "identity-security",
    name: "IDENTITY & SECURITY",
    color: "#FF6B9D",
    nodes: [
      { id: "entra",       label: "Entra ID",          x: 760, y: 130, pulseDelay: 0.1 },
      { id: "intune",      label: "Intune",             x: 840, y:  90, pulseDelay: 0.6 },
      { id: "cond-access", label: "Conditional Access", x: 900, y: 150, pulseDelay: 1.1 },
      { id: "aad-connect", label: "AAD Connect",        x: 870, y: 220, pulseDelay: 0.35 },
      { id: "scim",        label: "SCIM",               x: 790, y: 240, pulseDelay: 0.85 },
      { id: "sophos",      label: "Sophos Central",     x: 730, y: 200, pulseDelay: 1.35 },
    ],
    edges: [
      ["entra", "intune"],
      ["intune", "cond-access"],
      ["cond-access", "aad-connect"],
      ["aad-connect", "scim"],
      ["scim", "sophos"],
      ["sophos", "entra"],
    ],
  },
  {
    id: "networking",
    name: "NETWORKING",
    color: "#FFB347",
    nodes: [
      { id: "pfsense", label: "pfSense",      x: 155, y: 390, pulseDelay: 0.25 },
      { id: "draytek", label: "DrayTek",      x: 235, y: 350, pulseDelay: 0.75 },
      { id: "meraki",  label: "Cisco Meraki", x: 310, y: 400, pulseDelay: 1.25 },
      { id: "unifi",   label: "UniFi",        x: 290, y: 470, pulseDelay: 0.45 },
      { id: "s2s-vpn", label: "S2S VPN",      x: 200, y: 480, pulseDelay: 0.95 },
      { id: "vlan",    label: "VLANs",        x: 130, y: 450, pulseDelay: 1.45 },
    ],
    edges: [
      ["pfsense", "draytek"],
      ["draytek", "meraki"],
      ["meraki", "unifi"],
      ["unifi", "s2s-vpn"],
      ["s2s-vpn", "vlan"],
      ["vlan", "pfsense"],
    ],
  },
  {
    id: "virtualisation",
    name: "VIRTUALISATION & EUC",
    color: "#00FF88",
    nodes: [
      { id: "hyper-v",  label: "Hyper-V",   x: 490, y: 380, pulseDelay: 0.15 },
      { id: "proxmox",  label: "Proxmox",   x: 570, y: 340, pulseDelay: 0.65 },
      { id: "avd",      label: "AVD",       x: 640, y: 400, pulseDelay: 1.15 },
      { id: "fslogix",  label: "FSLogix",   x: 620, y: 470, pulseDelay: 0.4  },
      { id: "rds",      label: "RDS",       x: 535, y: 490, pulseDelay: 0.9  },
      { id: "vhdx",     label: "VHD/VHDX", x: 460, y: 460, pulseDelay: 1.4  },
    ],
    edges: [
      ["hyper-v", "proxmox"],
      ["proxmox", "avd"],
      ["avd", "fslogix"],
      ["fslogix", "rds"],
      ["rds", "vhdx"],
      ["vhdx", "hyper-v"],
    ],
  },
  {
    id: "scripting-ai",
    name: "SCRIPTING & AI",
    color: "#FF9F43",
    nodes: [
      { id: "powershell", label: "PowerShell", x: 800, y: 380, pulseDelay: 0.05 },
      { id: "bash",       label: "Bash",       x: 875, y: 345, pulseDelay: 0.55 },
      { id: "python",     label: "Python",     x: 935, y: 400, pulseDelay: 1.05 },
      { id: "litellm",    label: "LiteLLM",    x: 910, y: 470, pulseDelay: 0.3  },
      { id: "ollama",     label: "Ollama",     x: 830, y: 490, pulseDelay: 0.8  },
      { id: "cf-workers", label: "CF Workers", x: 760, y: 450, pulseDelay: 1.3  },
    ],
    edges: [
      ["powershell", "bash"],
      ["bash", "python"],
      ["python", "litellm"],
      ["litellm", "ollama"],
      ["ollama", "cf-workers"],
      ["cf-workers", "powershell"],
    ],
  },
];
