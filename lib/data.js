import fs from "fs";
import path from "path";
import publicBookmarks from "@/data/public-bookmarks.json";

const privateBookmarksPath = path.join(process.cwd(), "data", "bookmarks.json");

const categoryAliases = {
  Utilities: "Utilities & Misc"
};

const bookmarks = normalizeBookmarks(loadBookmarks());

const categoryDescriptions = {
  "Visual Reference Platforms": "视觉作品参考平台、灵感库、案例池，偏浏览和采样。",
  "Portfolios & Artists": "艺术家、设计师、工作室、个人作品集，偏看人与作品本身。",
  "Design Resources": "UI、字体、品牌、设计系统等可直接用于设计工作的资源。",
  "Build Tools & Development": "搭建工具、前端技术、工程实现、开发文档。",
  "Creative Coding & Graphics": "创意编程、图形、着色器、生成视觉与实验计算艺术。",
  "Product, UX & AI": "产品开发、UX 方法、AI 工具、交互系统与应用趋势。",
  "Reading & Humanities": "兴趣阅读、人文理论、文化文章、纪录与慢内容。",
  "Art & Institutions": "机构、基金、驻留、艺术基础设施与公共文化组织。",
  "Career & Language": "求职、职业发展、简历面试、语言学习与能力迁移。",
  "Utilities & Misc": "导航、搜索、临时工具和暂时还不值得深分的杂项。"
};

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function loadBookmarks() {
  if (process.env.NEXT_PUBLIC_DATA_MODE === "public") {
    return publicBookmarks;
  }

  try {
    return JSON.parse(fs.readFileSync(privateBookmarksPath, "utf8"));
  } catch {
    return publicBookmarks;
  }
}

function normalizeCategory(label) {
  return categoryAliases[label] ?? label;
}

function normalizeBookmarks(items) {
  return items.map((bookmark) => ({
    ...bookmark,
    primary_category: normalizeCategory(bookmark.primary_category),
    ...(bookmark.representative_tags
      ? {
          representative_tags: asArray(bookmark.representative_tags).map(normalizeCategory)
        }
      : {})
  }));
}

function asNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
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
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export function getBookmarks() {
  return bookmarks;
}

export function getRepresentativeTags(bookmark) {
  return [
    bookmark.primary_category,
    ...asArray(bookmark.resource_type_tags),
    ...asArray(bookmark.action_tags),
    ...asArray(bookmark.worldview_tags),
    ...asArray(bookmark.aesthetic_tags)
  ].filter((tag, index, array) => tag && array.indexOf(tag) === index).slice(0, 4);
}

export function getCuratedBookmarks(limit = 180) {
  const items = getBookmarks()
    .map((bookmark) => ({
      ...bookmark,
      representative_tags: getRepresentativeTags(bookmark),
      curation_score: getCurationScore(bookmark)
    }))
    .filter((bookmark) => bookmark.value_status !== "outdated" && bookmark.value_status !== "low_relevance")
    .sort((a, b) => b.curation_score - a.curation_score || (b.add_timestamp ?? 0) - (a.add_timestamp ?? 0));

  const seen = new Set();
  const curated = [];

  for (const item of items) {
    const uniqueKey = item.normalized_url ?? item.url ?? item.title;
    if (seen.has(uniqueKey)) continue;
    seen.add(uniqueKey);
    curated.push(item);
    if (curated.length >= limit) break;
  }

  return curated;
}

export function getSearchOptions() {
  const items = getBookmarks();

  return {
    years: [...new Set(items.map((item) => item.year).filter(Boolean))].sort((a, b) => b - a),
    statuses: [...new Set(items.map((item) => item.value_status))].sort(),
    categories: [...new Set(items.map((item) => item.primary_category).filter(Boolean))].sort(),
    resourceTypes: topEntries(
      countMany(items, (item) => [
        ...asArray(item.resource_type_tags)
      ]),
      20
    ).map((entry) => entry.label),
    actionTags: topEntries(
      countMany(items, (item) => [
        ...asArray(item.action_tags)
      ]),
      20
    ).map((entry) => entry.label),
    tags: topEntries(
      countMany(items, (item) => [
        item.primary_category,
        ...asArray(item.worldview_tags),
        ...asArray(item.aesthetic_tags)
      ]),
      40
    ).map((entry) => entry.label)
  };
}

