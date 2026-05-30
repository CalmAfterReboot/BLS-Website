# School Onboarding Runbook

**Context:** Repeatable convergence pattern for onboarding a new school into a Multi-Academy Trust — turning each inherited estate into one secure, cloud-authoritative end state.
**Pattern:** Multi-Academy Trust — Estate Convergence (Entra-authoritative, Intune-managed, cloud-native end state)
**Owner:** TechOps / Platform Engineering
**Status:** Living document — v2.0, updated after every onboarding (lessons learned feed back in)
**Facts verified:** May 2026 (time-sensitive vendor timelines and statutory guidance versions are dated inline — re-verify against the sources in the References section before relying on them)

---

## Purpose

This runbook exists so that onboarding a new school is **repeatable, not bespoke**. Every school arrives with its own Active Directory, its own mailbox estate, its own network, and its own way of doing things. The goal is to converge each one onto a single secure, observable, segmented, recoverable, cloud-authoritative pattern — so the *next* school onboards faster and cheaper than the last.

The end state is **Entra-authoritative, Intune-managed, cloud-native**. On-premises AD and Exchange are migrated *away from*, not consolidated into. Hybrid identity and forest trusts are transitional scaffolding with a scheduled retirement date, never a destination.

**Two non-negotiables override every technical decision in this document:**

1. **Safeguarding first.** This is a school. Child welfare outranks every service-level concern. IT is a safeguarding actor — see Appendix A.
2. **Never break term time.** Major cutovers land in holiday windows. No service-affecting change at 08:40 on a school day.

---

## Guiding Principles

- **Discover before you touch.** You are inheriting someone else's environment, including their compromise. Assume nothing is documented and nothing is clean until proven.
- **Harden the destination before you migrate into it.** Identity controls go live *before* data lands, never after.
- **Migrate through hybrid, don't live in it.** Name the anchor that pins you to on-premises, or kill the hybrid.
- **Least privilege, just-in-time.** No standing Domain Admin. No God-mode migration accounts left alive.
- **Decommissioning is a deliverable, not cleanup.** A half-retired trust, a lingering migration account, or an unpatched legacy Exchange box is the residual risk that compounds across onboardings.
- **Repeatable beats heroic.** Any manual step done twice is a candidate for automation — idempotent, risks stated, no destructive operations without confirmation.

---

## Phase Overview & Gates

Each phase ends in a **gate** — a go/no-go checkpoint. You do not proceed until the gate is signed off. Gates are what stop a rushed onboarding breaking a school.

| Phase | Name | Outcome | Gate sign-off |
|---|---|---|---|
| 0 | Engagement & Governance | Scope, ownership, data agreements in place | Trust IT lead + School Head |
| 1 | Discovery | Full inventory of identity, mail, network, data, dependencies | Trust IT lead |
| 2 | Design & Decision | Target-state design; migration models chosen; anchors named | Trust IT lead |
| 3 | Destination Hardening | Cloud tenant secured *before* any data moves | Security owner |
| 4 | Pilot | Model proven on a low-risk cohort | Trust IT lead + pilot users |
| 5 | Migration (Waves) | Identity, mail, files, devices migrated in holiday windows | Per-wave validation |
| 6 | Decommission | Legacy attack surface retired and audited | Security owner |
| 7 | Handover & BAU | School running on the standard pattern, documented, monitored | Trust IT lead + School + Service Desk |

---

## Phase 0 — Engagement & Governance

Before any technical work. This phase prevents the two failure modes that have nothing to do with technology: unclear ownership, and data-handling breaches.

- Confirm onboarding scope, timeline, and target term/holiday windows for cutovers.
- Identify and record key contacts: School Head, on-site IT/champion, **Designated Safeguarding Lead (DSL) and deputy**, MIS administrator.
- Data protection: data processing/sharing agreement reviewed; data residency confirmed. You are moving **children's personal data and safeguarding records** — handle under UK GDPR and the DfE's data protection guidance for schools.
- Confirm licensing position (e.g. Microsoft 365 Education A3/A5) and reconcile licence-to-user count. Note the tier distinction recorded in Phase 3 — it changes which security controls are available.
- Establish change control: who approves cutovers, and the comms plan to staff and parents.
- Agree rollback authority and success criteria with the Head in writing.

**Gate 0:** Scope, contacts (incl. DSL), data agreement, licensing, and rollback authority all confirmed.

---

