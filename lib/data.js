import fs from "fs";
import path from "path";
import publicBookmarks from "@/data/public-bookmarks.json";
import { buildUserProfile } from "@/lib/profile";
import { applyKnownBookmarkCorrections, applyTaxonomy, normalizeUrl } from "@/lib/taxonomy";

const privateBookmarksPath = path.join(process.cwd(), "data", "bookmarks.json");

const categoryAliases = {
  Utilities: "Needs Review",
  "Utilities & Misc": "Needs Review",
  "Visual Reference Platforms": "Visual Inspiration & References",
  "Portfolios & Artists": "Portfolios, Artists & Studios",
  "Design Resources": "Design Systems & Interface Resources",
  "Build Tools & Development": "Tools, Dev & Workflow",
  "Creative Coding & Graphics": "Creative Coding & Computational Media",
  "Product, UX & AI": "AI, Product & Interaction",
  "Art & Institutions": "Institutions, Schools & Opportunities",
  "Career & Language": "Life, Learning & Personal Growth"
};

const bookmarks = normalizeBookmarks(loadBookmarks());

const categoryDescriptions = {
  "AI, Product & Interaction": "AI、产品、UX、交互案例与智能系统，偏趋势、产品判断和原型启发。",
  "Visual Inspiration & References": "视觉作品参考平台、灵感库、案例池，偏浏览、采样和项目 moodboard。",
  "Portfolios, Artists & Studios": "艺术家、设计师、工作室、个人作品集，偏看人与作品本身。",
  "Creative Coding & Computational Media": "创意编程、图形、着色器、生成视觉、数据可视化与实验计算艺术。",
  "Design Systems & Interface Resources": "UI、字体、品牌、设计系统、组件与界面方法。",
  "Reading & Humanities": "兴趣阅读、人文理论、文化文章、纪录与慢内容。",
  "Institutions, Schools & Opportunities": "学校、机构、基金、驻留、展览、组织与公共文化基础设施。",
  "Tools, Dev & Workflow": "搭建工具、前端技术、工程实现、开发文档和工作流资源。",
  "Life, Learning & Personal Growth": "职业发展、语言学习、身心状态、生活实践与能力迁移。",
  "Needs Review": "低置信、语义不足或需要人工复核的暂存资源。"
};

