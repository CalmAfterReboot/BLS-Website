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

- AZ-900 — ✅ Passed
- AZ-104 — ✅ Passed
- Terraform Associate — 🔄 In Progress
- AZ-400 — 📋 Planned
- AZ-305 — 📋 Planned

---

## BLS Portfolio Projects (GitHub)

| Repo | Status | Description |
|---|---|---|
| [BLS-Website](https://github.com/CalmAfterReboot/BLS-Website) | ✅ Live | This portfolio site |
| [azure-landing-zone](https://github.com/CalmAfterReboot/azure-landing-zone) | 🔄 Building | Terraform, GitHub Actions, Checkov, Infracost |
| [aks-platform](https://github.com/CalmAfterReboot/aks-platform) | 📋 Planned | AKS, Helm, RBAC, GitHub Actions CI/CD |
| [litellm-gateway](https://github.com/CalmAfterReboot/litellm-gateway) | 🔄 Active | Self-hosted LiteLLM on Proxmox, Ollama, Cloudflare tunnel |

---

## Known Issues & Resolutions

### 1. Cloudflare Worker — Syntax Error on Deployment
**Issue:** Worker failed to deploy with syntax error on line 1.
Content from two separate lines had been merged into a single constant
declaration during editing in the Cloudflare dashboard.

**Resolution:** Rewrote the full worker.js file from scratch with correct
syntax. The ALLOWED_ORIGIN constant and the corsHeaders function body
must remain on separate lines.

**Prevention:** Never edit worker code directly in the Cloudflare
dashboard inline editor for multi-line changes. Use a local file and
paste the complete content.

---

### 2. Cloudflare Worker — Upstream Error (OpenRouter)
**Issue:** Worker deployed successfully but returned
`{"error":"Upstream error"}` on all requests.

**Root cause:** The target AI model (`deepseek/deepseek-chat-v3-0324:free`)
required a verified payment method on OpenRouter even for the free tier.
No card was available.

**Resolution:** Switched to Groq API (console.groq.com) with model
`llama-3.1-8b-instant`. Groq free tier requires no payment method.
Updated worker constants:
- `API_URL` → `https://api.groq.com/openai/v1/chat/completions`
- `MODEL` → `llama-3.1-8b-instant`
- `env.OPENROUTER_API_KEY` → `env.GROQ_API_KEY`

**Secret name in Cloudflare:** `GROQ_API_KEY` (set via Worker Settings →
Variables and Secrets)

---

### 3. Chat Widget — 400 Error (Stale React State)
**Issue:** ChatWidget.tsx sent POST requests to the Worker but received
400 responses. Network tab showed Content-Length of only 15 bytes.

**Root cause:** Classic React stale closure bug. The fetch call was
reading the messages array before the new user message had been committed
to state via useState. The array sent to the Worker was empty or missing
the latest message.

**Resolution:** Build the updated messages array before calling setState,
then use the same array reference for both the state update and the
fetch payload:

```typescript
const updatedMessages = [...messages, { role: 'user', content: inputValue, ts: new Date() }]
setMessages(updatedMessages)
const payload = {
  messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
}
```

---

### 4. Cloudflare Pages — Failed Build (Wrong Hosting Target)
**Issue:** `bls-portfolio` project on Cloudflare Pages showed
"Latest build failed" repeatedly.

**Root cause:** The project was incorrectly configured to deploy to
Cloudflare Pages. The correct hosting target for this Next.js site
is Vercel, not Cloudflare Pages.

**Resolution:** Ignored the Cloudflare Pages project entirely.
Deployed to Vercel instead. Cloudflare is used for DNS only
(proxy disabled — grey cloud).

---

### 5. Vercel Domain — 403 Forbidden
**Issue:** Site deployed successfully to Vercel but returned
403 Forbidden when accessed via browser.

**Root cause:** Vercel Deployment Protection was enabled by default,
blocking public access.

**Resolution:** Vercel dashboard → Project Settings →
Deployment Protection → Disabled.

---

### 6. Vercel Auto-Deploy Not Triggering
**Issue:** Pushing to GitHub main branch did not trigger automatic
Vercel deployments. Manual `vercel --prod` was required each time.

**Root cause:** The GitHub repository was not properly connected to
the Vercel project via webhook at initial setup.

**Resolution:** Vercel dashboard → Project Settings → Git →
Connected Git Repository → reconnected `CalmAfterReboot/BLS-Website`.
After reconnection, all subsequent pushes to main trigger automatic
deployment within 60 seconds.

---

### 7. Cloudflare DNS — Invalid Configuration on Custom Domain
**Issue:** Vercel showed "Invalid Configuration" for
`bluelayersystems.com` after adding the domain.

**Root cause:** Existing CNAME record for root domain was set to
Cloudflare Pages endpoint with proxy enabled (orange cloud).
Vercel requires DNS-only (grey cloud) and its own CNAME target.

**Resolution:**
- Deleted old CNAME pointing to Cloudflare Pages
- Added new CNAME: `@` → `[VERCEL_DNS_TARGET]` (DNS only)
- Added TXT: `_vercel` → `[VERCEL_VERIFICATION_TOKEN]` (DNS only)
- Kept all MX and SPF records untouched (email unaffected)

**Note:** Cloudflare proxy (orange cloud) must remain OFF for root
domain and www — Vercel handles SSL termination.

---

### 8. AI Assistant — Terminal-Style Rejection Responses
**Issue:** The Groq/Llama model responded to short or unclear inputs
with CLI-style rejection messages ("UNKNOWN COMMAND",
"COMMAND NOT RECOGNIZED") despite the portfolio context.

**Root cause:** The system prompt instructed a "terminal-style tone"
which the model interpreted as literal terminal/CLI behaviour.

**Resolution:** Updated SYSTEM_PROMPT in `bls-chat-worker.js` to
explicitly prohibit CLI rejection phrases and clarify the assistant
is conversational, not a command interpreter. Added:
"Never say UNKNOWN COMMAND. Always respond in plain sentences."

---

### 9. Hero Section — Excess Gap Below Navbar
**Issue:** Large blank space (~150px) appeared between the ticker bar
and hero content on initial page load.

**Root cause:** Multiple padding-top values were added across
`Hero.tsx`, `app/layout.tsx`, and section components during
iterative scroll-offset fixes, compounding the spacing.

**Resolution:** Audited all padding/margin changes with
`git diff HEAD~4`, removed all accumulated padding from layout
wrapper and section components, keeping only the scroll offset
correction in `Navbar.tsx` (`scrollToSection` subtracts navbar
height from `getBoundingClientRect().top + window.scrollY`).
