# Claude Code Bundle — BLS Portfolio Refactor

This bundle contains everything needed to run a Claude Code task that refactors your `bls-siteV2` portfolio site and adds the audit viewer tool.

## Contents

```
claude-code-bundle/
├── CLAUDE_CODE_BRIEF.md                                          ← the prompt
├── README.md                                                     ← this file
└── artefacts/
    ├── 01-incident-vpn-rds-cascade.md                            ← case study 1
    ├── 02-azure-migration-discovery-methodology.md               ← case study 2
    ├── collect-server-inventory.ps1                              ← collector 1
    └── collect-workload-profile.ps1                              ← collector 2
```

## How to run

1. **Copy this entire bundle into the root of your `bls-siteV2` repo** (or alongside it as a scratch directory — Claude Code reads from the path).

2. **Open Claude Code in the `bls-siteV2` repo directory.**

3. **Paste this prompt at the start of the Claude Code session:**

   ```
   Read CLAUDE_CODE_BRIEF.md in full before starting. Then execute it step by step.
   The artefacts/ folder contains four files you must copy verbatim into the project
   at the locations specified in the brief. Do not modify their contents.

   Work on a new branch: refactor/military-aesthetic-tools-section
   Commit after every step.
   Run npm run build after every step — do not proceed if build fails.
   Do not push. Wait for me to review before merge.

   Begin.
   ```

4. **Walk away.** Claude Code should run through 12 steps with commits between each.

5. **When it's done** it leaves the branch ready to push, with a summary report in the terminal. Review the changes, push, open a PR, Vercel will preview-deploy automatically.

## What the brief tells Claude Code to do

- **Delete:** Persona gate, Story/Skills/Experience/Homelab sections, Nebula background, Star explosion effect, theme switcher
- **Keep untouched:** `/cv` route, GalaxyCursor, ChatWidget
- **Refactor:** Hero, Projects (visual update only, same data)
- **Add:**
  - New military/tactical dark aesthetic (palette in `tailwind.config.ts`)
  - `/tools` route + landing-page section
  - `/tools/audit-viewer` — the drag-and-drop JSON viewer
  - `/case-studies` index + `/case-studies/[slug]` for individual studies
  - PowerShell collectors as downloadable files from the audit viewer page

## Safeguards built into the brief

The brief explicitly instructs Claude Code to:

- Work step by step, commit between each step
- Run `npm run build` after every step
- Stop if build fails
- Not push to origin
- Not invent features
- Not add dependencies beyond `react-markdown` and `remark-gfm` (for case study rendering)
- Not modify the four artefact files
- Not touch `/cv`, `GalaxyCursor`, or `ChatWidget`
- Output a summary report at the end before any push
- Write a `BLOCKERS.md` and stop if it hits something it can't resolve from the brief

## If Claude Code drifts

If you come back to find Claude Code has gone off-piste:

1. Check the most recent commit message — they should match the step descriptions
2. If branch is mostly OK, cherry-pick the good commits onto a fresh branch
3. If branch is mostly bad, `git reset --hard` to the last good commit and re-run from there with a corrective prompt
4. Worst case: delete the branch, start over with the original prompt — it's idempotent if you're back on `main`

## Iterations after this

Once this lands, future improvements happen by adding new files, not refactoring this one:

- **New case study?** Drop a new markdown file in `content/case-studies/`. Done.
- **New tool?** Add a route under `/tools/[tool-name]` and an entry to the Tools section.
- **More PowerShell collectors?** Drop them in `public/tools/audit-viewer/` and update the audit viewer's download section.
- **Aggregator script?** Separate piece of work, separate Claude Code session, separate brief.

## Don't

- Don't add the audit viewer to a separate repo if this one is working — keeping it in the portfolio site is the whole point
- Don't add a backend to the audit viewer without thinking through the customer-data-storage implications (see earlier conversation)
- Don't run two Claude Code sessions against the same repo simultaneously
