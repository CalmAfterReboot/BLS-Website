# Discovery Methodology: Assessing a Small SME Estate Before Recommending Azure Migration

**Context for this document:** Most "should we move to Azure?" conversations in the SME / lower-mid-market space happen without proper discovery. The recommendation is made on vibes — usually a senior engineer reacting to a bad incident, or a sales conversation driven by Microsoft licensing pressure. This document is the framework I use to scope properly before producing a recommendation.

**Why this matters:** A migration proposal without discovery data is a vibes document. It gets shredded by anyone competent on the customer side. More importantly, it produces bad migrations — wrong sizing, missed dependencies, broken applications, over- or under-provisioned cost. Discovery is not bureaucracy. It's the difference between engineering and guessing.

**Scope of this framework:** Small-to-mid SME with on-premise estate of 3–10 servers, single-site or hub-and-spoke, considering Azure IaaS, AVD, or hybrid as alternatives to status quo. Not enterprise-scale. Not greenfield.

---

## Phase 1 — Define the question before answering it

Before pulling any data, establish:

1. **What problem is migration meant to solve?**
   - End-of-life hardware that needs replacing?
   - Recurring incidents indicating the on-prem stack is fragile?
   - Compliance or security driver (Cyber Essentials, ISO 27001, sector-specific)?
   - International user experience (latency to a UK-hosted estate)?
   - Microsoft licensing change forcing a re-evaluation (e.g. RDS CAL gaps, M365 entitlements)?
   - Customer-driven business change (acquisition, growth, hybrid working)?

2. **What does "success" look like?**
   - Quantifiable: "reduce sev-1 incidents by 50%" or "deliver <100ms RDP latency to EU users"
   - Qualitative: "modernise the stack so the team can hire skills"
   - Financial: "shift from CapEx replacement cycle to predictable OpEx"

3. **What's the budget reality?**
   - Three-year TCO comparison, not month-one cost
   - Procurement model the customer can actually use (CSP, EA, on-prem refresh, leased)
   - Realistic spend ceiling — "we can find £500/month but not £5000/month"

If you can't answer these, you're not ready to recommend anything. Go back to the customer.

## Phase 2 — Estate inventory

### Per-server data collection

For each server in scope:

| Data point | Source | Why it matters |
|---|---|---|
| OS version + patch level | `systeminfo`, RMM | Determines lift-and-shift eligibility (older OSes may need rebuild in Azure) |
| OS support status + EOL date | Vendor lifecycle pages | Server 2012 R2 = ESU only. Server 2016 = mainstream ended, extended to Jan 2027. Server 2019/2022 = supported. Drives urgency. |
| Installed roles & features | `Get-WindowsFeature` | Identifies what the server actually does. Often surprises. |
| CPU & RAM provisioned vs actual usage | Perfmon, RMM metrics, 30+ days | Right-sizing data. On-prem boxes are routinely over-provisioned 3-5×. |
| Disk: provisioned, used, growth rate | `Get-Volume`, RMM, monitoring history | Storage costing for IaaS; profile container sizing for AVD |
| Applications installed | `Get-WmiObject Win32_Product` (slow), RMM software inventory | Application dependency mapping |
| Application vendor support stance on Azure | Vendor docs / sales | Some legacy apps explicitly do not support cloud hosting. This is a kill-switch for parts of the migration. |
| Backup state | Backup vendor console | Last successful backup, retention, restore test history, off-site copy |
| Patching state | RMM / WSUS | Identifies servers being neglected — usually the ones nobody wants to touch |
| Network dependencies | netstat, conn tracking, firewall logs | Who talks to whom on what ports. Critical for Azure NSG / firewall design. |

### Identity inventory

- AD forest/domain functional level
- FSMO role holders (and the single point of failure they represent)
- GPO count and complexity (`Get-GPO -All | Measure-Object`)
- AAD Connect already deployed? Sync scope? Health?
- User count, mailbox count, group complexity
- Service accounts and what they run — often the biggest hidden migration risk
- Authentication patterns (NTLM v1 in use? Kerberos delegation? Modern auth?)

### Application inventory (the one that kills migrations)

- Line-of-business applications by name, vendor, version
- Hosting model (server-installed, browser-based, terminal-server-published, SaaS)
- Licensing model (per-user, per-device, concurrent, named)
- Authentication (AD, local accounts, app-specific, SAML)
- Database backend (SQL Server edition, MySQL, Access, file-based)
- Integration points (other apps, external services, scheduled jobs)
- Vendor support stance on Azure / AVD specifically

### Network & connectivity

- WAN circuit: carrier, bearer type (FTTC, FTTP, EFM, leased line), bandwidth, contention, SLA
- LAN topology, VLAN structure, switch capabilities
- Edge firewall: vendor, model, firmware, end-of-support date
- Existing VPN: protocol, user count, performance characteristics
- Internet IP block (static / dynamic, single / range)
- DNS hosting (on-prem AD DNS, external, mixed)
- Bandwidth utilisation patterns (peak vs average, upload vs download)

### Microsoft licensing baseline

- M365 tenant — current SKU mix
- Per-user vs shared mailbox counts
- AVD entitlements already included in existing licensing?
- RDS CAL inventory and currency
- Windows Server licensing model and Software Assurance status (drives Azure Hybrid Benefit eligibility)
- CSP / EA / Open Value — what procurement route exists

## Phase 3 — Analysis

### Right-sizing for Azure

On-prem CPU/RAM provisioning is almost always wrong for cloud:
- Over-provisioned: 4 vCPU / 16GB RAM running at 8% utilisation. Right-size to B-series or D2s_v5.
- Under-monitored: spiky workloads where 95th percentile matters more than average. Memory-pressure events not visible in averages.
- Storage IOPS often the real bottleneck — local SSD on-prem masks I/O patterns that need P10/P20/P30 in Azure.

