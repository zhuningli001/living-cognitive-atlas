export const SNAPSHOT_SCHEMA_VERSION = "bookmark-profile-snapshot/v1";

const topicRules = [
  {
    label: "Design systems",
    patterns: ["design system", "component", "ui kit", "interface", "ux", "figma", "framer"]
  },
  {
    label: "Visual reference",
    patterns: ["portfolio", "studio", "gallery", "brand", "typography", "logo", "visual", "inspiration"]
  },
  {
    label: "AI product",
    patterns: ["ai", "gpt", "llm", "agent", "copilot", "midjourney", "runway", "prompt"]
  },
  {
    label: "Creative coding",
    patterns: ["creative coding", "processing", "three.js", "webgl", "shader", "generative", "p5.js"]
  },
  {
    label: "Personal knowledge",
    patterns: ["knowledge", "notes", "notion", "obsidian", "archive", "mind map", "atlas", "memory"]
  },
  {
    label: "Learning",
    patterns: ["course", "tutorial", "guide", "docs", "documentation", "paper", "research", "learn"]
  },
  {
    label: "Culture research",
    patterns: ["museum", "archive", "institution", "academy", "culture", "art", "exhibition", "library"]
  }
];

const dimensionRules = [
  {
    label: "Design / visual systems",
    topics: ["Design systems", "Visual reference"]
  },
  {
    label: "HCI / interaction intelligence",
    topics: ["Design systems", "AI product"]
  },
  {
    label: "Personal knowledge systems",
    topics: ["Personal knowledge", "Learning"]
  },
  {
    label: "Art institutions & cultural research",
    topics: ["Culture research", "Visual reference"]
  },
  {
    label: "AI product curiosity",
    topics: ["AI product"]
  }
];

const collectionRules = [
  {
    label: "Read & learn",
    patterns: ["Learning", "Culture research"]
  },
  {
    label: "Tools to try",
    patterns: ["AI product", "Creative coding", "Design systems"]
  },
  {
    label: "Inspiration",
    patterns: ["Visual reference", "Culture research"]
  },
  {
    label: "Build memory",
    patterns: ["Personal knowledge", "Design systems"]
  }
];

export function flattenBookmarkTree(nodes, path = []) {
  return nodes.flatMap((node) => {
    const title = node.title?.trim() || "Untitled";
    if (node.url) return [normalizeBookmark(node, path)];

    const nextPath = node.parentId ? [...path, title] : path;
    return flattenBookmarkTree(node.children || [], nextPath);
  });
}

export function buildProfileSnapshot(records, options = {}) {
  const approvedRules = normalizeApprovedRules(options.approvedRules);
  const enriched = records.map((record) => ({
    ...record,
    topics: inferTopics(record),
    resourceType: inferResourceType(record)
  }));

  let topics = topCounts(enriched.flatMap((record) => record.topics), 8);
  let dimensions = buildDimensions(enriched);
  let reviewQueue = buildReviewQueue(enriched);
  const phases = buildDevelopmentLine(enriched);
  let collections = buildCollections(enriched);
  const domainCounts = countItems(enriched.map((record) => record.domain).filter(Boolean));
  const domains = new Set(enriched.map((record) => record.domain).filter(Boolean));
  const appliedRules = applyApprovedRules({
    approvedRules,
    records: enriched,
    topics,
    dimensions,
    collections,
    reviewQueue
  });

  topics = appliedRules.topics;
  dimensions = appliedRules.dimensions;
  collections = appliedRules.collections;
  reviewQueue = appliedRules.reviewQueue;

  return {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    source: options.source || "chrome-extension",
    generatedAt: new Date().toISOString(),
    headline: inferHeadline(dimensions, topics),
    summary: buildSummary(topics, dimensions),
    metrics: {
      bookmarks: enriched.length,
      domains: domains.size,
      topics: topics.length,
      review: reviewQueue.length
    },
    topics,
    dimensions,
    phases,
    collections,
    sourceBalance: buildSourceBalance(enriched, domainCounts),
    appliedRules: {
      schemaVersion: "applied-rules/v1",
      sourceRuleCount: approvedRules.length,
      appliedCount: appliedRules.items.length,
      items: appliedRules.items
    },
    reviewQueue,
    records: enriched
  };
}

