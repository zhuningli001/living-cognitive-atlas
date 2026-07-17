const worldviewRules = [
  { tag: "Human × AI coexistence", patterns: ["ai", "machine learning", "gpt", "llm", "agent", "copilot", "neural", "artificial intelligence"] },
  { tag: "Calm technology", patterns: ["calm", "minimal", "quiet", "ambient", "slow", "mindful", "zen", "meditation"] },
  { tag: "Decentralized creativity", patterns: ["web3", "blockchain", "dao", "crypto", "open source", "community", "creator economy"] },
  { tag: "Ambient intelligence", patterns: ["ambient", "ubiquitous", "voice", "iot", "smart home", "wearable", "sensor"] },
  { tag: "Emotional computing", patterns: ["emotion", "empathy", "wellbeing", "mental health", "healing", "care", "relationship"] },
  { tag: "Future parenting", patterns: ["parent", "family", "children", "education", "learning", "school", "future of kids"] },
  { tag: "Slowness & calm", patterns: ["slow living", "mindfulness", "tea", "ritual", "retreat", "calm", "stillness"] },
  { tag: "Collective intelligence", patterns: ["collective", "community", "network", "collaboration", "knowledge sharing", "forum"] },
  { tag: "Systemic thinking", patterns: ["system", "framework", "ecosystem", "strategy", "governance", "infrastructure"] },
  { tag: "Creative autonomy", patterns: ["portfolio", "freelance", "independent", "studio", "creator", "workflow", "craft"] }
];

const humanStateRules = [
  { tag: "Flow", patterns: ["flow", "productivity", "maker", "craft", "deep work"] },
  { tag: "Presence", patterns: ["presence", "mindful", "meditation", "calm", "ritual", "breath"] },
  { tag: "Intimacy", patterns: ["love", "relationship", "intimate", "family", "friend", "care"] },
  { tag: "Curiosity", patterns: ["research", "explore", "discover", "future", "trend", "signal", "lab"] },
  { tag: "Reflection", patterns: ["journal", "essay", "notes", "reflection", "review", "archive"] },
  { tag: "Healing", patterns: ["therapy", "wellness", "healing", "mental health", "rest"] },
  { tag: "Empowerment", patterns: ["guide", "tutorial", "learn", "career", "resource", "education"] },
  { tag: "Exploration", patterns: ["travel", "maps", "visual", "inspiration", "reference"] },
  { tag: "Cognitive overload", patterns: ["news", "feed", "analytics", "monitoring", "dashboard", "productivity tool"] },
  { tag: "Emotional safety", patterns: ["safe", "trust", "privacy", "security", "consent", "care"] }
];

const interactionRules = [
  { tag: "GUI", patterns: ["ui", "ux", "app", "dashboard", "interface", "figma", "dribbble"] },
  { tag: "Conversational", patterns: ["chat", "assistant", "conversation", "dialog", "voice"] },
  { tag: "Agentic", patterns: ["agent", "automation", "workflow", "multi-agent", "copilot"] },
  { tag: "Ambient", patterns: ["ambient", "wearable", "calm", "smart home", "passive"] },
  { tag: "Invisible UI", patterns: ["invisible", "seamless", "frictionless", "background", "zero ui"] },
  { tag: "Spatial", patterns: ["ar", "vr", "xr", "3d", "spatial", "installation"] },
  { tag: "Narrative", patterns: ["story", "editorial", "documentary", "film", "case study"] },
  { tag: "Adaptive", patterns: ["adaptive", "personalized", "recommendation", "responsive"] },
  { tag: "System-driven", patterns: ["system", "platform", "ecosystem", "infrastructure", "protocol"] },
  { tag: "Behavioral", patterns: ["habit", "behavior", "gamification", "loop", "engagement"] }
];

const systemModelRules = [
  { tag: "Feedback loop", patterns: ["feedback", "loop", "iteration", "analytics", "measurement"] },
  { tag: "Trust system", patterns: ["trust", "privacy", "security", "identity", "verification"] },
  { tag: "Recommendation system", patterns: ["recommend", "feed", "discover", "curation"] },
  { tag: "Multi-agent system", patterns: ["multi-agent", "agent", "agents", "orchestration"] },
  { tag: "Creative workflow", patterns: ["workflow", "creative", "design process", "pipeline", "production"] },
  { tag: "Cognitive augmentation", patterns: ["thinking", "notes", "knowledge", "memory", "second brain"] },
  { tag: "Attention system", patterns: ["attention", "focus", "notification", "priority"] },
  { tag: "Knowledge graph", patterns: ["graph", "network", "atlas", "map", "semantic", "taxonomy"] },
  { tag: "Behavioral system", patterns: ["habit", "behavior", "nudge", "gamification", "reward"] }
];

