# Public Deploy Checklist

This checklist assumes you want the **public curated** deployment mode.

## 1. Verify local build

```bash
NEXT_PUBLIC_DATA_MODE=public npm run build
```

## 2. Create a GitHub repository

Create a new empty repository on GitHub, then connect this project:

```bash
git init
git add .
git commit -m "Initial public curated dashboard"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

If this folder is already a Git repo, skip `git init` and only add the remote if needed.

## 3. Import to Vercel

1. Open Vercel dashboard
2. Click `Add New...` -> `Project`
3. Import your GitHub repository
4. Framework preset: `Next.js`
5. Build command: `npm run build`
6. Output directory: leave default

## 4. Add environment variable

In Vercel Project Settings -> Environment Variables:

- Key: `NEXT_PUBLIC_DATA_MODE`
- Value: `public`

Redeploy after saving.

## 5. Confirm public-safe data mode

The deployed app should use:

- `data/public-bookmarks.json`

and should **not** depend on:

- `data/bookmarks.json`
- `data/bookmarks.csv`

## 6. After deploy

Open these pages in production and confirm they load:

- `/`
- `/atlas?group=primary_category`
- `/reclassify`
- `/search`

## Notes

- `data/bookmarks.json` and `data/bookmarks.csv` are ignored by Git.
- The public deployment mode is already validated locally.
