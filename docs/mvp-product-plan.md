# MVP Product Plan: Chrome Memory Mirror

## Product position

Chrome Memory Mirror is a local-first personal information portrait board hidden inside the user's Chrome bookmarks.

With explicit bookmark permission, it reads the user's saved links and turns them into:

- interest keywords
- canonical topics
- source patterns
- resource modes
- return actions
- time-based development lines
- smart collections
- review queues

This is not a generic bookmark manager. It is a personal cognitive infrastructure that helps a person understand and reuse the information traces already living in Chrome.

The deeper product frame is documented in `docs/living-cognitive-atlas-product-concept.md`: the system should behave like a local, explainable information organism that observes traces, forms hypotheses, accepts feedback, and proposes rules instead of locking the user into a fixed taxonomy.

## MVP promise

When a user grants bookmark access, the product should answer:

1. What topics has this person cared about over time?
2. Which sources and domains shape their information diet?
3. What kinds of resources do they save: tools, articles, portfolios, videos, communities, portals, or references?
4. What actions do those links imply: read, try, reference, monitor, clean up, or revisit?
5. Which interests are recurring, fading, newly emerging, or worth developing?
6. Which parts of the profile are low-confidence and need user confirmation?

The output should be framed as evidence-based information behavior, not as psychological diagnosis.

## MVP user flow

1. User installs or opens the prototype.
2. Product explains the privacy model before requesting access.
3. User grants read-only bookmark permission.
4. Product reads the bookmark tree.
5. Product normalizes titles, URLs, domains, folders, timestamps, and duplicates.
6. Product applies transparent taxonomy rules.
7. Product generates a profile report.
8. Product shows smart collections for practical return.
9. User reviews low-confidence or sensitive items in small batches.
10. User feedback improves local rules and profile confidence.

## Minimum surfaces

### Side panel

The Chrome extension MVP should default to a compact side panel, not a full-screen dashboard.

The side panel should show only:

- one profile headline
- current development phase
- top interest keywords
- strongest profile dimensions
- 3-4 smart collection entry points
- one review prompt
- a clear link to the full profile report

The side panel should feel like a small personal dashboard that can be understood in under 30 seconds while the user keeps browsing.

### Profile

The profile surface is the full report behind the side panel.

It should show:

- one evidence-based profile headline
- top interests and keywords
- dominant information dimensions
- resource type rhythm
- return action rhythm
- source and domain structure
- time-based attention changes
- classification leads
- low-confidence caveats

### Collections

Collections turn analysis into use.

Starter collections:

- Accounts and Communities
- Reading and Learning
- Tools and Plugins
- Life Admin and Portals
- Inspiration and References
- Sources to Monitor
- Review and Cleanup

### Review

Review should be finite and lightweight.

The first version should support:

- accept classification
- mark important
- monitor source
- cleanup later
- skip
- export local decisions

### Privacy

The privacy surface should be visible before and after authorization.

It should say:

- bookmarks are read only
- analysis is local-first by default
- no automatic cloud upload
- no automatic bookmark modification
- profile cache can be deleted
- exported reports may contain sensitive personal traces

MVP 1.1 adds a small local-data control in the extension side panel. Users can clear the stored bookmark snapshot without deleting their display name, language, or local report URL settings.

### Local handoff

The extension should avoid making users export and re-upload JSON for the normal happy path.

MVP 1.1 flow:

1. User scans bookmarks in the side panel.
2. Snapshot is saved locally in `chrome.storage.local`.
3. User clicks `Open full report`.
4. The report page asks the extension for the latest snapshot.
5. The user clicks `Import latest snapshot`.
6. The full report is recalculated locally in the browser.

Manual JSON export/import remains as a fallback and portability path.

### Language

Language is a product setting, not a decorative toggle.

MVP 1.1 supports English and Chinese across:

- side panel controls and empty states
- report import flow
- dashboard labels
- feedback and rule approval controls
- visible taxonomy and system-generated category labels

User evidence such as bookmark titles, URLs, folder paths, and domains stays in the original language.

## Permissions

The Chrome extension MVP should request only:

- `bookmarks`
- `storage`
- `sidePanel`

Avoid in MVP:

- browsing history
- all-site content access
- automatic bookmark writes
- background network upload

## Non-goals

Do not build these in the first MVP:

- full bookmark replacement
- social sharing
- cloud sync
- automatic deletion or folder migration
- psychological personality scoring
- recommendation feed based on external tracking
- AI upload by default

## Success criteria

The MVP is working when:

1. A new Chrome bookmark export or bookmark tree can be analyzed without hand editing.
2. The profile report feels specific enough to the user's actual archive.
3. The report names uncertainty instead of overclaiming.
4. Smart collections help the user reopen useful links faster.
5. Review feedback can be stored and reused.
6. The privacy model is understandable before authorization.

## Next execution path

1. Stabilize the current Next.js profile report from imported bookmark data.
2. Add a compact side-panel preview for the extension interaction model.
3. Add a technical architecture document for ingestion, taxonomy, profile, audit, and collections.
4. Turn the existing profile model into a dedicated MVP report page.
5. Generalize ingestion for arbitrary Chrome exports.
6. Prototype a read-only Chrome extension side panel.
