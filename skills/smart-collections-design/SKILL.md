---
name: smart-collections-design
description: Design user-facing smart collections, saved views, dashboards, and navigation entry points from a deeper taxonomy or personal information archive. Use when the user wants to convert classified bookmarks, links, notes, sources, or knowledge assets into practical collection cards, retrieval surfaces, review queues, search filters, or calm product experiences that reflect real return habits rather than raw taxonomy fields.
---

# Smart Collections Design

## Overview

Convert an information management layer into a usable product surface. Smart collections are not taxonomy categories; they are user-facing doorways based on how a person returns to information.

## Design Principle

Do not expose every taxonomy field as navigation. Use taxonomy as intelligence underneath the interface, then design fewer, stronger entry points around user jobs.

Default user jobs for personal link archives:

- Quickly open accounts, communities, and portals.
- Return to reading, learning, and research material.
- Reuse tools, plugins, and workflow resources.
- Handle low-frequency life admin links.
- Browse inspiration, references, portfolios, and examples.
- Monitor important sources and recurring signals.
- Review, clean up, or improve uncertain records.
- Understand attention, interests, and personal development over time.

## Workflow

1. Identify real return habits.
   - Infer what the user is trying to do when they come back to the archive.
   - Prefer behavior-based groups over knowledge-area groups when designing the first screen.

2. Map taxonomy fields to collection logic.
   - Use `primary_category` for broad inclusion.
   - Use `resource_type_tags` for shape: tool, article, portfolio, documentation, video, community.
   - Use `action_tags` for intent: read, try, reference, monitor, cleanup.
   - Use `canonical_topics` for deeper filtering and saved views.
   - Use `source_importance`, `classification_confidence`, and `value_status` for review and monitoring.

3. Define each collection as a contract.
   - `slug`: stable route or identifier.
   - `label`: clear user-facing name.
   - `short_label`: compact label for cards or mobile.
   - `description`: one sentence about the return habit.
   - `query`: serializable filter state when possible.
   - `match`: precise inclusion logic.
   - `subgroups`: 3-5 useful subdivisions.
   - `empty_state`: what to show when no items match.
   - `primary_action`: open, search, review, export, monitor, compare, or clean up.

4. Design multiple surfaces, not one overloaded dashboard.
   - Home: fast orientation and quick return.
   - Collections: user-facing cabinets by return habit.
   - Search: precise retrieval and advanced filters.
   - Review: finite queue for correction and cleanup.
   - Atlas: inspect the management layer.
   - Evolution: understand long-term attention shifts.
   - Signals: monitor sources and generate digests.

5. Validate usefulness.
   - Check that each collection has enough items to matter.
   - Ensure collections overlap intentionally; one item may support several workflows.
   - Remove collections that are merely taxonomy labels in disguise.
   - Confirm each card answers "why would I click this now?"

## Starter Collection Set

Use this set as a starting point, then adapt to the archive:

- Accounts and Communities
- Reading and Learning
- Tools and Plugins
- Life Admin and Portals
- Inspiration and References
- Sources to Monitor
- Review and Cleanup
- Interest Evolution

## Output Format

Return:

- A short design rationale.
- The final collection list.
- For each collection: label, purpose, inclusion rules, subgroups, primary action, and example items if available.
- Suggested dashboard/search/review/evolution surfaces.
- A validation checklist for whether the collections are too broad, too narrow, or too taxonomic.

## Quality Bar

- Prefer 5-8 strong entry points over many small categories.
- Keep labels plain and action-oriented.
- Hide advanced taxonomy unless it helps the current task.
- Make review tasks finite and low-friction.
- Make automation feel calm: source monitoring and recommendations should reduce noise.