function normalizeApprovedRules(approvedRules) {
  if (!approvedRules || typeof approvedRules !== "object" || !approvedRules.items || typeof approvedRules.items !== "object") {
    return [];
  }

  return Object.values(approvedRules.items).filter((rule) => rule?.status === "approved" && rule?.ruleType && rule?.label);
}

function applyApprovedRules({ approvedRules, records, topics, dimensions, collections, reviewQueue }) {
  const nextTopics = topics.map((topic) => ({ ...topic }));
  const nextDimensions = dimensions.map((dimension) => ({ ...dimension }));
  const nextCollections = collections.map((collection) => ({ ...collection }));
  const nextReviewQueue = reviewQueue.map((item) => ({ ...item }));
  const applications = [];

  for (const rule of approvedRules) {
    if (rule.ruleType === "trust_topic") {
      const topic = nextTopics.find((item) => item.label === rule.label);
      if (!topic) continue;
      topic.count += 1;
      applications.push(createRuleApplication(rule, "boosted_topic_signal", `Boosted recurring topic: ${rule.label}.`));
    }

    if (rule.ruleType === "refine_topic") {
      const topic = nextTopics.find((item) => item.label === rule.label);
      if (!topic) continue;
      topic.needsRefinement = true;
      applications.push(createRuleApplication(rule, "marked_topic_for_refinement", `Marked broad topic for later refinement: ${rule.label}.`));
    }

    if (rule.ruleType === "review_topic") {
      const matchingRecords = records.filter((record) => record.topics.includes(rule.label)).slice(0, 3);
      if (!matchingRecords.length) continue;

      for (const record of matchingRecords) {
        if (nextReviewQueue.some((item) => item.id === record.id)) continue;
        nextReviewQueue.unshift({
          id: record.id,
          title: record.title,
          url: record.url,
          domain: record.domain,
          reason: `Approved rule review: ${rule.label}`
        });
      }

      applications.push(createRuleApplication(rule, "added_topic_review_candidates", `Sent matching links into review for topic: ${rule.label}.`));
    }

    if (rule.ruleType === "trust_dimension") {
      const dimension = nextDimensions.find((item) => item.label === rule.label);
      if (!dimension) continue;
      dimension.share = Math.min(100, dimension.share + 5);
      applications.push(createRuleApplication(rule, "boosted_dimension_signal", `Boosted trusted dimension: ${rule.label}.`));
    }

    if (rule.ruleType === "lower_dimension_confidence") {
      const dimension = nextDimensions.find((item) => item.label === rule.label);
      if (!dimension) continue;
      dimension.share = Math.max(0, dimension.share - 10);
      applications.push(createRuleApplication(rule, "lowered_dimension_confidence", `Lowered confidence for dimension: ${rule.label}.`));
    }

    if (rule.ruleType === "keep_collection") {
      const collection = nextCollections.find((item) => item.label === rule.label);
      if (!collection) continue;
      collection.count += 1;
      collection.pinnedByRule = true;
      applications.push(createRuleApplication(rule, "boosted_return_path", `Kept useful return path: ${rule.label}.`));
    }

    if (rule.ruleType === "demote_collection") {
      const collection = nextCollections.find((item) => item.label === rule.label);
      if (!collection) continue;
      collection.count = Math.max(0, collection.count - 1);
      applications.push(createRuleApplication(rule, "demoted_return_path", `Demoted return path: ${rule.label}.`));
    }
  }

  return {
    topics: nextTopics.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, 8),
    dimensions: nextDimensions.sort((a, b) => b.share - a.share || a.label.localeCompare(b.label)).filter((item) => item.share > 0).slice(0, 5),
    collections: nextCollections.sort((a, b) => Number(Boolean(b.pinnedByRule)) - Number(Boolean(a.pinnedByRule)) || b.count - a.count || a.label.localeCompare(b.label)).filter((item) => item.count > 0).slice(0, 4),
    reviewQueue: nextReviewQueue,
    items: applications
  };
}