const smartCollectionDefinitions = [
  {
    slug: "accounts-communities",
    icon: "◎",
    label: "Accounts & Communities",
    shortLabel: "社群账号",
    description: "常回来登录、查看或进入社群的平台入口。",
    query: { resourceType: "Community" },
    match: (item) =>
      includesAny(item.domain, ["x.com", "twitter.com", "discord.com", "reddit.com", "linkedin.com", "instagram.com", "accounts.google.com"]) ||
      asArray(item.resource_type_tags).includes("Community") ||
      item.source_importance === "core_source",
    subgroups: [
      { label: "Social", patterns: ["x.com", "twitter", "linkedin", "instagram"] },
      { label: "Community", patterns: ["discord", "reddit", "community", "forum", "network"] },
      { label: "Account Portal", patterns: ["account", "login", "signin", "gmail", "google"] }
    ]
  },
  {
    slug: "reading-learning",
    icon: "✦",
    label: "Reading & Learning",
    shortLabel: "阅读学习",
    description: "文章、教程、课程、报告和适合之后慢慢消化的材料。",
    query: { action: "Read" },
    match: (item) =>
      hasAnyTag(item.resource_type_tags, ["Article", "Essay", "Publication", "Tutorial", "Course", "Research Report", "Video", "Guide", "Book"]) ||
      hasAnyTag(item.action_tags, ["Read", "Learn", "Extract Notes"]) ||
      includesAny(item.domain, ["medium.com", "substack.com", "theatlantic.com", "theverge.com", "ted.com"]),
    subgroups: [
      { label: "Articles", patterns: ["article", "essay", "blog", "medium", "substack"] },
      { label: "Tutorials", patterns: ["tutorial", "guide", "course", "learn"] },
      { label: "Reports", patterns: ["research", "report", "study", "journal"] }
    ]
  },
  {
    slug: "tools-plugins",
    icon: "✷",
    label: "Tools & Plugins",
    shortLabel: "工具插件",
    description: "之前用过、想试用，或未来做项目时可能复用的工具。",
    query: { action: "Try" },
    match: (item) =>
      hasAnyTag(item.resource_type_tags, ["Tool", "App", "Product Page", "Code Repository", "Documentation"]) ||
      hasAnyTag(item.action_tags, ["Try", "Compare"]) ||
      item.save_intent === "tool_or_prototype_trial",
    subgroups: [
      { label: "Design Tools", patterns: ["figma", "design", "font", "type", "brand", "ui", "ux", "logo", "pagebot", "quartz"] },
      { label: "Dev Tools", patterns: ["github", "docs", "api", "developer", "code", "javascript", "react", "jsfiddle", "repository"] },
      { label: "AI Tools", patterns: ["ai", "aigc", "gpt", "midjourney", "stable diffusion", "novelai", "dreamstudio", "machine learning"] },
      { label: "Media Tools", patterns: ["video", "motion", "cinema", "audio", "sound", "c4d", "cinema 4d"] },
      { label: "Utility Tools", patterns: ["toolbox", "download", "search", "gmail", "portal", "generator"] }
    ]
  },
  {
    slug: "life-admin-portals",
    icon: "◫",
    label: "Life Admin & Portals",
    shortLabel: "办事入口",
    description: "低频但重要的政府、考试、学校、税务、账户和生活事务入口。",
    query: { tag: "Education & Learning" },
    match: (item) =>
      item.primary_category === "Life, Learning & Personal Growth" ||
      item.primary_category === "Institutions, Schools & Opportunities" ||
      includesAny([item.title, item.domain, item.folder_path].join(" "), [
        "government",
        "gov",
        "tax",
        "belasting",
        "exam",
        "application",
        "portal",
        "school",
        "university",
        "college",
        "chsi",
        "duo",
        "考试",
        "税",
        "政府",
        "教务",
        "报名",
        "申请"
      ]),
    subgroups: [
      { label: "Government", patterns: ["gov", "government", "tax", "belasting", "政府", "税"] },
      { label: "School", patterns: ["school", "university", "college", "教务", "学校", "学院"] },
      { label: "Exam / Application", patterns: ["exam", "application", "报名", "申请", "考试"] }
    ]
  },
  {
    slug: "inspiration-references",
    icon: "◌",
    label: "Inspiration & References",
    shortLabel: "灵感参考",
    description: "设计、视觉、作品集、案例和“感觉特别好所以存下”的学习材料。",
    query: { action: "Reference" },
    match: (item) =>
      hasAnyTag([item.primary_category], ["Visual Inspiration & References", "Portfolios, Artists & Studios", "Design Systems & Interface Resources"]) ||
      hasAnyTag(item.resource_type_tags, ["Portfolio", "Studio Site", "Gallery", "Case Study"]) ||
      item.save_intent === "visual_reference",
    subgroups: [
      { label: "Visual", patterns: ["visual", "gallery", "showcase", "logo", "brand", "type"] },
      { label: "Portfolios", patterns: ["portfolio", "artist", "studio", "behance", "dribbble"] },
      { label: "Moodboard", patterns: ["inspiration", "reference", "cinematic", "editorial"] }
    ]
  },
  {
    slug: "sources-to-monitor",
    icon: "◍",
    label: "Learning Sources",
    shortLabel: "新知来源",
    description: "值得以后由 agent 定期看、总结和提醒的重要来源。",
    query: { action: "Monitor" },
    match: (item) =>
      item.source_importance === "core_source" ||
      item.source_importance === "specialist_source" ||
      hasAnyTag(item.action_tags, ["Monitor"]),
    subgroups: [
      { label: "Core", patterns: ["core_source", "github", "behance", "figma"] },
      { label: "Specialist", patterns: ["specialist_source", "journal", "magazine", "publication"] },
      { label: "Weekly", patterns: ["weekly", "feed", "newsletter", "source"] }
    ]
  },
  {
    slug: "review-cleanup",
    icon: "△",
    label: "Optimization Queue",
    shortLabel: "优化队列",
    description: "分类不确定、资源形态过泛或可以顺手改善的链接。",
    query: { category: "Needs Review" },
    match: (item) =>
      item.primary_category === "Needs Review" ||
      item.classification_confidence === "low" ||
      hasAnyTag(item.action_tags, ["Review", "Clean Up"]),
    subgroups: [
      { label: "Needs Category", patterns: ["Needs Review"] },
      { label: "Low Confidence", patterns: ["low"] },
      { label: "Cleanup", patterns: ["Clean Up", "outdated", "low_relevance"] }
    ]
  }
];

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
  const normalizedItems = items.map((bookmark, index) =>
    applyKnownBookmarkCorrections({
      ...bookmark,
      normalized_url: bookmark.normalized_url ?? normalizeUrl(bookmark.url ?? bookmark.title ?? `bookmark-${index}`)
    })
  );
  const duplicateCounts = countBy(normalizedItems, (item) => item.normalized_url);

  return normalizedItems.map((bookmark, index) => {
    const reclassified = applyTaxonomy(bookmark, {
      currentYear: 2026,
      duplicateCounts
    });
    const normalizedUrl = reclassified.normalized_url ?? reclassified.url ?? reclassified.title ?? `bookmark-${index}`;
    const normalizedBookmark = {
      ...reclassified,
      id: reclassified.id ?? `${normalizedUrl}::${reclassified.add_timestamp ?? reclassified.year ?? index}`,
      normalized_url: normalizedUrl,
      primary_category: normalizeCategory(reclassified.primary_category)
    };

    return {
      ...normalizedBookmark,
      representative_tags: getRepresentativeTags(normalizedBookmark)
    };
  });
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