const aestheticRules = [
  { tag: "Editorial", patterns: ["editorial", "magazine", "journal", "publication"] },
  { tag: "Poetic", patterns: ["poetic", "poem", "lyric", "ritual", "dream"] },
  { tag: "Soft tech", patterns: ["soft", "calm", "ambient", "gentle", "human-centered"] },
  { tag: "Brutalist", patterns: ["brutalist", "brutalism", "raw", "monospace"] },
  { tag: "Warm documentary", patterns: ["documentary", "photo essay", "field notes", "archive"] },
  { tag: "Scandinavian", patterns: ["nordic", "scandinavian", "muji", "minimal living"] },
  { tag: "Cinematic", patterns: ["film", "cinema", "motion", "trailer", "visual story"] },
  { tag: "Quiet luxury", patterns: ["luxury", "premium", "tasteful", "craft", "boutique"] },
  { tag: "Experimental", patterns: ["experimental", "lab", "prototype", "future", "generative"] },
  { tag: "Organic systems", patterns: ["nature", "organic", "biomorphic", "ecology", "garden"] }
];

const mediumRules = [
  { tag: "Website", patterns: ["http", ".com", ".net", ".io", ".org"] },
  { tag: "Motion", patterns: ["motion", "animation", "video", "vimeo", "youtube"] },
  { tag: "Installation", patterns: ["installation", "exhibition", "immersive"] },
  { tag: "Product", patterns: ["product", "app", "service", "tool"] },
  { tag: "Video", patterns: ["youtube", "vimeo", "bilibili", "video"] },
  { tag: "AI agent", patterns: ["agent", "assistant", "copilot", "autonomous"] },
  { tag: "Interface", patterns: ["ui", "ux", "dashboard", "figma", "app"] },
  { tag: "Spatial", patterns: ["space", "spatial", "xr", "ar", "vr", "3d"] },
  { tag: "Publication", patterns: ["magazine", "article", "essay", "journal", "book"] },
  { tag: "Sound", patterns: ["audio", "sound", "music", "podcast"] }
];

const contentTypeRules = [
  { type: "documentation", patterns: ["docs", "documentation", "developer", "api"] },
  { type: "tutorial", patterns: ["tutorial", "guide", "how to", "course", "learn"] },
  { type: "portfolio", patterns: ["portfolio", "behance", "dribbble", "notefolio"] },
  { type: "tool", patterns: ["tool", "app", "software", "platform", "generator"] },
  { type: "community", patterns: ["forum", "community", "network", "club", "collective"] },
  { type: "article", patterns: ["article", "essay", "blog", "magazine", "journal"] },
  { type: "video", patterns: ["youtube", "vimeo", "bilibili", "video", "film"] },
  { type: "research", patterns: ["research", "report", "study", "atlas", "future"] },
  { type: "inspiration", patterns: ["inspiration", "showcase", "gallery", "design", "creative"] },
  { type: "reference", patterns: ["reference", "directory", "resource", "collection"] }
];

