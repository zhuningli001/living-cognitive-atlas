# Living Cognitive Atlas Product Concept

## Core idea

Living Cognitive Atlas is a personal cognitive infrastructure that grows from a user's saved information traces.

It is not a fixed bookmark taxonomy and not a mechanical folder cleaner. It starts from evidence, forms a provisional portrait, accepts lightweight human correction, and turns repeated feedback into reusable rule suggestions.

The product should feel like a local, explainable information organism:

- it observes only traces the user explicitly grants
- it makes tentative inferences
- it shows uncertainty
- it lets the user correct it
- it learns only through visible, reversible rules

## Product loop

```text
Saved traces
  -> local inference
  -> personal mirror
  -> lightweight feedback
  -> rule suggestions
  -> approved local rules
  -> better future inference
```

This turns the product from a one-time analysis tool into a growing personal information system.

## Five layers

### 1. Trace layer

The factual evidence left by the user:

- bookmark title
- URL
- domain
- folder path
- saved year
- repeated saves
- exported snapshots

This layer should stay private, portable, and inspectable.

### 2. Inference layer

The system translates traces into working hypotheses:

- topics
- resource types
- return actions
- source importance
- development stages
- review risk
- smart return paths

This layer must stay explainable. It should say what evidence produced a label.

### 3. Mirror layer

The user-facing portrait:

- profile headline
- dominant dimensions
- weighted interests
- development line
- source structure
- review queue

This layer should be useful for reflection without pretending to be a personality diagnosis.

### 4. Feedback layer

The user corrects the system with minimal actions:

- accurate
- wrong topic
- important
- review later

The goal is not manual cataloging. The goal is to collect just enough judgment to improve future inference.

### 5. Learning layer

Repeated feedback becomes rule suggestions:

- increase importance for a recurring domain
- create a topic rule for a frequently wrong domain
- keep a rule that users repeatedly confirm
- defer uncertain categories instead of hardening them

The system may suggest rules, but the user should approve them before they become durable behavior.

## Design principles

- Evidence before interpretation.
- Local-first before cloud intelligence.
- Suggestions before automation.
- User approval before durable rules.
- Small feedback before heavy management.
- Living structure before fixed taxonomy.

## Current MVP milestone

The current MVP already supports:

- Chrome extension bookmark scan
- local snapshot export
- browser-local snapshot import
- web taxonomy/profile recalculation
- minimal local feedback
- feedback export
- rule suggestion generation

The next milestone is making the extension test-ready for external users with clearer first-run, scan-success, scan-error, stale-data, and reset states.

## Rule approval layer

Rule approval is the point where the system stops merely observing and asks for user consent before changing long-term behavior.

Current rule approval behavior:

- suggestions are generated from feedback
- the user can approve or revoke a suggestion
- approved rules are stored locally as `approved-rules/v1`
- approved rules can be inspected in local extension storage
- approved rules can shape later extension-local scans
- each scan records applied rules as an audit trail

This keeps the system organic without making it autonomous in a way the user cannot inspect.

## Local override config

Approved rules can be compiled into `taxonomy-overrides/v1`.

This config is the bridge between consent and future behavior:

- domain importance overrides
- domain topic review rules
- confirmed category rules
- deferred category rules

The config is generated locally and can be exported. It is not automatically written into the main taxonomy engine until a later explicit apply step exists.

## Explicit apply layer

The explicit apply step turns approved rules into a visible experiment on the current report.

Current behavior:

- the user approves a rule suggestion
- the system compiles it into a local taxonomy override
- the user chooses which overrides to apply to the current report
- the report is recalculated in the browser with those selected overrides
- applied overrides can be undone without changing source bookmarks or global taxonomy files

This keeps the product alive and adaptive, while preserving user agency. The system can learn patterns, but durable behavior remains inspectable, reversible, and consent-based.
