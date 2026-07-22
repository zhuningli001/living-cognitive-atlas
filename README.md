# Living Cognitive Atlas

A local-first bookmark intelligence prototype that turns saved Chrome links into a personal cognitive atlas.

The current MVP has two connected surfaces:

- **Next.js local report app** for full profile, taxonomy, search, review, and rule-learning workflows.
- **Chrome Memory Mirror extension** for a compact side-panel dashboard and built-in full report page that read Chrome bookmarks locally.

## Product vision

Most bookmarks are easy to save and hard to reuse. This project turns a long-running, messy bookmark archive into a private cognitive map: a way to rediscover old references, understand recurring interests, separate public resources from private clutter, and turn saved links into creative direction, research signals, and reusable knowledge assets.

## Current MVP status

This repository contains a working local MVP:

- Chrome extension side panel reads bookmarks with the `bookmarks` permission.
- Bookmark analysis runs locally in the extension.
- Snapshots are stored in `chrome.storage.local`.
- The extension includes a full report page, so the core extension flow does not require a local web server.
- The report page supports feedback, rule suggestions, approved rules, and local taxonomy overrides.
- The first-run state is intentionally empty until a user scans or imports data.
- English and Chinese UI copy are supported for the MVP surfaces.

This is **not yet** a Chrome Web Store package. See `docs/public-extension-release-plan.md` for the remaining release gates before general installation.

## Product architecture

The project now separates two layers:

- Information management layer: taxonomy, canonical topics, source importance, confidence, review status, and long-term insight.
- User usage layer: homepage dashboard, smart collections, search, review, atlas, evolution, and future Chrome extension side-panel flows.

See:

- `docs/information-architecture.md`
- `docs/chrome-extension-product-plan.md`
- `docs/chrome-extension-mvp-flow.md`
- `docs/mvp-product-plan.md`
- `docs/mvp-iteration-loop.md`
- `docs/public-extension-release-plan.md`
- `docs/privacy-policy-draft.md`
- `docs/taxonomy-v2.md`

There is also a product-facing playbook page in the local app:

- `http://localhost:3000/playbook`

## What it does

- Parses a Chrome bookmarks HTML export into structured `JSON` and `CSV`
- Applies a first-pass rule-based taxonomy across worldview, human state, interaction, system model, aesthetic language, medium, region, and value status
- Surfaces the archive in a simplified local dashboard with atlas, search, evolution, signals, settings, and cold storage views
- Supports bilingual interface switching (`中文 / English`) in local settings
- Exports curated or full bookmark libraries as downloadable `JSON` and `CSV`
- Provides a read-only Chrome extension side panel for live bookmark scanning
- Supports local feedback and rule-learning artifacts from imported extension snapshots

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Regenerate bookmark data from a new Chrome export:

```bash
npm run parse-bookmarks -- "/path/to/chrome-bookmarks.html"
```

The parser requires an explicit local file path. It writes private full-archive files to ignored paths and public-safe files to tracked public data paths.

3. Start the dashboard:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Chrome extension local test

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the local `extension/` folder from this repository.
5. Open the `Chrome Memory Mirror` side panel.
6. Click `Scan bookmarks`.
7. Click `Open full report`.
8. Confirm the extension opens its built-in `report.html` page.

The extension MVP requests only:

- `bookmarks`
- `storage`
- `sidePanel`

It does not request browsing history, all-site access, bookmark write actions, or network upload permissions.

## User notes

Chrome Memory Mirror is a local-first prototype. Before using it with a real bookmark archive, users should understand these boundaries:

- The extension reads Chrome bookmarks only after the user installs it and clicks `Scan bookmarks`.
- Analysis is stored locally in Chrome extension storage by default.
- Exported snapshot files can contain private URLs, folder names, and inferred interests. Treat exported files as personal data.
- `Clear data` removes the extension's stored profile snapshot, but it does not delete Chrome bookmarks.
- The current taxonomy is an interpretable first-pass model, not a personality diagnosis.
- The project is not yet a Chrome Web Store package; install it only as an unpacked local extension during MVP testing.

For a fuller release checklist and privacy boundary, see `docs/public-extension-release-plan.md` and `docs/privacy-policy-draft.md`.

## MVP iteration method

This project should evolve through small product loops rather than broad redesigns.

Each MVP cycle should define:

