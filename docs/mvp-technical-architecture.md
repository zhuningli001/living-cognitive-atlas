# MVP Technical Architecture

## Architecture goal

Turn Chrome bookmarks into a reusable personal information profile through a small, local-first analysis pipeline.

Core pipeline:

```text
Chrome bookmarks or export
  -> ingestion
  -> normalization
  -> taxonomy engine
  -> audit engine
  -> profile engine
  -> smart collections
  -> review feedback
  -> rule learning
```

## Modules

### 1. Bookmark ingestion

Responsibility:

- Accept Chrome bookmarks HTML, JSON, CSV, or extension bookmark tree data.
- Preserve legacy folder paths as evidence.
- Avoid dropping timestamps, duplicate URLs, or domains.

Input:

- Chrome bookmarks HTML export
- `chrome.bookmarks.getTree()` result
- existing JSON/CSV exports

Output:

- normalized bookmark records

Required fields:

- `title`
- `url`
- `domain`
- `folder_path`
- `folder_path_array`
- `add_date`
- `year`
- `normalized_url`

Current code:

- `scripts/parse-bookmarks.js`
- `lib/taxonomy.js` for URL normalization

Next improvement:

- Make ingestion source-agnostic so one parser can serve upload, local data, and extension data.

### 2. Taxonomy engine

Responsibility:

- Convert raw records into explainable information assets.
- Separate stable category, resource type, action intent, topics, lifecycle, and confidence.

Output fields:

- `primary_category`
- `resource_type_tags`
- `action_tags`
- `canonical_topics`
- `save_intent`
- `usefulness_reason`
- `source_importance`
- `classification_confidence`
- `classification_reasons`
- `value_status`

Current code:

- `lib/taxonomy.js`
- `docs/taxonomy-v2.md`
- `skills/personal-taxonomy-architect/SKILL.md`

Next improvement:

- Split universal rules from user-specific rules.
- Store user overrides separately from generated classification.

### 3. Audit engine

Responsibility:

- Measure whether the taxonomy is healthy enough to trust.
- Identify rule gaps and low-confidence review queues.

Metrics:

- fallback category ratio
- generic resource type ratio
- passive action ratio
- low-confidence count
- over-matching tags
- duplicate clusters
- source importance distribution
- lifecycle distribution
- privacy risk

Current code:

- `scripts/audit-taxonomy.js`
- `skills/information-asset-audit/SKILL.md`

Next improvement:

- Return audit data as JSON for the UI, not only console output.

### 4. Profile engine

Responsibility:

- Generate an evidence-based information behavior profile.
- Summarize interests, keywords, source patterns, resource modes, action modes, and development lines.

Output:

- profile headline
- summary
- interest keywords
- dominant dimensions
- resource rhythm
- action rhythm
- source rhythm
- time rhythm
- classification leads
- caveats

Current code:

- `lib/profile.js`
- `components/profile-mirror.js`
- Atlas profile view in `app/atlas/page.js`

Next improvement:

- Create a dedicated `/profile` report page for the MVP.
- Add caveats and source/domain structure to the report.

### 5. Smart collections engine

Responsibility:

- Turn taxonomy into user-facing return paths.
- Keep taxonomy internal and expose practical collections.

Starter collections:

- Accounts and Communities
- Reading and Learning
- Tools and Plugins
- Life Admin and Portals
- Inspiration and References
- Sources to Monitor
- Review and Cleanup

Current code:

- `smartCollectionDefinitions` in `lib/data.js`
- `app/collections/[slug]/page.js`
- `skills/smart-collections-design/SKILL.md`

Next improvement:

- Add collection health metrics: item count, dominant topic, dominant action, low-confidence share.

### 6. Review feedback

Responsibility:

- Capture small user corrections without requiring full manual organization.
- Convert decisions into future local rules.

Decisions:

- accept
- mark important
- monitor source
- cleanup later
- skip
- override category
- override resource type

Current code:

- `components/review-session.js`
- `lib/review-decisions.js`

Next improvement:

- Convert exported decisions into rule suggestions.

### 7. Chrome extension shell

Responsibility:

- Connect the analysis engine to live Chrome bookmarks.
- Keep the first version read-only and local-first.
- Present the default experience as a compact side panel, not a full-page dashboard.

Permissions:

- `bookmarks`
- `storage`
- `sidePanel`

MVP behavior:

- Read `chrome.bookmarks.getTree()`.
- Normalize in memory.
- Store generated profile and review decisions in `chrome.storage.local`.
- Show a side panel profile board.
- Link from the side panel to deeper report surfaces only when the user asks for detail.

Current prototype:

- `extension/` contains a read-only MV3 Chrome extension side-panel prototype.
- The extension reads live bookmarks with `chrome.bookmarks.getTree()`, builds a lightweight local profile snapshot, stores it in `chrome.storage.local`, and can export the snapshot as local JSON.
- `extension/bookmark-profile-engine.js` separates local analysis from Chrome API and UI rendering so the engine can be aligned with the web report next.
- `/profile/import` imports the extension snapshot locally in the browser, reruns imported records through the web taxonomy/profile adapter, and renders an imported profile report without server upload.
- `/profile/import` also stores minimal review feedback in localStorage and can export `profile-feedback/v1` JSON for later rule learning.
- `lib/feedback-rule-suggestions.js` turns local feedback into provisional `profile-rule-suggestions/v1` suggestions without mutating taxonomy.
- `lib/rule-approval.js` turns selected suggestions into local `approved-rule/v1` records that can be revoked or exported.
- `lib/taxonomy-overrides.js` compiles approved rules into exportable `taxonomy-overrides/v1` config.
- `/profile/import` can explicitly apply selected taxonomy overrides to the current browser-local report recalculation, and can undo that applied state without rewriting source taxonomy or bookmark data.
- The side panel starts clean with no analysis visible until a real scan creates `profileSnapshot`.
- The side panel supports local display name, English/Chinese UI language, built-in full report opening, and explicit clearing of stored snapshot data.
- `extension/report.html` renders a full extension-local report from `chrome.storage.local`, removing the need for a localhost report handoff in the public-style MVP.
- `extension/manifest.json` does not request localhost content-script matches for the public-style MVP.
- `/panel` previews the compact side-panel dashboard.
- `/profile` remains the full profile report.

Not in MVP:

- browsing history
- all-site access
- automatic bookmark writes
- cloud upload

## MVP implementation order

1. Dedicated `/profile` report in the current Next.js app.
2. JSON-ready audit/profile outputs.
3. Source-agnostic bookmark ingestion.
4. Upload-based prototype for arbitrary Chrome exports.
5. Read-only Chrome extension prototype.
6. Browser-local snapshot import for extension exports.
7. Minimal browser-local review feedback.
8. Review feedback to local rule suggestions.
9. User-approved taxonomy overrides with explicit local report apply.
10. Local handoff polish: automatic report opening, one-click latest snapshot import, clean first-run state, local data clearing, and bilingual interface coverage.
11. Extension-only report page so the core scan-to-report flow can run without a local Next.js server.

## Validation checklist

Before calling an iteration complete:

- Run taxonomy audit.
- Run build.
- Confirm profile report is specific and includes uncertainty.
- Confirm public/private data mode is still respected.
- Confirm no new network calls or telemetry were added.
- Confirm review actions are local-first.
