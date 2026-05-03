# Blue Layer Systems — Portfolio (BLS)

Production portfolio for Mihai / Blue Layer Systems — a cyberpunk HUD-style
engineering portfolio built with Next.js 14 (App Router), deployed to Vercel
at bluelayersystems.com.

Repository: github.com/CalmAfterReboot/BLS-Website

---

## Live URLs
- Production: https://bluelayersystems.com
- www: https://www.bluelayersystems.com
- Vercel preview: https://bls-website-psi.vercel.app

---

## Architecture Overview
```
Browser
└── bluelayersystems.com (Cloudflare DNS → Vercel)
    └── Next.js 14 App Router (Vercel, region: lhr1)
        ├── /api/github/repos        → GitHub REST API
        ├── /api/github/activity     → GitHub REST API
        ├── /api/github/deployments  → GitHub REST API
        └── ChatWidget (client)
            └── Cloudflare Worker (bls-chat-worker)
                └── Groq API (llama-3.1-8b-instant) — FREE TIER
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS Modules (hud.module.css) |
| Animation | Framer Motion |
| Client data | SWR |
| Fonts | Rajdhani (display), Share Tech Mono (mono) |
| Hosting | Vercel (lhr1 — London region) |
| DNS / CDN | Cloudflare (DNS only, proxy OFF) |
| AI Chat | Groq API via Cloudflare Worker proxy |
| AI Model | llama-3.1-8b-instant (free tier, no cost) |
| GitHub data | GitHub REST API (public, unauthenticated) |

---

## Repository Structure
```
BLS-Website/
├── app/
│   ├── layout.tsx              # Root layout, fonts, SEO, ChatWidget mount
│   ├── page.tsx                # Home page — all sections
│   └── api/github/
│       ├── repos/route.ts      # Public repos, BLS pinned list first
│       ├── activity/route.ts   # Recent push/PR/create events
│       └── deployments/route.ts # Deploy status per watched repo
├── components/
│   ├── providers/
│   │   └── AppProviders.tsx    # ThemeProvider + PageTransitionProvider
│   ├── layout/
│   │   ├── Navbar.tsx          # Fixed nav, hamburger, mobile drawer
│   │   └── ThemeToggle.tsx
│   ├── sections/
│   │   ├── Hero.tsx            # Boot sequence, typing effect, live feed
│   │   ├── About.tsx           # Bio, stats, experience timeline
│   │   ├── Projects.tsx        # Live GitHub data, status badges
│   │   ├── Skills.tsx          # Animated progress bars, cert roadmap
│   │   └── Contact.tsx         # Contact nodes, CTA
│   └── ui/
│       ├── ChatWidget.tsx      # AI chat — calls Cloudflare Worker
│       ├── HudPanel.tsx        # Clipped-corner HUD panel
│       ├── StatusBadge.tsx     # Pulsing status dot
│       ├── GlitchText.tsx      # Hover glitch effect
│       ├── ScanOverlay.tsx     # Fixed scan lines
│       ├── Tag.tsx             # Mono uppercase tag
│       ├── ProgressBar.tsx     # Animated skill bar
│       ├── SectionHeader.tsx   # Index + title + gradient line
│       ├── ThemeToggle.tsx     # Dark/light toggle
│       ├── CustomCursor.tsx    # Dot + lagging ring cursor
│       └── TechMarquee.tsx     # Infinite ticker
├── hooks/
│   ├── useTheme.tsx            # Theme context + localStorage
│   ├── usePageTransition.tsx   # Full-screen fade transitions
│   ├── useGitHub.ts            # SWR hooks for GitHub API routes
│   └── useScrollReveal.ts      # IntersectionObserver hook
├── lib/
│   └── github.ts               # GitHub client, BLS_META, PINNED_REPOS
├── styles/
│   ├── globals.css             # CSS variables (dark/light themes)
│   └── hud.module.css          # Clip-path, glitch, scan, HUD effects
├── types/
│   ├── github.ts               # GitHub API types
│   └── chat.ts                 # ChatMessage interface
├── bls-chat-worker.js          # Cloudflare Worker source (deploy manually)
├── .env.local.example          # Environment variable template
├── vercel.json                 # Vercel config, lhr1 region, security headers
└── README.md                   # This file
```

---

## Cloudflare Worker (AI Chat)

The chat widget is powered by a standalone Cloudflare Worker.

**Worker URL:** https://empty-fire-57ca-bls-chat-worker.ferencz-mihai9.workers.dev

**Source file:** bls-chat-worker.js (in repo root)

**To update the Worker:**
1. Edit bls-chat-worker.js locally
2. Go to dash.cloudflare.com → Workers & Pages → empty-fire-57ca-bls-chat-worker
3. Edit code → paste updated content → Deploy

**Worker secrets (set in Cloudflare dashboard):**
- GROQ_API_KEY — Groq API key (console.groq.com, free tier)

**Model:** llama-3.1-8b-instant via Groq (free, no card required)

**CORS allowed origins:**
- https://bluelayersystems.com
- http://localhost:3000
- http://localhost:3001

---

## Environment Variables

Copy .env.local.example to .env.local for local development.

| Variable | Required | Default | Description |
|---|---|---|---|
| GITHUB_USERNAME | No | CalmAfterReboot | GitHub username for API calls |
| GITHUB_TOKEN | No | — | PAT for higher rate limits (5000/hr vs 60/hr) |
| NEXT_PUBLIC_SITE_URL | No | https://bluelayersystems.com | Canonical URL for SEO/OpenGraph |
| NEXT_PUBLIC_CONTACT_EMAIL | No | — | mailto target for SEND TRANSMISSION button |

**Note:** The AI chat API key (GROQ_API_KEY) lives in Cloudflare Worker
secrets — never in this repo or Vercel env vars.

---

## Local Development

```bash
git clone https://github.com/CalmAfterReboot/BLS-Website
cd BLS-Website
npm install
cp .env.local.example .env.local
npm run dev
# → http://localhost:3000
```

The AI chat widget works on localhost — the Cloudflare Worker
explicitly allows localhost:3000 and localhost:3001.

```bash
npm run build       # production build
npm run lint        # ESLint
npm run type-check  # TypeScript check
```

---

## Deployment

**Automatic:** Every push to main branch triggers a Vercel deployment.

**Manual:**
```bash
git add .
git commit -m "your message"
git push origin main
# Vercel auto-deploys in ~60 seconds
```

**First time setup:**
```bash
npm i -g vercel
vercel        # follow prompts, connect GitHub repo
vercel --prod # deploy to production
```

---

## DNS Configuration (Cloudflare)

| Type | Name | Content | Proxy |
|---|---|---|---|
| TXT | _vercel | vc-domain-verify=... | DNS only |
| CNAME | @ | 0a0236d134052a4f.vercel-dns-017.com | DNS only (grey cloud) |
| CNAME | www | cname.vercel-dns.com | DNS only (grey cloud) |
| MX | @ | mx00.ionos.co.uk / mx01.ionos.co.uk | DNS only |
| TXT | @ | v=spf1 include:_spf-eu.ionos.com ~all | DNS only |

**Critical:** Cloudflare proxy must be OFF (grey cloud) for the root
domain and www — Vercel handles SSL. Email records (MX, SPF) are
untouched.

---

## Theme System

Two full themes via CSS variables on `[data-theme="dark|light"]`:

**Dark mode:** #07070D background, #00CC6A accent green  
**Light mode:** #F2F0E8 background (military off-white), #1A6B34 accent

Theme persists in localStorage as `bls-theme`. Anti-flash inline
script in app/layout.tsx reads theme before first paint.

---

## Adding Content

| Goal | File to edit |
|---|---|
| Bio / timeline / skills | components/sections/*.tsx |
| Pinned repos / descriptions | lib/github.ts — BLS_META, PINNED_REPOS_ORDER |
| AI assistant persona | bls-chat-worker.js — SYSTEM_PROMPT, then redeploy Worker |
| SEO metadata | app/layout.tsx — metadata export |
| Colour tokens | styles/globals.css |
| HUD effects | styles/hud.module.css |

---

## Cert Roadmap

- AZ-104 — ✅ Passed
- Terraform Associate — 🔄 In Progress
- AZ-400 — 📋 Planned
- AZ-305 — 📋 Planned

---

## BLS Portfolio Projects (GitHub)

| Repo | Status | Description |
|---|---|---|
| BLS-Website | ✅ Live | This portfolio site |
| bls-azure-landing-zone | 🔄 Building | Terraform, GitHub Actions, Checkov |
| bls-aks-platform | 📋 Planned | AKS, ArgoCD, Helm, GitOps |
| bls-cicd-pipeline | 📋 Planned | GitHub Actions, security scanning |
| bls-observability-stack | 📋 Planned | Prometheus, Grafana, Loki |
| bls-policy-governance | 📋 Planned | OPA, Azure Policy |
| bls-ai-gateway | 📋 Planned | LiteLLM, FastAPI, Redis |
| homelab-infrastructure | 🔄 Active | Proxmox, pfSense, k3s, VLANs |
