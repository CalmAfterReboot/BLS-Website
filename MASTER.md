# MASTER — Blue Layer Systems Portfolio

Complete reference for the BLS portfolio codebase, deployment pipeline,
and operational runbook.

**Live site:** https://www.bluelayersystems.com  
**Repository:** https://github.com/CalmAfterReboot/BLS-Website  
**Owner:** Mihai Ferencz / Blue Layer Systems

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [Tech Stack](#2-tech-stack)
3. [Repository Map](#3-repository-map)
4. [Environment Variables](#4-environment-variables)
5. [Local Development](#5-local-development)
6. [Deployment Pipeline](#6-deployment-pipeline)
7. [DNS & Hosting](#7-dns--hosting)
8. [Theme System](#8-theme-system)
9. [GitHub Integration](#9-github-integration)
10. [AI Chat Widget](#10-ai-chat-widget)
11. [Content Editing Guide](#11-content-editing-guide)
12. [Portfolio Projects](#12-portfolio-projects)
13. [Cert Roadmap](#13-cert-roadmap)
14. [Known Issues & Resolutions](#14-known-issues--resolutions)

---

## 1. Project Summary

Blue Layer Systems is a cyberpunk HUD-style engineering portfolio for
Mihai Ferencz — a cloud/DevOps engineer specialising in Azure, IaC, and
platform engineering. The site presents professional background, live
GitHub project data, skills, and a contact interface, all wrapped in a
terminal/HUD aesthetic with dark and light theme support.

**Key design decisions:**
- Cyberpunk HUD aesthetic with clipped-corner panels, scan-line overlays,
  and glitch effects
- Live data: GitHub repos, activity feed, and deployment statuses are
  fetched at runtime, not hardcoded
- Minimal dependencies: Next.js, Framer Motion, SWR — no heavy UI library
- Zero-cost AI chat via Groq free tier proxied through a Cloudflare Worker

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 14.2.35 |
| Language | TypeScript (strict) | 5.6 |
| Styling | Tailwind CSS + CSS Modules | 3.4 |
| Animation | Framer Motion | 12.38 |
| Client data | SWR | 2.4 |
| Fonts | Rajdhani (display), Share Tech Mono (mono) | Google Fonts |
| Hosting | Vercel | lhr1 (London) |
| DNS/CDN | Cloudflare | DNS-only, proxy OFF |
| AI Chat | Groq API (llama-3.1-8b-instant) | via Cloudflare Worker |
| GitHub data | GitHub REST API | Public, unauthenticated |

---

## 3. Repository Map

```
bls-siteV2/
├── app/
│   ├── layout.tsx              # Root layout: fonts, SEO, theme anti-flash, fixed UI
│   ├── page.tsx                # Home page — renders all 5 sections + footer
│   └── api/github/
│       ├── repos/route.ts      # GET /api/github/repos — sorted, enriched repos
│       ├── activity/route.ts   # GET /api/github/activity — last 10 events
│       └── deployments/route.ts # GET /api/github/deployments — deploy status map
├── components/
│   ├── providers/
│   │   └── AppProviders.tsx    # Wraps ThemeProvider + PageTransitionProvider
│   ├── layout/
│   │   ├── Navbar.tsx          # Fixed top nav, mobile hamburger drawer, scroll spy
│   │   └── ThemeToggle.tsx     # Dark/light toggle button (also in ui/)
│   ├── sections/
│   │   ├── Hero.tsx            # Boot animation, typewriter, live git feed
│   │   ├── About.tsx           # Bio, 4 stats, employment timeline
│   │   ├── Projects.tsx        # Live GitHub repo cards, deploy badges
│   │   ├── Skills.tsx          # Progress bars by category, cert roadmap
│   │   └── Contact.tsx         # Contact nodes, targeting roles, email CTA
│   └── ui/
│       ├── ChatWidget.tsx      # AI chat panel (Groq via CF Worker)
│       ├── HudPanel.tsx        # Clipped-corner panel (3 variants)
│       ├── StatusBadge.tsx     # Pulsing dot (success / pending / failure)
│       ├── GlitchText.tsx      # Hover-triggered glitch offset effect
│       ├── ScanOverlay.tsx     # Fixed scan lines + sweep beam (14s loop)
│       ├── Tag.tsx             # Mono uppercase tech tag
│       ├── ProgressBar.tsx     # Animated fill bar with glow dot
│       ├── SectionHeader.tsx   # Section index + title + gradient underline
│       ├── TechMarquee.tsx     # Infinite scrolling tech ticker (38s)
│       ├── CustomCursor.tsx    # Dot + lagging ring (desktop only)
│       └── ThemeToggle.tsx     # Theme button used inside Navbar
├── hooks/
│   ├── useTheme.tsx            # Theme context, localStorage key: bls-theme
│   ├── usePageTransition.tsx   # Full-screen fade overlay between page changes
│   ├── useGitHub.ts            # SWR hooks: repos, activity, deployments
│   └── useScrollReveal.ts      # IntersectionObserver — reveal on 12% visibility
├── lib/
│   └── github.ts               # GitHub client, BLS_META descriptions, PINNED_REPOS_ORDER
├── types/
│   ├── github.ts               # GitHubRepo, Activity, Deployment, ProcessedRepo types
│   └── chat.ts                 # ChatMessage interface {role, content, ts}
├── styles/
│   ├── globals.css             # CSS variables (dark + light), scrollbar, selection
│   └── hud.module.css          # Clip-path panels, glitch, scan, pulse animations
├── vercel.json                 # Vercel config: framework nextjs, region lhr1, headers
├── next.config.js              # reactStrictMode: true
├── tailwind.config.ts          # Custom screens, fonts, color tokens
└── tsconfig.json               # TypeScript strict mode
```

---

## 4. Environment Variables

Copy `.env.local.example` → `.env.local` for local development.

| Variable | Required | Default | Description |
|---|---|---|---|
| `GITHUB_USERNAME` | No | `CalmAfterReboot` | GitHub user for API calls |
| `GITHUB_TOKEN` | No | — | PAT for 5000 req/hr (vs 60/hr unauthenticated) |
| `NEXT_PUBLIC_SITE_URL` | No | `https://bluelayersystems.com` | Canonical URL for SEO + OG |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | — | mailto target for SEND TRANSMISSION button |

The AI chat API key (`GROQ_API_KEY`) lives in Cloudflare Worker secrets
only — it must never be stored in this repo or Vercel environment variables.

---

## 5. Local Development

```bash
git clone https://github.com/CalmAfterReboot/BLS-Website
cd BLS-Website
npm install
cp .env.local.example .env.local   # optional — all vars have defaults
npm run dev
# → http://localhost:3000
```

```bash
npm run build       # production build (checks types + lint)
npm run lint        # ESLint
```

The AI chat widget works on localhost — the Cloudflare Worker CORS
allowlist explicitly includes `http://localhost:3000` and `http://localhost:3001`.

---

## 6. Deployment Pipeline

### Automatic (recommended)

Every push to `main` triggers a Vercel deployment via GitHub webhook.
Builds complete in approximately 60 seconds.

```bash
git add <files>
git commit -m "feat: ..."
git push origin main
# Vercel deploys automatically
```

### Manual

```bash
npm i -g vercel      # install CLI once
vercel --prod        # deploy to production
```

If auth fails:
```bash
vercel login
vercel link          # select bls-siteV2 project
vercel --prod
```

### Build checks before deploying

```bash
npm run build        # must succeed — zero type errors, zero lint errors
```

---

## 7. DNS & Hosting

**Hosting:** Vercel, region `lhr1` (London)  
**DNS:** Cloudflare (DNS-only mode — proxy must be OFF for all records)

| Type | Name | Content | Proxy |
|---|---|---|---|
| TXT | `_vercel` | `vc-domain-verify=...` | DNS only |
| CNAME | `@` | `0a0236d134052a4f.vercel-dns-017.com` | DNS only (grey cloud) |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only (grey cloud) |
| MX | `@` | `mx00.ionos.co.uk` / `mx01.ionos.co.uk` | DNS only |
| TXT | `@` | `v=spf1 include:_spf-eu.ionos.com ~all` | DNS only |

Cloudflare proxy (orange cloud) must remain OFF on root domain and www.
Vercel handles SSL termination. Email records (MX, SPF) are untouched.

**Security headers** (set in `vercel.json`):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 8. Theme System

Two full themes implemented via CSS custom properties on
`[data-theme="dark"]` and `[data-theme="light"]` on `<html>`.

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#07070D` (deep black) | `#F2F0E8` (military off-white) |
| `--accent` | `#00CC6A` (neon green) | `#1A6B34` (dark forest green) |
| `--text-bright` | `#E8F5EC` | `#0D1F14` |
| `--text` | `#A3C4AD` | `#2D5C3A` |
| `--muted` | `#4A7A58` | `#5A8C6A` |

Theme persists in `localStorage` as `bls-theme`. An inline script in
`app/layout.tsx` reads `localStorage` before first paint to prevent
flash of wrong theme.

Toggle is available in the Navbar (top-right). Default: dark mode.

---

## 9. GitHub Integration

Three server-side API routes proxy GitHub REST API calls with caching:

| Route | Data | Cache |
|---|---|---|
| `/api/github/repos` | Public repos sorted by `PINNED_REPOS_ORDER`, enriched with `BLS_META` | 60s + 300s SWR |
| `/api/github/activity` | Last 10 push / PR / release / create events | 60s + 300s SWR |
| `/api/github/deployments` | Latest deployment status per `WATCHED_REPOS` list | 60s + 300s SWR |

**Key constants in `lib/github.ts`:**

- `GITHUB_USERNAME` — defaults to `"CalmAfterReboot"`, overridable via env var
- `PINNED_REPOS_ORDER` — ordered list of 8 repo names (BLS-Website first)
- `BLS_META` — maps repo name → `{ description, phase }` for display
- `WATCHED_REPOS` — repos to check for deployment status

**Rate limits:**
- Unauthenticated: 60 requests/hour/IP
- With `GITHUB_TOKEN`: 5000 requests/hour

To add a GitHub token: set `GITHUB_TOKEN` in Vercel project environment variables.

---

## 10. AI Chat Widget

A floating chat panel in the bottom-right corner powered by:
- **Cloudflare Worker** (`empty-fire-57ca-bls-chat-worker.ferencz-mihai9.workers.dev`)
  acts as a CORS proxy
- **Groq API** (`llama-3.1-8b-instant`) handles inference (free tier, no card required)

**Worker source:** `bls-chat-worker.js` (repo root)

**To update the Worker:**
1. Edit `bls-chat-worker.js` locally
2. Cloudflare dashboard → Workers & Pages → `empty-fire-57ca-bls-chat-worker`
3. Edit code → paste complete updated content → Deploy

**Worker secrets (set via Cloudflare dashboard only):**
- `GROQ_API_KEY` — Groq API key from `console.groq.com`

**CORS allowed origins:**
- `https://bluelayersystems.com`
- `http://localhost:3000`
- `http://localhost:3001`

**To update AI persona:** edit `SYSTEM_PROMPT` in `bls-chat-worker.js`,
then redeploy the Worker. The system prompt defines the assistant's
voice, context, and prohibited response patterns.

---

## 11. Content Editing Guide

| What to change | File |
|---|---|
| Bio text, employment timeline | `components/sections/About.tsx` |
| Stat cards (years exp, certs, tools) | `components/sections/About.tsx` |
| Skill bars and categories | `components/sections/Skills.tsx` |
| Cert roadmap entries | `components/sections/Skills.tsx` |
| Contact info and targeting roles | `components/sections/Contact.tsx` |
| Pinned repos and display order | `lib/github.ts` — `PINNED_REPOS_ORDER` |
| Project descriptions and phases | `lib/github.ts` — `BLS_META` |
| AI assistant persona | `bls-chat-worker.js` — `SYSTEM_PROMPT`, then redeploy |
| SEO title, description, OG image | `app/layout.tsx` — `metadata` export |
| Colour tokens | `styles/globals.css` |
| HUD effects, clip-paths, animations | `styles/hud.module.css` |
| Hero typewriter roles | `components/sections/Hero.tsx` — `ROLES` array |

---

## 12. Portfolio Projects

| Repo | Status | Description |
|---|---|---|
| [BLS-Website](https://github.com/CalmAfterReboot/BLS-Website) | Live | This portfolio site |
| [azure-landing-zone](https://github.com/CalmAfterReboot/azure-landing-zone) | Building | Terraform, GitHub Actions, Checkov, Infracost |
| [aks-platform](https://github.com/CalmAfterReboot/aks-platform) | Planned | AKS, Helm, RBAC, GitHub Actions CI/CD |
| [litellm-gateway](https://github.com/CalmAfterReboot/litellm-gateway) | Active | Self-hosted LiteLLM on Proxmox, Ollama backend, Cloudflare tunnel |

---

## 13. Cert Roadmap

| Cert | Status |
|---|---|
| AZ-900 Microsoft Azure Fundamentals | Passed |
| AZ-104 Microsoft Azure Administrator | Passed |
| HashiCorp Terraform Associate | In Progress |
| AZ-400 Azure DevOps Engineer Expert | Planned |
| AZ-305 Azure Solutions Architect Expert | Planned |

---

## 14. Known Issues & Resolutions

### 1. Cloudflare Worker — Syntax Error on Deployment
**Issue:** Worker failed to deploy with syntax error on line 1. Two
separate lines had been merged during Cloudflare dashboard inline editing.

**Resolution:** Rewrote worker.js from scratch with correct syntax.
`ALLOWED_ORIGIN` constant and `corsHeaders` function body must remain on
separate lines.

**Prevention:** Never edit worker code directly in the Cloudflare dashboard
inline editor for multi-line changes. Use a local file and paste the
complete content.

---

### 2. Cloudflare Worker — Upstream Error (OpenRouter)
**Issue:** Worker returned `{"error":"Upstream error"}` on all requests.

**Root cause:** `deepseek/deepseek-chat-v3-0324:free` on OpenRouter
required a verified payment method even for the free tier.

**Resolution:** Switched to Groq API with `llama-3.1-8b-instant`. No
payment method required. Updated worker constants:
- `API_URL` → `https://api.groq.com/openai/v1/chat/completions`
- `MODEL` → `llama-3.1-8b-instant`
- Secret renamed to `GROQ_API_KEY`

---

### 3. Chat Widget — 400 Error (Stale React State)
**Issue:** POST requests to Worker received 400 with only 15 bytes sent.

**Root cause:** Classic React stale closure bug — `fetch` read `messages`
state before the new user message had been committed via `useState`.

**Resolution:** Build the updated messages array before calling `setState`,
then use the same array reference for both the state update and the
fetch payload:

```typescript
const updatedMessages = [...messages, { role: 'user', content: inputValue, ts: new Date() }]
setMessages(updatedMessages)
const payload = { messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) }
```

---

### 4. Cloudflare Pages — Failed Build (Wrong Hosting Target)
**Issue:** `bls-portfolio` project on Cloudflare Pages showed repeated
build failures.

**Root cause:** Project was incorrectly configured to deploy to Cloudflare
Pages. Correct target is Vercel.

**Resolution:** Deployed to Vercel. Cloudflare is DNS-only.

---

### 5. Vercel Domain — 403 Forbidden
**Issue:** Site deployed successfully but returned 403 in browser.

**Root cause:** Vercel Deployment Protection was enabled by default.

**Resolution:** Vercel dashboard → Project Settings → Deployment
Protection → Disabled.

---

### 6. Vercel Auto-Deploy Not Triggering
**Issue:** Pushes to main did not trigger automatic Vercel deployments.

**Root cause:** GitHub repository not connected to Vercel project via
webhook at initial setup.

**Resolution:** Vercel dashboard → Project Settings → Git → Connected Git
Repository → reconnected `CalmAfterReboot/BLS-Website`.

---

### 7. Cloudflare DNS — Invalid Configuration on Custom Domain
**Issue:** Vercel showed "Invalid Configuration" for `bluelayersystems.com`.

**Root cause:** Existing root CNAME pointed to Cloudflare Pages with proxy
enabled (orange cloud). Vercel requires DNS-only and its own CNAME target.

**Resolution:** Deleted old CNAME, added new CNAME `@` → Vercel DNS target
(DNS only), added TXT `_vercel` → verification token. Kept MX/SPF
records untouched.

---

### 8. AI Assistant — Terminal-Style Rejection Responses
**Issue:** Model responded to short inputs with CLI rejection messages
("UNKNOWN COMMAND", "COMMAND NOT RECOGNIZED").

**Root cause:** System prompt instructed "terminal-style tone" which the
model interpreted as literal CLI behaviour.

**Resolution:** Updated `SYSTEM_PROMPT` to explicitly prohibit CLI
rejection phrases and clarify the assistant is conversational.

---

### 9. Hero Section — Excess Gap Below Navbar
**Issue:** Large blank space (~150px) appeared between ticker and hero
content on initial load.

**Root cause:** Accumulated `padding-top` values across multiple components
during iterative scroll-offset fixes.

**Resolution:** Audited all padding changes with `git diff HEAD~4`, removed
all accumulated padding, keeping only the scroll offset correction in
`Navbar.tsx` (`scrollToSection` subtracts navbar height from
`getBoundingClientRect().top + window.scrollY`).
