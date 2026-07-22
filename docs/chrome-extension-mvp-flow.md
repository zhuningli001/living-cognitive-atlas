# Chrome Extension MVP Flow

## Goal

Build the smallest usable Chrome extension that proves the core product loop:

```text
User grants bookmark access
  -> extension reads Chrome bookmarks
  -> local analyzer builds a personal profile snapshot
  -> side panel shows a compact dashboard
  -> built-in extension report shows the full local profile
  -> user identifies what feels accurate, missing, or over-general
```

This MVP is not a bookmark manager yet. It is a read-only personal information mirror.

## Product boundary

The extension should be:

- read-only for bookmarks
- local-first
- small enough to live in a browser side panel
- useful after one click
- clear about uncertainty

The extension should not:

- read browsing history
- request all-site content permissions
- call external AI or analytics services
- modify bookmarks automatically
- upload bookmark data

## Clean first-run state

The product should start with no personal analysis visible.

On first use:

- the side panel shows only setup controls, privacy boundary copy, and the scan action
- metric rows, source balance, dimensions, timeline, return paths, and review queue stay hidden until a real snapshot exists
- `/profile/import` shows a clean connection state, not a sample profile
- analysis appears only after the user scans bookmarks, imports an extension handoff, or chooses a local snapshot file

This avoids implying that the system has already inferred a person before the user grants data access.

## Files

- `extension/manifest.json`: Manifest V3 extension definition.
- `extension/background.js`: Opens the side panel from the extension action when Chrome supports it.
- `extension/bookmark-profile-engine.js`: Reusable local profile engine for bookmark trees.
- `extension/sidepanel.html`: Compact side-panel interface.
- `extension/sidepanel.css`: Brand-aligned side-panel styling.
- `extension/sidepanel.js`: Chrome API connection, local storage, snapshot export, and rendering.
- `extension/report.html`: Full extension-local report page.
- `extension/report.css`: Full report styling.
- `extension/report.js`: Full report rendering from `chrome.storage.local`.

## Local installation

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the local `extension/` folder from this repository.
5. Pin or open `Chrome Memory Mirror`.
6. Open the side panel and click `Scan bookmarks`.
7. Optional: set a display name such as `NEO`.
8. Click `Open full report`.
9. Confirm the built-in extension report opens.
10. Use `Export snapshot` only as a manual fallback or portable archive.

## First-use flow

1. User opens the extension side panel.
2. Panel states the product boundary: read-only, local-first, no network calls.
3. User clicks `Scan bookmarks`.
4. Extension calls `chrome.bookmarks.getTree()`.
5. Bookmarks are flattened into normalized records:
   - title
   - url
   - domain
   - normalized URL
   - folder path
   - saved year
6. A lightweight local profile snapshot is generated.
7. Snapshot is saved in `chrome.storage.local`.
8. User can explicitly export the snapshot as local JSON.
9. User can open the full report page from the side panel.
10. The full report page reads the latest local snapshot directly from `chrome.storage.local`.
11. Panel renders:
   - profile headline
   - bookmark/domain/signal/review counts
   - source balance
   - top attention signals
   - development line
   - dominant dimensions
   - smart return paths
   - review queue

## Snapshot schema

Exported files use `schemaVersion: bookmark-profile-snapshot/v1`.

The JSON contains:

- `generatedAt`: scan timestamp
- `source`: extension source label
- `headline` and `summary`: compact profile copy
- `metrics`: bookmark, domain, signal, and review counts
- `topics`: top attention signals
- `dimensions`: dominant profile dimensions
- `phases`: development-line segments
- `collections`: smart return paths
- `sourceBalance`: whether the profile is broad or source-skewed
- `reviewQueue`: links that need confirmation
- `records`: normalized bookmarks with URL, domain, folder path, year, topics, and resource type

Because `records` includes private URLs and folder names, export must stay explicit and user-initiated.

## Extension-local report

The public-facing extension flow no longer depends on a localhost report page.

`extension/report.html` reads `profileSnapshot` from `chrome.storage.local` and renders:

- profile headline and dimensions
- source balance and domain concentration
- top attention signals
- development line
- smart return paths
- review priority items
- evidence sample
- local export and clear controls

This makes the first public-style prototype usable without running the Next.js app.

## Web report import

`/profile/import` remains in the Next.js app as a local research surface for manually importing exported snapshot JSON and testing deeper feedback/rule-learning flows.

Manual JSON import does not upload the file. It parses in the browser and stores the latest valid snapshot in `localStorage`.

## Local data controls

The side panel includes a `Local data` status and `Clear data` action.

`Clear data` removes only the stored `profileSnapshot` from `chrome.storage.local`. It keeps:

- display name
- language setting
- full report URL

After clearing, the side panel returns to the clean first-run state and analysis modules are hidden until the next scan.

## Display name

The side panel supports a local display name such as `NEO`, rendered as `NEO's Bookmark`.

The extension does not automatically read the Google account display name. Chrome's public identity API can expose profile email and account id with extra permission, but not the user-facing display name, so MVP keeps this as an explicit local setting.

## Language setting

The side panel supports a local browsing-language preference. This should behave like a system display-language setting, not a partial button-label toggle.

