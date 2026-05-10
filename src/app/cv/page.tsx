import type { Metadata } from "next";
import { PrintButton } from "@/components/ui/PrintButton";

export const metadata: Metadata = {
  title: "CV — Mihai Gabriel Ferencz",
  robots: { index: false, follow: false },
};

export default function CVPage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .cv-shell { box-shadow: none !important; max-width: 100% !important; padding: 0 !important; }
        }
        @page { margin: 18mm 14mm; }
        body { font-family: 'Segoe UI', Arial, sans-serif; }
      `}</style>

      <PrintButton />

      {/* CV shell — white, A4-ish */}
      <div
        className="cv-shell mx-auto my-8 bg-white text-gray-900"
        style={{ maxWidth: 860, padding: "40px 48px", boxShadow: "0 4px 40px rgba(0,0,0,0.15)" }}
      >
        {/* Header */}
        <header style={{ borderBottom: "2px solid #00D4FF", paddingBottom: 14, marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.08em", margin: 0, color: "#02040A" }}>
            MIHAI GABRIEL FERENCZ
          </h1>
          <p style={{ fontSize: 13, color: "#444", marginTop: 4, marginBottom: 8, fontWeight: 500 }}>
            Cloud &amp; DevOps Engineer&nbsp;&nbsp;|&nbsp;&nbsp;Infrastructure &amp; Platform Engineering
          </p>
          <p style={{ fontSize: 11.5, color: "#555", margin: 0, lineHeight: 1.7 }}>
            Carlisle, UK&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="mailto:mihai.ferencz@hotmail.com" style={{ color: "#0070cc" }}>mihai.ferencz@hotmail.com</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;07436 784212
            <br />
            <a href="https://github.com/CalmAfterReboot" style={{ color: "#0070cc" }}>github.com/CalmAfterReboot</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="https://bluelayersystems.com" style={{ color: "#0070cc" }}>bluelayersystems.com</a>
          </p>
        </header>

        {/* Profile */}
        <Section title="PROFESSIONAL PROFILE">
          <p style={bodyText}>
            Infrastructure engineer with 5+ years in IT, including 3+ years at second-to-third line MSP level
            delivering managed services across 50+ client tenants. Deep hands-on experience across Azure, Entra ID,
            Intune, Hyper-V, Azure Virtual Desktop (AVD), FSLogix, RDS, Windows Server, Exchange Online, Datto RMM,
            IT Glue, Autotask PSA, DrayTek, Cisco Meraki, Sophos, and UniFi. Strong in change control, post-sales
            technical scoping, hybrid connectivity (S2S VPN, NSGs, Azure networking), enterprise patch management,
            and incident root-cause analysis. Currently building a public Platform Engineering portfolio (Blue Layer
            Systems) using Terraform, GitHub Actions, AKS, Docker, and LiteLLM. Applies prompt engineering and AI
            tooling operationally to accelerate diagnostics, documentation, and automation. Pursuing AZ-104 to
            formalise existing production Azure depth.
          </p>
        </Section>

        {/* Skills */}
        <Section title="TECHNICAL SKILLS">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <tbody>
              {[
                ["Cloud & IaC", "Microsoft Azure, Terraform, Bicep, ARM Templates, Azure Policy, Log Analytics, Azure Monitor, NSGs, VNet design, Storage, Key Vault"],
                ["Containers & CI/CD", "AKS (Azure Kubernetes Service), Docker, GitHub Actions, Checkov, Infracost, YAML pipelines"],
                ["Identity & Security", "Entra ID, Intune (MDM/MAM), Conditional Access, MFA, RBAC, Azure AD Connect, SCIM provisioning, Sophos Central, Cyber Essentials"],
                ["Virtualisation & EUC", "Hyper-V, Proxmox, Azure Virtual Desktop (AVD), FSLogix Profile Containers, RDS/RemoteApp, VHD/VHDX management"],
                ["Networking", "DrayTek, Cisco Meraki (MX/MS/MR), UniFi, pfSense, VLAN segmentation, S2S & SSL VPN, IPSec/IKE, DNS, DHCP, routing"],
                ["Scripting & Automation", "PowerShell (advanced), Bash, Python, Git, Intune system-context scripts, idempotent automation"],
                ["M365 & Collaboration", "Exchange Online (DKIM/DMARC/SPF, hybrid mail flow, journaling), SharePoint Online (PnP PowerShell), Teams, AAD Connect/DirSync"],
                ["MSP Tooling", "Datto RMM, IT Glue, Autotask PSA, Sophos Central, FreshService, Veeam"],
                ["ITSM & Process", "ITIL v3, change control (CR authorship, impact analysis, rollback planning), patch management, multi-tenant SLA ownership, post-sales scoping"],
                ["AI & Automation", "Prompt engineering, LiteLLM, OpenRouter, DeepSeek, Azure OpenAI, Ollama, Cloudflare Workers"],
                ["Certifications", "Microsoft Certified: Azure Fundamentals (AZ-900). In progress: AZ-104 Azure Administrator"],
              ].map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "5px 10px 5px 0", fontWeight: 600, whiteSpace: "nowrap", verticalAlign: "top", color: "#111", width: 180 }}>{k}</td>
                  <td style={{ padding: "5px 0", color: "#333", lineHeight: 1.5 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* Experience */}
        <Section title="PROFESSIONAL EXPERIENCE">
          <Job
            title="Technical Operations Engineer"
            company="Global4 Communications — Carlisle, UK"
            period="Sep 2025 – Present"
            bullets={[
              "Multi-tenant MSP delivering managed IT services to SME and mid-market UK clients. Sole technical escalation point for complex infrastructure incidents across Azure, Hyper-V, RDS/AVD, networking, and M365.",
              "Operating across 50+ client tenants at second-to-third line: owning change control (CR authorship, impact analysis, rollback planning), patch management cycles across 500+ endpoints via Datto RMM, vendor and licence management, and post-sales technical scoping.",
              "Resolved advanced RDS/AVD incidents: root-caused desktop heap exhaustion; executed live FSLogix VHD to VHDX migration on an active AVD environment with zero session interruption; audited mixed Entra ID and on-premises AD SID conflicts causing profile attach failures.",
              "Hybrid connectivity and S2S scoping: assessed SonicWall-to-DrayTek firewall migration with active Azure S2S VPN tunnel termination; resolved DrayTek SSL VPN egress fault by enforcing correct interface binding.",
              "Entra ID and identity engineering: rebuilt AAD Connect connector space objects and forced delta sync to restore failed user provisioning; configured SCIM provisioning for a third-party platform via Azure Enterprise Application.",
              "Automation and IaC: built PowerShell tooling for Windows Server in-place upgrades delivered via Azure Blob Storage SAS tokens; deployed printers across Entra-joined AVD session hosts via Intune system-context scripts; applying Terraform, GitHub Actions CI/CD, Checkov, and Infracost in the BLS portfolio.",
            ]}
          />
          <Job
            title="Senior IT Operations Analyst"
            company="Carrs Group PLC — Carlisle, UK"
            period="Jul 2023 – Aug 2025"
            bullets={[
              "FTSE-listed agricultural and food group with 12+ UK sites. Owned infrastructure operations, multi-site AD DS, virtualisation, and engineering systems.",
              "Administered multi-site Active Directory DS, GPOs, OU structure, and security group lifecycle; managed Hyper-V host clusters including VM provisioning, checkpoints, and DR runbooks.",
              "Owned and delivered infrastructure upgrade and migration projects across multiple sites — produced impact analysis, change records, and rollback plans aligned to ITIL change control.",
              "Administered Autodesk Vault server and client deployments for engineering teams, including license server management.",
              "Authored and maintained operational documentation (runbooks, asset registers, change logs) adopted by other project engineers as the internal source of truth.",
            ]}
          />
          <Job
            title="Help Desk Analyst"
            company="Mitie — Carlisle, UK"
            period="Mar 2022 – Jul 2023"
            bullets={[
              "Frontline IT and operational support within a major UK facilities management contract.",
              "Triaged and escalated incidents across IT and estates systems within SLA; coordinated with engineers and external contractors to drive issues to resolution.",
              "Owned major incident communications — kept stakeholders informed under pressure and maintained accurate ticket trails for post-incident review.",
            ]}
          />
          <Job
            title="Windows 10 Deployment Engineer (Contract)"
            company="Solution Through Knowledge — NHS Programme, Carlisle"
            period="Jun 2021 – Dec 2021"
            bullets={[
              "Deployed Windows 10 across 2,000+ NHS endpoint devices on a fixed deadline using SCCM/Software Centre and GPO with a 99%+ success rate; delivered post-migration support and coordinated hardware replacements with NHS procurement.",
            ]}
          />
        </Section>

        {/* Portfolio */}
        <Section title="PORTFOLIO PROJECTS — BLUE LAYER SYSTEMS">
          <p style={{ ...bodyText, marginBottom: 6 }}>
            Public DevOps portfolio at{" "}
            <a href="https://github.com/CalmAfterReboot" style={{ color: "#0070cc" }}>github.com/CalmAfterReboot</a>{" "}
            and{" "}
            <a href="https://bluelayersystems.com" style={{ color: "#0070cc" }}>bluelayersystems.com</a>.
            All projects production-grade, security-scanned (Checkov), and cost-governed (Infracost).
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Azure Landing Zone (Terraform):</strong> hub-spoke VNet topology, NSGs, Azure Policy, Log Analytics workspace, remote state in Azure Storage, and a GitHub Actions CI/CD pipeline integrating Checkov SAST and Infracost cost governance gates.</li>
            <li style={liStyle}><strong>AKS Platform:</strong> managed Kubernetes cluster with Workload Identity, Azure Container Registry, Helm-based application deployment, and GitOps-style continuous delivery.</li>
            <li style={liStyle}><strong>AI Gateway:</strong> LiteLLM routing layer proxying Azure OpenAI, DeepSeek, Anthropic, and Ollama (Proxmox local fallback); fronted by a Cloudflare Worker; designed for multi-provider cost routing and compliance fallback.</li>
          </ul>
        </Section>

        {/* Homelab */}
        <Section title="HOME LAB INFRASTRUCTURE">
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Proxmox VE host:</strong> 128GB RAM, 6-core Xeon, 4TB storage — running production-equivalent workloads including local LLM inference (Ollama), Kubernetes test clusters, and CI/CD runners for the BLS portfolio.</li>
            <li style={liStyle}><strong>pfSense router</strong> with VLAN segmentation across six VLANs (management, servers, IoT, trusted, guest, DMZ) and a managed switch with 802.1Q trunking — used to validate Terraform modules, Ansible playbooks, and container networking before Azure deployment.</li>
          </ul>
        </Section>

        {/* Education */}
        <Section title="EDUCATION">
          <p style={bodyText}>
            <strong>BTEC Level 2 — Information and Creative Technology</strong>&nbsp;&nbsp;|&nbsp;&nbsp;Carlisle College, 2020 – 2021
            <br />
            GCSE Mathematics &amp; English (Grade 4)&nbsp;&nbsp;|&nbsp;&nbsp;Qualified Emergency First Aider
          </p>
        </Section>

        {/* Footer */}
        <p style={{ fontSize: 11, color: "#777", textAlign: "center", marginTop: 20, borderTop: "1px solid #eee", paddingTop: 14 }}>
          Available for UK remote and hybrid roles&nbsp;&nbsp;|&nbsp;&nbsp;Full right to work in the UK&nbsp;&nbsp;|&nbsp;&nbsp;References on request
        </p>
      </div>
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 20 }}>
      <h2 style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: "#0070cc",
        borderBottom: "1px solid #d0e8f8",
        paddingBottom: 4,
        marginBottom: 10,
        textTransform: "uppercase",
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Job({ title, company, period, bullets }: {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
        <strong style={{ fontSize: 12.5, color: "#111" }}>{title}</strong>
        <span style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>{period}</span>
      </div>
      <p style={{ fontSize: 11.5, color: "#444", margin: "2px 0 6px", fontStyle: "italic" }}>{company}</p>
      <ul style={ulStyle}>
        {bullets.map((b, i) => (
          <li key={i} style={liStyle}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

const bodyText: React.CSSProperties = { fontSize: 11.5, color: "#333", lineHeight: 1.6, margin: 0 };
const ulStyle: React.CSSProperties = { margin: "0 0 0 16px", padding: 0 };
const liStyle: React.CSSProperties = { fontSize: 11.5, color: "#333", lineHeight: 1.55, marginBottom: 4 };