const attentionMapStopTags = new Set([
  "Reference",
  "Archive",
  "Read",
  "Learn",
  "Try",
  "Website",
  "Tool",
  "Article",
  "Guide",
  "Needs Review",
  "active",
  "rediscover"
]);

function buildAttentionMapNodes(sourceItems, options = {}) {
  const tagSelector =
    options.tagSelector ??
    ((item) => [
      ...asArray(item.canonical_topics),
      ...asArray(item.worldview_tags),
      ...asArray(item.aesthetic_tags),
      ...asArray(item.interaction_paradigm_tags),
      item.primary_category
    ]);
  const scores = new Map();
  const itemCounts = new Map();
  const childScores = new Map();

  for (const item of sourceItems) {
    const tags = [...new Set(tagSelector(item).filter((tag) => tag && !attentionMapStopTags.has(tag)))];

    for (const tag of tags) {
      const topicBoost = asArray(item.canonical_topics).includes(tag) ? 2 : 1;
      const valueBoost = item.value_status === "rediscover" || item.value_status === "evergreen" ? 1 : 0;
      scores.set(tag, (scores.get(tag) ?? 0) + topicBoost + valueBoost);
      itemCounts.set(tag, (itemCounts.get(tag) ?? 0) + 1);

      const children = childScores.get(tag) ?? new Map();
      for (const childTag of tags) {
        if (childTag === tag) continue;
        children.set(childTag, (children.get(childTag) ?? 0) + 1);
      }
      childScores.set(tag, children);
    }
  }

  const maxScore = Math.max(...scores.values(), 1);

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, options.limit ?? 8)
    .map(([label, score]) => ({
      label,
      count: itemCounts.get(label) ?? 0,
      weight: score,
      size: 58 + Math.round((score / maxScore) * 34),
      href: `/search?tag=${encodeURIComponent(label)}`,
      children: [...(childScores.get(label)?.entries() ?? [])]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 5)
        .map(([childLabel, childCount]) => ({
          label: childLabel,
          count: childCount,
          href: `/search?tag=${encodeURIComponent(childLabel)}`
        }))
    }));
}

