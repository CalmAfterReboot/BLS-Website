# Incident Case Study: VPN Failure Cascade Revealing a Stacked-Fault Estate

**Environment:** UK MSP customer, mid-size logistics SME, ~50 users, single Carlisle office, international remote workers
**Role:** Second/third-line engineer (incident response, customer-facing)
**Duration:** ~4 hours, single Friday afternoon
**Outcome:** VPN restored, RDS root cause identified, five architectural findings surfaced and routed

---

## Presenting symptom

End user (working remotely from Germany) reported they could not connect to the office VPN. Client-side error:

> *The L2TP connection attempt failed because certificate validation on the remote computer failed.*

Ticket arrived end-of-week, single user impact, no other open tickets against the same client.

## Initial hypothesis (and why I was wrong)

The error message points at machine certificate validation. The obvious first move is to disable cert validation on the client or check the certificate chain on the router.

I asked the user one diagnostic question rather than running through a checklist: *did other users at the same client connect successfully today?* Answer was that some users worked, some did not. That immediately ruled out "router cert expired" — a cert-side fault would affect everyone simultaneously.

The error message was misleading. The DrayTek Smart VPN Client (5.7.1) surfaces multiple unrelated failures as "certificate validation failed," including IKE proposal mismatches and IPsec security policy rejections. This is a known UX defect in that client version that I should have recognised earlier.

## Diagnostic chain

### Layer 1 — Router IPsec policy mismatch

Pulled the router config (Vigor 2862n perimeter firewall). Confirmed via `VPN and Remote Access → IPsec General Setup` that the router's IPsec Security Method was set to "Medium" — which on that vendor's firmware accepts AH-based proposals. The client was offering ESP with AES256/SHA1/DH14.

**First intervention (judgement call under live incident):** Flipped router IPsec Security Method from Medium to High to align with the client's ESP proposal. Risk: changes affect every dial-in user. Verbal sign-off obtained, change logged in ticket.

**Result:** Made it worse. Router syslog (filtered on VPN, which required correcting the syslog filter twice — the default "All" filter drowns out IKE events) showed:

```
[IPSEC/IKE][@x.x.x.x] state transition fail: STATE_MAIN_R0
IPsec Security Level[High]: Ignore Phase1 SA proposals of DES/3DES/MD5/SHA1/DH G1 G2 G5
```

The "High" setting on that vendor's firmware rejects SHA1 outright, accepting only SHA256+. The client was offering SHA1. My change had created a new fault, not fixed the existing one.

**Lesson:** I had misread the vendor's labelling — Medium vs High on that firmware is about *cipher strength*, not about AH vs ESP. I corrected the change (reverted to Medium) and re-evaluated.

### Layer 2 — Router firmware

Once the security level was reverted, I checked firmware state. The router was running a firmware build from late 2022, ~3 years old. The vendor had shipped multiple subsequent point releases addressing L2TP/IPsec NAT-T issues and several CVEs against that model.

**Second intervention:** Firmware upgrade under live change. Process:
1. Configuration backup downloaded to local + attached to ticket (the `.cfg` file contains all VPN PSKs and dial-in credentials in recoverable form — handled per credential-handling policy)
2. Identified correct firmware variant for the BT Wholesale-tagged WAN line (vendor ships line-carrier-specific builds; choosing the wrong one breaks PPPoE)
3. Selected the `.all` file (preserves config) over `.rst` (factory reset) — the vendor's file extensions are counter-intuitive, this caught me out and I had to correct the file selection before flashing
4. Out-of-band recovery considered: confirmed someone on-site could power-cycle the device if it bricked
5. Flash performed, router rebooted, came back on the same config in ~4 minutes

**Result:** VPN handshake completed. User connected. Tunnel stable.

### Layer 3 — RDS connection still failing

VPN was up, ping to internal terminal server was working (with high jitter — 73ms baseline spiking to 1023ms, a 14× variation), but `mstsc` to the terminal server hung indefinitely at "Estimating connection quality."

I spent ~90 minutes on this layer trying client-side workarounds:
- Forcing RDP "Modem (56kbps)" performance profile
- Editing `.rdp` file to disable `bandwidthautodetect` and `networkautodetect`
- Setting `fClientDisableUDP` registry key on the user's machine
- Testing alternative client (Windows App)
- Investigating FSLogix logs on the terminal server (Event Viewer)

None resolved the symptom.

### Layer 4 — Actual root cause

The hang eventually surfaced as a clear error:

