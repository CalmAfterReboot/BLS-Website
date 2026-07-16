# Rebuilding a Broken AVD Estate: Fixing FSLogix Profile Failures at the Authentication Layer

**Context for this document:** A UK-based finance SME running Azure Virtual Desktop was suffering recurring FSLogix profile-mount failures — users losing their profiles, sessions falling back to broken states, the kind of fault that erodes trust in a whole platform. I was brought in to stabilise it. This is the record of what I found, why the obvious diagnosis was wrong, and how I rebuilt the environment around the actual root cause.

**Why this matters:** The failure presented as a timing problem and had been treated as one for some time. It wasn't. The real issue was an authentication model that had never been configured correctly — and no amount of timing workarounds was ever going to fix it. The value of this case study is the diagnosis and the two-layer permission reasoning behind the fix, not the fact that AVD now works.

**Scope of this record:** This covers the AVD session-host build, FSLogix profile storage, and the hybrid-identity authentication model — the layers this engagement turned on. The network layer is deliberately thin (a single flat NSG; access via the Windows App client — see the networking note below), and tiered segmentation is named as a hardening step, not claimed as built.


---

## The challenge

The environment was a pooled, multi-session Windows 11 AVD estate with FSLogix profile containers stored on Azure Files. Symptomatically, profiles would intermittently fail to mount — most visibly after a host reboot, such as the ones Windows Update triggers. The working theory on arrival was a token race condition: reboots firing before authentication was ready, so the profile mount lost its window.

That theory fit the timing of the failures, which is exactly why it had survived. But it didn't survive assessment.

When I inspected the FSLogix storage account, its identity-based authentication property came back **null**. Not misconfigured — absent. The share had no identity-based authentication of any kind: not Entra Kerberos, not AD DS. Profiles were being mounted using the **storage account key** baked into the FSLogix configuration, with zero identity RBAC behind them.

That single fact reframed the entire engagement. A key-mounted share has no resilient identity to fall back on. When a host rebooted and the mount path was disturbed, there was no identity to re-authenticate with — so the mount failed, and the failure *looked* like a race because reboots were the trigger. The fix was never going to be better timing. The share needed a real identity to authenticate against.

## Approach

I made four decisions up front, and the reasoning behind each one is the substance of the rebuild.

**1. Reuse the anchors, rebuild the hosts.** In AVD, the host pool, workspace and desktop application group are the objects the end-user client is subscribed to. Delete or recreate them and every user's published connection breaks, forcing a re-subscribe across the estate. The session hosts, by contrast, are disposable. So I preserved the three anchor objects untouched and rebuilt only the hosts. Hosts are cattle; the pool, workspace and app group are not.

**2. Fix the root cause, not the symptom.** Rather than continue papering over a key-based mount with timing tweaks, I moved the storage to identity-based authentication using **Entra Kerberos (AADKERB)**.

**3. Layer all configuration through Intune — no gold image.** Every setting (FSLogix, locale, lockdown, the drive map) is delivered by Intune policy to a dynamic device group keyed on host naming. There is no baked-in GPO and no captured image. The hosts are reproducible from a known-good Marketplace base and fully interchangeable.

**4. Standardise both hosts identically and verify by comparison** before sign-off. Every mechanism is the same on each host, confirmed side by side, so there is no "works on one, not the other" drift.

### Why Entra Kerberos over the alternatives

There are three ways to give an Azure Files share an identity, and the choice was driven by what the organisation actually is — a hybrid-identity shop running Entra-joined AVD hosts.

- **Storage key** — what was already there. No identity, no RBAC. This *was* the root cause. Rejected.
- **AD DS authentication** — requires the session hosts to be domain-joined. These hosts are Entra-joined and cloud-managed. Rejected.
- **Entra Kerberos (AADKERB)** — lets an Entra-joined host authenticate to Azure Files using the user's own Entra identity, with Kerberos tickets retrieved from Entra ID, no domain join required. Exactly right for a cloud-managed AVD estate. **Chosen.**

This is the correct identity model for cloud-managed AVD, and — as it turned out — the same reasoning resolved a second, unrelated problem later in the build.