function buildAttentionMaps(items, sortedByDate, curatedBookmarks) {
  const recentItems = sortedByDate.slice(0, 48);
  const reuseItems = curatedBookmarks.filter((item) =>
    ["rediscover", "evergreen", "active"].includes(item.value_status) ||
    asArray(item.action_tags).some((tag) => ["Reference", "Try", "Learn", "Monitor"].includes(tag))
  );

  return [
    {
      id: "recent",
      nodes: buildAttentionMapNodes(recentItems.length >= 8 ? recentItems : items, { limit: 8 })
    },
    {
      id: "overview",
      nodes: buildAttentionMapNodes(items, {
        limit: 10,
        tagSelector: (item) => [
          ...asArray(item.canonical_topics),
          ...asArray(item.worldview_tags),
          item.primary_category
        ]
      })
    },
    {
      id: "reuse",
      nodes: buildAttentionMapNodes(reuseItems.length >= 8 ? reuseItems : curatedBookmarks, {
        limit: 8,
        tagSelector: (item) => [
          ...asArray(item.canonical_topics),
          ...asArray(item.resource_type_tags),
          ...asArray(item.action_tags),
          ...asArray(item.aesthetic_tags)
        ]
      })
    }
  ].filter((view) => view.nodes.length);
}

function includesAny(value, patterns) {
  const text = asArray(value).join(" ").toLowerCase();
  return patterns.some((pattern) => text.includes(pattern.toLowerCase()));
}

function hasAnyTag(values, tags) {
  const current = new Set(asArray(values));
  return tags.some((tag) => current.has(tag));
}

function getSmartCollectionScore(item) {
  const statusWeights = {
    rediscover: 8,
    evergreen: 7,
    active: 5,
    cold_storage: 1,
    outdated: -4,
    low_relevance: -3
  };
  const confidenceWeights = {
    high: 4,
    medium: 2,
    low: -1
  };

  return (
    (statusWeights[item.value_status] ?? 0) +
    (confidenceWeights[item.classification_confidence] ?? 0) +
    Math.min(asNumber(item.duplicate_count, 1), 4) +
    asArray(item.canonical_topics).length +
    (item.source_importance === "core_source" ? 3 : 0) +
    (item.source_importance === "specialist_source" ? 2 : 0)
  );
}

function buildCollectionSubgroups(definition, items) {
  return definition.subgroups.map((subgroup) => ({
    ...subgroup,
    href: `/collections/${definition.slug}?group=${encodeURIComponent(subgroup.label)}`,
    count: items.filter((item) => matchesCollectionSubgroup(item, subgroup)).length
  }));
}

function getCollectionItemText(item) {
  return [
    item.title,
    item.domain,
    item.primary_category,
    item.save_intent,
    item.source_importance,
    item.classification_confidence,
    ...asArray(item.resource_type_tags),
    ...asArray(item.action_tags),
    ...asArray(item.canonical_topics),
    ...asArray(item.medium_tags)
  ];
}

function matchesCollectionSubgroup(item, subgroup) {
  return includesAny(getCollectionItemText(item), subgroup.patterns);
}

function getMatchedSubgroups(item, definition) {
  return definition.subgroups
    .filter((subgroup) => matchesCollectionSubgroup(item, subgroup))
    .map((subgroup) => subgroup.label);
}

function buildSmartCollections(items) {
  return smartCollectionDefinitions.map((definition) => {
    const matched = items
      .filter(definition.match)
      .map((item) => ({
        ...item,
        smart_collection_score: getSmartCollectionScore(item)
      }))
      .sort((a, b) => b.smart_collection_score - a.smart_collection_score || (b.add_timestamp ?? 0) - (a.add_timestamp ?? 0));

    return {
      slug: definition.slug,
      icon: definition.icon,
      label: definition.label,
      shortLabel: definition.shortLabel,
      description: definition.description,
      query: definition.query,
      href: `/collections/${definition.slug}`,
      searchHref: `/search?${new URLSearchParams(definition.query).toString()}`,
      count: matched.length,
      subgroups: buildCollectionSubgroups(definition, matched),
      samples: matched.slice(0, 4)
    };
  });
}

export function getSmartCollections() {
  return buildSmartCollections(getBookmarks());
}

