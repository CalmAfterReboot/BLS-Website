# Blue Layer Systems — Portfolio (BLS)

Production portfolio for **Mihai** / **Blue Layer Systems** — a cyberpunk HUD–style marketing site built with **Next.js 14 (App Router)** and deployed to **Vercel** (`bluelayersystems.com`).

This README is a **map of the codebase**: where things live, what they do, and how they connect.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Tech stack](#tech-stack)
3. [Repository layout (top level)](#repository-layout-top-level)
4. [App Router (`app/`)](#app-router-app)
5. [Components (`components/`)](#components-components)
6. [Hooks (`hooks/`)](#hooks-hooks)
7. [Styles (`styles/`)](#styles-styles)
8. [Library & types (`lib/`, `types/`)](#library--types-lib-types)
9. [Configuration files](#configuration-files)
10. [Environment variables](#environment-variables)
11. [Data flow: GitHub](#data-flow-github)
12. [Theming & UX behaviors](#theming--ux-behaviors)

---

## Quick start

```bash
npm install
cp .env.local.example .env.local   # optional; edit values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build
npm run start    # run production server locally
npm run lint     # ESLint (Next.js config)
```

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js 14, App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS Modules (`styles/hud.module.css`) |
| Animation | Framer Motion |
| Client data | SWR (GitHub JSON from your own API routes) |
| Fonts | `next/font/google` — **Rajdhani** (display), **Share Tech Mono** (mono) |
| Hosting | Vercel (`vercel.json`: `lhr1`, security headers) |

---

## Repository layout (top level)

```
bls-siteV2/
├── app/                    # Next.js App Router: pages, layout, API routes
├── components/             # React UI: layout, sections, primitives, providers
├── hooks/                  # Client hooks: theme, transitions, SWR, scroll reveal
├── lib/                    # Server-side GitHub client + pinned repo metadata
├── styles/                 # Global CSS variables + HUD CSS Modules
├── types/                  # Shared TypeScript types (GitHub DTOs)
├── public/                 # (optional) static assets — add if you use images/favicons
├── .env.local.example      # Documented env vars (copy to .env.local)
├── .eslintrc.json          # eslint-config-next
├── next.config.js          # Next.js config
├── postcss.config.js       # PostCSS (Tailwind)
├── tailwind.config.ts      # Tailwind content paths + design tokens → utilities
├── tsconfig.json           # Strict TS + `@/*` path alias → repo root
├── vercel.json             # Vercel framework, region, HTTP security headers
├── package.json            # Scripts + dependencies
└── README.md               # This file
```

Generated / local-only (do not treat as “source docs”): `.next/`, `node_modules/`, `.env*.local`.

---

## App Router (`app/`)

| Path | Role |
|------|------|
| **`app/layout.tsx`** | Root layout: **SEO metadata** (title, description, keywords, Open Graph, robots), **Google fonts** (CSS variables `--font-display`, `--font-mono`), **global stylesheet** import (`@/styles/globals.css`), **inline theme bootstrap script** in `<head>` (reads `bls-theme` from `localStorage` before paint), **shell UI** (`ScanOverlay`, `CustomCursor`, `Navbar`, `TechMarquee`) and **`AppProviders`** wrapper. |
| **`app/page.tsx`** | Home page: composes section components in order (**Hero → About → Projects → Skills → Contact**) plus a small **footer**. |

### API route handlers (`app/api/github/`)

All three are **Route Handlers** (`GET`). They run **on the server**, call GitHub via **`lib/github.ts`**, and return JSON. They set **`Cache-Control: s-maxage=60, stale-while-revalidate=300`** and use **`export const dynamic = "force-dynamic"`** so responses are not frozen at build time.

| Path | Purpose |
|------|---------|
| **`app/api/github/repos/route.ts`** | Public repos for the configured user; **forks removed**; **pinned BLS list first**, then others by recency; enriched with **`BLS_META`** (phase label + long description). |
| **`app/api/github/activity/route.ts`** | Recent **public** events; filtered to push/create/PR/release types; capped (e.g. last 10). |
| **`app/api/github/deployments/route.ts`** | For each **watched** repo name, fetches latest **deployment** + **status** (success / pending / failure, etc.). |

**Never** put `GITHUB_TOKEN` in client code — only in server env (see [Environment variables](#environment-variables)).

---

## Components (`components/`)

### `components/providers/`

| File | Role |
|------|------|
| **`AppProviders.tsx`** | Client wrapper: **`PageTransitionProvider`** (full-screen fade for nav + theme) outside **`ThemeProvider`** (theme state + `localStorage`). |

### `components/layout/`

| File | Role |
|------|------|
| **`Navbar.tsx`** | Sticky nav: **solid** `var(--nav-bg)`, blur, border, shadow; desktop links; **mobile ≤768px** hamburger + **drawer** + **scroll lock**; uses **`usePageTransition`** for in-page jumps. |
| **`ThemeToggle.tsx`** | Re-exports **`ThemeToggle`** from `components/ui/ThemeToggle.tsx` (single implementation). |

### `components/ui/` — HUD primitives

| File | Role |
|------|------|
| **`HudPanel.tsx`** | Clipped-corner panel; composes classes from **`styles/hud.module.css`** (`clipDefault` / `large` / `double`, header bar optional). |
| **`StatusBadge.tsx`** | Pulsing dot + mono label (green / amber / red). |
| **`GlitchText.tsx`** | Hover/focus glitch using `data-text` + CSS in **`hud.module.css`**. |
| **`ScanOverlay.tsx`** | Fixed scan-line + slow beam (global atmosphere). |
| **`Tag.tsx`** | Small mono uppercase tag. |
| **`ProgressBar.tsx`** | 2px track, animated fill + leading glow (driven by **`active`** + scroll reveal in **Skills**). |
| **`SectionHeader.tsx`** | Index + title + gradient line. |
| **`ThemeToggle.tsx`** | Clipped button; sun/moon; calls **`usePageTransition`** then **`toggleTheme`**. |
| **`CustomCursor.tsx`** | Dot + lagging ring (fine pointer only); toggles **`body.has-custom-cursor`**. |
| **`TechMarquee.tsx`** | Infinite horizontal ticker; **pauses on hover**. |

### `components/sections/` — Page sections (client components)

| File | Section id | Role |
|------|------------|------|
| **`Hero.tsx`** | `#hero` | Boot stagger, parallax name, typewriter roles, CTAs, **live GitHub push** widget (SWR → activity API). |
| **`About.tsx`** | `#about` | Bio panel, stats grid, experience timeline. |
| **`Projects.tsx`** | `#projects` | **SWR** repos + deployments; cards, skeletons, **`BLS_META`** phases; links to GitHub. |
| **`Skills.tsx`** | `#skills` | Four **HudPanel** skill groups + animated bars; certification row. |
| **`Contact.tsx`** | `#contact` | Contact nodes, targeting panel, **SEND TRANSMISSION** (`mailto` from env or fallback). |

---

## Hooks (`hooks/`)

| File | Role |
|------|------|
| **`useTheme.tsx`** | **`ThemeProvider`**, **`useTheme()`** — reads/writes **`bls-theme`** in `localStorage`, sets **`document.documentElement` `data-theme`**. (`.tsx` because the provider returns JSX.) |
| **`usePageTransition.tsx`** | **`PageTransitionProvider`**, **`usePageTransition()`** — **`runTransition(fn)`**: fade to opaque → run callback (scroll / theme) → fade out. |
| **`useGitHub.ts`** | **SWR** hooks: **`useGitHubRepos`**, **`useGitHubActivity`**, **`useGitHubDeployments`** — fetch `/api/github/*` with **~5 min** `refreshInterval`. |
| **`useScrollReveal.ts`** | **`useScrollReveal()`** — **`IntersectionObserver`** → **`ref`** + **`inView`** for Framer **`variants`** and skill bars. |

---

## Styles (`styles/`)

| File | Role |
|------|------|
| **`globals.css`** | Tailwind **`@tailwind` layers**; **`[data-theme="dark"]` / `[data-theme="light"]`** CSS variables (backgrounds, text, accent, borders, shadows); base **`body`** / links / focus / scrollbar; **`has-custom-cursor`** cursor reset. |
| **`hud.module.css`** | HUD-only visuals: **clip-path panels**, corner accent, **glitch**, **scan/beam**, **progress bar**, **section header**, **marquee**, **navbar/drawer/hamburger** (when used from **`Navbar.tsx`**), **boot** keyframes, etc. |

**Convention:** layout/spacing/utilities → **Tailwind**; clip-paths, glitch, scan lines, bespoke HUD chrome → **CSS Modules** (`hud.module.css`).

---

## Library & types (`lib/`, `types/`)

| Path | Role |
|------|------|
| **`lib/github.ts`** | **`GITHUB_USERNAME`**, **`PINNED_REPOS_ORDER`**, **`WATCHED_REPOS`**, **`BLS_META`**; **`githubHeaders()`** (optional bearer token + API version + `User-Agent`); **`fetchUserRepos`**, **`sortAndEnrichRepos`**, **`fetchUserActivity`**, **`fetchWatchedDeployments`**; **`cacheHeaders()`** for Route Handlers. |
| **`types/github.ts`** | **`GitHubRepo`**, **`ProcessedRepo`**, activity/deployment DTOs, API response shapes. |

---

## Configuration files

| File | Role |
|------|------|
| **`next.config.js`** | Next.js project config (`reactStrictMode`, etc.). |
| **`tailwind.config.ts`** | **`content`** globs for `app/`, `components/`, `hooks/`; **font families** bound to CSS variables; extended **colors** mapped to theme variables; breakpoints **`xs` / `sm` / `md` / `lg`**. |
| **`postcss.config.js`** | Tailwind + Autoprefixer. |
| **`tsconfig.json`** | **Strict** TypeScript; **`paths`: `@/*` → project root**. |
| **`.eslintrc.json`** | **`next/core-web-vitals`**. |
| **`vercel.json`** | **`framework`: `nextjs`**, **`regions`**: `lhr1`**, security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`). |

---

## Environment variables

Copy **`.env.local.example`** → **`.env.local`** (gitignored).

| Variable | Where used | Notes |
|----------|------------|--------|
| **`GITHUB_USERNAME`** | `lib/github.ts` | Defaults to `CalmAfterReboot` if unset. |
| **`GITHUB_TOKEN`** | `lib/github.ts` (server only) | Optional PAT; higher rate limits. **Never expose to the browser.** |
| **`NEXT_PUBLIC_SITE_URL`** | `app/layout.tsx` | Canonical site URL for **metadataBase** / Open Graph (default `https://bluelayersystems.com`). |
| **`NEXT_PUBLIC_CONTACT_EMAIL`** | `components/sections/Contact.tsx` | Optional; **`mailto:`** target for **SEND TRANSMISSION**. |

---

## Data flow: GitHub

```
Browser (SWR)
    → GET /api/github/repos | activity | deployments
        → lib/github.ts → https://api.github.com/...
        ← JSON (Cache-Control on response)
```

- **Server** does all GitHub HTTP; the client only talks to **your** `/api/github/*` routes.
- **Repo cards** merge **repos** + **deployments** by **repo name** in **`Projects.tsx`**.
- **Hero** uses **activity** to show the latest **push**-style event when available.

---

## Theming & UX behaviors

| Concern | Where it lives |
|---------|----------------|
| **Flash of wrong theme** | Inline script in **`app/layout.tsx` `<head>`** + **`data-theme`** on `<html>`. |
| **React theme state** | **`hooks/useTheme.tsx`** + **`AppProviders`**. |
| **Nav / theme flash overlay** | **`hooks/usePageTransition.tsx`** (Framer **motion** full-screen layer, `z-index` above content). |
| **Custom cursor** | **`components/ui/CustomCursor.tsx`** + **`globals.css`** (`body.has-custom-cursor { cursor: none }`) for fine pointers only. |
| **Section scroll targets** | Section **`id`s**: **`hero`**, **`about`**, **`projects`**, **`skills`**, **`contact`** — used by **`Navbar`** and hero CTAs. |

---

## Adding or changing content

| Goal | Start here |
|------|------------|
| **Copy / bio / timeline / skills / certs** | `components/sections/*.tsx` |
| **Pinned repos, descriptions, phases** | `lib/github.ts` — **`PINNED_REPOS_ORDER`**, **`BLS_META`**, **`WATCHED_REPOS`** |
| **SEO** | `app/layout.tsx` — **`metadata`** export |
| **Colours / typography tokens** | `styles/globals.css` (variables), `tailwind.config.ts` (Tailwind aliases) |
| **HUD chrome (panels, glitch, nav)** | `styles/hud.module.css` + relevant `components/ui/*` |

---

## License / branding

Site content and design are for **Blue Layer Systems** / **Mihai**. Dependencies remain under their respective licenses (`package.json` / `node_modules`).

If you want this README to include **screenshots**, **architecture diagrams**, or **runbooks** (e.g. Cloudflare DNS steps), say what to add and where it should live.
