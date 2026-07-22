# Information Architecture

This project has two separate layers.

## 1. Information management layer

This layer explains and maintains the archive.

It answers:

- What is this resource?
- Which long-term topic does it belong to?
- Why was it probably saved?
- Is it still useful?
- How confident is the classification?
- Which sources deserve future monitoring?

Core fields:

- `primary_category`
- `resource_type_tags`
- `action_tags`
- `canonical_topics`
- `save_intent`
- `usefulness_reason`
- `source_importance`
- `classification_confidence`
- `classification_reasons`
- `value_status`

This layer powers search, review, insight, taxonomy audits, and future connectors.

## 2. User display layer

This layer helps the user return to resources quickly.

It should not expose every taxonomy detail. It should group resources by real return habits:

- Accounts and communities.
- Reading and learning.
- Tools and plugins.
- Life admin and portals.
- Inspiration and references.
- Sources to monitor.
- Review and cleanup.

This layer is implemented as `Smart Collections`.

Each collection is a user-facing doorway built from the management layer. The same bookmark can belong to multiple collections because real use is multi-context.

## Design rule

Do not use taxonomy fields directly as the homepage mental model.

Taxonomy is for understanding the archive.

Smart Collections are for using the archive.

Keep the user layer minimal:

- One screen should answer one main question.
- Prefer 5-8 strong entry points over many small categories.
- Hide technical labels unless they help the current action.
- Use analysis as explanation, not decoration.
- Make every card clickable or clearly informational.
- Avoid asking the user to manually maintain the whole system.

## Keep multiple user surfaces

The homepage dashboard is not a replacement for search, review, atlas, or evolution pages.

Each surface has a different user job:

- `Home`: fast orientation and quick return.
- `Collections`: user-facing resource cabinets by return habit.
- `Search`: precise retrieval and advanced filtering.
- `Review`: improve classification quality and cleanup unclear resources.
- `Atlas`: inspect the information management layer.
- `Evolution`: understand long-term interests and growth.
- `Signals`: prepare source-monitoring and digest workflows.

User-facing design should decide which surface fits the user's current intent instead of forcing all tasks into one page.
