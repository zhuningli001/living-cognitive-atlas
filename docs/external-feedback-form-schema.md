# External Feedback Form Schema

Use this schema for Tally, Google Forms, Notion Forms, or any lightweight tester intake form.

Do not request exported bookmark snapshots, private URLs, or screenshots that reveal sensitive bookmarks.

## Section 1: Tester context

1. Tester name or handle
   - Type: short text
   - Optional

2. Browser
   - Type: single choice
   - Options: Chrome stable, Chrome beta/dev/canary, Chromium-based browser
   - Required

3. Operating system
   - Type: single choice
   - Options: macOS, Windows, Linux, ChromeOS, Other
   - Required

4. Chrome profile type
   - Type: single choice
   - Options: daily profile, fresh test profile, work profile, personal profile, other
   - Required

## Section 2: Test completion

5. Which steps did you complete?
   - Type: multiple choice
   - Options:
     - Installed the unpacked extension
     - Opened the side panel
     - Scanned bookmarks
     - Opened the built-in report
     - Marked feedback
     - Approved or ignored a suggested rule
     - Re-scanned after rule approval
     - Cleared local data
   - Required

6. Where did you get stuck?
   - Type: long text
   - Optional

## Section 3: Trust and privacy

7. Did the privacy boundary feel clear before scanning?
   - Type: single choice
   - Options: yes, partly, no, not sure
   - Required

8. Could you explain what data the extension reads?
   - Type: single choice
   - Options: yes, partly, no
   - Required

9. Could you explain where the data is stored?
   - Type: single choice
   - Options: yes, partly, no
   - Required

## Section 4: Profile quality

10. Which profile signal felt most accurate?
    - Type: long text
    - Required

11. Which profile signal felt wrong, too broad, or too confident?
    - Type: long text
    - Required

12. Did the side panel make sense at browser-panel width?
    - Type: single choice
    - Options: yes, mostly, partly, no
    - Required

13. Did the full report add useful depth beyond the side panel?
    - Type: single choice
    - Options: yes, mostly, partly, no
    - Required

## Section 5: Learning loop

14. Did feedback actions feel easy to understand?
    - Type: single choice
    - Options: yes, mostly, partly, no
    - Required

15. Did rule approval feel connected to later scans?
    - Type: single choice
    - Options: yes, partly, no, I did not get that far
    - Required

16. Would you open this extension again later?
    - Type: single choice
    - Options: yes, maybe, no, not sure
    - Required

17. What one change would make this more useful?
    - Type: long text
    - Required

## Scoring

Use a simple 0-2 score per tester:

- 0: blocked or confused before scan
- 1: completed scan/report but did not understand correction or trust boundary
- 2: completed scan/report/feedback/rule/reset and could explain the local privacy boundary

P0.7 passes if at least 3 testers score 2, or if blockers are specific enough to define the next P0 fix.