function createRuleApplication(rule, effect, note) {
  return {
    id: rule.id,
    ruleType: rule.ruleType,
    targetType: rule.targetType,
    label: rule.label,
    feedbackValue: rule.feedbackValue,
    effect,
    note
  };
}

function normalizeBookmark(node, folderPath) {
  const parsed = parseUrl(node.url);
  const addDate = node.dateAdded ? new Date(node.dateAdded) : null;

  return {
    id: node.id,
    title: node.title?.trim() || "Untitled",
    url: node.url,
    domain: parsed?.hostname.replace(/^www\./, "") || "unknown",
    normalizedUrl: parsed ? `${parsed.origin}${parsed.pathname}`.replace(/\/$/, "") : node.url,
    folderPath,
    folderPathLabel: folderPath.join(" / "),
    year: addDate && !Number.isNaN(addDate.getTime()) ? addDate.getFullYear() : null,
    dateAdded: node.dateAdded || null
  };
}

function parseUrl(url) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function inferTopics(record) {
  const text = `${record.title} ${record.url} ${record.domain} ${record.folderPath.join(" ")}`.toLowerCase();
  const matches = topicRules
    .filter((rule) => rule.patterns.some((pattern) => text.includes(pattern.toLowerCase())))
    .map((rule) => rule.label);

  if (matches.length) return [...new Set(matches)];
  if (record.domain.includes("github.com")) return ["Creative coding"];
  if (record.domain.includes("youtube.com") || record.domain.includes("vimeo.com")) return ["Learning"];
  return ["General reference"];
}

function inferResourceType(record) {
  const text = `${record.title} ${record.url} ${record.domain}`.toLowerCase();
  if (text.includes("github.com") || text.includes("npmjs.com")) return "code/tool";
  if (text.includes("docs") || text.includes("documentation")) return "documentation";
  if (text.includes("youtube.com") || text.includes("vimeo.com")) return "video";
  if (text.includes("portfolio") || text.includes("studio")) return "portfolio";
  if (text.includes("medium.com") || text.includes("substack.com")) return "article";
  return "reference";
}

function topCounts(items, limit) {
  const counts = countItems(items);

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function countItems(items) {
  return items.reduce((acc, item) => {
    if (!item) return acc;
    acc.set(item, (acc.get(item) || 0) + 1);
    return acc;
  }, new Map());
}

function buildSourceBalance(records, domainCounts) {
  const total = records.length;
  const topDomains = [...domainCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }));
  const topDomain = topDomains[0] || null;
  const topShare = total && topDomain ? percentage(topDomain.count, total) : 0;
  const topFiveShare = total ? percentage(topDomains.reduce((sum, item) => sum + item.count, 0), total) : 0;
  const breadthShare = total ? percentage(domainCounts.size, total) : 0;
  const level =
    topShare >= 35 || topFiveShare >= 65 || breadthShare < 25
      ? "high"
      : topShare >= 20 || topFiveShare >= 45 || breadthShare < 45
        ? "medium"
        : "low";

  return {
    level,
    topDomain,
    topShare,
    topFiveShare,
    breadthShare,
    note: getSourceBalanceNote(level, topDomain, topShare, topFiveShare)
  };
}

function getSourceBalanceNote(level, topDomain, topShare, topFiveShare) {
  if (!topDomain) return "No source pattern yet.";
  if (level === "high") return `${topDomain.label} shapes ${topShare}% of this profile.`;
  if (level === "medium") return `Top sources shape ${topFiveShare}% of this profile.`;
  return "Sources are broadly distributed.";
}

function percentage(count, total) {
  return Math.round((count / Math.max(total, 1)) * 100);
}

