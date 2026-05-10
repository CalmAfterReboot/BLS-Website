# EXPLAINER — Blue Layer Systems Portfolio

Plain-language guide to what this site is, what each part does,
and how to update or maintain it.

---

## What Is This Site?

**bluelayersystems.com** is the professional portfolio of Mihai Ferencz
— a cloud and DevOps engineer based in the UK. It serves as a live CV
and project showcase, styled as a futuristic computer terminal (cyberpunk
HUD aesthetic) with dark and light themes.

The site is publicly accessible and used when applying for cloud engineering,
platform engineering, and DevOps roles. It is targeted at recruiters and
hiring teams in the UK market.

---

## What Each Section Shows

### Hero
The first thing visitors see. An animated boot sequence plays, then the
site types out different job titles (Cloud Engineer, DevOps Engineer, etc.).
A live feed of recent GitHub commits and pull requests scrolls in the
background, showing that the engineering work is real and ongoing.

### About
Background section. Shows:
- A short bio paragraph (who Mihai is, what he specialises in)
- Four stat cards: years of experience, certifications held, tools mastered,
  and home lab active status
- An employment timeline listing previous roles with dates and descriptions

### Projects
A grid of engineering projects pulled live from GitHub. Each card shows:
- Project name and description
- Primary programming language
- Star count
- A status badge showing whether the latest deployment succeeded, is
  pending, or has failed
- A direct link to the GitHub repository

Projects are ordered with the most important ones pinned to the top.
The descriptions shown are custom (more informative than GitHub's defaults).

### Skills
Two parts:
1. Skill progress bars grouped into four categories:
   Cloud Infrastructure, CI/CD & Automation, Networking & Security,
   and Observability & Monitoring
2. A certification roadmap showing which certs have been completed,
   which are in progress, and which are planned next

### Contact
Shows contact methods and tells visitors what kind of roles and salary
range Mihai is targeting. The main action is a "SEND TRANSMISSION"
button that opens a pre-addressed email.

---

## The AI Chat Widget

A chat button in the bottom-right corner opens an AI assistant that can
answer questions about Mihai's background, experience, and projects.
The assistant uses Llama 3.1 (hosted on Groq's free tier) and is
instructed to respond in the voice of a BLS systems assistant.

To update the AI assistant's personality or knowledge, edit the
`SYSTEM_PROMPT` in `bls-chat-worker.js` and redeploy the Cloudflare Worker.

---

## How Live Data Works

The Projects section and Hero feed are not hardcoded. They call the
GitHub API every 5 minutes and display real data:

- Projects come from the public GitHub account `CalmAfterReboot`
- The order and descriptions are controlled in `lib/github.ts`
- Deployment status badges show the real last-deployment result from
  GitHub's deployments API

This means the site stays current automatically as new projects are
created and pushed.

---

## Themes

The site has a dark mode (deep black background, neon green) and a
light mode (off-white military background, dark green). The toggle
is in the top-right corner of the navigation bar. The chosen theme
is remembered between visits.

---

## Navigation

The top navigation bar links to each of the five sections. On mobile,
this collapses into a hamburger menu that opens a slide-in drawer.
Clicking a nav link smoothly scrolls to that section.

---

## How to Update Content

You do not need to be a developer to make most content changes, but
you do need to edit source files and push them to GitHub (which
triggers an automatic deployment).

| What to change | Where |
|---|---|
| Bio paragraph | `components/sections/About.tsx` |
| Employment history | `components/sections/About.tsx` |
| Stat cards (years exp, certs, etc.) | `components/sections/About.tsx` |
| Skill bars and levels | `components/sections/Skills.tsx` |
| Cert roadmap status | `components/sections/Skills.tsx` |
| Contact roles and salary range | `components/sections/Contact.tsx` |
| Which GitHub projects appear (and in what order) | `lib/github.ts` — `PINNED_REPOS_ORDER` |
| Custom project descriptions | `lib/github.ts` — `BLS_META` |
| AI chat persona and knowledge | `bls-chat-worker.js` — `SYSTEM_PROMPT` (then redeploy Worker) |
| Page title and SEO description | `app/layout.tsx` — `metadata` export |

After editing any source file, commit and push to the `main` branch.
The site redeploys automatically in about 60 seconds.

---

## How Deployment Works

The site is hosted on **Vercel**. DNS is managed through **Cloudflare**
(in DNS-only mode — Cloudflare is not acting as a CDN or proxy here).

Every time code is pushed to the `main` branch on GitHub, Vercel
automatically detects the change, builds the site, and deploys it.
No manual action is needed for routine content updates.

The AI chat function runs as a separate small program on
**Cloudflare Workers** — it is not part of the Vercel deployment and
must be updated separately via the Cloudflare dashboard.

---

## Who Maintains This

**Mihai Ferencz** (`CalmAfterReboot` on GitHub)  
Email: `ferencz.mihai9@gmail.com`  
GitHub: `github.com/CalmAfterReboot`

The site is a personal project built and maintained by Mihai as a live
demonstration of cloud and web engineering skills.