## Phase 1 — Discovery

> You cannot cut what you have not mapped. The undocumented dependency is what breaks the cutover. Budget more time here than feels necessary.

### 1.1 Identity (Active Directory / Entra ID)

- Forest/domain functional levels (a school on Server 2008 R2 changes your options).
- Domain Admins and privileged accounts — who, why, last used.
- Service accounts — password age, what depends on them, Kerberos delegation configuration.
- UPN suffixes, namespace, and SID/RID collision risk against the Trust tenant.
- GPO inventory — what each policy *actually does* (printers, drive mappings, lockdown, kiosk), mapped to intent, not just by name.
- Existing Entra/Microsoft 365 presence (none / separate tenant / partial).
- Certificate authorities and what relies on them.

### 1.2 Mail (Exchange)

- What "legacy" means here: on-premises Exchange (which version?), a separate Microsoft 365 tenant, or IMAP/hosted. **This forks the whole migration model.**
- Mailbox inventory: user / shared / resource / room counts and sizes.
- Legacy and basic-authentication usage — what is still authenticating via basic auth. **Note (verified May 2026):** Microsoft disabled basic authentication for most Exchange Online protocols by the end of 2022. The remaining exception is **SMTP AUTH client submission**, whose retirement timeline has been repeatedly extended; as of the latest Microsoft guidance it is scheduled to be **disabled by default for existing tenants at the end of December 2026**, with new tenants defaulting off thereafter. This is exactly the dependency that breaks MFD scan-to-email and line-of-business mail relays — find it now. (See References.)
- Shared mailbox access model (passworded, sign-in-enabled accounts are rot to fix).
- Mail flow dependencies: multifunction devices (scan-to-email), line-of-business apps relaying mail.
- Retention / litigation hold / FOI / safeguarding-record obligations on mailboxes.
- Current DNS state: SPF, DKIM, DMARC.

### 1.3 Network

- WAN topology and circuits — and resilience (is the school on a single FTTC line?).
- Existing VLAN/segmentation, or the lack of it (a flat network is a finding).
- Wi-Fi authentication: RADIUS/NPS, certificate-based device auth tied to AD.
- Firewall, edge, and current site-to-site VPN arrangements.
- Print infrastructure (on-premises print servers).
- **Safeguarding filtering and monitoring** in place (e.g. Smoothwall / Senso / Securly class of product) — what it is, and whether it reports centrally.

### 1.4 Servers, Files & Data

- Server inventory, OS versions, patch state, end-of-life boxes.
- File share structure and **permissions** (expect flat "Domain Users → Modify on everything" rot).
- Data volumes for migration sizing.
- **MIS (SIMS / Arbor / Bromcom)** — hosting, identity integration, dependencies. *This usually dictates the timeline; scope it first, not last.*
- Other line-of-business apps and how they authenticate.

### 1.5 Backups

- Current backup solution, scope, and **last successful tested restore** (an untested backup is hope, not a backup).
- Whether anyone wrongly assumes Microsoft 365 is backed up by Microsoft (it is not — retention is not backup).

**Gate 1:** Complete inventory across all five domains. Every authentication dependency, data store, and legal-hold obligation identified. MIS dependency understood.

---

## Phase 2 — Design & Decision

Translate discovery into a target-state design and explicit migration-model choices. **Record the trade-offs and the named anchors** — this is the document that proves you designed rather than defaulted.

### 2.1 Identity decision

- **Default target:** cloud-only (Entra-native), Intune-managed.
- **If an on-premises anchor exists:** hybrid via Microsoft Entra Connect, using **Password Hash Sync** (most resilient — authentication survives if on-premises dies). Avoid AD FS / federation: fragile, high blast radius, and rarely justified for a school.
- **If consolidating an existing AD:** prefer **migrate-and-decommission** (ADMT or a commercial tool, with SID History as a transitional aid that is then stripped) over a long-lived forest trust. If a trust is unavoidable as a bridge, use **selective authentication** (never forest-wide) plus **SID filtering**, with a scheduled retirement date.

> **Layer discipline — do not conflate these three things:**
> - **Site-to-site VPN = network transport.** It provides IP reachability between sites. It is not an identity mechanism.
> - **Forest trust = cross-domain authentication** riding over that transport.
> - **SID History = a migration mechanism** so migrated users retain access to not-yet-repermissioned resources.
>
> SID History is **actively stripped post-migration** — it is a known privilege-escalation vector and does not "resolve itself." During the overlap window, Kerberos, SPN registration, and SID filtering must be configured correctly, or authentication silently half-works.

