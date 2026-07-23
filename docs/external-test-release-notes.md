# External Test Release Notes

## 0.1.1 - P0.8 small cohort execution

This release is for executing the first 3-5 person external testing round. It is still an unpacked Chrome extension MVP, not a Chrome Web Store release.

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
- Added `docs/p0.8-test-execution-runbook.md`, cohort tracker CSV, and feedback log CSV.
- Added `npm run summarize-cohort` to turn the feedback log into a decision summary.
- The package command now creates an operator kit for the person running the cohort.

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

P0.8 passes when 3-5 testers complete the loop or reveal specific blockers, and the team can use the cohort summary to decide whether the next loop should keep, simplify, deepen, fix, or remove.
