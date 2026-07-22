import { buildUserProfile } from "./profile.js";
import { applyTaxonomyOverridesToItem } from "./taxonomy-overrides.js";
import { applyTaxonomy, normalizeUrl } from "./taxonomy.js";

export function buildImportedProfileReport(snapshot, options = {}) {
  const baseItems = snapshot.records.map(recordToBookmark);
  const duplicateCounts = countBy(baseItems, (item) => item.normalized_url);
  const duplicateStats = buildDuplicateStats(baseItems);
  const currentYear = inferCurrentYear(baseItems);

  const items = baseItems.map((item) => {
    const classified = applyTaxonomy(item, { currentYear, duplicateCounts });
    const duplicate = duplicateStats.get(classified.normalized_url);

    const enriched = {
      ...classified,
      duplicate_count: duplicate?.count ?? 1,
      duplicate_cluster_id: duplicate && duplicate.count > 1 ? duplicate.id : null,
      first_saved_year: duplicate?.firstYear ?? classified.year,
      last_saved_year: duplicate?.lastYear ?? classified.year,
      save_span_years: duplicate ? Math.max(0, duplicate.lastYear - duplicate.firstYear) : 0
    };

    const withOverrides = applyTaxonomyOverridesToItem(enriched, options.taxonomyOverrideConfig);

    return {
      ...withOverrides,
      representative_tags: getRepresentativeTags(withOverrides)
    };
  });

  const profile = buildUserProfile(items);
  const dashboard = buildImportedDashboard(items);
  const review = buildImportedReview(items);

  return {
    source: {
      schemaVersion: snapshot.schemaVersion,
      generatedAt: snapshot.generatedAt,
      originalHeadline: snapshot.headline,
      originalSummary: snapshot.summary
    },
    items,
    profile,
    dashboard,
    review
  };
}

function recordToBookmark(record, index) {
  const normalizedUrl = record.normalizedUrl || normalizeUrl(record.url || `imported-${index}`);
  const folderPath = record.folderPathLabel || record.folderPath?.join(" / ") || "";
  const timestamp = Number(record.dateAdded) || 0;

  return {
    id: record.id || `${normalizedUrl}::${index}`,
    title: record.title || "Untitled",
    url: record.url || normalizedUrl,
    domain: record.domain || getDomain(record.url),
    normalized_url: normalizedUrl,
    folder_path: folderPath,
    raw_folder: folderPath,
    year: Number(record.year) || inferYearFromTimestamp(timestamp) || new Date().getFullYear(),
    add_timestamp: timestamp
  };
}

function buildImportedDashboard(items) {
  const domainCounts = countBy(items, (item) => item.domain);
  const sourceBalance = buildSourceBalance(items, domainCounts);
  const timeline = Object.entries(countBy(items, (item) => item.year))
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, count]) => ({ year: Number(year), count }));
  const curatedItems = items
    .filter((item) => !["outdated", "low_relevance"].includes(item.value_status))
    .sort((a, b) => getCurationScore(b) - getCurationScore(a));
  const evolutionStages = buildEvolutionStages(items, timeline);

  return {
    totals: {
      total: items.length,
      uniqueDomains: Object.keys(domainCounts).length,
      interestPhases: evolutionStages.length,
      duplicateClusters: countDuplicateClusters(items)
    },
    timeline,
    topDomains: topEntries(domainCounts, 8),
    sourceBalance,
    topCategories: topEntries(countBy(items, (item) => item.primary_category), 8),
    topResourceTypes: topEntries(countMany(items, (item) => item.resource_type_tags), 8),
    topActions: topEntries(countMany(items, (item) => item.action_tags), 8),
    evolutionStages,
    smartCollections: buildSmartCollections(items),
    curatedItems: curatedItems.slice(0, 12)
  };
}

function buildSourceBalance(items, domainCounts) {
  const total = items.length;
  const domains = topEntries(domainCounts, 5);
  const topDomain = domains[0] ?? null;
  const topShare = total && topDomain ? percentage(topDomain.count, total) : 0;
  const topFiveShare = total ? percentage(domains.reduce((sum, item) => sum + item.count, 0), total) : 0;
  const breadthShare = total ? percentage(Object.keys(domainCounts).length, total) : 0;
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
  if (!topDomain) return "No source pattern is available yet.";

  if (level === "high") {
    return `${topDomain.label} contributes ${topShare}% of saved links; read the profile as strongly source-shaped.`;
  }

  if (level === "medium") {
    return `Top sources contribute ${topFiveShare}% of saved links; useful signal, with some source bias to keep visible.`;
  }

  return `Sources are broadly distributed; the profile is less dependent on one domain.`;
}

function buildImportedReview(items) {
  const lowConfidence = items.filter((item) => item.classification_confidence === "low");
  const needsReview = items.filter((item) => item.primary_category === "Needs Review");
  const genericReferences = items.filter((item) => asArray(item.resource_type_tags).includes("Reference"));
  const duplicates = items.filter((item) => Number(item.duplicate_count) > 1);
  const priorityItems = [...new Map([...lowConfidence, ...needsReview, ...genericReferences, ...duplicates].map((item) => [item.id, item])).values()]
    .slice(0, 12);

  return {
    totals: {
      lowConfidence: lowConfidence.length,
      needsReview: needsReview.length,
      genericReferences: genericReferences.length,
      duplicates: duplicates.length
    },
    priorityItems
  };
}