Use 30+ days of monitoring data. Less than that and you're guessing.

### Dependency mapping

For each application, map:
- What it needs (database, file shares, AD authentication, internet egress, specific ports)
- What needs it (which user groups, which other apps)
- What happens if it's down for an hour, a day, a week

Applications cluster into co-migration groups. Moving one without its dependencies is how migrations break.

### Migration path options

For each server / workload, evaluate four paths:

1. **Rehost (lift-and-shift to Azure IaaS).** Cheapest engineering effort, highest ongoing cost. Default for legacy apps that can't be re-architected. Watch for: licensing changes (Windows Server CAL implications), networking model differences, backup product compatibility.

2. **Refactor / repackage.** Move from on-prem app server to AVD-hosted, or from per-server licensing to per-user, or from RDS to Windows 365 Cloud PC. Mid-cost, mid-benefit.

3. **Replatform.** Move from on-prem SQL to Azure SQL MI, from file server to Azure Files + Sync, from on-prem Exchange to Exchange Online. Higher engineering effort, often lower ongoing cost, modernises the platform.

4. **Retire / replace.** The app is dead, the vendor is gone, the function is now covered by M365 or SaaS. Often the highest-value finding from a discovery — kills cost the customer didn't know was avoidable.

### TCO modelling

Three-year total cost, all-in:

**Status quo:**
- Hardware refresh / extended support
- Software licensing (CALs, OS, application, backup)
- Power, cooling, rack space, hands-on maintenance
- Backup / DR infrastructure
- Internet circuit
- Estimated incident-response cost (engineer hours × incident frequency)

**Azure / hybrid:**
- Compute (right-sized, reservation-discounted where applicable, Hybrid Benefit applied where applicable)
- Storage (right-tier — Standard SSD for most SME workloads, Premium only where IOPS justify it)
- Networking (egress, ExpressRoute / VPN gateway, NAT gateway)
- Microsoft licensing (M365, AVD entitlements, Windows licensing model)
- Backup (Azure Backup, retention)
- Migration project cost (one-off)
- Ongoing management cost (your MSP charge or internal admin time)

Be honest about hidden costs on *both* sides. Status-quo costs hide in engineer time and lost productivity; Azure costs hide in egress, NAT gateway, log analytics, and bandwidth.

## Phase 4 — Recommendation framing

Three things, in order:

1. **The customer's question, answered directly.** "You asked whether you should move to Azure. Based on discovery, recommendation is: [option X], because [evidence-backed reasons]." Not "it depends." Take a position.

2. **The other options, dismissed with reasoning.** Why not lift-and-shift everything? Why not stay on-prem? Why not pure SaaS? A senior reader wants to see you considered alternatives, not just advocated for one.

3. **The risks and dependencies.** What could derail this? What needs the customer's action? What's the order of operations?

Followed by a phased plan — not a Gantt chart, just a credible sequence of phases with their gates.

## Phase 5 — Things to refuse

Some "migrations" should not happen. Be willing to say so:

- Customer can't articulate the business problem the migration solves
- The applications in scope are explicitly unsupported on Azure by their vendor
- The connectivity at the customer's site can't sustain the workload's bandwidth requirements
- The customer's budget reality doesn't survive the realistic three-year TCO
- The customer is moving to Azure to avoid fixing an on-prem problem that would also exist in Azure

A consultant who refuses bad migrations earns more credibility than one who takes every project.

## Common scoping mistakes I've seen

1. **Sizing from on-prem hardware specs rather than utilisation data.** "The server has 32GB RAM" tells you nothing if it's running at 12% utilisation.

2. **Forgetting bandwidth.** Customers who currently have ~20Mbit FTTC upload won't have a good time backing up 2TB to Azure nightly, or running 50 users on AVD over the same pipe.

3. **Underestimating identity complexity.** AAD Connect with custom attribute mapping, hybrid Exchange, federation services, ADFS — these are weeks of work, not days.

4. **Ignoring the printers.** Print services are unglamorous and always end up being the long pole of an AVD migration. Plan for Universal Print or print-management product from day one.

5. **Not validating backup restore.** "We have backups" is not the same as "we have tested restores." Validate before migration starts, not after.

6. **Skipping the licensing audit.** Assuming the customer's current M365 SKU includes what they need. It often doesn't. Often Business Premium needs uplifting to E3, or RDS CALs need procuring on top.

7. **Forgetting the apps that nobody mentioned.** The shared MS Access database that runs the entire finance reporting function and was never installed via group policy. The Excel macros that hit a SQL view over a mapped drive. Discovery means asking what people *actually* do, not what's *officially* in scope.

## What good discovery output looks like

A discovery report at the end of this process should contain, at minimum:

- Server inventory with right-sized Azure equivalents and 3-year TCO per server
- Application inventory with migration path per app and dependency clusters
- Network requirements and circuit recommendation
- Identity migration plan with AAD Connect / Entra ID transition
- Licensing baseline and target with cost delta
- Risk register
- Phased migration plan with gates and rollback per phase
- Status-quo TCO for comparison

Length: typically 20–40 pages depending on estate complexity. Anything shorter and you've cut corners.

## What this framework is not

This isn't a sales document. It's not Microsoft's Cloud Adoption Framework (which is excellent but enterprise-scoped). It's not a vendor accelerator. It's the order in which I'd think about a real SME estate before producing a recommendation that I'd be willing to defend in a senior architecture review.

The framework is the artefact. The discipline of using it is what separates engineering recommendations from vibes-based ones.

---

*This document is a methodology framework, not a customer-specific assessment. Application to any specific estate requires running the actual discovery against that estate's data.*
