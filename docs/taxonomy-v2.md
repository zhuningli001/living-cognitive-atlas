# Taxonomy v2: Personal Information Asset System

## 1. Why this taxonomy exists

This project is not only a bookmark manager. It is a personal information asset system.

The core user problems are:

- Old folders are historical artifacts. Similar research phases can create duplicated folders years apart.
- Saved links are rarely revisited, so the archive has weak retrieval and weak conversion.
- The timeline is scattered, making it hard to understand long-term interest shifts.
- Information lives across fragmented platforms such as browser bookmarks, newsletters, RSS, social follows, and future external connectors.
- Important sources publish continuously, but subscriptions often turn into unread noise.
- The archive should support both repeated lookup and personal growth reflection.

Taxonomy v2 should convert saved links into reusable knowledge signals:

- What is this resource?
- Why was it saved?
- How could it be reused later?
- Which long-term interest does it belong to?
- Is the source still useful?
- What pattern does it reveal about the user?

## 2. Design principles

### 2.1 Folders are evidence, not structure

Legacy folders should remain available as `legacy_folder_evidence`, but they should not decide final navigation.

Example:

- `AIGC`
- `AI Art`
- `Midjourney`
- `生成图像`
- `AI tools`

These may be separate old folders, but they should map into one or more canonical topics.

### 2.2 One stable category, many retrieval facets

A resource should have one stable `primary_category` for browsing, but multiple facet tags for search and analysis.

This follows the strongest pattern from modern information tools:

- Collections or folders provide stable orientation.
- Tags and filters provide flexible retrieval.
- Saved views provide repeatable workflows.

### 2.3 Tags must answer different questions

Do not mix theme, file type, user intent, and lifecycle in one tag soup.

Each layer has a different job:

| Layer | Question | Example |
| --- | --- | --- |
| `primary_category` | What knowledge area is this? | `AI, Product & Interaction` |
| `resource_type_tags` | What form is the resource? | `Tool`, `Article`, `Portfolio` |
| `action_tags` | What should I do with it? | `Read`, `Try`, `Reference`, `Clean Up` |
| `canonical_topics` | Which recurring interest does it express? | `Generative AI`, `Emotion Computing` |
| `meaning_tags` | Why does it matter personally? | `Project Material`, `Taste Marker` |
| `lifecycle_status` | What is its current value state? | `Active`, `Rediscover`, `Outdated` |

### 2.4 Reduce sorting labor

The system should not ask the user to become a librarian.

It should:

- Auto-classify with transparent rules.
- Surface low-confidence cases for review.
- Use old folders and repeated saves as clues.
- Convert passive saving into small review prompts.

### 2.5 Every rule needs a feedback metric

Classification should be measured after every iteration.

Useful metrics:

- Fallback category ratio.
- Generic resource type ratio.
- Passive action ratio.
- Over-matching tags.
- Low-confidence count.
- Rediscovery candidates.
- Duplicate cluster quality.

## 3. Proposed field model

### 3.1 Existing fields to keep

- `title`
- `url`
- `domain`
- `folder_path`
- `folder_path_array`
- `raw_folder`
- `add_date`
- `year`
- `normalized_url`
- `duplicate_count`
- `duplicate_cluster_id`
- `value_status`

### 3.2 Existing fields to refine

- `primary_category`
- `resource_type_tags`
- `action_tags`
- `worldview_tags`
- `human_state_tags`
- `interaction_paradigm_tags`
- `system_model_tags`
- `aesthetic_tags`
- `medium_tags`
- `region_tags`

### 3.3 New fields to add gradually

| Field | Purpose |
| --- | --- |
| `canonical_topics` | Merge similar old folders and repeated interests into stable topics. |
| `save_intent` | Explain why the item was probably saved. |
| `usefulness_reason` | Explain how the item can help in the future. |
| `source_importance` | Mark important sources, ordinary sources, noise, or unsubscribe candidates. |
| `classification_confidence` | Show whether the rule is strong, medium, or weak. |
| `classification_reasons` | Store the evidence behind tags. |
| `review_queue` | Mark items needing manual review or cleanup. |
| `interest_episode` | Group scattered years into meaningful research phases. |
| `conversion_potential` | Estimate whether the resource can become project material, study material, or reference material. |

## 4. Primary category v2

Primary categories should stay limited and stable. They are top-level doors, not every possible nuance.

Recommended set:

1. `AI, Product & Interaction`
2. `Visual Inspiration & References`
3. `Portfolios, Artists & Studios`
4. `Creative Coding & Computational Media`
5. `Design Systems & Interface Resources`
6. `Reading, Theory & Humanities`
7. `Institutions, Schools & Opportunities`
8. `Tools, Dev & Workflow`
9. `Life, Learning & Personal Growth`
10. `Needs Review`

Migration from v1:

| Current category | v2 direction |
| --- | --- |
| `Product, UX & AI` | Split into `AI, Product & Interaction`, plus other categories when the title/domain is not product-related. |
| `Utilities & Misc` | Rename to `Needs Review`, then reduce with better domain and topic rules. |
| `Build Tools & Development` | Rename or map to `Tools, Dev & Workflow`. |
| `Design Resources` | Split between `Design Systems & Interface Resources` and `Visual Inspiration & References`. |
| `Visual Reference Platforms` | Map to `Visual Inspiration & References`. |
| `Reading & Humanities` | Keep, but include deeper theory, culture, essays, publication archives. |
| `Art & Institutions` | Map to `Institutions, Schools & Opportunities` when it is a school, museum, grant, residency, or organization. |
| `Career & Language` | Map to `Life, Learning & Personal Growth`. |