function buildSmartCollections(items) {
  const definitions = [
    {
      label: "Read & learn",
      match: (item) => hasAnyTag(item.action_tags, ["Read", "Learn", "Monitor"]) || hasAnyTag(item.resource_type_tags, ["Article", "Essay", "Tutorial", "Course", "Publication", "Research Report"])
    },
    {
      label: "Tools to try",
      match: (item) => hasAnyTag(item.action_tags, ["Try"]) || hasAnyTag(item.resource_type_tags, ["Tool", "Product Page", "Code Repository", "Documentation"])
    },
    {
      label: "Inspiration",
      match: (item) => hasAnyTag([item.primary_category], ["Visual Inspiration & References", "Portfolios, Artists & Studios", "Design Systems & Interface Resources"])
    },
    {
      label: "Sources to monitor",
      match: (item) => item.source_importance === "core_source" || item.source_importance === "specialist_source" || hasAnyTag(item.action_tags, ["Monitor"])
    }
  ];

  return definitions
    .map((definition) => ({
      label: definition.label,
      count: items.filter(definition.match).length
    }))
    .filter((collection) => collection.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function buildEvolutionStages(items, timeline) {
  if (!timeline.length) return [];

  const minYear = timeline[0].year;
  const maxYear = timeline.at(-1).year;
  const spanSize = Math.max(1, Math.ceil((maxYear - minYear + 1) / 4));
  const labels = ["Foundation", "Expansion", "Synthesis", "Current focus"];
  const stages = [];

  for (let index = 0; index < 4; index += 1) {
    const start = minYear + index * spanSize;
    const end = Math.min(maxYear, start + spanSize - 1);
    if (start > maxYear) break;

    const slice = items.filter((item) => item.year >= start && item.year <= end);
    if (!slice.length) continue;

    const topTopic =
      topEntries(countMany(slice, (item) => item.canonical_topics), 1)[0]?.label ||
      topEntries(countBy(slice, (item) => item.primary_category), 1)[0]?.label ||
      "Open curiosity";
    const topAction = topEntries(countMany(slice, (item) => item.action_tags), 1)[0]?.label || "Archive";

    stages.push({
      label: labels[index] || "New phase",
      range: start === end ? String(start) : `${start}-${end}`,
      topTopic,
      topAction,
      bookmarkCount: slice.length,
      narrative: `${labels[index] || "New phase"} phase centered on ${topTopic.toLowerCase()}, with ${topAction.toLowerCase()} as the strongest return action.`
    });
  }

  return stages;
}

function getRepresentativeTags(bookmark) {
  return [
    bookmark.primary_category,
    ...asArray(bookmark.region_tags),
    ...asArray(bookmark.canonical_topics),
    ...asArray(bookmark.resource_type_tags),
    ...asArray(bookmark.action_tags),
    ...asArray(bookmark.worldview_tags),
    ...asArray(bookmark.aesthetic_tags)
  ].filter((tag, index, array) => tag && array.indexOf(tag) === index).slice(0, 4);
}

function buildDuplicateStats(items) {
  const groups = new Map();

  for (const item of items) {
    const group = groups.get(item.normalized_url) ?? [];
    group.push(item);
    groups.set(item.normalized_url, group);
  }

  return new Map(
    [...groups.entries()].map(([normalizedUrl, group], index) => {
      const years = group.map((item) => Number(item.year)).filter(Number.isFinite);
      return [
        normalizedUrl,
        {
          id: `imported-duplicate-${index + 1}`,
          count: group.length,
          firstYear: years.length ? Math.min(...years) : null,
          lastYear: years.length ? Math.max(...years) : null
        }
      ];
    })
  );
}

function countDuplicateClusters(items) {
  return new Set(items.filter((item) => Number(item.duplicate_count) > 1).map((item) => item.duplicate_cluster_id)).size;
}

function countBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item);
    if (!key) return acc;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function countMany(items, selector) {
  return items.reduce((acc, item) => {
    for (const key of asArray(selector(item))) {
      if (!key) continue;
      acc[key] = (acc[key] ?? 0) + 1;
    }
    return acc;
  }, {});
}

function topEntries(record, limit = 8) {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function percentage(count, total) {
  return Math.round((count / Math.max(total, 1)) * 100);
}

function getCurationScore(item) {
  const statusWeights = {
    rediscover: 8,
    evergreen: 7,
    active: 5,
    cold_storage: 1,
    outdated: 0,
    low_relevance: 0
  };

  return (
    (statusWeights[item.value_status] ?? 0) +
    asArray(item.representative_tags).length * 2 +
    Math.min(Number(item.duplicate_count) || 1, 4) +
    Math.min(Number(item.save_span_years) || 0, 4)
  );
}

function inferCurrentYear(items) {
  const maxYear = Math.max(...items.map((item) => Number(item.year) || 0), 0);
  return Math.max(new Date().getFullYear(), maxYear);
}

function inferYearFromTimestamp(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date.getFullYear();
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

function hasAnyTag(values, tags) {
  const current = new Set(asArray(values));
  return tags.some((tag) => current.has(tag));
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}
