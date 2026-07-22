# Chrome Extension Product Plan

## Product frame

The long-term product is a Chrome extension that turns existing bookmarks into a personal information asset system.

The extension should not replace Chrome bookmarks immediately. It should first read, analyze, classify, and present better ways to use them.

## User-centered product principle

Design from the user's return habits:

- I need to quickly open accounts, communities, and social platforms.
- I need to return to reading and learning materials.
- I need to find tools, plugins, and previous utilities.
- I need low-frequency but important life/admin portals.
- I need inspiration and reference materials.
- I need a way to understand my attention, interests, and growth.
- I need cleanup and review flows that do not become another chore.

The product should stay minimal, lightweight, and calm.

The user-facing layer should:

- Show fewer choices by default.
- Prefer clear cards, short labels, and obvious next actions.
- Hide advanced taxonomy unless the user asks for detail.
- Avoid dense dashboards that feel like another management burden.
- Use progressive disclosure: quick access first, deeper filters second, analysis third.
- Keep review tasks small and finite.
- Make automation feel helpful, not noisy.

## Two product layers

### 1. Data and intelligence layer

This layer reads and understands information.

Responsibilities:

- Ingest Chrome bookmarks.
- Preserve legacy folders as evidence.
- Normalize domains, URLs, duplicate clusters, timestamps, and source identities.
- Classify resources into taxonomy fields.
- Generate smart collections for user-facing access.
- Track confidence, review needs, source importance, and usefulness reasons.
- Prepare future source connectors such as newsletters, RSS, LinkedIn, WeChat subscriptions, and other platform inputs.

This layer should be private-first and reversible.

### 2. User usage layer

This layer helps the user use the archive.

Responsibilities:

- Quick-access dashboard.
- Smart collection cards.
- Recommended resource lists.
- Search and advanced filtering.
- Review and cleanup workflows.
- Evolution and insight views.
- Future side-panel companion UI.

This layer should be simple, visual, and action-oriented.

Complexity belongs in the data layer. The user layer should feel like a clean control room, not a database admin panel.

## Why keep both dashboard and filters

The homepage dashboard is for fast return.

Search and filters are for precise retrieval.

Review pages are for improving the system.

Atlas and evolution pages are for understanding patterns.

These should coexist:

- `Home`: quick use-mode board and summary.
- `Collections`: curated entry points by return habit.
- `Search`: precise retrieval when the user knows what they want.
- `Review`: low-confidence cleanup and classification improvement.
- `Atlas`: taxonomy exploration.
- `Evolution`: long-term attention and interest shifts.
- `Signals`: future source-monitoring workflow.

The dashboard should not replace search. It should reduce the need to search for common return cases.

Default experience:

1. Open the dashboard.
2. Pick a clear use-mode card.
3. See a recommended list.
4. Use filters only when needed.
5. Review only a small queue at a time.

## Chrome extension capability notes

Based on current Chrome extension documentation:

- `chrome.bookmarks` can read, search, create, update, move, and remove bookmarks with the `bookmarks` permission.
- `chrome.storage` can persist extension state such as classification cache, user preferences, review status, and manual overrides.
- `chrome.sidePanel` can show a persistent extension UI beside the current page, available in MV3 Chrome 114+.
- Extension permission warnings matter. The product should ask only for necessary permissions and make write actions explicit.

Sources:

- Chrome Bookmarks API: https://developer.chrome.com/docs/extensions/reference/api/bookmarks
- Chrome Storage API: https://developer.chrome.com/docs/extensions/reference/api/storage
- Chrome Side Panel API: https://developer.chrome.com/docs/extensions/reference/api/sidePanel

## Extension MVP flow

1. User installs extension.
2. Extension asks for bookmark read permission.
3. Extension scans bookmark tree.
4. Extension builds local normalized dataset.
5. Extension runs local rule-based taxonomy first.
6. User sees dashboard, smart collections, search, review, and insights.
7. User can approve manual cleanup or folder suggestions.
8. Optional future AI enrichment can add summaries, hidden connections, and source-monitoring digests.

## Permission strategy

Start with:

- `bookmarks`
- `storage`
- `sidePanel`

Avoid early broad permissions:

- Do not request full browsing history by default.
- Do not request all website content access unless a later feature clearly needs it.
- Do not automatically modify bookmarks without user confirmation.

## Experiment loop

Use a compound engineering loop:

1. Explore: inspect bookmark samples, usage pain points, and low-confidence cases.
2. Plan: define a small feature or rule improvement.
3. Implement: change the smallest useful surface.
4. Validate: run build, taxonomy audit, and user-flow checks.
5. Learn: record what improved and what still feels unclear.
6. Compound: turn findings into reusable rules, docs, scripts, and UI patterns.

## Near-term product backlog

### Dashboard and collections

- Keep smart collections on the homepage.
- Add better recommendation explanations.
- Add icons and visual distinction for each return mode.
- Make tool categories more actionable.

### Search and retrieval

- Keep advanced search.
- Add saved views for common workflows.
- Let users jump from collection cards into pre-filtered search.
- Add source, confidence, and usefulness filters.

### Review workflow

- Keep low-confidence review.
- Add manual override storage later.
- Add "mark as useful", "cleanup", and "monitor source" actions.

### Insight layer

- Add hidden connection graph.
- Add interest recurrence and return-cycle summaries.
- Add source concentration and blind-spot warnings.

### Extension layer

- Prototype read-only bookmark ingestion.
- Build side-panel quick access.
- Store user overrides in extension storage.
- Add explicit user approval before any bookmark write operation.