export function getSmartCollection(slug) {
  const definition = smartCollectionDefinitions.find((item) => item.slug === slug);
  if (!definition) return null;

  const items = getBookmarks()
    .filter(definition.match)
    .map((item) => ({
      ...item,
      matched_subgroups: getMatchedSubgroups(item, definition),
      smart_collection_score: getSmartCollectionScore(item)
    }))
    .sort((a, b) => b.smart_collection_score - a.smart_collection_score || (b.add_timestamp ?? 0) - (a.add_timestamp ?? 0));

  return {
    slug: definition.slug,
    icon: definition.icon,
    label: definition.label,
    shortLabel: definition.shortLabel,
    description: definition.description,
    query: definition.query,
    href: `/collections/${definition.slug}`,
    searchHref: `/search?${new URLSearchParams(definition.query).toString()}`,
    count: items.length,
    subgroups: buildCollectionSubgroups(definition, items),
    items
  };
}

export function getBookmarks() {
  return bookmarks;
}

export function getRepresentativeTags(bookmark) {
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
  const smartCollections = buildSmartCollections(items);

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
        ...asArray(item.canonical_topics),
        ...asArray(item.worldview_tags),
        ...asArray(item.aesthetic_tags),
        ...asArray(item.region_tags)
      ]),
      40
    ).map((entry) => entry.label),
    smartCollections: smartCollections.map((collection) => ({
      slug: collection.slug,
      label: collection.label,
      groups: collection.subgroups.map((group) => group.label)
    }))
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
  const collectionSlug = filters.collection ?? "all";
  const group = filters.group ?? "all";
  const collection = collectionSlug === "all" ? null : getSmartCollection(collectionSlug);

  return items.filter((bookmark) => {
    const haystack = [
      bookmark.title,
      bookmark.url,
      bookmark.domain,
      bookmark.primary_category,
      asArray(bookmark.resource_type_tags).join(" "),
      asArray(bookmark.action_tags).join(" "),
      asArray(bookmark.canonical_topics).join(" "),
      asArray(bookmark.worldview_tags).join(" "),
      asArray(bookmark.aesthetic_tags).join(" "),
      asArray(bookmark.region_tags).join(" ")
    ]
      .join(" ")
      .toLowerCase();

    const allTags = [
      bookmark.primary_category,
      ...asArray(bookmark.canonical_topics),
      ...asArray(bookmark.resource_type_tags),
      ...asArray(bookmark.action_tags),
      ...asArray(bookmark.worldview_tags),
      ...asArray(bookmark.aesthetic_tags),
      ...asArray(bookmark.region_tags)
    ];

    return (
      (!query || haystack.includes(query)) &&
      (year === "all" || String(bookmark.year) === String(year)) &&
      (status === "all" || bookmark.value_status === status) &&
      (category === "all" || bookmark.primary_category === category) &&
      (resourceType === "all" || asArray(bookmark.resource_type_tags).includes(resourceType)) &&
      (action === "all" || asArray(bookmark.action_tags).includes(action)) &&
      (tag === "all" || allTags.includes(tag)) &&
      (!collection || collection.items.some((item) => item.id === bookmark.id)) &&
      (group === "all" || collection?.items.find((item) => item.id === bookmark.id)?.matched_subgroups?.includes(group))
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
  const smartCollections = buildSmartCollections(items);
  const attentionMaps = buildAttentionMaps(items, sortedByDate, curatedBookmarks);

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
    attentionMaps,
    smartCollections,
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
    const groupKeys = tags.length ? tags : ["Unsorted"];

    for (const key of groupKeys) {
      const list = grouped.get(key) ?? [];
      list.push(item);
      grouped.set(key, list);
    }
  }

  return [...grouped.entries()]
    .map(([label, bookmarks]) => ({ label, bookmarks }))
    .sort((a, b) => b.bookmarks.length - a.bookmarks.length);
}

export function getUserProfileData() {
  return buildUserProfile(getBookmarks());
}

export function getReclassifyData() {
  const items = getBookmarks();
  const byOldFolder = countBy(items, (item) => item.raw_folder || "Unfiled");
  const folderGroups = Object.keys(byOldFolder)
    .map((folder) => {
      const slice = items.filter((item) => (item.raw_folder || "Unfiled") === folder);
      const topCategory = topEntries(countBy(slice, (item) => item.primary_category), 1)[0]?.label ?? "Needs Review";
      const topResourceType = topEntries(countMany(slice, (item) => item.resource_type_tags), 1)[0]?.label ?? "Reference";
      const topAction = topEntries(countMany(slice, (item) => item.action_tags), 1)[0]?.label ?? "Review";

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
        (item) => [...asArray(item.canonical_topics), ...asArray(item.resource_type_tags), ...asArray(item.action_tags), ...asArray(item.worldview_tags)]
      ),
      4
    ).map((tag) => tag.label)
  }));

  return {
    folderGroups,
    categoryBlueprint
  };
}

