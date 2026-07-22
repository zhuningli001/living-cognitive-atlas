---
name: personal-taxonomy-architect
description: Design reusable personal taxonomies for messy saved links, bookmarks, notes, research archives, reading lists, source lists, or other personal knowledge collections. Use when the user wants to turn raw folders, URLs, tags, titles, or accumulated information traces into stable categories, facets, canonical topics, save intent, usefulness signals, lifecycle status, cognitive profile keywords, and a system that can keep learning over time.
---

# Personal Taxonomy Architect

## Overview

Turn a messy personal archive into a private cognitive infrastructure. Preserve historical organization as evidence, then design a layered taxonomy that supports retrieval, reflection, review, and future automation.

## Core Principle

Treat old folders, existing tags, and repeated saves as evidence, not final structure. The final model should separate stable orientation from flexible retrieval and personal meaning.

Use this split:

- Stable category: one main home for browsing.
- Retrieval facets: many tags for type, topic, medium, action, and context.
- Personal meaning: why the item mattered and how it could be reused.
- Lifecycle: active, evergreen, rediscover, outdated, low-value, or needs review.
- Evidence: title, URL, domain, source, folder path, timestamp, duplicate pattern, and user feedback.

## Workflow

1. Build an evidence map.
   - Inspect available data fields before proposing a model.
   - Identify legacy folder patterns, repeated topics, source domains, time ranges, and obvious private/public boundaries.
   - Note weak evidence rather than pretending ambiguous items are clear.

2. Define the layered field model.
   - Keep top-level categories few and stable, usually 6-12.
   - Separate `primary_category`, `resource_type_tags`, `action_tags`, `canonical_topics`, `save_intent`, `usefulness_reason`, `source_importance`, `classification_confidence`, `classification_reasons`, and `value_status`.
   - Add domain-specific fields only when they unlock a real workflow.

3. Create canonical topics.
   - Merge bilingual aliases, old folder variants, repeated saves, and synonymous phrases into durable interests.
   - Keep canonical topics fewer than raw tags.
   - Track which old folders or title/domain evidence contributed to each topic.

4. Infer cognitive profile signals.
   - Summarize recurring interests, source preferences, resource modes, action tendencies, and time-based shifts.
   - Phrase profile outputs as hypotheses grounded in data, not psychological certainty.
   - Prefer labels the user can act on: "AI prototyping", "portfolio inspiration", "source monitoring", "visual storytelling", "personal knowledge systems".

5. Design the learning loop.
   - Give every rule a confidence level and explanation.
   - Route low-confidence or high-impact cases to a small review queue.
   - Convert review decisions into rule updates, manual overrides, or new canonical topics.

## Recommended Output

Return a compact architecture package:

- Taxonomy purpose: what user problem this model solves.
- Field model: names, definitions, value examples, and required evidence.
- Category set: stable top-level categories with inclusion/exclusion rules.
- Facet sets: resource type, action, canonical topic, meaning, lifecycle, and source importance.
- Profile signals: repeatable way to derive persona keywords and development lines.
- Review strategy: which cases need human feedback and how feedback should update the system.
- Validation metrics: fallback ratio, generic tag ratio, low-confidence count, duplicate clusters, stale-source ratio, and over-matching rules.

## Quality Bar

- Do not expose internal taxonomy as the homepage mental model.
- Do not create a tag soup that mixes topic, file type, action, and personal meaning.
- Do not overfit to the current sample if the archive is meant to grow.
- Do not ask the user to manually maintain the whole system.
- Prefer transparent rules first; add AI enrichment only when the feedback loop is clear.

## Coordination

Pair with `$information-asset-audit` after rules exist. Pair with `$smart-collections-design` when converting the taxonomy into user-facing navigation.
