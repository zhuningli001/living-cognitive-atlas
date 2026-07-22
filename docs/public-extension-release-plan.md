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
- The manifest no longer declares localhost content-script matches.

Remaining productization work:

- Move deeper feedback/rule-learning controls from `/profile/import` into extension pages.
- Keep all snapshot, feedback, rule, and override data in `chrome.storage.local`.
- Keep manual JSON export/import as a portability fallback.

## Public package checklist

Before a public installable build:

- Add extension icons in Chrome Web Store sizes.
- Add `options.html` for display name, language, data reset, and export settings.
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

## Later options

Hosted report mode can be explored later, but only if the product clearly separates local analysis from any cloud features and asks for explicit consent before uploading bookmark-derived data.
