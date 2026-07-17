# Ningli-Bookmark-living cognitive atlas

A local Next.js dashboard that transforms a Chrome bookmarks export into a living cognitive atlas.

## What it does

- Parses a Chrome bookmarks HTML export into structured `JSON` and `CSV`
- Applies a first-pass rule-based taxonomy across worldview, human state, interaction, system model, aesthetic language, medium, region, and value status
- Surfaces the archive in a simplified local dashboard with atlas, search, evolution, signals, settings, and cold storage views
- Supports bilingual interface switching (`中文 / English`) in local settings
- Exports curated or full bookmark libraries as downloadable `JSON` and `CSV`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Regenerate bookmark data from a new Chrome export:

```bash
npm run parse-bookmarks -- "/Users/a123/Downloads/my bookmarks_5_15.html"
```

If you omit the path, the parser defaults to `/Users/a123/Downloads/my bookmarks_5_15.html`.

3. Start the dashboard:

```bash
npm run dev
```

4. Open `http://localhost:3000`

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

- swap rule-only tagging with AI-assisted summaries and semantic embeddings
- enrich cards with screenshot thumbnails
- add dead-link detection and domain health checks
- generate weekly signal reports from tracked feeds and newly added bookmarks
