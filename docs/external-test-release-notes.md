# External Test Release Notes

## 0.1.1 - P0.7 small cohort release readiness

This release is for the first 3-5 person external testing round. It is still an unpacked Chrome extension MVP, not a Chrome Web Store release.

### What to test

- Install the unpacked extension without running the Next.js app.
- Scan Chrome bookmarks from the side panel.
- Open the built-in extension report.
- Mark feedback on profile signals.
- Approve or ignore one suggested rule.
- Re-scan and check whether approved local rules are applied.
- Clear local extension data when finished.

### What changed

- Added `npm run package-extension` to build a local tester package under `dist/`.
- The package script validates the extension permission boundary before copying files.
- The generated package includes tester README, release notes, checklist, and checksum artifacts.
- Added a GitHub Issue template for structured extension test feedback.
- Added a side-panel tester loop, stale snapshot warning, and clear-data confirmation in the previous P0.5 step.
- Added a GitHub Release draft for `v0.1.1`.
- Added tester invitation copy for a small external cohort.
- Added a feedback form schema for Tally, Google Forms, or Notion Forms.
- Added a cohort retrospective template for deciding the next loop from evidence.

### Privacy boundary

- The extension requests only `bookmarks`, `storage`, and `sidePanel`.
- It does not request host permissions, content scripts, browsing history, identity, cookies, passwords, or bookmark write APIs.
- It does not upload bookmark-derived data.
- Exported snapshots may contain private URLs and inferred interests, so they should not be shared publicly.

### Known limitations

- This version still uses local keyword/rule analysis rather than semantic AI analysis.
- Profile labels are hypotheses and can be wrong, broad, or overconfident.
- Production icons, Chrome Web Store screenshots, support URL, and final privacy policy URL are not finished.
- The extension is intended for unpacked local testing only.

### Pass condition

P0.7 passes when 3-5 testers can receive the package, complete the scan-to-report-to-feedback loop, submit structured feedback, and leave enough evidence to decide whether the next loop should keep, simplify, deepen, fix, or remove.