export function getReviewData() {
  const items = getBookmarks();
  const needsReview = items.filter((item) => item.primary_category === "Needs Review");
  const lowConfidence = items.filter((item) => item.classification_confidence === "low");
  const genericReference = items.filter((item) => asArray(item.resource_type_tags).includes("Reference"));
  const reviewAction = items.filter((item) => asArray(item.action_tags).includes("Review"));
  const monitorCandidates = items.filter(
    (item) => item.source_importance === "core_source" || item.source_importance === "specialist_source" || asArray(item.action_tags).includes("Monitor")
  );
  const cleanupCandidates = items.filter((item) =>
    ["cold_storage", "low_relevance", "outdated"].includes(item.value_status) || asArray(item.action_tags).includes("Clean Up")
  );

  const priorityItems = [...items]
    .map((item) => ({
      ...item,
      review_priority:
        (item.primary_category === "Needs Review" ? 4 : 0) +
        (item.classification_confidence === "low" ? 3 : 0) +
        (asArray(item.resource_type_tags).includes("Reference") ? 2 : 0) +
        (asArray(item.action_tags).includes("Review") ? 2 : 0) +
        (asArray(item.canonical_topics).length ? -1 : 0)
    }))
    .filter((item) => item.review_priority > 0)
    .sort((a, b) => b.review_priority - a.review_priority || (b.add_timestamp ?? 0) - (a.add_timestamp ?? 0));

  const queues = [
    {
      id: "needs-category",
      label: "Needs Category",
      count: needsReview.length,
      description: "主分类仍然不确定，适合优先补规则或手动归类。",
      href: "/search?category=Needs%20Review"
    },
    {
      id: "low-confidence",
      label: "Low Confidence",
      count: lowConfidence.length,
      description: "规则证据不足，适合查看标题、域名和旧 folder 是否能提供线索。",
      href: "/review#low-confidence"
    },
    {
      id: "generic-reference",
      label: "Generic Reference",
      count: genericReference.length,
      description: "资源形态仍然偏泛，适合补充 Tool / Article / Portfolio / Institution 等判断。",
      href: "/review#generic-reference"
    },
    {
      id: "source-monitoring",
      label: "Source Monitoring",
      count: monitorCandidates.length,
      description: "可能值得持续关注的来源，未来可进入 agent watchlist。",
      href: "/signals"
    },
    {
      id: "cleanup",
      label: "Cleanup",
      count: cleanupCandidates.length,
      description: "冷存、过时、低相关或疑似应清理资源。",
      href: "/cold-storage"
    }
  ];

  return {
    totals: {
      total: items.length,
      needsReview: needsReview.length,
      lowConfidence: lowConfidence.length,
      genericReference: genericReference.length,
      reviewAction: reviewAction.length,
      monitorCandidates: monitorCandidates.length,
      cleanupCandidates: cleanupCandidates.length
    },
    queues,
    priorityItems: priorityItems.slice(0, 36),
    needsReview: needsReview.slice(0, 12),
    lowConfidence: lowConfidence.slice(0, 12),
    genericReference: genericReference.slice(0, 12),
    monitorCandidates: monitorCandidates.slice(0, 12),
    cleanupCandidates: cleanupCandidates.slice(0, 12)
  };
}
