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

function topEntries(record, limit = 8) {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function includesAny(text, patterns) {
  const normalized = text.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
}

function itemText(item) {
  return [
    item.title,
    item.url,
    item.domain,
    item.primary_category,
    item.save_intent,
    item.source_importance,
    ...asArray(item.region_tags),
    ...asArray(item.resource_type_tags),
    ...asArray(item.action_tags),
    ...asArray(item.canonical_topics),
    ...asArray(item.worldview_tags),
    ...asArray(item.aesthetic_tags),
    ...asArray(item.medium_tags)
  ].join(" ");
}

const profileDimensions = [
  {
    label: "Design / visual systems",
    description: "Strong evidence of design practice, visual reference collecting, studios, portfolios, branding, and design systems.",
    patterns: ["design", "visual", "portfolio", "studio", "brand", "logo", "type", "Design Systems & Interface Resources", "Visual Inspiration & References", "Portfolios, Artists & Studios", "设计", "工作室"]
  },
  {
    label: "Art institutions & cultural research",
    description: "Interest in art schools, institutions, cultural archives, museums, and research-led references.",
    patterns: ["Cultural Institutions", "Western Art Institutions", "museum", "foundation", "institution", "school", "academy", "research", "archive", "future art ecosystems", "艺术", "机构", "学院"]
  },
  {
    label: "Tech art / computational media",
    description: "A bridge between creative coding, data visualization, generative media, new media art, and tool-based making.",
    patterns: ["Tech Art & Computational Media", "Creative Coding", "New Media Art", "Data Visualization", "creative coding", "processing", "gephi", "shader", "generative art", "新媒体", "创意编程"]
  },
  {
    label: "HCI / interaction intelligence",
    description: "Interaction design, interface thinking, UX systems, and human-computer interaction show up as a recurring lens.",
    patterns: ["HCI & Interaction Design", "Human-AI Interaction", "interaction", "interface", "ux", "ui", "human-computer", "人机交互", "交互"]
  },
  {
    label: "Personal knowledge systems",
    description: "Bookmarks are not only resources; they also point to memory, mapping, archive, attention, and learning systems.",
    patterns: ["Personal Knowledge Systems", "knowledge", "memory", "mind map", "atlas", "archive", "notes", "information mapping"]
  },
  {
    label: "AI product curiosity",
    description: "Signals around AI, product interfaces, tools, agents, and human-AI collaboration.",
    patterns: ["Generative AI", "AI Agents", "Human-AI Interaction", "AI, Product & Interaction", "gpt", "aigc", "agent", "midjourney", "machine learning"]
  }
];

const interestStopTags = new Set([
  "Needs Review",
  "Reference",
  "Video",
  "Article",
  "Tool",
  "Tutorial",
  "Search Result",
  "Documentation",
  "Global",
  "active",
  "Archive",
  "Read",
  "Try",
  "Learn",
  "Monitor"
]);

function getWeightedInterestTags(items) {
  const maxYear = Math.max(...items.map((item) => Number(item.year) || 0), 0);
  const scores = new Map();
  const counts = new Map();

  for (const item of items) {
    const tags = [
      ...asArray(item.canonical_topics),
      ...asArray(item.region_tags),
      ...asArray(item.primary_category),
      ...asArray(item.resource_type_tags)
    ].filter((tag) => !interestStopTags.has(tag));
    const uniqueTags = [...new Set(tags)];
    const year = Number(item.year) || maxYear;
    const recencyBoost = maxYear && year >= maxYear - 2 ? 1.4 : year >= maxYear - 6 ? 1 : 0.55;
    const durationBoost = Number(item.save_span_years) > 2 ? 0.8 : 0;

    for (const tag of uniqueTags) {
      scores.set(tag, (scores.get(tag) ?? 0) + recencyBoost + durationBoost);
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([label, score]) => ({
      label,
      count: counts.get(label) ?? 0,
      score: Number(score.toFixed(1))
    }));
}

function buildProfileDimensions(items) {
  return profileDimensions
    .map((dimension) => {
      const matches = items.filter((item) => includesAny(itemText(item), dimension.patterns));
      return {
        ...dimension,
        count: matches.length,
        share: items.length ? Math.round((matches.length / items.length) * 100) : 0,
        samples: matches.slice(0, 3)
      };
    })
    .filter((dimension) => dimension.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function inferProfileHeadline(dimensions) {
  const labels = dimensions.map((dimension) => dimension.label);
  if (labels.includes("Design / visual systems") && labels.includes("Tech art / computational media")) {
    return "Design-minded creative technologist";
  }
  if (labels.includes("Design / visual systems") && labels.includes("Art institutions & cultural research")) {
    return "Design researcher with cultural-institution memory";
  }
  if (labels.includes("Personal knowledge systems")) {
    return "Knowledge-system builder";
  }
  return dimensions[0]?.label ?? "Exploratory knowledge collector";
}

function buildRhythm(items) {
  const byYear = topEntries(countMany(items, (item) => item.year), 8);
  const topActions = topEntries(countMany(items, (item) => item.action_tags), 5);
  const topResourceTypes = topEntries(countMany(items, (item) => item.resource_type_tags), 5);
  const topRegions = topEntries(countMany(items, (item) => item.region_tags), 5);
  const topSaveIntents = topEntries(countMany(items, (item) => item.save_intent), 5);

  return {
    byYear,
    topActions,
    topResourceTypes,
    topRegions,
    topSaveIntents
  };
}

function buildClassificationLeads(items) {
  const leads = [];
  const regions = countMany(items, (item) => item.region_tags);
  const topics = countMany(items, (item) => item.canonical_topics);
  const resourceTypes = countMany(items, (item) => item.resource_type_tags);

  if ((regions.Netherlands ?? 0) >= 5 || (regions.Europe ?? 0) >= 10) {
    leads.push("Keep Netherlands / Europe as first-class region filters for design, art institutions, and research references.");
  }
  if ((topics["Chinese Design Studios"] ?? 0) >= 5 || (topics["Western Design Studios"] ?? 0) >= 5) {
    leads.push("Split design studio references by region and studio type instead of mixing them with generic visual inspiration.");
  }
  if ((topics["Tech Art & Computational Media"] ?? 0) >= 4 || (topics["New Media Art"] ?? 0) >= 2) {
    leads.push("Treat new media art, creative coding, and computational media as a specialist cluster for future search.");
  }
  if ((resourceTypes.Reference ?? 0) / Math.max(items.length, 1) > 0.3) {
    leads.push("Reduce generic Reference tags by asking whether an item is a studio, institution, article, tool, or research platform.");
  }

  return leads.slice(0, 4);
}

export function buildUserProfile(items) {
  const dimensions = buildProfileDimensions(items);
  const interests = getWeightedInterestTags(items);
  const rhythm = buildRhythm(items);
  const classificationLeads = buildClassificationLeads(items);
  const headline = inferProfileHeadline(dimensions);

  return {
    headline,
    summary:
      "The archive suggests a profile centered on design, visual culture, creative technology, art/research institutions, and personal knowledge systems. The strongest value is not just storing links, but turning them into a map of taste, professional direction, and reusable reference memory.",
    dimensions,
    interests,
    rhythm,
    classificationLeads
  };
}
