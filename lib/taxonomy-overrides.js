export const TAXONOMY_OVERRIDES_SCHEMA_VERSION = "taxonomy-overrides/v1";

export function buildTaxonomyOverrideConfig(approvedRules, context = {}) {
  const sourceImportanceOverrides = [];
  const domainTopicReviewRules = [];
  const confirmedCategoryRules = [];
  const deferredCategoryRules = [];

  for (const rule of approvedRules) {
    if (rule.type === "increase_importance" && rule.scope === "domain") {
      sourceImportanceOverrides.push({
        id: `source_importance:${rule.target}`,
        domain: rule.target,
        sourceImportance: "core_source",
        reason: rule.proposedRule,
        evidenceCount: rule.evidenceCount
      });
    }

    if (rule.type === "needs_topic_rule" && rule.scope === "domain") {
      domainTopicReviewRules.push({
        id: `topic_review:${rule.target}`,
        domain: rule.target,
        action: "review_topic_override",
        suggestedTopics: topTopicsFromEvidence(rule.evidence),
        reason: rule.proposedRule,
        evidenceCount: rule.evidenceCount
      });
    }

    if (rule.type === "keep_rule" && rule.scope === "category") {
      confirmedCategoryRules.push({
        id: `confirmed_category:${rule.target}`,
        category: rule.target,
        action: "keep_current_rule",
        reason: rule.proposedRule,
        evidenceCount: rule.evidenceCount
      });
    }

    if (rule.type === "defer_rule" && rule.scope === "category") {
      deferredCategoryRules.push({
        id: `deferred_category:${rule.target}`,
        category: rule.target,
        action: "keep_observational",
        reason: rule.proposedRule,
        evidenceCount: rule.evidenceCount
      });
    }
  }

  return {
    schemaVersion: TAXONOMY_OVERRIDES_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    sourceSnapshotGeneratedAt: context.generatedAt ?? null,
    counts: {
      sourceImportanceOverrides: sourceImportanceOverrides.length,
      domainTopicReviewRules: domainTopicReviewRules.length,
      confirmedCategoryRules: confirmedCategoryRules.length,
      deferredCategoryRules: deferredCategoryRules.length
    },
    sourceImportanceOverrides,
    domainTopicReviewRules,
    confirmedCategoryRules,
    deferredCategoryRules
  };
}

export function countTaxonomyOverrides(config) {
  if (!config) return 0;
  return Object.values(config.counts ?? {}).reduce((sum, count) => sum + Number(count || 0), 0);
}

export function listTaxonomyOverrides(config) {
  if (!config) return [];

  return [
    ...config.sourceImportanceOverrides.map((item) => ({
      id: item.id,
      type: "Source importance",
      target: item.domain,
      detail: `Set source importance to ${item.sourceImportance}.`,
      reason: item.reason,
      evidenceCount: item.evidenceCount
    })),
    ...config.domainTopicReviewRules.map((item) => ({
      id: item.id,
      type: "Topic review",
      target: item.domain,
      detail: item.suggestedTopics.length ? `Review topic override: ${item.suggestedTopics.join(" / ")}.` : "Review domain-specific topic override.",
      reason: item.reason,
      evidenceCount: item.evidenceCount
    })),
    ...config.confirmedCategoryRules.map((item) => ({
      id: item.id,
      type: "Confirmed category",
      target: item.category,
      detail: "Keep current category rule.",
      reason: item.reason,
      evidenceCount: item.evidenceCount
    })),
    ...config.deferredCategoryRules.map((item) => ({
      id: item.id,
      type: "Deferred category",
      target: item.category,
      detail: "Keep as observational signal.",
      reason: item.reason,
      evidenceCount: item.evidenceCount
    }))
  ];
}

export function filterTaxonomyOverrideConfig(config, appliedIds) {
  const applied = new Set(appliedIds);
  const sourceImportanceOverrides = config.sourceImportanceOverrides.filter((item) => applied.has(item.id));
  const domainTopicReviewRules = config.domainTopicReviewRules.filter((item) => applied.has(item.id));
  const confirmedCategoryRules = config.confirmedCategoryRules.filter((item) => applied.has(item.id));
  const deferredCategoryRules = config.deferredCategoryRules.filter((item) => applied.has(item.id));

  return {
    ...config,
    counts: {
      sourceImportanceOverrides: sourceImportanceOverrides.length,
      domainTopicReviewRules: domainTopicReviewRules.length,
      confirmedCategoryRules: confirmedCategoryRules.length,
      deferredCategoryRules: deferredCategoryRules.length
    },
    sourceImportanceOverrides,
    domainTopicReviewRules,
    confirmedCategoryRules,
    deferredCategoryRules
  };
}

export function applyTaxonomyOverridesToItem(item, config) {
  if (!config) return item;

  let next = { ...item, applied_overrides: [...(item.applied_overrides ?? [])] };

  for (const override of config.sourceImportanceOverrides ?? []) {
    if (!matchesDomain(next.domain, override.domain)) continue;
    next = {
      ...next,
      source_importance: override.sourceImportance,
      applied_overrides: [...next.applied_overrides, override.id]
    };
  }

  for (const override of config.domainTopicReviewRules ?? []) {
    if (!matchesDomain(next.domain, override.domain)) continue;
    next = {
      ...next,
      primary_category: "Needs Review",
      action_tags: unique([...asArray(next.action_tags), "Review"]),
      canonical_topics: unique([...asArray(override.suggestedTopics), ...asArray(next.canonical_topics)]),
      classification_confidence: "low",
      classification_reasons: [
        ...(next.classification_reasons ?? []),
        {
          field: "local_override",
          tag: "Needs Review",
          evidence: override.reason
        }
      ],
      applied_overrides: [...next.applied_overrides, override.id]
    };
  }

  for (const override of config.confirmedCategoryRules ?? []) {
    if (next.primary_category !== override.category) continue;
    next = {
      ...next,
      classification_confidence: "high",
      classification_reasons: [
        ...(next.classification_reasons ?? []),
        {
          field: "local_override",
          tag: override.category,
          evidence: override.reason
        }
      ],
      applied_overrides: [...next.applied_overrides, override.id]
    };
  }

  for (const override of config.deferredCategoryRules ?? []) {
    if (next.primary_category !== override.category) continue;
    next = {
      ...next,
      action_tags: unique([...asArray(next.action_tags), "Review"]),
      classification_confidence: "low",
      applied_overrides: [...next.applied_overrides, override.id]
    };
  }

  return {
    ...next,
    applied_overrides: unique(next.applied_overrides)
  };
}

function topTopicsFromEvidence(evidence = []) {
  const counts = new Map();

  for (const item of evidence) {
    for (const topic of item.canonicalTopics ?? []) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([topic]) => topic);
}

function matchesDomain(itemDomain, overrideDomain) {
  return itemDomain === overrideDomain || itemDomain.endsWith(`.${overrideDomain}`);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