```
A licensing error occurred while the client was attempting to connect (Licensing timed out)
Error code: 0xf06
```

`lsdiag.msc` on the terminal server confirmed:
- Configured as its own RD Licensing server
- Per-User licensing mode
- **Zero CALs installed**
- Grace period had recently expired

**The original "Estimating connection quality" hang was the licensing handshake timing out.** The connection-quality UI is what the RDP client shows while the licensing request is in flight; if licensing never completes, the UI never updates. The 90 minutes I spent on RDP transport tuning was investigating the wrong layer.

**Lesson (the important one):** When an RDP session hangs at logon stages, `lsdiag.msc` is a 30-second check that should be done before any client-side troubleshooting. I had gone deep on bandwidth/transport before checking licensing, and it cost time.

## Resolution

- **VPN:** Restored. Firmware updated to current. IPsec policy reverted to Medium for backward compatibility with existing client profiles (SHA1-based) — flagged for hardening project (see findings below).
- **RDS:** Root cause identified, not fixed within the incident. Requires CAL procurement, which is outside 2nd line scope. Handed to account/licensing owner with full diagnostic write-up.
- **User:** Informed that RDS would not be available until licensing was resolved; given realistic timeline.

## Architectural findings surfaced by the incident

Routine break-fix would close the ticket here. I logged the following as separate items for proper follow-up:

1. **Firmware EOL exposure.** The perimeter firewall had been running unsupported firmware with known CVEs for 3+ years. No patch management process visible for this device class.
2. **Weak IPsec policy.** SHA1 and DH groups <14 still accepted. Recommend phased migration of client profiles to SHA256/DH14+ followed by router policy tightening.
3. **VPN protocol sprawl.** Syslog showed users dialling in via PPTP, OpenVPN, *and* L2TP/IPsec against the same router. PPTP is cryptographically broken; OpenVPN was misconfigured and failing. Recommend standardisation on a single transport with SSL VPN as a fallback for hostile networks.
4. **WAN line quality.** Observed 14× jitter variation on the FTTC line (copper last-mile, marginal SNR). This is the underlying cause of poor remote-user experience and cannot be fixed in software. Recommend FTTP availability check.
5. **RDS hygiene.** `quser` revealed disconnected sessions persisting for >2 weeks. No idle/disconnect timeout policy. Licensing pool was at zero, indicating no CAL procurement process or inventory tracking.
6. **International user architecture.** End user was working from Germany over consumer broadband, hitting a UK terminal server via L2TP/IPsec. This architecture is fundamentally constrained by transatlantic latency and consumer-ISP packet handling. No amount of router tuning will deliver an acceptable experience. The correct answer is regional AVD or RD Gateway over TLS/443. Flagged for account-level architecture review.

## Self-assessment

**What I did well:**

- Didn't accept the initial error message at face value
- Got the missing diagnostic data (router syslog) before making the second change
- Held the line on a known licensing-violation workaround when it would have been an easy shortcut
- Separated incident-scope work from follow-up findings instead of bundling everything into one ticket
- Recognised when the problem had exited my scope (licensing procurement, account-level architecture)

**What I'd do differently:**

- `lsdiag.msc` first when RDP hangs at logon — would have saved ~90 minutes
- Don't change router IPsec policy mid-incident without testing on a non-production endpoint first
- Build the diagnostic order into a personal runbook so I don't have to invent it under pressure each time

## Lessons that would apply at any client

1. **The error message is rarely the diagnosis.** Especially with consumer-grade VPN clients that aggregate failure modes into a single user-facing string.
2. **Filter your logs.** I spent a full diagnostic cycle reading general traffic in the syslog because the default filter wasn't narrowed to VPN events. Defaults are rarely useful.
3. **Stacked faults are the norm in long-lived SME estates.** This incident contained at least two unrelated faults (firmware bug + licensing gap) that happened to surface on the same day. Don't assume one root cause.
4. **The cheap shortcut is usually the licensing violation.** Resetting the RDS grace period via registry would have unblocked the user in 30 seconds. It's also traceable, breaches Microsoft's licensing terms, and is the kind of decision that ends MSP partnerships. The professional answer is to identify the gap, document it, and escalate procurement.
5. **A 2nd line ticket often reveals a strategic problem.** The job is to close the ticket *and* surface the strategic problem in a way that someone upstream can act on. If you only do the first part, the same ticket comes back in 3 months.

---

*Anonymisation note: client identity, real IPs, hostnames, and usernames have been removed. Technical vendor names, error codes, and product versions are retained because they are the credibility markers for this case study.*