const categoryRules = [
  {
    tag: "Visual Reference Platforms",
    patterns: [
      "awwwards", "one page love", "hover states", "brutalist", "muuuuu", "fontanel", "gallery",
      "showcase", "inspiration", "站酷", "优设", "网页设计", "灵感", "案例"
    ]
  },
  {
    tag: "Portfolios & Artists",
    patterns: [
      "portfolio", "behance", "dribbble", "notefolio", "personal site", "designer", "artist", "studio",
      "作品集", "艺术家", "设计师", "个人主页"
    ]
  },
  {
    tag: "Design Resources",
    patterns: [
      "ui", "ux", "web design", "branding", "logo", "font", "type", "visual design", "design system",
      "组件", "界面", "排版", "字体", "品牌", "视觉设计", "设计资源"
    ]
  },
  {
    tag: "Build Tools & Development",
    patterns: [
      "git", "frontend", "javascript", "css", "html", "developer", "coding", "api", "docs", "webflow",
      "wix", "no-code", "react", "xampp", "开发", "前端", "技术", "代码", "工程"
    ]
  },
  {
    tag: "Creative Coding & Graphics",
    patterns: [
      "creative coding", "processing", "p5", "openframeworks", "generative art", "golan levin", "shader",
      "opengl", "webgl", "three.js", "graphics", "render", "gephi", "creativecoding", "图形", "着色器", "生成艺术"
    ]
  },
  {
    tag: "Product, UX & AI",
    patterns: [
      "product design", "product", "ux strategy", "service design", "midjourney", "stable diffusion", "gpt",
      "llm", "ai", "ml4a", "wekinator", "machine learning for artists", "agent", "copilot", "aigc", "产品", "人工智能"
    ]
  },
  {
    tag: "Reading & Humanities",
    patterns: [
      "essay", "article", "journal", "magazine", "theory", "humanities", "culture", "philosophy", "documentary",
      "reading", "archive", "publication", "人文", "阅读", "文化", "哲学", "随笔", "纪录片"
    ]
  },
  {
    tag: "Art & Institutions",
    patterns: [
      "fund", "grant", "museum", "institution", "eyebeam", "foundation", "organization", "residency",
      "art org", "奖学金", "基金", "机构", "美术馆", "博物馆"
    ]
  },
  {
    tag: "Career & Language",
    patterns: [
      "career", "job", "resume", "cv", "interview", "hiring", "recruit", "language", "english", "japanese",
      "korean", "工作", "求职", "简历", "面试", "语言", "英语", "日语", "韩语"
    ]
  },
  {
    tag: "Utilities & Misc",
    patterns: [
      "bookmarklet", "directory", "search", "toolbox", "resource list", "navigation", "misc", "latest file",
      "收藏夹", "导航", "工具箱", "目录", "杂项"
    ]
  }
];

const resourceTypeRules = [
  { tag: "Tool", patterns: ["tool", "app", "software", "platform", "generator"] },
  { tag: "Tutorial", patterns: ["tutorial", "guide", "course", "how to", "learn"] },
  { tag: "Reference", patterns: ["reference", "resource", "directory", "index", "reference list"] },
  { tag: "Gallery", patterns: ["gallery", "showcase", "inspiration", "awwwards", "one page love"] },
  { tag: "Community", patterns: ["community", "forum", "network", "club", "collective"] },
  { tag: "Docs", patterns: ["docs", "documentation", "manual", "developer"] }
];

const actionRules = [
  { tag: "Read", patterns: ["article", "essay", "journal", "blog", "notes", "publication"] },
  { tag: "Learn", patterns: ["tutorial", "guide", "course", "learn", "training", "how to"] },
  { tag: "Try", patterns: ["tool", "app", "generator", "prototype", "demo", "playground"] },
  { tag: "Archive", patterns: ["archive", "reference", "library", "directory", "collection"] },
  { tag: "Watch", patterns: ["video", "motion", "film", "vimeo", "youtube", "bilibili"] }
];

const evergreenDomains = [
  "github.com",
  "wikipedia.org",
  "archive.org",
  "behance.net",
  "are.na",
  "figma.com",
  "notion.so",
  "medium.com"
];

const staleDomains = [
  "googlecode.com",
  "flash",
  "youku.com",
  "ctfile.com"
];

export function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "spm"].forEach((key) => {
      parsed.searchParams.delete(key);
    });
    const host = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname.replace(/\/$/, "");
    const query = parsed.searchParams.toString();
    return `${host}${path}${query ? `?${query}` : ""}`.toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

export function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export function decodeHtml(html) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " "
  };

  return html
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-zA-Z]+);/g, (_, entity) => named[entity] ?? `&${entity};`);
}

function hasPattern(text, pattern) {
  return text.includes(pattern);
}

function matchTags(source, rules) {
  const text = source.toLowerCase();
  return rules
    .filter((rule) => rule.patterns.some((pattern) => hasPattern(text, pattern)))
    .map((rule) => rule.tag ?? rule.type);
}

export function inferContentType(source) {
  return matchTags(source, contentTypeRules)[0] ?? "reference";
}

function inferPrimaryCategory(source) {
  return matchTags(source, categoryRules)[0] ?? "Utilities & Misc";
}

