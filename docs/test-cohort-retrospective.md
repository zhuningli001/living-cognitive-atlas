# Test Cohort Retrospective

Use this after each 3-5 person external testing round.

## Cohort

- Release:
- Date range:
- Number of invited testers:
- Number of completed tests:
- Package:
- Feedback channels:

## Goal

Validate whether external testers can complete this loop without developer help:

```text
install
  -> scan
  -> side-panel profile
  -> full report
  -> feedback
  -> rule approval
  -> re-scan
  -> reset
```

## Results table

| Tester | Installed | Scanned | Opened report | Gave feedback | Approved rule | Re-scanned | Cleared data | Score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 |  |  |  |  |  |  |  |  |
| T2 |  |  |  |  |  |  |  |  |
| T3 |  |  |  |  |  |  |  |  |
| T4 |  |  |  |  |  |  |  |  |
| T5 |  |  |  |  |  |  |  |  |

Score:

- 0: blocked before useful scan
- 1: completed scan/report but trust or correction loop was unclear
- 2: completed scan/report/feedback/rule/reset and understood the local privacy boundary

## Pattern review

### Install and permission

- What confused testers before scanning?
- Did the bookmark permission feel acceptable?
- Did any tester fail to load the unpacked extension?

### Side panel

- Did the narrow dashboard communicate enough?
- Which information was ignored?
- Which information did testers want sooner?

### Full report

- Did the report feel like useful depth or too much detail?
- Which section created trust?
- Which section created confusion?

### Profile quality

- Accurate signals:
- Wrong or broad signals:
- Missing signal types:
- Overconfident language:

### Feedback and rule learning

- Did testers understand feedback buttons?
- Did rule suggestions feel legible?
- Did re-scan make improvement visible?

### Privacy and reset

- Could testers explain what data was read?
- Could testers explain where data was stored?
- Did clear-data behavior feel safe?

## Decision

Choose one:

- Keep: the loop works; continue to broader cohort.
- Simplify: testers completed the loop but found it too heavy.
- Deepen: testers understood the loop and want richer profile quality.
- Fix P0: blockers prevent repeatable external testing.
- Remove: a feature created confusion without adding trust or value.

## Next loop

- Target user question:
- Smallest product change:
- Success signal:
- Privacy risk:
- Files or surfaces likely affected:

## P0.8 pass condition

P0.8 passes when at least 3 testers complete the loop with score `2`, or when the blockers are specific enough to define the next P0 fix.
