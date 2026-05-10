# ARCHITECTURE — Blue Layer Systems Portfolio

Technical architecture reference: system design, data flows,
component hierarchy, API contracts, and technology rationale.

---

## System Overview

```
Browser (client)
│
├── bluelayersystems.com
│   └── Cloudflare DNS (proxy OFF) → Vercel Edge Network
│       └── Next.js 14 App Router (Vercel, region: lhr1)
│           │
│           ├── SSR: app/layout.tsx + app/page.tsx
│           │   └── Static shell + hydrated sections
│           │
│           ├── API Routes (server-side)
│           │   ├── GET /api/github/repos        → github.com REST API
│           │   ├── GET /api/github/activity     → github.com REST API
│           │   └── GET /api/github/deployments  → github.com REST API
│           │
│           └── ChatWidget (client component, dynamic import)
│               └── POST → Cloudflare Worker (bls-chat-worker)
│                   └── POST → api.groq.com (llama-3.1-8b-instant)
```

---

## Next.js App Router Structure

The application uses the Next.js 14 App Router with a single root layout
and a single home route.

### Root Layout (`app/layout.tsx`)

Responsibilities:
- Sets `<html lang="en">` with `data-theme` injected by inline anti-flash script
- Loads Google Fonts (Rajdhani + Share Tech Mono) via `next/font`
- Exports `metadata` (title, description, OG tags, canonical URL)
- Wraps content in `AppProviders` (theme + page transition contexts)
- Mounts fixed global UI: `ScanOverlay`, `CustomCursor`, `Navbar`, `TechMarquee`
- Dynamically imports `ChatWidget` with `{ ssr: false }` to prevent hydration issues

### Home Page (`app/page.tsx`)

Renders five sections in order:
1. `<Hero />` — boot animation, typewriter, live git feed
2. `<About />` — bio, stats, experience timeline
3. `<Projects />` — live GitHub repo cards
4. `<Skills />` — skill progress bars, cert roadmap
5. `<Contact />` — contact nodes, targeting roles, email CTA

Footer: copyright, version stamp.

---

## Component Hierarchy

```
AppProviders
├── ThemeProvider         (useTheme context)
└── PageTransitionProvider (usePageTransition context)
    │
    ├── ScanOverlay        (fixed, full-viewport, pointer-events: none)
    ├── CustomCursor       (fixed, desktop only)
    ├── Navbar             (fixed top, z-50)
    │   └── ThemeToggle
    ├── TechMarquee        (fixed bottom, infinite scroll)
    ├── ChatWidget         (fixed bottom-right, dynamic import)
    │
    └── main (page content)
        ├── Hero
        │   └── HudPanel, GlitchText, StatusBadge
        ├── About
        │   └── HudPanel, SectionHeader, Tag
        ├── Projects
        │   └── HudPanel, StatusBadge, Tag, ProgressBar
        ├── Skills
        │   └── HudPanel, SectionHeader, ProgressBar, Tag
        └── Contact
            └── HudPanel, SectionHeader, StatusBadge, Tag
```

---

## API Routes

All three routes follow the same pattern:
- Server-side Next.js route handlers (no client exposure of tokens)
- 60-second `Cache-Control: max-age=60, stale-while-revalidate=300`
- Graceful error handling: returns 502 with `{ error: string }` on GitHub failure
- Token read from `process.env.GITHUB_TOKEN` (optional; falls back to unauthenticated)

### GET /api/github/repos

1. Calls `fetchUserRepos()` — GitHub `/users/{username}/repos?per_page=100`
2. Filters out forks
3. Calls `sortAndEnrichRepos()`:
   - Repos in `PINNED_REPOS_ORDER` appear first, in that order
   - Remaining repos sorted by `stargazers_count` descending
   - Each repo merged with `BLS_META[repo.name]` if present
4. Returns `{ repos: ProcessedRepo[], total: number }`

### GET /api/github/activity

1. Calls `fetchUserActivity()` — GitHub `/users/{username}/events?per_page=30`
2. Filters to: `PushEvent`, `CreateEvent`, `PullRequestEvent`, `ReleaseEvent`
3. Returns last 10 matching events as `ActivityResponse`

### GET /api/github/deployments

1. Iterates `WATCHED_REPOS` in parallel (`Promise.all`)
2. Each repo: GitHub `/repos/{owner}/{repo}/deployments?per_page=1`
   then `/repos/{owner}/{repo}/deployments/{id}/statuses?per_page=1`
3. Returns `{ deployments: Record<repoName, DeploymentState> }`

---

## Data Fetching (Client Side)

`hooks/useGitHub.ts` wraps all three routes with SWR:

```typescript
useRepos()       → useSWR('/api/github/repos',       fetcher, { refreshInterval: 300000 })
useActivity()    → useSWR('/api/github/activity',    fetcher, { refreshInterval: 300000 })
useDeployments() → useSWR('/api/github/deployments', fetcher, { refreshInterval: 300000 })
```

Poll interval: 300,000ms (5 minutes). On initial mount, SWR uses the
cached response and revalidates in the background.

---

## State Management

No global state library. Three mechanisms:

| Mechanism | Scope | Used for |
|---|---|---|
| React Context | App-wide | Theme, page transitions |
| SWR cache | Client session | GitHub API data |
| localStorage | Persistent | Theme preference (`bls-theme`) |

