import fs from "fs";
import path from "path";
import {
  applyTaxonomy,
  decodeHtml,
  extractDomain,
  normalizeUrl
} from "../lib/taxonomy.js";

const rootDir = path.resolve(process.cwd());
const inputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : "/Users/a123/Downloads/my bookmarks_5_15.html";

const outputJsonPath = path.join(rootDir, "data", "bookmarks.json");
const outputCsvPath = path.join(rootDir, "data", "bookmarks.csv");
const outputMetaPath = path.join(rootDir, "data", "atlas-meta.json");
const outputPublicJsonPath = path.join(rootDir, "data", "public-bookmarks.json");
const outputPublicCsvPath = path.join(rootDir, "data", "public-bookmarks.csv");

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseAttributes(rawTag) {
  const attributes = {};
  const attributeRegex = /([A-Z_]+)="([^"]*)"/g;
  let match;

  while ((match = attributeRegex.exec(rawTag)) !== null) {
    attributes[match[1]] = decodeHtml(match[2]);
  }

  return attributes;
}

function parseTitle(raw) {
  return decodeHtml(raw.replace(/<[^>]+>/g, "").trim());
}

function unixSecondsToIso(seconds) {
  if (!seconds) return null;
  const numeric = Number(seconds);
  if (!Number.isFinite(numeric)) return null;
  return new Date(numeric * 1000).toISOString();
}

function extractYear(dateIso) {
  return dateIso ? Number(dateIso.slice(0, 4)) : null;
}

function parseBookmarks(html) {
  const lines = html.split(/\r?\n/);
  const folderStack = [];
  const bookmarks = [];
  let pendingFolder = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("<DT><H3")) {
      const tagMatch = line.match(/<DT><H3([^>]*)>([\s\S]*?)<\/H3>/i);
      if (!tagMatch) continue;

      pendingFolder = {
        name: parseTitle(tagMatch[2]),
        attributes: parseAttributes(tagMatch[1])
      };
      continue;
    }

    if (line.startsWith("<DL><p>")) {
      if (pendingFolder) {
        folderStack.push(pendingFolder);
        pendingFolder = null;
      }
      continue;
    }

    if (line.startsWith("</DL>")) {
      if (folderStack.length) {
        folderStack.pop();
      }
      continue;
    }

    if (line.startsWith("<DT><A")) {
      const tagMatch = line.match(/<DT><A([^>]*)>([\s\S]*?)<\/A>/i);
      if (!tagMatch) continue;
      const attributes = parseAttributes(tagMatch[1]);
      const title = parseTitle(tagMatch[2]);
      const url = attributes.HREF ?? "";
      const domain = extractDomain(url);
      const folderPathArray = folderStack.map((folder) => folder.name);
      const folderPath = folderPathArray.join(" / ");
      const addDateIso = unixSecondsToIso(attributes.ADD_DATE);
      const favicon = attributes.ICON || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null);

      bookmarks.push({
        id: `${normalizeUrl(url)}::${attributes.ADD_DATE ?? "unknown"}`,
        title,
        url,
        domain,
        folder_path: folderPath,
        folder_path_array: folderPathArray,
        raw_folder: folderPathArray.at(-1) ?? "",
        add_date: addDateIso,
        add_timestamp: attributes.ADD_DATE ? Number(attributes.ADD_DATE) : null,
        year: extractYear(addDateIso),
        possible_favicon: favicon,
        normalized_url: normalizeUrl(url)
      });
    }
  }

  return bookmarks;
}

function summarize(bookmarks) {
  const uniqueDomains = new Set();
  const years = {};
  const statuses = {};
  const worldviewCounts = {};
  const categoryCounts = {};
  const duplicateClusters = new Set();
  let duplicatedBookmarks = 0;

  for (const bookmark of bookmarks) {
    if (bookmark.domain) uniqueDomains.add(bookmark.domain);
    years[bookmark.year] = (years[bookmark.year] ?? 0) + 1;
    statuses[bookmark.value_status] = (statuses[bookmark.value_status] ?? 0) + 1;
    categoryCounts[bookmark.primary_category] = (categoryCounts[bookmark.primary_category] ?? 0) + 1;
    if (bookmark.duplicate_count > 1) {
      duplicateClusters.add(bookmark.duplicate_cluster_id);
      duplicatedBookmarks += 1;
    }
    for (const tag of bookmark.worldview_tags) {
      worldviewCounts[tag] = (worldviewCounts[tag] ?? 0) + 1;
    }
  }

  return {
    total_bookmarks: bookmarks.length,
    unique_domains: uniqueDomains.size,
    duplicate_clusters: duplicateClusters.size,
    duplicated_bookmarks: duplicatedBookmarks,
    year_span: [Math.min(...Object.keys(years).map(Number)), Math.max(...Object.keys(years).map(Number))],
    statuses,
    top_categories: Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag, count]) => ({ tag, count })),
    top_worldviews: Object.entries(worldviewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag, count]) => ({ tag, count }))
  };
}

function escapeCsvValue(value) {
  const text = Array.isArray(value) ? value.join(" | ") : value ?? "";
  const stringValue = String(text);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }
  return stringValue;
}