> [!DANGER]
>
> **Entra Kerberos (AADKERB) is load-bearing and fails *silently* — understand it fully before changing anything.** Three conditions take the entire profiles share offline with no honest error message: admin consent missing on the auto-created storage app registration (ticket retrieval fails quietly); the cloud-Kerberos client flag not applied, or the host not rebooted after it (mounts fail with `1326`); and, in a hybrid tenant, the on-premises AD anchor that underpins the whole trust (see the hybrid-identity danger below). None of these present as "authentication failed" — they look like timing, networking, or nothing at all. Treat every AADKERB change as a tested, pilot-validated change, never ad hoc.

### The part most people conflate: two permission layers

Access to an Azure Files share is governed by **two independent layers**, and both must be correct. Conflating them is the single most common cause of "it should work but doesn't":

| Layer | Controls | Set by |
|---|---|---|
| **Azure RBAC (SMB)** | Whether an identity can connect to the share at all | Role assignment — *Storage File Data SMB Share Contributor* on the user group |
| **NTFS ACL (filesystem)** | What that identity can *do* inside the share | `icacls`, applied by mounting the share with a privileged identity |

The NTFS model on the share root is the standard FSLogix per-user pattern: *Authenticated Users* can create and traverse but only at the root; *CREATOR OWNER* gets full control of subfolders and files; *Administrators* and *SYSTEM* get full control throughout. The effect is that each user creates and fully owns their own profile folder, and cannot touch anyone else's. Both layers have to line up — RBAC to get through the door, NTFS to use the room — and most "phantom" Azure Files permission faults live in the gap between them.

### Decision: rebuild the profiles, don't migrate them

The containers I inherited came from an environment with a broken authentication model and a documented history of mount failures. That forced an explicit choice rather than a default:

| Option | Pros | Cons |
|---|---|---|
| **Migrate existing containers** | Preserves user customisation and cached state; no first-login re-setup | Carries state forward from the exact system being replaced; risks inheriting corrupted or locked containers; migration tooling adds its own failure surface |
| **Rebuild fresh** *(chosen)* | Clean baseline under the corrected auth model; nothing carried over from the broken estate; no migration step to go wrong | Users start on new profiles; only safe where profile-resident data isn't the only copy |

**Decision:** rebuild fresh. Re-mounting suspect containers onto a freshly corrected auth model risks reintroducing the very state I was there to eliminate. **Gate — when I'd migrate instead:** in-place migration is only the right call when the existing containers are *known-good* **and** hold data with no other source. Neither was true here. I kept SID-first folder naming so the new containers match the old convention even though the data is new — consistency of standard, not of data.

## Implementation highlights

### A gated build sequence

The build followed a deliberately gated order, because several settings must land *before* first login or the original failure simply replays in a new costume:

1. **Enable AADKERB on the storage account and grant admin consent** on the auto-created app registration. Hard gate — nothing downstream proceeds until both are green.
2. **Storage SMB RBAC** — assign the user group the SMB Share Contributor role; administrators the elevated role.
3. **NTFS ACLs inside the share** — the per-user filesystem layer.
4. **Intune Settings Catalog** — FSLogix configuration plus the client-side cloud-Kerberos retrieval flag, assigned to the device group, applied before first login.
5. **Deploy hosts from the Marketplace image** into the existing pool, Entra-joined and Intune-enrolled.
6. **Reboot** — cloud Kerberos does not take effect until after one (more on that below).
7. **Applications, locale, lockdown.**
8. **Validate** — pilot login, FSLogix Operational log, clean mount and write-back before release.

### The go / no-go gates

Five of those steps are true gates, not just sequence. Cross one before it's green and the build fails in a way that's expensive to unwind — so each has an explicit pass criterion and a known failure mode:

| Gate | Must be green before proceeding | Failure mode if skipped |
|---|---|---|
| **Auth foundation** | AADKERB enabled on the storage account *and* admin consent granted on the auto-created app registration | Kerberos ticket retrieval fails silently — a mount error that looks like everything and nothing |
| **Pre-login config** | FSLogix config + cloud-Kerberos retrieval flag applied to the device group *before* first login | The original key-mount failure simply replays on the new hosts |
| **Post-enrolment reboot** | Hosts rebooted after Intune enrolment | Cloud Kerberos stays inactive — a fresh host fails to mount with error `1326` |
| **Real-user validation** | A *standard, non-admin* user mounts and writes back cleanly | An admin test account masks NTFS/SPN faults and the failure ships to a real user — which it nearly did |
| **Policy proof** | Disconnected-session limit fires and FSLogix shows a clean unload/compact on forced logoff | Profiles stay locked to dead sessions; write-back integrity goes unverified |