### 2.2 Mail decision

- **Cutover** — small estate (realistically under ~50 mailboxes), weekend, big-bang. Fine for a small primary.
- **Staged** — batches with a coexistence period (this period is the security-exposure window).
- **Full Exchange Hybrid** — large estate or long migration only. The hybrid server is itself attack surface to retire afterward; do not stand it up for 40 mailboxes.
- **Cross-tenant** — if the source is already Microsoft 365 in another tenant (different tooling; identity is the hard part).

### 2.3 Network decision

- **Multi-site Trust → SD-WAN** as the WAN fabric, in preference to a mesh of hand-built site-to-site tunnels: centralised orchestration, application-aware routing, per-site failover, and zero-trust segmentation. Trade-off: orchestrator compromise is a systemic blast radius, and you accept vendor lock-in.
- **Segmentation as a safeguarding and ransomware control:** separate VLANs for staff / pupil / IoT-and-smartboards / management / guest / CCTV-and-door-access. Inter-VLAN routing is firewall-controlled, not open. The pupil VLAN never reaches the management VLAN.

### 2.4 Data, permissions, and backup decision

- Files → SharePoint/OneDrive; permissions **rebuilt** around an access model (RBAC, least privilege), not lifted-and-shifted with their existing rot.
- Admin accounts separated from daily-driver accounts; **PIM / just-in-time elevation** in preference to standing privilege.
- Backup target: **3-2-1, immutable, and tested**, explicitly **including third-party Microsoft 365 backup**. Note the sector context: the public-sector ransomware-payment ban means recovery, not payment, is the only option — making tested immutable backups a hard requirement, not a nicety. (See References.)

**Gate 2:** Target-state design signed off. Every migration model chosen with rationale. Every on-premises anchor named with a retirement plan. Rollback defined per workload.

---

## Phase 3 — Destination Hardening

> The single most-skipped phase, and the one that gets schools breached. Identity controls go live **before** a single user or mailbox lands in the cloud. The window where cloud objects exist without Conditional Access is the window you get breached.

- **Conditional Access baseline:** block legacy authentication, require MFA, and block or flag risky and impossible-travel sign-ins.
  - **Licensing note (verified May 2026):** baseline Conditional Access and MFA are available on Microsoft 365 Education **A3**. The **risk-based / identity-protection** tier (sign-in and user risk policies) is part of **Microsoft Entra ID Plan 2**, which is bundled with **A5** or can be added to A3 as a paid add-on. The advanced Microsoft Defender stack (Defender for Identity, Defender for Endpoint Plan 2, Defender for Office 365 Plan 2) is an A5 feature. Confirm the school's tier before promising risk-based controls. (See References.)
- Enforce MFA on all identities (break-glass accounts excluded and documented).
- Create, secure, and monitor break-glass / emergency-access accounts.
- Configure **DKIM and DMARC** for the destination domain; ensure SPF is correct. Move DMARC toward enforcement (`p=quarantine` then `p=reject`) before the MX cutover — domain spoofing of school staff to parents (e.g. fake payment requests) is a live attack.
- Configure **PIM** for privileged roles (just-in-time elevation).
- Enable the tenant security baseline / Defender stack appropriate to the licence tier.
- Wire logging and monitoring to a place you actually look (sign-in logs, audit, endpoint, network telemetry).
- Provision and verify the backup solution against the destination *before* data lands.

**Gate 3 (Security owner sign-off):** Destination tenant hardened. Conditional Access and MFA live. DMARC ready. Monitoring on. Backup verified. No data has moved yet.

---

## Phase 4 — Pilot

Prove the model on a low-risk cohort before touching the school at scale.

- Pilot cohort: IT plus willing staff volunteers.
- Validate: identity sign-in and MFA; mail/calendar/delegation; mobile re-authentication; file access; device enrolment (Entra join + Autopilot); printing; Wi-Fi.
- Validate that Intune delivers the GPO equivalents: printers, drive mappings, lockdown, apps, and kiosk/shared-device mode where needed.
- Confirm rollback works for each workload.
- Capture issues and feed them into the wave plan.

**Gate 4:** Pilot validated end-to-end. Rollback proven. Issues resolved or accepted with mitigation.

---

## Phase 5 — Migration (Waves)