function toCsv(bookmarks) {
  const headers = [
    "title",
    "url",
    "domain",
    "folder_path",
    "add_date",
    "year",
    "raw_folder",
    "possible_favicon",
    "duplicate_count",
    "duplicate_cluster_id",
    "first_saved_year",
    "last_saved_year",
    "save_span_years",
    "primary_category",
    "resource_type_tags",
    "action_tags",
    "content_type",
    "worldview_tags",
    "human_state_tags",
    "interaction_paradigm_tags",
    "system_model_tags",
    "aesthetic_tags",
    "medium_tags",
    "region_tags",
    "value_status"
  ];

  const rows = bookmarks.map((bookmark) =>
    headers.map((key) => escapeCsvValue(bookmark[key])).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

function getCurationScore(bookmark) {
  const statusWeights = {
    rediscover: 8,
    evergreen: 7,
    active: 5,
    cold_storage: 1,
    outdated: 0,
    low_relevance: 0
  };

  const representativeSignal = [
    bookmark.primary_category,
    ...(bookmark.resource_type_tags ?? []),
    ...(bookmark.action_tags ?? []),
    ...bookmark.worldview_tags,
    ...bookmark.aesthetic_tags
  ].filter(Boolean).length;

  return (
    (statusWeights[bookmark.value_status] ?? 0) +
    representativeSignal * 2 +
    Math.min(bookmark.duplicate_count ?? 1, 4) +
    Math.min(bookmark.save_span_years ?? 0, 4)
  );
}

function getPublicBookmarks(bookmarks, limit = 180) {
  const sorted = bookmarks
    .map((bookmark) => ({
      ...bookmark,
      curation_score: getCurationScore(bookmark),
      representative_tags: [
        bookmark.primary_category,
        ...(bookmark.resource_type_tags ?? []),
        ...(bookmark.action_tags ?? []),
        ...bookmark.worldview_tags,
        ...bookmark.aesthetic_tags
      ].filter((tag, index, array) => tag && array.indexOf(tag) === index).slice(0, 4)
    }))
    .filter((bookmark) => !["outdated", "low_relevance"].includes(bookmark.value_status))
    .sort((a, b) => b.curation_score - a.curation_score || (b.add_timestamp ?? 0) - (a.add_timestamp ?? 0));

  const seen = new Set();
  const curated = [];

  for (const bookmark of sorted) {
    if (seen.has(bookmark.normalized_url)) continue;
    seen.add(bookmark.normalized_url);
    curated.push({
      title: bookmark.title,
      url: bookmark.url,
      domain: bookmark.domain,
      year: bookmark.year,
      possible_favicon: bookmark.possible_favicon,
      primary_category: bookmark.primary_category,
      resource_type_tags: bookmark.resource_type_tags,
      action_tags: bookmark.action_tags,
      worldview_tags: bookmark.worldview_tags,
      aesthetic_tags: bookmark.aesthetic_tags,
      medium_tags: bookmark.medium_tags,
      value_status: bookmark.value_status,
      representative_tags: bookmark.representative_tags
    });
    if (curated.length >= limit) break;
  }

  return curated;
}

function main() {
  const html = readFile(inputPath);
  const parsed = parseBookmarks(html);
  const duplicateGroups = parsed.reduce((acc, item) => {
    const group = acc[item.normalized_url] ?? [];
    group.push(item);
    acc[item.normalized_url] = group;
    return acc;
  }, {});
  const duplicateCounts = Object.fromEntries(
    Object.entries(duplicateGroups).map(([key, items]) => [key, items.length])
  );

  const enriched = parsed.map((bookmark) => {
    const siblings = duplicateGroups[bookmark.normalized_url] ?? [bookmark];
    const years = siblings.map((item) => item.year).filter(Boolean).sort((a, b) => a - b);
    const firstSavedYear = years[0] ?? bookmark.year ?? null;
    const lastSavedYear = years.at(-1) ?? bookmark.year ?? null;

    return applyTaxonomy(
      {
        ...bookmark,
        duplicate_count: siblings.length,
        duplicate_cluster_id: siblings.length > 1 ? bookmark.normalized_url : null,
        first_saved_year: firstSavedYear,
        last_saved_year: lastSavedYear,
        save_span_years: firstSavedYear && lastSavedYear ? lastSavedYear - firstSavedYear : 0
      },
      {
      currentYear: 2026,
      duplicateCounts
      }
    );
  });

  const meta = summarize(enriched);
  const publicBookmarks = getPublicBookmarks(enriched);

  fs.writeFileSync(outputJsonPath, `${JSON.stringify(enriched, null, 2)}\n`);
  fs.writeFileSync(outputCsvPath, `${toCsv(enriched)}\n`);
  fs.writeFileSync(outputMetaPath, `${JSON.stringify(meta, null, 2)}\n`);
  fs.writeFileSync(outputPublicJsonPath, `${JSON.stringify(publicBookmarks, null, 2)}\n`);
  fs.writeFileSync(outputPublicCsvPath, `${toCsv(publicBookmarks)}\n`);

  console.log(
    JSON.stringify(
      {
        input: inputPath,
        outputJsonPath,
        outputCsvPath,
        outputMetaPath,
        outputPublicJsonPath,
        outputPublicCsvPath,
        total: enriched.length
      },
      null,
      2
    )
  );
}

main();