function inferResourceTypeTags(source) {
  const tags = matchTags(source, resourceTypeRules);
  return tags.length ? [...new Set(tags)] : ["Reference"];
}

function inferActionTags(source) {
  const tags = matchTags(source, actionRules);
  return tags.length ? [...new Set(tags)] : ["Archive"];
}

export function inferRegionTags({ domain, title, folderPath }) {
  const combined = `${domain} ${title} ${folderPath}`.toLowerCase();
  const tags = [];

  if (/\.(cn|com\.cn|edu\.cn)$/.test(domain) || /中文|设计|教程|书/.test(combined)) {
    tags.push("China");
  }
  if (/\.(jp|co\.jp)$/.test(domain) || /日本|japan|tokyo/.test(combined)) {
    tags.push("Japan");
  }
  if (/\.(kr|co\.kr)$/.test(domain) || /korea|노트폴리오|한국/.test(combined)) {
    tags.push("Korea");
  }
  if (/\.(de|fr|nl|se|no|dk|fi|eu)$/.test(domain) || /scandinavian|amsterdam|stockholm|copenhagen|europe/.test(combined)) {
    tags.push("Europe");
  }
  if (/\.(us|io|ai)$/.test(domain) || /silicon valley|america|california/.test(combined)) {
    tags.push("North America");
  }

  return tags.length ? [...new Set(tags)] : ["Global"];
}

export function inferValueStatus(bookmark, context = {}) {
  const age = (context.currentYear ?? new Date().getFullYear()) - bookmark.year;
  const duplicateCount = context.duplicateCounts?.[bookmark.normalized_url] ?? 1;
  const combined = `${bookmark.title} ${bookmark.url} ${bookmark.folder_path}`.toLowerCase();
  const hasStrongSignal = bookmark.worldview_tags.length + bookmark.system_model_tags.length + bookmark.aesthetic_tags.length >= 3;
  const evergreen = evergreenDomains.some((domain) => bookmark.domain.endsWith(domain));
  const genericTitle = bookmark.title.trim().length < 4 || /^(home|index|test|untitled)$/i.test(bookmark.title);
  const stale = staleDomains.some((domain) => combined.includes(domain)) || (/^http:\/\//.test(bookmark.url) && age > 12 && genericTitle);

  if (duplicateCount >= 4 || (duplicateCount >= 3 && age > 6) || (duplicateCount >= 2 && age > 10 && genericTitle)) {
    return "cold_storage";
  }

  if (stale || /download|index of|redirect|expired|beta/.test(combined)) {
    return "outdated";
  }

  if (age >= 10 && !hasStrongSignal && (genericTitle || bookmark.content_type === "reference")) {
    return "low_relevance";
  }

  if (age >= 6 && (evergreen || hasStrongSignal)) {
    return age >= 9 ? "rediscover" : "evergreen";
  }

  if (age <= 2) {
    return "active";
  }

  return age >= 7 && hasStrongSignal ? "rediscover" : hasStrongSignal ? "evergreen" : "active";
}

export function applyTaxonomy(bookmark, context = {}) {
  const source = [bookmark.title, bookmark.domain, bookmark.folder_path, bookmark.raw_folder, bookmark.url].join(" | ");

  const worldview_tags = matchTags(source, worldviewRules);
  const human_state_tags = matchTags(source, humanStateRules);
  const interaction_paradigm_tags = matchTags(source, interactionRules);
  const system_model_tags = matchTags(source, systemModelRules);
  const aesthetic_tags = matchTags(source, aestheticRules);
  const medium_tags = [...new Set(matchTags(source, mediumRules))];
  const content_type = inferContentType(source);
  const primary_category = inferPrimaryCategory(source);
  const resource_type_tags = inferResourceTypeTags(source);
  const action_tags = inferActionTags(source);
  const region_tags = inferRegionTags({
    domain: bookmark.domain,
    title: bookmark.title,
    folderPath: bookmark.folder_path
  });

  const enriched = {
    ...bookmark,
    content_type,
    primary_category,
    resource_type_tags,
    action_tags,
    worldview_tags,
    human_state_tags,
    interaction_paradigm_tags,
    system_model_tags,
    aesthetic_tags,
    medium_tags,
    region_tags
  };

  return {
    ...enriched,
    value_status: inferValueStatus(enriched, context)
  };
}
