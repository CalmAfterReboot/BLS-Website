# BLS Architecture Decisions — Engineer Brain Dump
# I will fill in the WHY column. Claude Code reads this in Phase 1.
# Format: Decision | What I chose | What I rejected | My reasoning
#
# NOTE FROM CLAUDE CODE:
# This repo (bls-siteV2) contains only the portfolio website (Next.js).
# The infrastructure repos (azure-landing-zone, aks-platform, etc.) are
# external. Evidence fields can only be confirmed once those repos are
# readable. All rows marked [CANNOT CONFIRM FROM THIS REPO] until then.
# Tools listed were inferred from src/data/skills.ts and src/data/projects-fallback.ts.

NETWORKING
- VNet topology        | Hub-spoke              | Flat VNet / Virtual WAN     | [FILL IN]
- NSG placement        | Per subnet             | Per NIC                     | [FILL IN]
- Terraform iteration  | for_each               | count                        | [FILL IN]
- DNS                  | Private DNS zones      | Custom DNS server            | [FILL IN]

KUBERNETES
- CNI plugin           | Azure CNI              | Kubenet                      | [FILL IN]
- Package management   | Helm                  | Raw manifests / Kustomize    | [FILL IN]
  # Helm confirmed as skill: src/data/skills.ts line 47
- GitOps tool          | ArgoCD                | Flux                         | [FILL IN]
- Image tagging        | Git commit SHA         | :latest / semver             | [FILL IN]
- Identity             | Managed identity       | Service principal            | [FILL IN]

CI/CD
- IaC tool             | Terraform              | Bicep / ARM / Pulumi         | [FILL IN]
  # Terraform confirmed as skill: src/data/skills.ts line 25
  # Bicep and ARM also confirmed as skills: src/data/skills.ts lines 26-27
  # Reason Terraform chosen over Bicep/ARM: [FILL IN]
- Pipeline platform    | GitHub Actions         | Azure DevOps / Jenkins       | [FILL IN]
  # GitHub Actions confirmed as skill: src/data/skills.ts line 44
- Secret management    | GitHub OIDC + KV refs  | Hardcoded / env vars         | [FILL IN]
- IaC security scan    | Checkov                | tfsec / Terrascan            | [FILL IN]
  # Checkov confirmed as skill: src/data/skills.ts line 48
  # Checkov also referenced in projects-fallback.ts line 23 (azure-landing-zone topics)
- Cost visibility      | Infracost              | Manual estimates             | [FILL IN]
  # Infracost confirmed as skill: src/data/skills.ts line 49
  # Infracost also referenced in projects-fallback.ts line 18 (azure-landing-zone description)
- Container scan       | Trivy                  | Snyk / Clair                 | [FILL IN]
  # Trivy NOT confirmed in this repo — no skills.ts entry, no pipeline files

OBSERVABILITY
- Metrics model        | Prometheus pull        | Push / CloudWatch            | [FILL IN]
- Log shipping         | Fluent Bit DaemonSet   | App-level / Logstash         | [FILL IN]
- Instrumentation      | OpenTelemetry          | Vendor SDK (Datadog etc)     | [FILL IN]
- Unified UI           | Grafana                | Native Azure Monitor only    | [FILL IN]
- Alert routing        | Alertmanager           | Grafana alerts only          | [FILL IN]
  # None of these confirmed in this repo — bls-observability-stack is PLANNED per README.md line 244

PLATFORM
- State backend        | Azure Blob + lock      | Local state / Terraform Cloud| [FILL IN]
- Module structure     | Reusable modules       | Monolithic root config       | [FILL IN]
- Tagging strategy     | Mandatory via Policy   | Convention / honour system   | [FILL IN]
  # Azure Policy confirmed as skill: src/data/skills.ts line 28
  # Whether it enforces tagging: [CANNOT CONFIRM FROM THIS REPO]