### Why the Marketplace image, not a gold image

The original plan was to deploy from a captured gold image. I abandoned that after hitting the Windows 11 24H2 sysprep wall: a protected system package on 24H2 cannot be removed and blocks `generalize` with `0x80073cf2`. Both standard workarounds — re-registering the package and the special-profiles registry flag — failed.

Rather than fight the generalisation step, I deployed both hosts from the stock Marketplace Windows 11 Enterprise multi-session image and layered everything through Intune. That removed the sysprep dependency entirely and made the hosts reproducible from a known-good base — which is the better long-term posture anyway.

### FSLogix configuration choices worth calling out

Two settings were deliberate rather than default:

- **SID-first folder naming (FlipFlop disabled)** — keeps the previous environment's naming convention, so the layout stays instantly recognisable and any tooling that assumes SID-first naming still holds. The data is new (see the rebuild-vs-migrate decision above) — this is consistency of *standard*, not of data.
- **Prevent login with temp profile (fail-closed)** — if a profile genuinely can't mount, the user is *stopped* rather than silently dropped onto a throwaway temp profile where their work vanishes at logoff. For a finance team, failing loud is the correct posture.

### A storage-governance note worth knowing

The profiles storage account is enrolled in Azure Backup, which places an automatic `CannotDelete` lock on it. The practical effect surprised me mid-build: a retained staging share on the same account couldn't be deleted until the backup association was understood — and that lock should *not* be removed casually, because the same protection covers the live profiles share. It's deliberate, not an error. Worth knowing before someone "tidies up" a share and quietly strips the protection off the production profiles in the process.

### The network posture — flat, and why that's workable

The network design here is minimal: a single flat, permissive NSG, with user access arriving through the Windows App client. That's workable rather than reckless, because AVD uses an outbound *reverse-connect* transport — the session hosts dial out to the AVD control plane, so nothing inbound is exposed and no per-host inbound rules are needed. The real access boundary is therefore **identity and app-group assignment** (Entra-joined hosts, desktop application group membership), not network segmentation. I'm calling this out plainly: tiered NSGs and private endpoints for the storage are the obvious next hardening step — named here as honest future work, not as something this rebuild delivered.

### The hybrid-identity dependency — a warning I documented as foresight

Because the organisation is hybrid, the Entra Kerberos trust for the share is anchored on an on-premises AD DS object carrying the storage account's service principal name, synced into Entra ID alongside the users. When an Entra-joined host requests a ticket to mount a profile, that ticket is validated against the synced identity chain. **The on-premises directory is therefore not a legacy bystander — it is part of the live authentication path for FSLogix.**

> [!DANGER]
>
> **The on-premises AD DS / AD Connect sync is part of the *live* authentication path — do not touch it without a migration plan.** Decommissioning on-prem AD DS, breaking the directory sync, or deleting/altering the storage account's SPN object breaks Kerberos ticket validation and fails **every** profile mount across the estate at once — the exact failure this project eliminated, only worse, and hitting everyone simultaneously. Moving to cloud-only is achievable, but only as a *planned migration*: re-establish and validate the cloud-only Kerberos model against a pilot user first, **then** retire the anchor — never the reverse. Treat the directory-sync layer as production infrastructure for as long as the hybrid model is in place.

## Lessons and engineering depth

The dead ends were as instructive as the fixes. Five are worth keeping.

**Cloud Kerberos needs a reboot.** The second host failed to mount FSLogix with error `1326` on a fresh build. The cause was simply that the cloud-Kerberos client setting doesn't take effect until after a reboot. On a fresh host showing a `1326` mount failure, rule the reboot out *first* — it's the cheapest check and it was the answer here.

**An admin test account will hide a real permissions fault.** Late in validation, a standard (non-admin) user hit `Access Denied (Error 5)` mounting their profile — in a spot where my admin test account had worked perfectly. Administrators have broad access regardless, so the admin account had *masked* the problem. The user was correctly in the right group, so the RBAC layer was fine; that pointed me straight at the NTFS layer and the Kerberos SPN anchor, which is where the fix lived. The lesson: always validate identity-based storage with a regular user account, never an admin — the admin will lie to you by succeeding.

