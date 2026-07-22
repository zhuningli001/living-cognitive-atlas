export const PROFILE_RULE_SUGGESTIONS_SCHEMA_VERSION = "profile-rule-suggestions/v1";

const suggestionTypeLabels = {
  increase_importance: "Increase importance",
  needs_topic_rule: "Needs topic rule",
  keep_rule: "Keep current rule",
  defer_rule: "Defer rule"
};

export function buildRuleSuggestions(decisions, options = {}) {
  const minRepeatedEvidence = options.minRepeatedEvidence ?? 2;
  const suggestions = [
    ...buildDomainActionSuggestions(decisions, "important", "increase_importance", minRepeatedEvidence),
    ...buildDomainActionSuggestions(decisions, "wrong_topic", "needs_topic_rule", minRepeatedEvidence),
    ...buildCategoryActionSuggestions(decisions, "accurate", "keep_rule", minRepeatedEvidence),
    ...buildCategoryActionSuggestions(decisions, "review_later", "defer_rule", minRepeatedEvidence)
  ];

  return suggestions
    .sort((a, b) => b.evidenceCount - a.evidenceCount || a.type.localeCompare(b.type))
    .slice(0, options.limit ?? 10);
}

export function buildRuleSuggestionExport(suggestions, context = {}) {
  return {
    schemaVersion: PROFILE_RULE_SUGGESTIONS_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    sourceSnapshotGeneratedAt: context.generatedAt ?? null,
    count: suggestions.length,
    suggestions
  };
}

function buildDomainActionSuggestions(decisions, action, type, minRepeatedEvidence) {
  const groups = groupBy(
    decisions.filter((decision) => decision.action === action && decision.domain),
    (decision) => decision.domain
  );

  return [...groups.entries()].map(([domain, group]) => {
    const topCategory = topValue(group, (decision) => decision.primaryCategory);
    const topTopic = topValue(group.flatMap((decision) => decision.canonicalTopics ?? []), (topic) => topic);

    return {
      id: `${type}:${domain}`,
      type,
      label: suggestionTypeLabels[type],
      target: domain,
      scope: "domain",
      confidence: group.length >= minRepeatedEvidence ? "repeated_signal" : "early_signal",
      evidenceCount: group.length,
      description: describeDomainSuggestion({ type, domain, topCategory, topTopic, count: group.length }),
      proposedRule: proposeDomainRule({ type, domain, topCategory, topTopic }),
      evidence: group.slice(0, 4).map(toEvidence)
    };
  });
}

function buildCategoryActionSuggestions(decisions, action, type, minRepeatedEvidence) {
  const groups = groupBy(
    decisions.filter((decision) => decision.action === action && decision.primaryCategory),
    (decision) => decision.primaryCategory
  );

  return [...groups.entries()].map(([category, group]) => {
    const topDomain = topValue(group, (decision) => decision.domain);
    const topTopic = topValue(group.flatMap((decision) => decision.canonicalTopics ?? []), (topic) => topic);

    return {
      id: `${type}:${category}`,
      type,
      label: suggestionTypeLabels[type],
      target: category,
      scope: "category",
      confidence: group.length >= minRepeatedEvidence ? "repeated_signal" : "early_signal",
      evidenceCount: group.length,
      description: describeCategorySuggestion({ type, category, topDomain, topTopic, count: group.length }),
      proposedRule: proposeCategoryRule({ type, category, topDomain, topTopic }),
      evidence: group.slice(0, 4).map(toEvidence)
    };
  });
}

function describeDomainSuggestion({ type, domain, topCategory, topTopic, count }) {
  if (type === "increase_importance") {
    return `${domain} has ${count} important feedback decision(s), often around ${topTopic || topCategory || "this domain"}.`;
  }

  return `${domain} has ${count} wrong-topic feedback decision(s), suggesting a domain-specific topic rule is needed.`;
}

function describeCategorySuggestion({ type, category, topDomain, topTopic, count }) {
  if (type === "keep_rule") {
    return `${category} has ${count} accurate feedback decision(s), so the current rule may be reliable.`;
  }

  return `${category} has ${count} review-later decision(s), so it should remain observational before becoming a strong rule.`;
}

function proposeDomainRule({ type, domain, topCategory, topTopic }) {
  if (type === "increase_importance") {
    return `Treat ${domain} as a higher-importance source${topTopic ? ` for ${topTopic}` : ""}.`;
  }

  return `Create a topic override for ${domain}${topCategory ? ` instead of defaulting to ${topCategory}` : ""}.`;
}

function proposeCategoryRule({ type, category, topDomain, topTopic }) {
  if (type === "keep_rule") {
    return `Keep ${category} classification rules when similar evidence appears${topDomain ? ` from ${topDomain}` : ""}.`;
  }

  return `Do not harden ${category} into a stronger rule yet${topTopic ? ` for ${topTopic}` : ""}.`;
}

function toEvidence(decision) {
  return {
    bookmarkId: decision.bookmarkId,
    title: decision.title,
    domain: decision.domain,
    action: decision.action,
    primaryCategory: decision.primaryCategory,
    canonicalTopics: decision.canonicalTopics ?? []
  };
}

function groupBy(items, selector) {
  return items.reduce((groups, item) => {
    const key = selector(item);
    if (!key) return groups;
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
    return groups;
  }, new Map());
}

function topValue(items, selector) {
  const counts = new Map();

  for (const item of items) {
    const value = selector(item);
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "";
}
