import fs from "fs";
import path from "path";
import { applyKnownBookmarkCorrections, applyTaxonomy, normalizeUrl } from "../lib/taxonomy.js";

const rootDir = process.cwd();
const privateBookmarksPath = path.join(rootDir, "data", "bookmarks.json");
const publicBookmarksPath = path.join(rootDir, "data", "public-bookmarks.json");
const metaPath = path.join(rootDir, "data", "atlas-meta.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadBookmarks() {
  if (fs.existsSync(privateBookmarksPath)) {
    return {
      source: "private",
      bookmarks: readJson(privateBookmarksPath)
    };
  }

  return {
    source: "public",
    bookmarks: readJson(publicBookmarksPath)
  };
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
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

function topEntries(record, limit = 12) {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function percent(count, total) {
  if (!total) return "0.0%";
  return `${((count / total) * 100).toFixed(1)}%`;
}

function getCount(record, label) {
  return record[label] ?? 0;
}

function buildDistribution(bookmarks) {
  return {
    primaryCategory: countMany(bookmarks, (item) => item.primary_category),
    resourceType: countMany(bookmarks, (item) => item.resource_type_tags),
    action: countMany(bookmarks, (item) => item.action_tags),
    canonicalTopics: countMany(bookmarks, (item) => item.canonical_topics),
    worldview: countMany(bookmarks, (item) => item.worldview_tags),
    aesthetic: countMany(bookmarks, (item) => item.aesthetic_tags),
    medium: countMany(bookmarks, (item) => item.medium_tags),
    status: countMany(bookmarks, (item) => item.value_status),
    saveIntent: countMany(bookmarks, (item) => item.save_intent),
    sourceImportance: countMany(bookmarks, (item) => item.source_importance),
    confidence: countMany(bookmarks, (item) => item.classification_confidence),
    domain: countMany(bookmarks, (item) => item.domain),
    year: countMany(bookmarks, (item) => item.year)
  };
}

function findIssues(bookmarks, distribution) {
  const total = bookmarks.length;
  const issues = [];
  const miscCount = getCount(distribution.primaryCategory, "Utilities & Misc") + getCount(distribution.primaryCategory, "Needs Review");
  const referenceCount = getCount(distribution.resourceType, "Reference");
  const archiveCount = getCount(distribution.action, "Archive");

  if (miscCount / total > 0.2) {
    issues.push({
      severity: "high",
      label: "Fallback category is too large",
      detail: `${miscCount}/${total} (${percent(miscCount, total)}) items are in Utilities & Misc / Needs Review.`
    });
  }

  if (referenceCount / total > 0.45) {
    issues.push({
      severity: "medium",
      label: "Resource type is too generic",
      detail: `${referenceCount}/${total} (${percent(referenceCount, total)}) items are tagged Reference.`
    });
  }

  if (archiveCount / total > 0.45) {
    issues.push({
      severity: "medium",
      label: "Action intent is too passive",
      detail: `${archiveCount}/${total} (${percent(archiveCount, total)}) items are tagged Archive.`
    });
  }

  for (const [label, count] of Object.entries(distribution.medium)) {
    if (count / total > 0.8) {
      issues.push({
        severity: "high",
        label: "Medium tag is over-matching",
        detail: `${label} appears on ${count}/${total} (${percent(count, total)}) items.`
      });
    }
  }

  return issues;
}

function pickSamples(bookmarks) {
  return {
    fallback: bookmarks
      .filter((item) => ["Utilities & Misc", "Needs Review"].includes(item.primary_category))
      .slice(0, 12)
      .map(toSample),
    passiveArchive: bookmarks
      .filter((item) => asArray(item.action_tags).includes("Archive"))
      .slice(0, 12)
      .map(toSample),
    repeatedInterest: bookmarks
      .filter((item) => Number(item.duplicate_count) > 1 || item.value_status === "rediscover")
      .slice(0, 12)
      .map(toSample),
    lowConfidence: bookmarks
      .filter((item) => item.classification_confidence === "low")
      .slice(0, 12)
      .map(toSample)
  };
}

function toSample(item) {
  return {
    title: item.title,
    domain: item.domain,
    year: item.year,
    category: item.primary_category,
    resourceType: asArray(item.resource_type_tags).join(" | "),
    action: asArray(item.action_tags).join(" | "),
    topics: asArray(item.canonical_topics).join(" | "),
    confidence: item.classification_confidence,
    status: item.value_status
  };
}

function formatTop(title, entries, total) {
  const rows = entries.map((entry) => `  - ${entry.label}: ${entry.count} (${percent(entry.count, total)})`);
  return [`\n${title}`, ...rows].join("\n");
}

function reclassifyBookmarks(bookmarks) {
  const normalized = bookmarks.map((bookmark, index) =>
    applyKnownBookmarkCorrections({
      ...bookmark,
      normalized_url: bookmark.normalized_url ?? normalizeUrl(bookmark.url ?? `${bookmark.title}-${index}`)
    })
  );
  const duplicateCounts = normalized.reduce((acc, item) => {
    acc[item.normalized_url] = (acc[item.normalized_url] ?? 0) + 1;
    return acc;
  }, {});

  return normalized.map((bookmark) =>
    applyTaxonomy(bookmark, {
      currentYear: 2026,
      duplicateCounts
    })
  );
}

function main() {
  const { source, bookmarks: rawBookmarks } = loadBookmarks();
  const bookmarks = reclassifyBookmarks(rawBookmarks);
  const total = bookmarks.length;
  const distribution = buildDistribution(bookmarks);
  const issues = findIssues(bookmarks, distribution);
  const samples = pickSamples(bookmarks);
  const meta = fs.existsSync(metaPath) ? readJson(metaPath) : null;

  console.log(`Taxonomy audit source: ${source} reclassified with current rules`);
  console.log(`Bookmarks audited: ${total}`);

  if (meta) {
    console.log(`Full archive meta: ${meta.total_bookmarks} bookmarks, ${meta.unique_domains} domains, ${meta.duplicate_clusters} duplicate clusters`);
  }

  console.log(formatTop("Primary categories", topEntries(distribution.primaryCategory), total));
  console.log(formatTop("Resource types", topEntries(distribution.resourceType), total));
  console.log(formatTop("Action intents", topEntries(distribution.action), total));
  console.log(formatTop("Canonical topics", topEntries(distribution.canonicalTopics), total));
  console.log(formatTop("Medium tags", topEntries(distribution.medium), total));
  console.log(formatTop("Lifecycle status", topEntries(distribution.status), total));
  console.log(formatTop("Save intent", topEntries(distribution.saveIntent), total));
  console.log(formatTop("Source importance", topEntries(distribution.sourceImportance), total));
  console.log(formatTop("Classification confidence", topEntries(distribution.confidence), total));

  console.log("\nIssues");
  if (issues.length) {
    for (const issue of issues) {
      console.log(`  - [${issue.severity}] ${issue.label}: ${issue.detail}`);
    }
  } else {
    console.log("  - No major taxonomy concentration issues detected.");
  }

  console.log("\nSamples to review");
  for (const [group, items] of Object.entries(samples)) {
    console.log(`\n${group}`);
    for (const item of items) {
      console.log(`  - ${item.title} | ${item.domain} | ${item.category} | ${item.resourceType} | ${item.action} | ${item.topics} | ${item.confidence} | ${item.status}`);
    }
  }
}

main();