## 5. Resource type v2

Resource type describes what the item is. It should not describe why it matters.

Recommended tags:

- `Article`
- `Essay`
- `Publication`
- `Tool`
- `App`
- `Documentation`
- `Tutorial`
- `Course`
- `Portfolio`
- `Studio Site`
- `Gallery`
- `Case Study`
- `Research Report`
- `Dataset`
- `Video`
- `Podcast`
- `Community`
- `Institution`
- `Opportunity`
- `Product Page`
- `Code Repository`
- `Newsletter`

Rules:

- `Reference` should become a fallback only when no clearer type exists.
- `Tool` should require strong evidence such as tool, app, generator, software, product page, pricing, docs, GitHub repo, or recognizable tool domains.
- `Community` should require forum, network, group, Discord, Reddit, GitHub org, Are.na channel, or community language.

## 6. Action tags v2

Action tags should convert passive saving into next action.

Recommended tags:

- `Read`
- `Watch`
- `Try`
- `Learn`
- `Reference`
- `Use in Project`
- `Compare`
- `Monitor`
- `Extract Notes`
- `Clean Up`
- `Unsubscribe`

Rules:

- `Archive` should not be the default for most items.
- Old, low-confidence, generic items should get `Clean Up`.
- Important recurring sources should get `Monitor`.
- Long articles and essays should get `Read` or `Extract Notes`.
- Tools and apps should get `Try` or `Compare`.
- Visual examples and portfolios should get `Reference` or `Use in Project`.

## 7. Canonical topics

Canonical topics merge scattered folder names, titles, and repeated saves into durable personal interests.

Initial topic candidates:

- `Generative AI`
- `AI Agents`
- `Emotion Computing`
- `Human-AI Interaction`
- `Creative Coding`
- `Data Visualization`
- `Design Systems`
- `Portfolio Inspiration`
- `Visual Storytelling`
- `Calm Technology`
- `Education & Learning`
- `Cultural Institutions`
- `Career Mobility`
- `Language Learning`
- `Personal Knowledge Systems`

Rules:

- Use exact domain/title/folder evidence first.
- Use synonyms and bilingual aliases.
- Keep canonical topics fewer than raw tags.
- Track old folder names that contributed to each topic.

## 8. Usefulness model

Each useful item should eventually answer one of these:

- `Project Material`: can support a future design, prototype, article, or presentation.
- `Study Material`: worth reading, watching, or extracting notes from.
- `Source to Monitor`: a platform or author worth periodically checking.
- `Taste Marker`: shows a recurring visual or conceptual preference.
- `Career Resource`: supports work, applications, positioning, or language growth.
- `Historical Signal`: reveals an old interest phase or long-term pattern.
- `Cleanup Candidate`: likely outdated, dead, duplicated, or low value.

This should feed `usefulness_reason` and `conversion_potential`.

## 9. Source importance

Sources should be classified separately from individual bookmarks.

Recommended values:

- `core_source`: repeatedly useful, worth monitoring.
- `specialist_source`: useful for a specific topic.
- `one_off_source`: saved once, not necessarily monitored.
- `noisy_source`: produces too much low-value content.
- `unsubscribe_candidate`: likely newsletter or feed noise.
- `dead_or_outdated`: unavailable, stale, or obsolete.

This prepares the project for future connectors such as newsletters, RSS, LinkedIn, WeChat subscriptions, and other fragmented inputs.

## 10. Hidden connection model

The system should not only retrieve resources. It should reveal connections the user may not see.

Connection types:

- `same_topic_different_year`: a theme disappears and returns later.
- `same_domain_different_folder`: the user saved the same source across contexts.
- `same_aesthetic_different_medium`: a visual preference appears in websites, videos, portfolios, and articles.
- `tool_to_theory_bridge`: a tool connects to a conceptual or cultural theme.
- `project_material_cluster`: separate links can support one possible future project.
- `blind_spot_warning`: a dominant topic lacks supporting perspectives.

Every connection should include evidence:

- Linked bookmarks.
- Years.
- Domains.
- Legacy folders.
- Matching tags.
- A short reason.

## 11. Validation targets

Taxonomy v2 should aim for:

- `Needs Review` below 20% after the first rule pass.
- `Reference` below 45% of resources.
- `Archive` below 45% of actions.
- No `medium_tags` value should apply to more than 80% of all bookmarks unless intentionally global.
- Every curated/public bookmark should have a stable `id`, primary category, resource type, action, and lifecycle status.
- Every new rule should reduce ambiguity or improve retrieval.

## 12. Sprint sequence

### Sprint 1: Taxonomy foundation

- Add taxonomy audit script.
- Document taxonomy v2.
- Run current audit.
- Identify first rules to fix.

### Sprint 2: Rule implementation

- Fix medium over-matching.
- Rename and reduce fallback categories.
- Add canonical topic aliases.
- Add classification confidence and reasons.

### Sprint 3: Review workflow

- Add `Needs Review` / low-confidence page.
- Add source importance and cleanup suggestions.
- Add saved views for recurring user workflows.

### Sprint 4: Insight layer

- Add interest episodes.
- Add hidden connection detection.
- Add personal profile summary.
- Add interactive graph/bubble views.

### Sprint 5: External source readiness

- Model newsletters, RSS, platform follows, and subscriptions as sources.
- Prepare source monitoring and digest workflows.
- Keep connectors optional and private-first.
