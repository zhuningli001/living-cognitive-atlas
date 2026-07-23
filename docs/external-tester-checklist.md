# External Tester Checklist

Use this checklist for the first unpacked-extension testing round.

## Test goal

Validate whether a new user can complete the local profile loop without running the Next.js app:

```text
install extension
  -> scan bookmarks
  -> inspect side panel
  -> open report
  -> mark feedback
  -> approve or reject rules
  -> export or clear local data
```

## Before testing

- Use a Chrome profile whose bookmarks you are comfortable testing with.
- Do not share exported snapshot files publicly; they may include private URLs, folder names, and inferred interests.
- Remember that the MVP reads bookmark metadata only. It does not read page contents, history, passwords, cookies, or open tabs.
- The profile is an information portrait, not a personality diagnosis.

## Install

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the local `extension/` folder from this repository.
5. Open the `Chrome Memory Mirror` side panel.

## Test path

1. Confirm the first-run state is empty and has no sample profile data.
2. Click `Scan bookmarks`.
3. Confirm the compact dashboard appears in the side panel.
4. Confirm the tester loop marks `Scan bookmarks` as complete.
5. Click `Open full report`.
6. Confirm the built-in extension report opens without a localhost page.
7. Mark at least one feedback action in the report.
8. Approve or ignore at least one suggested rule.
9. Return to the side panel and confirm the tester loop reflects feedback or rule progress.
10. Click `Clear data` and confirm the reset dialog is clear.

## Feedback questions

- Did the permission boundary feel understandable before scanning?
- Did the side panel make sense at browser-panel width?
- Which profile signal felt accurate?
- Which profile signal felt wrong, too broad, or too confident?
- Did feedback and rule approval feel connected to later scans?
- Could you explain where the data is stored?
- Would you open the extension again after the first scan?

## Pass condition

P0.5 passes when a tester can install, scan, inspect, correct, approve a rule, and clear local data without developer help or a local web server.