> Waves by department, year group, or building. **Service-affecting cutovers land in holiday windows.** Keep rollback viable until each wave is proven. Validate every wave before starting the next.

### 5.1 Identity and device waves

- Establish cloud identity non-destructively (Entra Connect + Password Hash Sync) — this adds a plane and removes nothing.
- Migrate users in waves; use SID History only if consolidating, scoped and time-boxed.
- Devices: Entra join + Autopilot, wave by wave. Keep on-premises join as rollback until proven.
- Re-platform Wi-Fi/RADIUS to cloud RADIUS or Intune SCEP certificates **before** the device wave, or Wi-Fi drops on cutover.

### 5.2 Mail waves

- Migrate mailboxes least-risk-first. **Scope, time-box, and audit the migration service account** — it typically holds FullAccess to every mailbox, making it the crown-jewel risk of the whole project.
- Validate item counts per batch — nothing orphaned, no retention or legal hold dropped.
- Convert shared and resource mailboxes to **sign-in blocked + delegation**, not passworded accounts.
- Cut MX; enforce DMARC; re-platform legacy SMTP senders (MFDs, line-of-business apps) to OAuth or scoped connectors — never leave basic auth enabled for them (and note the end-2026 default-off timeline above).
- Communicate to staff before cutover (everyone's phone re-authenticates — pre-empt the 08:40 ticket storm).

### 5.3 Files and data waves

- Migrate shares → SharePoint/OneDrive, with permissions rebuilt to the access model.
- Map and migrate print to Universal Print or a cloud print solution.
- Verify MIS integration is intact after the identity move.

**Gate 5 (per wave):** Wave validated — authentication, mail, files, devices, print, and Wi-Fi all confirmed. Rollback still available. Only then start the next wave.

---

## Phase 6 — Decommission

> Retiring the legacy attack surface is a **security deliverable**. The failure mode for a *growing* Trust is accumulating half-retired trusts, lingering SID History, and unpatched legacy boxes across a dozen onboardings until the estate is unauditable.

- **Kill the migration service account** and audit that its over-privileged access is gone.
- Strip SID History from migrated objects.
- Retire the forest trust (if one was used) and confirm removal.
- Decommission legacy Exchange / hybrid servers (an unpatched, internet-facing Exchange server is a top ransomware target).
- Decommission on-premises domain controllers once nothing depends on them; turn off Entra Connect if going cloud-native.
- Disable redundant on-premises accounts and service accounts.
- Confirm no lingering basic-auth dependency remains enabled.

**Gate 6 (Security owner sign-off):** All transitional privilege removed. Legacy infrastructure retired and confirmed offline. Attack surface reduced to the documented target state.

---

## Phase 7 — Handover & BAU

The school is now on the standard pattern. Make it operable by the service desk, not just by you.

- As-built documentation: identity model, network/VLAN map, backup configuration, monitoring, and known quirks.
- Service-desk runbook entries: common tasks, how shared/classroom logins work, escalation paths.
- **DSL and safeguarding contacts recorded** in the support knowledge base; filtering/monitoring confirmed reporting centrally.
- Backup restore-tested after migration and added to the recurring test schedule.
- Monitoring confirmed feeding the central pane across the Trust.
- **Lessons learned** captured and fed back into this runbook (the convergence flywheel — the next school is cheaper).
- Sign-off with the Head and Trust IT lead.

**Gate 7:** School running on the standard pattern — documented, monitored, backed-up-and-tested, and service-desk-supportable. Lessons fed back.

---

## Appendix A — Safeguarding Hooks (applies across all phases)

IT is a safeguarding actor. Convergence work touches children's data and the systems that protect them. Throughout:

- **Know your DSL and deputy before you need them** — recorded in Phase 0, in the knowledge base at Phase 7.
- **Report, don't investigate.** If you encounter concerning material on any device during discovery or migration: stop, do not explore further, preserve it, tell no one in the room, go to the DSL in person, and record factually afterwards. The response is identical whether the device belongs to a pupil or a staff member.
- **Filtering and monitoring is a Phase 1 finding and a Phase 7 confirmation** — it must never go dark during a network cutover.
- **Segmentation (Phase 2) is a safeguarding control**, not merely security hygiene.
- **Statutory reference:** *Keeping Children Safe in Education* (KCSIE) — statutory for schools and colleges in England, updated annually. The 2025 edition (in force from 1 September 2025) clarified staff roles and responsibilities for filtering and monitoring and added expectations around generative AI. It recommends schools self-assess using the DfE's **Plan Technology for Your School** service against the DfE filtering and monitoring standards. A draft 2026 edition is out for consultation at the time of writing. (See References.)

---

## Appendix B — Top Failure Modes (the things that actually break this)

| # | Failure mode | Phase caught in |
|---|---|---|
| 1 | Undocumented basic-auth dependency (MFD/LOB) breaks at cutover | 1, 5 |
| 2 | DMARC misconfigured — legitimate mail bounces, or the domain stays spoofable | 2, 3, 5 |
| 3 | Migration service account left alive and over-privileged | 5, 6 |
| 4 | MIS dependency discovered late, blowing the timeline | 1 |
| 5 | Wi-Fi/RADIUS not re-platformed before the device wave — Wi-Fi drops | 2, 5 |
| 6 | Kerberos / SID History half-working in the overlap window | 2, 5 |
| 7 | Stale hybrid/legacy Exchange left running — a ransomware target | 6 |
| 8 | "We'll finish hybrid later" — two identity planes forever | 6 |
| 9 | Microsoft 365 assumed backed-up; data lost past the retention window | 1, 2 |
| 10 | Untested backup — restore fails when it matters | 1, 7 |
| 11 | Cutover lands in term time, breaking a school morning | 0, 5 |
| 12 | Flat permissions lifted-and-shifted with their rot intact | 2, 5 |

---

## Appendix C — RACI (summary)

| Activity | TechOps / Platform | Trust IT Lead | Security Owner | School / DSL | Service Desk |
|---|---|---|---|---|---|
| Discovery | R | A | C | C | I |
| Design & model choice | R | A | C | I | I |
| Destination hardening | R | C | A | I | I |
| Migration waves | R | A | C | C | I |
| Decommission | R | C | A | I | I |
| Handover | R | A | I | C | A |
| Safeguarding escalation | C | I | I | A/R | I |

R = Responsible · A = Accountable · C = Consulted · I = Informed

---

## References

*All links verified live as of May 2026. Statutory guidance and vendor timelines change — re-verify the dated items before relying on them.*

**Safeguarding (statutory)**

1. Keeping Children Safe in Education 2025 — summary of changes (NSPCC Learning): https://learning.nspcc.org.uk/research-resources/schools/keeping-children-safe-in-education-caspar-briefing
2. KCSIE 2025 filtering and monitoring expectations (UK Safer Internet Centre): https://saferinternet.org.uk/blog/kcsie-2025-what-schools-and-colleges-in-england-will-need-to-do-to-meet-new-filtering-and-monitoring-expectations
3. DfE — Plan Technology for Your School / digital and technology planning (GOV.UK): https://www.gov.uk/guidance/improve-your-schools-and-trusts-digital-and-financial-planning
4. DfE — Plan Technology for Your School service overview (GOV.UK Buying for Schools blog): https://buyingforschools.blog.gov.uk/2025/07/09/plan-technology-for-your-school-free-support-for-planning-implementing-and-using-technology/

**Microsoft identity, mail, and licensing**

5. Deprecation of basic authentication in Exchange Online (Microsoft Learn): https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/deprecation-of-basic-authentication-exchange-online
6. Updated Exchange Online SMTP AUTH basic-authentication deprecation timeline — end-2026 default-off (Microsoft Tech Community): https://techcommunity.microsoft.com/blog/exchange/updated-exchange-online-smtp-auth-basic-authentication-deprecation-timeline/4489835
7. Microsoft 365 Education A5 products and features (Microsoft Learn): https://learn.microsoft.com/en-us/microsoft-365/education/guide/0-start-advanced/advanced-products-features
8. Microsoft 365 Education A3 products and features (Microsoft Learn): https://learn.microsoft.com/en-us/microsoft-365/education/guide/0-start-standard/standard-products-features
9. Risk-based Conditional Access licensing — Entra ID Plan 2 / A5 vs A3 add-on (Microsoft Learn): https://learn.microsoft.com/en-us/microsoft-365/education/golden-path/4-advanced/identity/advanced-identity-protection

**Sector context**

10. DfE Digital and Technology Standards & public-sector ransomware-payment ban (sector summary): https://ict4.co.uk/blog/meeting-DfE-standards

---

*End of runbook. This is a living document — every onboarding should leave it better than it was found.*
