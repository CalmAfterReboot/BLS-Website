# BLS Concept Analogies — Engineer Voice
# I fill these from my own MSP experience before Phase 4.
# These must sound like me, not a textbook.
#
# NOTE FROM CLAUDE CODE:
# Your timeline (src/data/timeline.ts) confirms MSP/enterprise IT background:
# - Global4 Communications: multi-tenant MSP, Datto RMM, change control, FSLogix, AVD
# - Carrs Group PLC: Hyper-V clusters, AD DS, multi-site infrastructure, ITIL change control
# - NHS deployment: SCCM, GPO, 2000+ endpoints
# Use those specific experiences as the source for your analogies.
# The prompts below are to jog your memory — replace [FILL] with your actual phrasing.

Git:          [FILL — think: how do you track config changes in MSP work?
               Hint: change records / CR logs / Datto RMM activity logs?]

Branching:    [FILL — think: change freeze / maintenance windows
               Hint: Global4 change control — CR authorship, rollback planning?]

CI:           [FILL — think: pre-flight checks before pushing a config
               Hint: impact analysis before a change? Testing on lab tenant first?]

IaC:          [FILL — think: Group Policy / DSC / build runbook
               Hint: Carrs Group GPO management, or the Windows Server upgrade
               PowerShell tooling you built at Global4?]

CD:           [FILL — think: automated Datto RMM job vs manual RDP
               Hint: patch management across 500+ endpoints via Datto RMM?]

Containers:   [FILL — think: VM template vs full VM vs bare metal
               Hint: Hyper-V checkpoints / VHDX at Carrs, or Proxmox on homelab?]

Kubernetes:   [FILL — think: what does Hyper-V failover clustering do?
               Hint: Carrs Group Hyper-V host clusters — VM provisioning, DR runbooks]

GitOps:       [FILL — think: desired state configuration at cluster level
               Hint: SCCM desired state at NHS? GPO enforcement at Carrs?]

Observability:[FILL — think: Datto RMM alerts vs flying blind
               Hint: Global4 — patch management across 500+ endpoints,
               or the difference between a monitored vs unmonitored tenant?]

SLO:          [FILL — think: SLA in an MSP contract
               Hint: Global4 incident SLAs, response/resolution targets?]