1. Target user question: what uncertainty are we trying to reduce?
2. Smallest product change: what can we ship without changing the whole system?
3. Success signal: what behavior or result proves the change helped?
4. Review notes: what confused the user, what felt valuable, and what should be removed?
5. Next decision: keep, simplify, deepen, or discard.

The working iteration playbook lives in `docs/mvp-iteration-loop.md`.

## External testing channels

Use different platforms for different validation stages:

- GitHub: public README, Releases, Issues, Discussions, and project boards for builders and technical collaborators.
- Chrome Web Store unlisted beta: real install flow testing through a private link after privacy copy, icons, and release notes are ready.
- Tally or Google Forms: structured feedback from non-technical testers.
- Notion public page: readable product story, tester handbook, changelog, and known limitations.
- Discord, Slack, or Circle: a small recurring tester group that can share screenshots and weekly feedback.
- Product Hunt, Reddit, or Hacker News: broader positioning validation only after the extension-only loop is stable.

## Generated data

- `data/bookmarks.json`
- `data/bookmarks.csv`
- `data/atlas-meta.json`
- `data/public-bookmarks.json`
- `data/public-bookmarks.csv`

## Long-term update workflow

1. Export a fresh Chrome bookmarks HTML file.
2. Re-run:

```bash
npm run parse-bookmarks -- "/path/to/your/export.html"
```

3. Start or refresh the app:

```bash
npm run dev
```

4. Review:

- `Home` for representative tags and repeated-save clusters
- `Signals` for tracked UX sources
- `Cold Storage` for cleanup candidates
- `Settings` to switch language or export a curated library

5. Download a shareable library:

- `http://localhost:3000/api/export?type=curated&format=json`
- `http://localhost:3000/api/export?type=curated&format=csv`

## Cloud deployment

Recommended platform:

- Vercel Hobby (free for personal projects)

### Important privacy note

If you deploy this project with the full archive, your bookmark data becomes part of the deployed app build.

Use one of these modes:

- Private deployment:
  Deploy with the full dataset if the project stays private.
- Public deployment:
  Set `NEXT_PUBLIC_DATA_MODE=public` so the site uses `data/public-bookmarks.json` instead of the full archive.

The app also falls back to `data/public-bookmarks.json` if `data/bookmarks.json` is not present. This keeps public deployments from failing when the private archive is intentionally omitted.

### Vercel deploy steps

1. Push this project to a Git repository.
2. Import the repository into Vercel.
3. Build settings:

- Framework preset: `Next.js`
- Build command: `npm run build`
- Output: automatic

4. Optional environment variable for safer public sharing:

```bash
NEXT_PUBLIC_DATA_MODE=public
```

5. Deploy.

### Recommended public deploy mode

If this site will be accessible by other people, use:

```bash
NEXT_PUBLIC_DATA_MODE=public
```

That makes the deployed site read from:

- `data/public-bookmarks.json`

instead of:

- `data/bookmarks.json`

This repository is prepared around that public-safe path by default:

- `data/bookmarks.json` and `data/bookmarks.csv` are ignored by Git
- `data/public-bookmarks.json` and `data/public-bookmarks.csv` are the intended deploy artifacts
- if the private archive is missing, the app automatically falls back to public data

### Before you push

1. Decide whether the repo should include the full archive or only the public subset.
2. For public deployment, keep these files in the repo:

- `data/public-bookmarks.json`
- `data/public-bookmarks.csv`
- `data/atlas-meta.json`

3. Put this environment variable in Vercel:

```bash
NEXT_PUBLIC_DATA_MODE=public
```

## Signals board

Tracked UX / product sources are configured in:

- `data/signal-sources.json`

You can add or remove feeds there as your weekly watchlist changes.

## Notes on the tagging system

The MVP tagging layer is intentionally rule-based and transparent. It uses:

- bookmark title keywords
- URL and domain keywords
- folder path keywords

This keeps the first version editable and easy to tune before introducing LLM summaries, embeddings, screenshot analysis, or vector search.

## Next upgrades

- move the deepest feedback and rule-approval flows into extension pages
- improve the compact side-panel dashboard for narrow browser panels
- add production extension icons, privacy policy URL, support URL, store screenshots, and release notes
- improve taxonomy quality with user-approved rules before adding AI-assisted summaries or embeddings
