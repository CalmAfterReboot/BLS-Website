# Blue Layer Systems — Portfolio (BLS)

Production portfolio for Mihai Gabriel Ferencz / Blue Layer Systems. A
military / tactical-aesthetic engineering portfolio built with Next.js 14
(App Router) and deployed to Vercel.

The site doubles as the home for the **Estate Audit Viewer** — a
browser-side tool for rendering JSON output from the BLS Estate Discovery
PowerShell collectors.

Repository: github.com/CalmAfterReboot/BLS-Website

---

## Live URLs
- Production: https://bluelayersystems.com
- www: https://www.bluelayersystems.com

---

## Tech Stack

| Layer            | Technology                                          |
|------------------|-----------------------------------------------------|
| Framework        | Next.js 14 App Router                               |
| Language         | TypeScript (strict)                                 |
| Styling          | Tailwind CSS                                        |
| Typography       | Inter (sans), JetBrains Mono (mono)                 |
| Animation        | Framer Motion (used sparingly)                      |
| 3D effects       | three / @react-three (GalaxyCursor only)            |
| Client data      | SWR                                                 |
| Icons            | lucide-react                                        |
| Markdown         | react-markdown + remark-gfm                         |
| Hosting          | Vercel (lhr1 region)                                |
| AI Chat          | Cloudflare Worker → Groq llama-3.1-8b-instant       |

---

## Routes

| Path                                    | Description                              |
|-----------------------------------------|------------------------------------------|
| `/`                                     | Landing: Hero → Projects → Tools → Case Studies → Contact |
| `/cv`                                   | CV page (unchanged by this refactor)     |
| `/tools`                                | Index of internal tools                  |
| `/tools/audit-viewer`                   | Estate Audit Viewer (drag-and-drop JSON) |
| `/case-studies`                         | Index of case studies                    |
| `/case-studies/[slug]`                  | Individual case study (markdown)         |
| `/api/contact`                          | Contact form endpoint                    |
| `/api/projects`                         | Project data feed                        |

---

## Local Development

```bash
git clone https://github.com/CalmAfterReboot/BLS-Website
cd BLS-Website
npm install
npm run dev
# → http://localhost:3000
```

```bash
npm run build       # production build
npm run lint        # ESLint
npx tsc --noEmit    # TypeScript check
```

---

## Design System

The site uses a single tactical / military palette. See
[tailwind.config.ts](./tailwind.config.ts) for the canonical tokens.

| Token                  | Hex      | Use                                |
|------------------------|----------|------------------------------------|
| `base`                 | `#0a0a0b`| Page background                    |
| `surface`              | `#14151a`| Card / panel background            |
| `surface-2`            | `#1c1e26`| Raised elements, code blocks       |
| `border`               | `#2a2d3a`| 1px dividers                       |
| `text` / `text-dim` / `text-mute` | bone tones | Foreground hierarchy   |
| `accent-olive`         | `#7a8450`| Primary accent — links, focus      |
| `accent-amber`         | `#c08a3e`| Warnings                           |
| `accent-rust`          | `#a14b3a`| Blockers / destructive             |
| `accent-steel`         | `#4a5568`| Informational                      |
| `status-{blocker,warning,info,ok}` | semantic aliases | Findings + badges |

Component shape: hard edges (`rounded-none`/`rounded-sm`), thin 1px
borders, no glow / shadow / glassmorphism. Section headers are styled as
classification banners with monospace labels (e.g. `// PROJECTS — BLS PORTFOLIO`).

---

## Adding a Case Study

1. Create a new markdown file in [content/case-studies/](./content/case-studies/).
   Filenames are numbered for chronological ordering on disk:

   ```
   content/case-studies/03-your-new-study.md
   ```

2. Map the filename to a short URL slug in
   [src/lib/case-studies.ts](./src/lib/case-studies.ts) by adding an entry
   to `FILE_TO_SLUG`:

   ```ts
   "03-your-new-study.md": "your-new-study",
   ```

3. The case study will then appear at `/case-studies/your-new-study` and
   in both the index page and the home-page section. The first `# Heading`
   becomes the title; the first non-heading paragraph becomes the intro.

Markdown rendering goes through
[src/components/case-studies/MarkdownView.tsx](./src/components/case-studies/MarkdownView.tsx)
— tweak typography there.

---

## Extending the Audit Viewer

The viewer (`/tools/audit-viewer`) renders JSON produced by two PowerShell
collectors in [public/tools/audit-viewer/](./public/tools/audit-viewer/).
Everything runs in the browser — no upload, no persistence.

### Adding a new finding type

Findings are emitted by `Add-Finding` calls inside the workload-profile
collector. Each finding has the shape:

```ts
{ Severity: "BLOCKER" | "WARN" | "INFO", Category: string, Message: string, Evidence?: unknown }
```

To add a new finding type, edit
[public/tools/audit-viewer/collect-workload-profile.ps1](./public/tools/audit-viewer/collect-workload-profile.ps1)
and call `Add-Finding` with a new `Category` string. The viewer
auto-renders any category — no client-side change needed.

### Supporting a new collector JSON shape

1. Add the collector name to the `CollectorName` union in
   [src/types/audit-viewer.ts](./src/types/audit-viewer.ts).
2. Extend `classifyDoc` in
   [src/lib/audit-viewer/parse.ts](./src/lib/audit-viewer/parse.ts) to
   recognise the new `Metadata.CollectorName` value.
3. Add a panel component alongside the existing `InventoryPanel` /
   `WorkloadPanel` in
   [src/components/tools/audit-viewer/](./src/components/tools/audit-viewer/)
   and render it from `HostCard.tsx`.

### Updating the embedded demo data

Demo data lives in
[src/data/audit-viewer-demo.ts](./src/data/audit-viewer-demo.ts). The
hostname is `HOST-DEMO-01`; the dataset is sanitised (RFC1918 IPs,
generic SQL DB names) and demonstrates exactly one BLOCKER, two WARN, and
one INFO finding.

---

## Anonymisation

The viewer's "Anonymise" toggle masks the displayed data only — the
original parsed JSON in memory is untouched. The masker:

- Replaces every IPv4 match with `xxx.xxx.xxx.xxx`
- Renames each loaded hostname to `HOST-01`, `HOST-02`, … (stable across renders)
- Replaces backslash-style usernames (`DOMAIN\user`) with `DOMAIN\user`
- Replaces `.local`/`.lan`/`.corp` domains with `example.local`

See [src/lib/audit-viewer/anonymise.ts](./src/lib/audit-viewer/anonymise.ts).

---

## Deployment

Push to `main` triggers a Vercel deployment.

```bash
git push origin main
# Vercel auto-deploys in ~60 seconds
```

---

## Architecture Notes

- **GalaxyCursor** and **ChatWidget** are intentionally preserved untouched
  from the previous design. They mount in [src/app/layout.tsx](./src/app/layout.tsx).
- All case-study and tools pages are statically rendered at build time
  (no runtime database).
- The audit viewer is a single client-side route — no server roundtrip
  after the initial load.
