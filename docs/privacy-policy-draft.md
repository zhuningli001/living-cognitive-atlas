# Privacy Policy Draft

This draft describes the intended public behavior of Chrome Memory Mirror. It should be reviewed before any Chrome Web Store submission.

## Summary

Chrome Memory Mirror is designed as a local-first bookmark analysis tool. It reads Chrome bookmarks only after the user installs the extension and grants the bookmark permission.

## Data read by the extension

The extension reads:

- bookmark titles
- bookmark URLs
- bookmark folder paths
- bookmark saved dates when available
- bookmark domains derived from URLs

The extension does not read:

- browsing history
- page contents
- cookies
- passwords
- tabs outside the extension workflow
- Google account profile information

## Data storage

MVP data is stored locally in the browser using `chrome.storage.local` or page `localStorage`.

Stored data may include:

- generated profile snapshot
- language setting
- display name
- local feedback decisions
- approved local rules
- local taxonomy override state

## Data sharing

The MVP does not upload bookmark data to a server.

Exports are user-initiated. Exported JSON files may contain private bookmark URLs, folder paths, and profile analysis, so users should keep them private unless they intentionally want to share them.

## Data deletion

Users can clear extension snapshot data from the side panel, report page, or options page.

Users can reset report data from the report page, which clears:

- imported snapshot
- local feedback
- approved rules
- applied overrides

The extension options page includes the same local reset boundary for the MVP.

## Permissions

The intended public MVP permissions are:

- `bookmarks`
- `storage`
- `sidePanel`

The extension should not request browsing history, all-site access, identity, or bookmark write permissions unless a future version adds a clear user-facing feature requiring them.