**Elevated installers can't authenticate to an AADKERB share.** Installing an MSI directly from the AADKERB-protected Azure Files share failed with MSI error `1314`. The elevated install context (SYSTEM/admin) can't authenticate to the share, because the Kerberos identity belongs to the *user session*, not the elevated installer. The workaround — copy the installer to local disk, then run it locally — applies to *any* elevated MSI sourced from an identity-based share, not just the one app that surfaced it.

**Scheduled tasks don't work for drive mapping in AVD.** A line-of-business accounting application needed a mapped drive to its shared data, hosted (on an interim basis) on an on-prem workgroup server reachable only by IP. My first attempt mapped the drive via a logon-triggered scheduled task. The task log cheerfully reported "mapped OK" — but the drive was invisible to the user. A scheduled task runs in a *different session and token* than the interactive desktop, and mapped drives are per-session: the task had mapped a drive into a session nobody was looking at. The correct pattern is a per-user mechanism that runs in the user's *own* interactive session, so the drive lands in the session the user actually sees. Worth noting the documented trade-off of the interactive approach: the drive takes a minute or two to appear after sign-in, so the app must not be launched before it's present.

**The workgroup-server bridge is a pattern with an expiry date.** A non-domain workgroup box can't authenticate Entra identities — the same fundamental limitation as the original key-mounted share. (Networking-wise it's mundane: the box shares a VNet with the hosts but doesn't register cleanly in DNS, so it's reached by IP rather than name — routable, just not named.) The interim integration uses a local service-account credential, which works now and disappears cleanly when that data moves onto Azure Files with AADKERB, at which point the mapping becomes Entra-identity based and mirrors the FSLogix model exactly. The point worth internalising: *only an identity-based file service (Azure Files with AADKERB) or a domain gives you identity-based SMB.* Everything else is a temporary bridge, and it should be documented as one.

## Decisions deferred — and their gates

Two changes are queued for later phases. Both are *planned migrations, not deletions* — and on each, the order of operations is the whole game. I documented the gate on both because getting the sequence wrong takes the estate down, not just the feature.

**Retiring hybrid identity (moving to cloud-only).**

- *Why you'd do it:* removes the on-premises directory and its sync from the live FSLogix authentication path — fewer moving parts, and no on-prem single point of failure sitting underneath every profile mount.
- *The risk:* the estate-wide blast radius set out in the hybrid-identity danger above — this is the change that triggers it if sequenced wrong.
- *Gate:* migrate Azure Files authentication to the cloud-only Kerberos model and validate the SPN/identity chain against a pilot user — *then*, and only then, retire the anchor. Never the reverse.

**Decommissioning the interim workgroup data source.**

- *Why you'd do it:* moves the line-of-business data onto Azure Files with AADKERB, which retires the last local-credential bridge in the build and makes the drive map Entra-identity based — the model already proven for FSLogix. It also kills the workgroup auth limitation at its source.
- *Why it's lower-risk:* the workgroup box is independent of the identity anchor (it's not a domain controller), so it doesn't carry the estate-wide blast radius the hybrid retirement does.
- *Gate:* migrate the data and prove the new mount works before retiring the old path. Same discipline, smaller blast radius.

The point of writing these down rather than just doing them later: the gate is the deliverable. Anyone picking this up after me inherits the *sequence*, not just the intention.

## Outcome

The environment is live and in production. Both rebuilt session hosts serve users, FSLogix profiles mount cleanly, and the profile-mount failures that triggered the engagement are resolved **at root cause** — not worked around. Regular users authenticate and mount their own profiles correctly, the per-user ownership model holds, and write-back on logoff is clean and verified. Users were migrated onto the rebuilt estate without losing the published-connection anchors.

Just as importantly, the things that *aren't* done are written down rather than lost — with their gates attached (above). The one remaining hardening item is the endpoint-EDR exclusions for the FSLogix containers: not a blocker, since profiles mount correctly without them, but their absence can masquerade as intermittent network latency later, so it's recorded as a known follow-up rather than a surprise.

The headline isn't "AVD works again." It's that a failure everyone had read as a timing problem was an authentication problem, and naming it correctly turned an endless cycle of workarounds into a one-time fix.

---

*If you're running AVD and fighting intermittent FSLogix profile-mount failures — or planning a rebuild and want the authentication model right the first time — I'm happy to talk it through. The hard part is rarely the deployment; it's diagnosing the layer the symptom is hiding.*
