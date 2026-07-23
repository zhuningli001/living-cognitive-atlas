# MVP Iteration Loop

Chrome Memory Mirror should be developed as a living personal information system, not a fixed bookmark organizer.

The product should learn from a user's real bookmark structure, surface useful patterns, accept human correction, and gradually turn repeated feedback into better local rules.

## Product direction

The core product promise is:

```text
Chrome bookmarks
  -> local scan
  -> compact personal dashboard
  -> full cognitive profile
  -> human feedback
  -> approved local rules
  -> better future analysis
```

The important loop is not classification alone. The important loop is whether the system can become more useful after the user reviews it.

## Iteration principles

- Keep the user's data local by default.
- Make every inference inspectable and correctable.
- Prefer small human feedback actions over long setup forms.
- Promote repeated corrections into explicit rules.
- Avoid treating the portrait as a final identity judgment.
- Ship one complete loop before adding new intelligence layers.

## MVP 1.2 goal

MVP 1.2 should make the extension feel like a real product that a new user can install, scan, inspect, correct, and reset without opening the local Next.js app.

Primary goal:

```text
Make the extension-only flow complete enough for first external testers.
```

Key user question:

```text
Can a first-time user understand what the extension reads, generate a useful profile, correct obvious mistakes, and trust where their data lives?
```

## MVP 1.2 scope

Build next:

- Extension options page for name, language, export, reset, and privacy boundary.
- Extension report feedback controls for misclassified topics, dimensions, and collection candidates.
- Rule approval view inside the extension, using only local storage.
- Better empty, loading, success, and error states for first-run testing.
- A compact side-panel summary optimized for narrow browser panels.

Do not build yet:

- Cloud sync.
- Account login.
- Browser history reading.
- Bookmark write-back.
- Automatic network upload.
- Full semantic embedding search.

## Execution plan

Current progress:

- Step 1 is implemented as `extension/options.html`.
- Step 2 is implemented as minimal report feedback stored in `chrome.storage.local` under `profileFeedback`.
- Step 3 is implemented as local rule approval stored under `approvedRules` and `ignoredRuleSuggestions`.
- Step 4 is implemented by applying matching approved rules during extension scans and recording `snapshot.appliedRules`.
- Step 5 is the next P0 loop.

### Step 1: Stabilize settings

Build an `options.html` page for:

- display name
- interface language
- export snapshot
- clear local data
- privacy explanation

Expected result:

- A user can personalize the extension without editing code.
- Settings apply consistently to side panel and report page.

### Step 2: Move feedback into the extension report

Add minimal correction controls:

- mark a dimension as accurate or inaccurate
- mark a topic as too broad, too narrow, or wrong
- mark a collection as useful or not useful

Expected result:

- Feedback is saved locally.
- The report can show what the system has learned from feedback.

### Step 3: Add rule approval

Turn repeated feedback into suggestions:

- proposed keyword rule
- proposed source/domain rule
- proposed collection rule
- approve, reject, or keep pending

Expected result:

- Approved rules are stored in `chrome.storage.local`.
- A new scan can apply approved local rules.

### Step 4: Improve trust and recovery

Add product safeguards:

- first-run privacy checkpoint
- scan error recovery
- empty bookmark state
- stale snapshot warning
- clear-data confirmation

Expected result:

- A tester can recover from common problems without developer help.

### Step 5: Prepare external testing

Package a test build with:

- version number
- install notes
- tester checklist
- known limitations
- feedback questions

Expected result:

- A non-developer can install the unpacked extension and complete the test flow.

Implemented P0.5:

- `docs/external-tester-checklist.md` defines install steps, test path, feedback questions, and pass condition.
- The side panel includes a compact tester loop for scan, report, feedback, rule approval, and reset progress.
- The side panel warns when a stored snapshot is older than 7 days.
- Clear-data in the side panel now requires confirmation and states that Chrome bookmarks are not changed.

Implemented P0.6:

- `npm run package-extension` creates a versioned unpacked extension package under `dist/`.
- The package script validates the extension permission boundary before copying files.
- `docs/external-test-release-notes.md` records the current external test scope, known limits, and pass condition.
- `.github/ISSUE_TEMPLATE/extension-test-feedback.yml` collects structured tester feedback without asking for private bookmark data.

Implemented P0.7:

- `.github/release-drafts/chrome-memory-mirror-v0.1.1.md` provides the GitHub Release draft for the first external cohort.
- `docs/tester-invitation.md` provides tester invitation and follow-up copy.
- `docs/external-feedback-form-schema.md` provides a structured external feedback form schema.
- `docs/test-cohort-retrospective.md` provides the post-test review template and next-loop decision frame.

Implemented P0.8:

- `docs/p0.8-test-execution-runbook.md` defines the live 3-5 tester execution schedule.
- `docs/p0.8-cohort-tracker.csv` tracks invitations and completion channels.
- `docs/p0.8-feedback-log.csv` captures structured tester outcomes without private bookmark data.
- `npm run summarize-cohort` turns the feedback log into a P0.8 decision summary.
- `npm run package-extension` now also creates a P0.8 operator kit under `dist/`.

## Review method

After each step, record:

- What changed?
- What user action became easier?
- What new confusion appeared?
- What data stayed local?
- What should be removed or simplified?
- What should become a rule, setting, or future feature?

## Success metrics

MVP 1.2 is working if:

- A new tester can install the extension and scan bookmarks without a local server.
- The first-run page has no sample personal data.
- The side panel gives a useful summary within a narrow browser panel.
- The full report opens from the extension and reflects the latest scan.
- The tester can correct at least three types of analysis mistakes.
- The tester can approve or reject suggested rules.
- The tester can export and clear local data.
- The tester can explain what data the extension reads and where it is stored.

## Retrospective template

Use this after each cycle:

```text
Cycle:
Goal:
Changed:
Validated:
User friction:
Useful surprise:
Privacy risk:
Decision:
Next smallest step:
```

Decisions should use one of four labels:

- Keep: the feature clearly helps.
- Simplify: the idea is right but the interaction is too heavy.
- Deepen: the feature works and deserves more intelligence.
- Remove: the feature adds confusion or weakens trust.

## Current open optimization areas

- Side panel should become the primary compact dashboard, not a miniature full report.
- Full report should prioritize growth path, dominant dimensions, feedback, and rule learning.
- The local report should not depend on decorative visual density.
- Language switching should cover all user-visible text.
- Data reset should be obvious and reversible only through a new scan or import.
- Exported snapshots should be clearly marked as private.
- Rule suggestions should explain why they were proposed.
- Future AI features should be opt-in and explain what leaves the device, if anything.
