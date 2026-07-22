# Public Extension Release Plan

## Current state

Chrome Memory Mirror is currently a local unpacked-extension MVP. It includes a side panel and a built-in extension report page.

This is enough for product validation and no longer requires ordinary users to run a local web server for the core scan-to-report flow.

## Recommended public architecture

The public version should be extension-only:

```text
Chrome bookmarks permission
  -> extension side panel
  -> extension-local report page
  -> chrome.storage.local
  -> exportable local data package
```

Completed in the public-style prototype:

- The report surface exists as `extension/report.html`.
- The side panel opens the extension report with `chrome.runtime.getURL("report.html")`.
- The local `Full report URL` setting is removed from the side panel.
- `extension/options.html` provides display name, language, privacy notes, export, and data reset.
- The manifest no longer declares localhost content-script matches.

Remaining productization work:

- Move deeper feedback/rule-learning controls from `/profile/import` into extension pages.
- Keep all snapshot, feedback, rule, and override data in `chrome.storage.local`.
- Keep manual JSON export/import as a portability fallback.

## User-facing usage notes

Public testers should see these notes before using the extension with a real bookmark archive:

- The extension reads bookmarks only after installation permission and a user-triggered scan.
- The extension does not delete, move, edit, or create Chrome bookmarks in the MVP.
- The extension does not read browser history, page contents, passwords, cookies, or open tabs.
- Profile results are inferred from bookmark titles, URLs, domains, and folder paths.
- Profile results should be treated as a working information portrait, not a psychological diagnosis.
- Exported snapshots can include private URLs and inferred interests, so users should store or share them carefully.
- `Clear data` removes extension-local profile data, not the original Chrome bookmarks.

## MVP 1.2 target

MVP 1.2 should make the extension usable by first external testers without the local Next.js app.

The target flow:

```text
Install unpacked extension
  -> read privacy boundary
  -> scan bookmarks
  -> inspect compact side-panel profile
  -> open extension report
  -> give lightweight feedback
  -> approve or reject suggested rules
  -> export or clear local data
```

MVP 1.2 should answer this question:

```text
Can a new user trust the extension, understand the portrait, correct obvious mistakes, and see the system improve locally?
```

## MVP 1.2 optimization backlog

P0:

- Move minimal feedback controls into `extension/report.html`.
- Add rule approval inside extension pages.
- Make first-run, no-data, scan-success, scan-error, and clear-data states explicit.
- Verify every user-visible extension string supports English and Chinese.

P1:

- Improve compact side-panel information hierarchy for a browser-side panel width.
- Add tester install notes and a manual QA checklist.
- Add production icon assets and store screenshot plan.
- Add stale snapshot warning when bookmarks have not been scanned recently.
- Mark exported snapshot files as private in the file name and in UI copy.

P2:

- Add optional screenshot thumbnails or richer source previews.
- Add dead-link and domain health checks.
- Add AI-assisted summaries only after local privacy boundaries are clear.
- Explore semantic search only after rule approval and feedback loops are stable.

## External testing channels

Recommended sequence:

1. GitHub branch or release
   Use this for technical collaborators who can inspect source, load the unpacked extension, and file issues.

2. Private tester form
   Use Tally, Google Forms, or a similar form to collect structured feedback from non-technical testers.

3. Notion or public product page
   Use this as a readable tester handbook with install steps, privacy notes, known limitations, and changelog.

4. Chrome Web Store unlisted beta
   Use this only after icons, privacy policy URL, support URL, screenshots, and versioned release notes are ready.

5. Small community cohort
   Use Discord, Slack, Circle, or a private group to collect repeated feedback across several weekly cycles.

6. Larger public launch
   Use Product Hunt, Reddit, Hacker News, or design/product communities only after the extension-only loop is stable and reset/export/privacy behavior has been tested.

Feedback should be collected around concrete questions:

- Did install and scanning work?
- Did the privacy boundary feel clear?
- Did the compact side panel make sense in a real browser window?
- Did the profile feel recognizable?
- Which inference was wrong, too broad, or too confident?
- Would the tester open the extension again later?

## Public package checklist

Before a public installable build:

- Add extension icons in Chrome Web Store sizes.
- Add a clear first-run permission screen before scanning bookmarks.
- Add privacy policy URL.
- Add support/help URL.
- Add Chrome Web Store description and screenshots.
- Add versioned release notes.
- Add a production manifest review checklist.
- Verify no private bookmark data, local paths, or user-specific datasets are bundled.

## Permissions

Keep public MVP permissions narrow:

- `bookmarks`: read the user's bookmark tree after explicit extension install permission.
- `storage`: save local snapshots, settings, feedback, and approved rules.
- `sidePanel`: show the compact dashboard beside the browser.

Avoid until there is a specific user-facing reason:

- `history`
- all-site host permissions
- identity/profile permissions
- bookmark write operations
- background network upload

## Data model

Public extension data should remain local by default:

- `profileSnapshot`
- `preferredLanguage`
- `ownerName`
- `feedback`
- `approvedRules`
- `taxonomyOverrides`
- `reportHandoffState`

Exported JSON files may contain private bookmark URLs and folder paths, so every export must be explicit and user-initiated.

## Release gates

A public beta is ready only when:

- A new user can install the extension without running this repo locally.
- First-run state contains no sample personal data.
- Scan, compact profile, report, feedback, reset, and export work inside extension pages.
- The extension can delete its own local data from the UI.
- Privacy policy matches actual behavior.
- Build artifacts do not include private data.

## Iteration review

Each public-MVP change should be reviewed with the loop in `docs/mvp-iteration-loop.md`.

Before starting a change, define:

- target user question
- smallest shippable change
- success signal
- privacy risk

After testing, decide:

- Keep
- Simplify
- Deepen
- Remove

## Later options

Hosted report mode can be explored later, but only if the product clearly separates local analysis from any cloud features and asks for explicit consent before uploading bookmark-derived data.