All section components receive GitHub data via the SWR hooks. No prop
drilling — hooks are called directly inside the sections that need them.

---

## Theme Architecture

CSS custom properties on `<html data-theme="dark|light">`:

```css
[data-theme="dark"]  { --bg: #07070D; --accent: #00CC6A; ... }
[data-theme="light"] { --bg: #F2F0E8; --accent: #1A6B34; ... }
```

`useTheme` hook:
- Reads `localStorage.getItem('bls-theme')` on mount
- Writes `document.documentElement.dataset.theme` on toggle
- Persists choice to `localStorage`

Anti-flash: an inline `<script>` in `app/layout.tsx` runs synchronously
before first paint and sets `data-theme` from `localStorage` (or defaults
to `'dark'`), preventing FOUC.

Tailwind classes reference the same CSS variables via `tailwind.config.ts`:
```typescript
colors: {
  bg: 'var(--bg)',
  accent: 'var(--accent)',
  // ...
}
```

---

## Animation Architecture

Three animation layers coexist:

### 1. Framer Motion
Used for entrance animations, scroll parallax, and staggered reveals:
- `Hero.tsx` — `useScroll` + `useTransform` for name parallax
- `About.tsx`, `Skills.tsx`, `Contact.tsx` — `motion.div` with `whileInView`
- `Projects.tsx` — staggered grid entrance

### 2. CSS Animations (`hud.module.css`)
Used for continuous effects that don't need JavaScript timing:
- Scan beam sweep (14s linear loop)
- Pulsing status dots (CSS `@keyframes pulse`)
- Glitch text offset (steps timing function)
- Progress bar fill (CSS transition on width)
- Boot sequence fade-in (staggered `animation-delay`)

### 3. IntersectionObserver (`useScrollReveal.ts`)
Adds `.revealed` class to elements when 12% visible in viewport.
Used for sections that use pure CSS transitions rather than Framer Motion.

---

## AI Chat Widget Architecture

```
ChatWidget (React state: messages[], inputValue, isLoading)
│
└── handleSend()
    ├── Build updatedMessages = [...messages, newUserMsg]
    ├── setMessages(updatedMessages)          // update UI immediately
    └── fetch(WORKER_URL, { method: 'POST', body: JSON.stringify({ messages }) })
        └── Cloudflare Worker
            ├── Validates Origin header (CORS)
            ├── Adds system prompt
            └── POST → api.groq.com/openai/v1/chat/completions
                └── { model: 'llama-3.1-8b-instant', messages: [...] }
```

The ChatWidget is loaded with `next/dynamic` and `{ ssr: false }` to
avoid hydration mismatch (the widget uses `useState` with `localStorage`
for message history).

---

## Styling Architecture

Two parallel styling systems work together:

### Tailwind CSS
Used for layout, spacing, responsive breakpoints, and theme-aware colour
classes. All colour classes reference CSS variables (not hardcoded values),
so they automatically switch with the theme.

Custom breakpoints:
- `xs`: 360px
- `sm`: 480px
- `md`: 768px
- `lg`: 1024px

### CSS Modules (`hud.module.css`)
Used for complex effects that require multi-step keyframes, clip-paths,
and pseudo-element tricks not expressible in Tailwind:
- `clip-path` polygon for clipped-corner panels (14px and 24px variants)
- Glitch effect using `::before`/`::after` with `steps()` timing
- Scan-line overlay using `repeating-linear-gradient`
- Sweep beam using `@keyframes sweep` with `transform: translateY`

Components import both: Tailwind classes for layout, CSS module classes
for HUD-specific visual effects.

---

## TypeScript Architecture

Strict mode enabled. Key types in `types/`:

```typescript
// types/github.ts
interface GitHubRepo { id, name, description, html_url, language,
                       stargazers_count, forks_count, topics, ... }
interface ProcessedRepo extends GitHubRepo { blsDescription?, phase? }
type DeploymentState = 'success' | 'pending' | 'failure' | 'inactive' | 'unknown'

// types/chat.ts
interface ChatMessage { role: 'user' | 'assistant', content: string, ts: Date }
```

API route handlers return typed response shapes (`ReposResponse`,
`ActivityResponse`, `DeploymentsResponse`) matching what `useGitHub.ts`
expects from SWR.

---

## Security Architecture

### Headers (vercel.json)
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

### Secret isolation
- `GROQ_API_KEY` lives only in Cloudflare Worker secrets
- `GITHUB_TOKEN` (optional) lives only in Vercel environment variables
- No secrets are bundled into the client JavaScript

### CORS on Cloudflare Worker
Origin allowlist enforced in Worker: only `bluelayersystems.com`,
`localhost:3000`, and `localhost:3001` may send requests to the chat
endpoint. All other origins receive 403.

---

## Performance Considerations

- **Fonts:** loaded via `next/font/google` — self-hosted by Next.js,
  no third-party font request from the browser
- **SWR:** client-side data fetching with background revalidation;
  initial page load is never blocked by GitHub API latency
- **Dynamic import:** `ChatWidget` loaded only after hydration (no impact
  on LCP or TTI for users who don't open chat)
- **Vercel region:** `lhr1` (London) — closest to the primary target
  audience (UK job market)
- **Cache headers:** all GitHub API routes cached 60s on Vercel Edge,
  SWR serves stale data for up to 300s before background refetch
