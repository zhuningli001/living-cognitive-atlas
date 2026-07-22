export const PROFILE_FEEDBACK_SCHEMA_VERSION = "profile-feedback/v1";

export const feedbackActions = [
  {
    id: "accurate",
    label: "Accurate",
    description: "The current classification looks right."
  },
  {
    id: "wrong_topic",
    label: "Wrong topic",
    description: "The item needs a different topic or category."
  },
  {
    id: "important",
    label: "Important",
    description: "The item matters and should be weighted higher."
  },
  {
    id: "review_later",
    label: "Review later",
    description: "Keep this in the queue without deciding now."
  }
];

export function createProfileFeedbackDecision(item, action, context = {}) {
  return {
    schemaVersion: PROFILE_FEEDBACK_SCHEMA_VERSION,
    action,
    bookmarkId: item.id,
    title: item.title,
    url: item.url,
    domain: item.domain,
    primaryCategory: item.primary_category,
    resourceTypeTags: item.resource_type_tags ?? [],
    canonicalTopics: item.canonical_topics ?? [],
    classificationConfidence: item.classification_confidence,
    sourceSnapshotGeneratedAt: context.generatedAt ?? null,
    createdAt: new Date().toISOString()
  };
}

export function summarizeProfileFeedback(decisions) {
  return feedbackActions.map((action) => ({
    ...action,
    count: decisions.filter((decision) => decision.action === action.id).length
  }));
}

export function buildFeedbackExport(decisions, context = {}) {
  return {
    schemaVersion: PROFILE_FEEDBACK_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    sourceSnapshotGeneratedAt: context.generatedAt ?? null,
    count: decisions.length,
    summary: summarizeProfileFeedback(decisions),
    decisions
  };
}
