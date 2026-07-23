# Chrome Memory Mirror v0.1.1 - External Tester Release Draft

This is a draft release note for the first small external testing cohort.

Chrome Memory Mirror is still an unpacked Chrome extension MVP. It is not a Chrome Web Store release.

## Assets to attach

- `chrome-memory-mirror-v0.1.1-unpacked.zip`
- `chrome-memory-mirror-v0.1.1-unpacked-manifest-summary.json`
- `chrome-memory-mirror-v0.1.1-unpacked-checksums.txt`

Generate them with:

```bash
npm run package-extension
```

## What testers should validate

- The extension can be installed from the unpacked package.
- The side panel starts empty before scanning.
- `Scan bookmarks` creates a compact local profile.
- `Open full report` opens the built-in extension report, not a localhost page.
- Feedback can be marked in the report.
- Suggested rules can be approved or ignored.
- Re-scanning applies approved local rules.
- `Clear data` removes extension-local data without changing Chrome bookmarks.

## Privacy boundary

- Permissions: `bookmarks`, `storage`, `sidePanel`.
- No host permissions.
- No content scripts.
- No browser history permission.
- No identity/profile permission.
- No bookmark write APIs.
- No network upload.

Bookmark-derived exports can include private URLs, folder names, and inferred interests. Testers should not post exported snapshots, private URLs, or sensitive screenshots in GitHub Issues.

## Feedback

Use GitHub Issues with the `Extension test feedback` template.

Useful feedback:

- Where did install or scanning become confusing?
- Did the privacy boundary feel clear before scanning?
- Did the compact side panel make sense in a real browser side panel?
- Which profile signals felt accurate?
- Which profile signals felt wrong, too broad, or too confident?
- Did feedback and rule approval feel connected to later scans?
- Could the tester explain where the data is stored?

## Known limitations

- Analysis is local keyword/rule based, not semantic AI analysis.
- Profile labels are working hypotheses, not psychological diagnosis.
- Production icons and Chrome Web Store screenshots are not final.
- Privacy policy and support URL are draft-stage.
- This release is meant for 3-5 invited testers, not a public launch.

## Pass condition

This release is successful if 3-5 testers can install, scan, inspect, correct, approve a rule, clear local data, and submit structured feedback without developer help.