export function searchBookmarks(filters = {}) {
  const items = getBookmarks();
  const query = (filters.query ?? "").trim().toLowerCase();
  const year = filters.year ?? "all";
  const status = filters.status ?? "all";
  const category = filters.category ?? "all";
  const resourceType = filters.resourceType ?? "all";
  const action = filters.action ?? "all";
  const tag = filters.tag ?? "all";

  return items.filter((bookmark) => {
    const haystack = [
      bookmark.title,
      bookmark.url,
      bookmark.domain,
      bookmark.primary_category,
      asArray(bookmark.resource_type_tags).join(" "),
      asArray(bookmark.action_tags).join(" "),
      asArray(bookmark.worldview_tags).join(" "),
      asArray(bookmark.aesthetic_tags).join(" "),
      asArray(bookmark.region_tags).join(" ")
    ]
      .join(" ")
      .toLowerCase();

    const allTags = [
      bookmark.primary_category,
      ...asArray(bookmark.resource_type_tags),
      ...asArray(bookmark.action_tags),
      ...asArray(bookmark.worldview_tags),
      ...asArray(bookmark.aesthetic_tags)
    ];

    return (
      (!query || haystack.includes(query)) &&
      (year === "all" || String(bookmark.year) === String(year)) &&
      (status === "all" || bookmark.value_status === status) &&
      (category === "all" || bookmark.primary_category === category) &&
      (resourceType === "all" || asArray(bookmark.resource_type_tags).includes(resourceType)) &&
      (action === "all" || asArray(bookmark.action_tags).includes(action)) &&
      (tag === "all" || allTags.includes(tag))
    );
  });
}

export function getDashboardData() {
  const items = getBookmarks();
  const curatedBookmarks = getCuratedBookmarks();
  const sortedByDate = [...items].sort((a, b) => (b.add_timestamp ?? 0) - (a.add_timestamp ?? 0));
  const timeline = Object.entries(countBy(items, (item) => item.year))
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, count]) => ({ year: Number(year), count }));
  const worldviewCounts = countMany(items, (item) => item.worldview_tags);
  const categoryCounts = countBy(items, (item) => item.primary_category);
  const interactionCounts = countMany(items, (item) => item.interaction_paradigm_tags);
  const aestheticCounts = countMany(items, (item) => item.aesthetic_tags);
  const statusCounts = countBy(items, (item) => item.value_status);
  const domainCounts = countBy(items, (item) => item.domain);

  const coldStorage = items.filter((item) => ["cold_storage", "low_relevance", "outdated"].includes(item.value_status));
  const rediscovery = items.filter((item) => item.value_status === "rediscover").slice(0, 9);
  const moodboard = items
    .filter((item) => item.possible_favicon)
    .slice(0, 18);

  const hiddenConnections = buildHiddenConnections(items);
  const constellation = buildConstellation(items);
  const categoryPaths = buildCategoryPaths(items);
  const featuredCategories = buildFeaturedCategories(curatedBookmarks);
  const evolutionStages = buildEvolutionStages(items, timeline);
  const duplicateClusters = buildDuplicateClusters(items);
  const themeDrifts = buildThemeDrifts(evolutionStages);
  const representativeTags = topEntries(
    countMany(curatedBookmarks, (item) => item.representative_tags),
    12
  );
  const visualDirections = buildVisualDirections(curatedBookmarks);

  return {
    bookmarks: items,
    curatedBookmarks,
    totals: {
      total: items.length,
      uniqueDomains: Object.keys(domainCounts).length,
      worldviewClusters: Object.keys(categoryCounts).length,
      coldStorage: coldStorage.length,
      duplicateClusters: duplicateClusters.length
    },
    timeline,
    worldviewCounts: topEntries(categoryCounts, 12),
    interactionCounts: topEntries(interactionCounts, 12),
    aestheticCounts: topEntries(aestheticCounts, 12),
    statusCounts: topEntries(statusCounts, 6),
    topDomains: topEntries(domainCounts, 10),
    representativeTags,
    rediscovery,
    moodboard,
    hiddenConnections,
    constellation,
    categoryPaths,
    featuredCategories,
    visualDirections,
    evolutionStages,
    themeDrifts,
    duplicateClusters,
    recent: sortedByDate.slice(0, 12),
    coldStorage
  };
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

  return (
    (statusWeights[bookmark.value_status] ?? 0) +
    getRepresentativeTags(bookmark).length * 2 +
    Math.min(asNumber(bookmark.duplicate_count, 1), 4) +
    Math.min(asNumber(bookmark.save_span_years), 4)
  );
}