function buildDimensions(records) {
  const total = Math.max(records.length, 1);

  return dimensionRules
    .map((dimension) => {
      const count = records.filter((record) => record.topics.some((topic) => dimension.topics.includes(topic))).length;
      return {
        label: dimension.label,
        count,
        share: Math.round((count / total) * 100)
      };
    })
    .filter((dimension) => dimension.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 5);
}

function buildDevelopmentLine(records) {
  const datedRecords = records.filter((record) => Number.isInteger(record.year));
  if (!datedRecords.length) {
    return [{ year: "Now", title: "First snapshot", meta: "No bookmark dates found", note: "The profile can start from current topics." }];
  }

  const minYear = Math.min(...datedRecords.map((record) => record.year));
  const maxYear = Math.max(...datedRecords.map((record) => record.year));
  const phaseCount = Math.min(4, Math.max(1, maxYear - minYear + 1));
  const buckets = Array.from({ length: phaseCount }, () => []);

  for (const record of datedRecords) {
    const position = maxYear === minYear ? 0 : (record.year - minYear) / (maxYear - minYear);
    const index = Math.min(phaseCount - 1, Math.floor(position * phaseCount));
    buckets[index].push(record);
  }

  const names = ["Foundation", "Expansion", "Synthesis", "Current focus"];

  return buckets
    .filter((bucket) => bucket.length)
    .map((bucket, index) => {
      const years = bucket.map((record) => record.year);
      const topTopic = topCounts(bucket.flatMap((record) => record.topics), 1)[0]?.label || "General reference";
      const start = Math.min(...years);
      const end = Math.max(...years);

      return {
        year: String(end),
        title: names[index] || "New phase",
        meta: start === end ? String(start) : `${start}-${end}`,
        note: `Dominant return pattern: ${topTopic}.`
      };
    });
}

function buildCollections(records) {
  return collectionRules
    .map((collection) => {
      const count = records.filter((record) => record.topics.some((topic) => collection.patterns.includes(topic))).length;
      return {
        label: collection.label,
        count
      };
    })
    .filter((collection) => collection.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 4);
}

function buildReviewQueue(records) {
  const duplicates = topCounts(records.map((record) => record.normalizedUrl), records.length)
    .filter((entry) => entry.count > 1)
    .map((entry) => entry.label);

  return records
    .filter((record) => {
      const genericTitle = record.title === "Untitled" || record.title.length < 4;
      const genericTopic = record.topics.length === 1 && record.topics[0] === "General reference";
      const duplicated = duplicates.includes(record.normalizedUrl);
      return genericTitle || genericTopic || duplicated || !record.year;
    })
    .map((record) => ({
      id: record.id,
      title: record.title,
      url: record.url,
      domain: record.domain,
      reason: getReviewReason(record, duplicates)
    }));
}

function getReviewReason(record, duplicates) {
  if (duplicates.includes(record.normalizedUrl)) return "Possible duplicate";
  if (!record.year) return "Missing save date";
  if (record.title === "Untitled" || record.title.length < 4) return "Weak title";
  return "Needs clearer topic";
}

function inferHeadline(dimensions, topics) {
  const labels = dimensions.map((dimension) => dimension.label);
  const topicLabels = topics.map((topic) => topic.label);

  if (labels.includes("Design / visual systems") && labels.includes("AI product curiosity")) {
    return "Design-led AI product explorer";
  }
  if (labels.includes("Design / visual systems") && labels.includes("Personal knowledge systems")) {
    return "Visual knowledge-system builder";
  }
  if (topicLabels.includes("Creative coding")) {
    return "Creative technology collector";
  }
  return labels[0] || "Exploratory knowledge collector";
}

function buildSummary(topics, dimensions) {
  const topicText = topics.slice(0, 3).map((topic) => topic.label).join(", ");
  const dimensionText = dimensions[0]?.label || "early signals";
  if (!topicText) return "The profile will become clearer after more bookmarks are scanned.";
  return `Strongest signals: ${topicText}. Dominant lens: ${dimensionText}.`;
}