MVP 1.1 includes:

- English
- Chinese

The selected language is stored in `chrome.storage.local` as `preferredLanguage`. It changes the side-panel interface copy, button labels, status messages, empty states, source-balance copy, and display-name title format.

The built-in extension report reads `preferredLanguage` from `chrome.storage.local` and applies it to report labels, empty states, metrics, source balance, dimensions, development stages, collections, and review reasons.

MVP 1.1 also localizes the most visible system-generated analysis labels:

- taxonomy categories
- resource types
- confidence labels
- dimension labels
- development stage labels
- smart collection labels
- rule suggestion types
- taxonomy override types

User evidence stays in its original language. Bookmark titles, domains, folder paths, and generated narrative sentences that include user-specific evidence are not silently rewritten.

## Minimal feedback loop

`/profile/import` includes a small local feedback loop for review items.

Supported actions:

- `Accurate`: the current classification looks right.
- `Wrong topic`: the item needs a different topic or category.
- `Important`: the item should be weighted higher.
- `Review later`: the user wants to keep it undecided.

Feedback is saved in browser `localStorage` as `profile-feedback/v1`. It can be exported as JSON and later converted into rule-learning suggestions.

## Rule suggestions

Local feedback is converted into `profile-rule-suggestions/v1` suggestions.

Supported suggestion types:

- `increase_importance`: a domain or source is repeatedly marked important.
- `needs_topic_rule`: a domain receives wrong-topic feedback and may need a domain-specific rule.
- `keep_rule`: a category receives accurate feedback and may be safe to keep.
- `defer_rule`: a category receives review-later feedback and should remain observational.

Suggestions are provisional. They are visible and exportable, but they do not mutate taxonomy rules yet.

## Rule approval

Users can approve a suggestion on `/profile/import`.

Approved rules use `approved-rule/v1` and are stored in browser `localStorage`. They can be revoked or exported. Approval is still a local consent layer; it does not automatically rewrite the taxonomy engine.

## Taxonomy override config

Approved rules can be compiled into `taxonomy-overrides/v1`.

The override config groups approved learning into:

- source importance overrides
- domain topic review rules
- confirmed category rules
- deferred category rules

This is exportable and inspectable. It is not automatically applied to `lib/taxonomy.js` yet.

## Explicit apply

`/profile/import` now lets the user apply selected taxonomy overrides to the current browser-local report.

Applied override ids are stored separately in localStorage as `applied-overrides`. This state controls report recalculation only:

- it can increase source importance for matching domains
- it can move matching domains back into review with suggested topics
- it can confirm or defer recurring categories
- it can be undone without deleting the approved rule

This does not rewrite Chrome bookmarks, mutate the extension snapshot, upload data, or edit the shared taxonomy source file.

## Current analysis rules

The first extension prototype uses local keyword rules. It intentionally favors explainability over depth.

It can infer:

- design systems
- visual references
- AI product curiosity
- creative coding
- personal knowledge systems
- learning
- cultural research

It can surface review candidates when a bookmark has:

- weak title
- unclear topic
- missing saved year
- possible duplicate URL

## Feedback questions

After trying the extension with real bookmarks, review these questions:

- Does the headline feel recognizably true?
- Are the top attention signals too generic?
- Does the development line reveal a real shift over time?
- Are smart return paths useful enough for daily access?
- Is the review queue finite and non-annoying?
- Does the side panel feel small enough for a real plugin surface?

## Next modification loop

### Plan

Stabilize the real Chrome extension experience before adding more profile complexity.

### Execute

P0 test checklist:

- Open `chrome://extensions`.
- Reload the unpacked `Chrome Memory Mirror` extension.
- Open the extension side panel.
- Confirm first-run state shows no profile metrics or analysis modules.
- Confirm the setup tracker starts at `Scan`.
- Click `Scan bookmarks`.
- Confirm local data changes from empty to stored bookmark/domain counts.
- Confirm metrics, source balance, current attention, development line, dimensions, smart return paths, and review queue appear.
- Confirm setup tracker moves to `Report`.
- Click `Open full report`.
- Confirm the built-in extension `report.html` opens.
- Confirm the full report renders from the extension snapshot without localhost.
- Confirm the extension side-panel setup tracker moves the `Review` step to done.
- Confirm the handoff card changes to an imported state and does not keep asking for the same snapshot.
- Switch language in the extension and report page.
- Confirm system copy and visible taxonomy labels switch language.
- Click `Clear data` in the extension.
- Confirm the side panel returns to clean first-run state.
- Click `Clear data` on the extension report page.
- Confirm the report page returns to clean no-data state.

### Feedback

Use the checklist with real Chrome bookmarks. Record friction in terms of where the user hesitates:

- permission trust
- scan completion
- report handoff
- report opening
- language mismatch
- local data clearing

### Summary

The P0 loop is valid if a new user can install the extension, scan bookmarks, open the built-in report, and clear local data without needing a local server or manual JSON export.

### Modify

Prioritize only the gaps that block trust:

- unclear first-use state
- unclear privacy boundary
- broken extension report opening
- stale local data
- language mismatch
- noisy or misleading setup steps
- unclear privacy boundary