function buildVisualDirections(items) {
  const grouped = new Map();

  for (const item of items) {
    const key =
      item.primary_category ??
      asArray(item.aesthetic_tags)[0] ??
      asArray(item.medium_tags)[0] ??
      "Unsorted";

    const group = grouped.get(key) ?? [];
    group.push(item);
    grouped.set(key, group);
  }

  return [...grouped.entries()]
    .map(([label, bookmarks]) => ({
      label,
      count: bookmarks.length,
      bookmarks: bookmarks.slice(0, 3)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

function buildCategoryPaths(items) {
  const grouped = new Map();

  for (const item of items) {
    const category = item.primary_category;
    const resourceType = asArray(item.resource_type_tags)[0];
    const action = asArray(item.action_tags)[0];
    if (!category || !resourceType) continue;

    const key = `${category}__${resourceType}__${action ?? "Archive"}`;
    const current = grouped.get(key) ?? {
      category,
      resourceType,
      action: action ?? "Archive",
      count: 0
    };
    current.count += 1;
    grouped.set(key, current);
  }

  return [...grouped.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function buildFeaturedCategories(items) {
  const categories = topEntries(countBy(items, (item) => item.primary_category), 6);

  return categories.map((entry) => {
    const slice = items.filter((item) => item.primary_category === entry.label);
    return {
      label: entry.label,
      count: entry.count,
      resourceTypes: topEntries(countMany(slice, (item) => item.resource_type_tags), 3).map((item) => item.label),
      actions: topEntries(countMany(slice, (item) => item.action_tags), 2).map((item) => item.label),
      samples: slice.slice(0, 3)
    };
  });
}

function buildHiddenConnections(items) {
  const pairCounts = {};

  for (const item of items) {
    const worldview = asArray(item.worldview_tags)[0];
    const human = asArray(item.human_state_tags)[0];
    const interaction = asArray(item.interaction_paradigm_tags)[0];
    if (worldview && human) {
      const key = `${worldview}__${human}`;
      pairCounts[key] = (pairCounts[key] ?? 0) + 1;
    }
    if (human && interaction) {
      const key = `${human}__${interaction}`;
      pairCounts[key] = (pairCounts[key] ?? 0) + 1;
    }
  }

  return Object.entries(pairCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key, count]) => {
      const [from, to] = key.split("__");
      return { from, to, count };
    });
}

function buildConstellation(items) {
  const nodeCounts = {};
  const edgeCounts = {};

  for (const item of items) {
    const worldview = asArray(item.worldview_tags)[0];
    const human = asArray(item.human_state_tags)[0];
    const interaction = asArray(item.interaction_paradigm_tags)[0];
    const aesthetic = asArray(item.aesthetic_tags)[0];
    const sequence = [
      worldview ? { label: worldview, layer: "worldview" } : null,
      human ? { label: human, layer: "human" } : null,
      interaction ? { label: interaction, layer: "interaction" } : null,
      aesthetic ? { label: aesthetic, layer: "aesthetic" } : null
    ].filter(Boolean);

    for (const node of sequence) {
      const key = `${node.layer}::${node.label}`;
      nodeCounts[key] = nodeCounts[key] ?? { ...node, count: 0 };
      nodeCounts[key].count += 1;
    }

    for (let index = 0; index < sequence.length - 1; index += 1) {
      const from = sequence[index];
      const to = sequence[index + 1];
      const edgeKey = `${from.layer}::${from.label}__${to.layer}::${to.label}`;
      edgeCounts[edgeKey] = edgeCounts[edgeKey] ?? {
        from: from.label,
        to: to.label,
        fromLayer: from.layer,
        toLayer: to.layer,
        count: 0
      };
      edgeCounts[edgeKey].count += 1;
    }
  }

  const nodes = Object.values(nodeCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 16)
    .map((node) => ({
      ...node,
      size: Math.max(1, Math.min(4, Math.ceil(node.count / 25)))
    }));
  const allowed = new Set(nodes.map((node) => `${node.layer}::${node.label}`));
  const edges = Object.values(edgeCounts)
    .filter((edge) => allowed.has(`${edge.fromLayer}::${edge.from}`) && allowed.has(`${edge.toLayer}::${edge.to}`))
    .sort((a, b) => b.count - a.count)
    .slice(0, 18);

  return { nodes, edges };
}

function buildEvolutionStages(items, timeline) {
  if (!timeline.length) return [];

  const minYear = timeline[0].year;
  const maxYear = timeline.at(-1).year;
  const spans = [
    [minYear, Math.min(minYear + 3, maxYear), "Foundation"],
    [Math.min(minYear + 4, maxYear), Math.min(minYear + 7, maxYear), "Expansion"],
    [Math.min(minYear + 8, maxYear), Math.min(minYear + 11, maxYear), "Synthesis"],
    [Math.min(minYear + 12, maxYear), maxYear, "Creative intelligence"]
  ].filter(([start, end]) => start <= end);

  return spans.map(([start, end, label]) => {
    const slice = items.filter((item) => item.year >= start && item.year <= end);
    const worldviewEntries = topEntries(countMany(slice, (item) => item.worldview_tags), 3);
    const interactionEntries = topEntries(countMany(slice, (item) => item.interaction_paradigm_tags), 3);
    const aestheticEntries = topEntries(countMany(slice, (item) => item.aesthetic_tags), 3);
    const topWorldview = worldviewEntries[0]?.label ?? "Open curiosity";
    const topInteraction = interactionEntries[0]?.label ?? "GUI";
    const topAesthetic = aestheticEntries[0]?.label ?? "Editorial";

    return {
      label,
      range: `${start}-${end}`,
      topWorldview,
      topInteraction,
      topAesthetic,
      bookmarkCount: slice.length,
      worldviewEntries,
      interactionEntries,
      aestheticEntries,
      narrative: `${label} phase centered on ${topWorldview.toLowerCase()}, expressed through ${topInteraction.toLowerCase()} interaction and a ${topAesthetic.toLowerCase()} surface language.`
    };
  });
}

function buildThemeDrifts(stages) {
  const drifts = [];

  for (let index = 1; index < stages.length; index += 1) {
    const previous = stages[index - 1];
    const current = stages[index];

    drifts.push({
      from: previous.label,
      to: current.label,
      range: `${previous.range} -> ${current.range}`,
      worldviewShift: summarizeShift(previous.worldviewEntries, current.worldviewEntries),
      interactionShift: summarizeShift(previous.interactionEntries, current.interactionEntries),
      aestheticShift: summarizeShift(previous.aestheticEntries, current.aestheticEntries)
    });
  }

  return drifts;
}

function summarizeShift(previousEntries, currentEntries) {
  const previousTop = previousEntries[0]?.label ?? "Open curiosity";
  const currentTop = currentEntries[0]?.label ?? "Open curiosity";
  const newcomer = currentEntries.find((entry) => !previousEntries.some((previous) => previous.label === entry.label))?.label ?? currentTop;

  return {
    from: previousTop,
    to: currentTop,
    newcomer
  };
}

function buildDuplicateClusters(items) {
  const grouped = new Map();

  for (const item of items) {
    if (!item.duplicate_cluster_id) continue;
    const cluster = grouped.get(item.duplicate_cluster_id) ?? [];
    cluster.push(item);
    grouped.set(item.duplicate_cluster_id, cluster);
  }

  return [...grouped.values()]
    .map((cluster) => {
      const sorted = [...cluster].sort((a, b) => (a.add_timestamp ?? 0) - (b.add_timestamp ?? 0));
      const years = [...new Set(sorted.map((item) => item.year).filter(Boolean))];
      const folders = [...new Set(sorted.map((item) => item.folder_path).filter(Boolean))];
      const worldview = topEntries(
        countMany(sorted, (item) => item.worldview_tags),
        2
      ).map((entry) => entry.label);

      return {
        id: sorted[0].duplicate_cluster_id,
        title: sorted[0].title,
        url: sorted[0].url,
        domain: sorted[0].domain,
        duplicateCount: sorted.length,
        firstSavedYear: sorted[0].first_saved_year,
        lastSavedYear: sorted[0].last_saved_year,
        saveSpanYears: sorted[0].save_span_years,
        folders,
        years,
        worldview,
        transitionNarrative: describeFolderTransition(folders),
        bookmarks: sorted
      };
    })
    .sort((a, b) => b.duplicateCount - a.duplicateCount || asNumber(b.saveSpanYears) - asNumber(a.saveSpanYears))
    .slice(0, 18);
}

function describeFolderTransition(folders) {
  if (!folders.length) {
    return "Saved repeatedly without a clear folder lineage.";
  }

  if (folders.length === 1) {
    return `Stayed inside ${folders[0]}, suggesting a stable long-term reference.`;
  }

  const first = folders[0];
  const last = folders.at(-1);
  return `Moved from ${first} toward ${last}, suggesting the reference changed role as your archive evolved.`;
}

export function getAtlasGroups(groupBy) {
  const items = getBookmarks();
  const grouped = new Map();

  for (const item of items) {
    const value = item[groupBy];
    const tags = Array.isArray(value) ? value : value ? [value] : [];
    const key = tags[0] ?? "Unsorted";
    const list = grouped.get(key) ?? [];
    list.push(item);
    grouped.set(key, list);
  }

  return [...grouped.entries()]
    .map(([label, bookmarks]) => ({ label, bookmarks }))
    .sort((a, b) => b.bookmarks.length - a.bookmarks.length);
}

export function getReclassifyData() {
  const items = getBookmarks();
  const byOldFolder = countBy(items, (item) => item.raw_folder || "Unfiled");
  const folderGroups = Object.keys(byOldFolder)
    .map((folder) => {
      const slice = items.filter((item) => (item.raw_folder || "Unfiled") === folder);
      const topCategory = topEntries(countBy(slice, (item) => item.primary_category), 1)[0]?.label ?? "Utilities & Misc";
      const topResourceType = topEntries(countMany(slice, (item) => item.resource_type_tags), 1)[0]?.label ?? "Reference";
      const topAction = topEntries(countMany(slice, (item) => item.action_tags), 1)[0]?.label ?? "Archive";

      return {
        folder,
        count: slice.length,
        topCategory,
        topCategoryDescription: categoryDescriptions[topCategory] ?? "",
        topResourceType,
        topAction,
        samples: slice.slice(0, 3)
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 24);

  const categoryBlueprint = topEntries(countBy(items, (item) => item.primary_category), 12).map((entry) => ({
    ...entry,
    description: categoryDescriptions[entry.label] ?? "",
    sampleTags: topEntries(
      countMany(
        items.filter((item) => item.primary_category === entry.label),
        (item) => [...asArray(item.resource_type_tags), ...asArray(item.action_tags), ...asArray(item.worldview_tags)]
      ),
      4
    ).map((tag) => tag.label)
  }));

  return {
    folderGroups,
    categoryBlueprint
  };
}
