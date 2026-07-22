---
name: information-asset-audit
description: Audit personal information archives, bookmark datasets, note collections, source lists, taxonomies, or cognitive atlas projects for classification quality, retrieval value, privacy risk, stale sources, duplicate clusters, low-confidence items, over-broad categories, and next rule-learning opportunities. Use when the user wants feedback, metrics, diagnostics, or an iteration plan for an information asset system.
---

# Information Asset Audit

## Overview

Evaluate whether a personal archive is becoming more usable, explainable, and alive. Focus on measurable taxonomy health, retrieval usefulness, privacy posture, and learning opportunities.

## Audit Loop

Use a plan-execute-feedback loop:

1. Plan: identify the archive shape, available fields, user goal, and fastest trustworthy checks.
2. Execute: compute or inspect distributions, samples, edge cases, and representative records.
3. Feedback: report risks, what improved, what remains unclear, and the next smallest rule or product change.

## Metrics

Track these whenever data allows:

- Fallback category ratio: share of items in misc, unknown, or needs-review categories.
- Generic resource type ratio: share of items tagged only as reference, link, page, or item.
- Passive action ratio: share of items with no next action or only archive/store intent.
- Low-confidence count: items whose evidence is too weak for automation.
- Over-matching rules: tags or facets appearing on an implausibly high share of records.
- Duplicate clusters: repeated saves that indicate recurring interest or cleanup candidates.
- Source importance distribution: core sources, specialist sources, one-off sources, noise.
- Lifecycle distribution: active, evergreen, rediscover, stale, outdated, cleanup.
- Public/private risk: fields or records that should not be included in public artifacts.

## Thresholds

Use thresholds as prompts for investigation, not absolute truth:

- Fallback category above 20%: likely category or domain rules are missing.
- Generic resource type above 45%: resource typing is too weak.
- Passive action above 45%: the system is storing more than helping.
- Any medium/topic tag above 80%: likely over-matching.
- Low confidence above 25%: review queue or evidence extraction needs improvement.
- One source/domain dominating unexpectedly: inspect source concentration and blind spots.

## Sampling

Always include concrete samples. Good buckets:

- Needs review: low-confidence and fallback items.
- Repeated interest: duplicates, repeated domains, or recurring canonical topics.
- Stale or fragile: old tools, dead platforms, redirects, login portals, abandoned services.
- High-value sources: sources marked core, specialist, monitored, or repeatedly saved.
- Boundary cases: items that could belong to multiple categories.

## Output Format

Lead with findings:

1. Health summary: overall condition in 3-5 sentences.
2. Metrics: compact table or bullets with counts and percentages.
3. Findings: prioritized issues with evidence and likely cause.
4. Samples: representative records to inspect.
5. Next iteration: smallest useful taxonomy, data, UI, or review-flow changes.
6. Feedback capture: what user decisions should be stored for future rule learning.

## Quality Bar

- Prefer measured evidence over aesthetic impressions.
- Name uncertainty clearly.
- Avoid exposing private links, secrets, or sensitive personal records in summaries.
- Suggest small, reviewable improvements rather than sweeping reclassification.
- Treat audit as a learning system, not a pass/fail report.
