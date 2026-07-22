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
  { tag: "Motion", patterns: ["motion", "animation", "video", "vimeo", "youtube"] },
  { tag: "Installation", patterns: ["installation", "exhibition", "immersive"] },
  { tag: "Product", patterns: ["product page", "pricing", "signup", "sign up", "download app", "software"] },
  { tag: "Video", patterns: ["youtube", "vimeo", "bilibili", "video"] },
  { tag: "AI agent", patterns: ["ai agent", "agentic", "assistant", "copilot", "autonomous agent"] },
  { tag: "Interface", patterns: ["ui", "ux", "dashboard", "figma", "app"] },
  { tag: "Spatial", patterns: ["spatial", "xr", "augmented reality", "virtual reality", "3d", "installation"] },
  { tag: "Publication", patterns: ["magazine", "article", "essay", "journal", "publication", "book design"] },
  { tag: "Sound", patterns: ["audio", "sound", "music", "podcast"] }
];

const contentTypeRules = [
  { type: "documentation", patterns: ["docs", "documentation", "developer", "api"] },
  { type: "tutorial", patterns: ["tutorial", "guide", "how to", "course", "learn"] },
  { type: "portfolio", patterns: ["portfolio", "behance", "dribbble", "notefolio", "studio", "工作室", "设计工作室", "设计公司", "fw119.com", "火狼设计"] },
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
    tag: "Visual Inspiration & References",
    patterns: [
      "awwwards", "one page love", "hover states", "brutalist", "muuuuu", "fontanel", "gallery",
      "showcase", "inspiration", "logomoose", "voicer", "it's nice that", "they draw", "illustration",
      "book design", "logo design", "visual culture", "emelie", "airside", "hiiibrand", "jump from paper",
      "kan tai-keung", "75b", "站酷", "优设", "网页设计", "灵感", "案例", "插画", "宣传片"
    ]
  },
  {
    tag: "Portfolios, Artists & Studios",
    patterns: [
      "portfolio", "behance", "dribbble", "notefolio", "cargocollective", "personal site", "designer", "artist", "studio",
      "作品集", "艺术家", "设计师", "个人主页", "工作室", "设计工作室", "设计公司", "火狼设计", "fw119.com"
    ]
  },
  {
    tag: "Design Systems & Interface Resources",
    patterns: [
      "ui", "ux", "web design", "branding", "logo", "font", "type", "visual design", "design system",
      "interface", "figma", "quartz composer", "pagebot", "advertising", "brand identity", "design institute",
      "landor", "jwt", "bbdo", "wkshanghai", "damndigital", "cdlab", "dongdao", "caaarch", "wangyuefei",
      "组件", "界面", "排版", "字体", "品牌", "视觉设计", "设计资源", "设计公司", "平面设计", "标志设计", "包装设计", "广告"
    ]
  },
  {
    tag: "Tools, Dev & Workflow",
    patterns: [
      "git", "frontend", "javascript", "css", "html", "developer", "coding", "api", "docs", "webflow",
      "wix", "no-code", "react", "xampp", "github", "jsfiddle", "developer.apple", "开发", "前端", "技术", "代码", "工程"
    ]
  },
  {
    tag: "Creative Coding & Computational Media",
    patterns: [
      "creative coding", "processing", "p5", "openframeworks", "generative art", "golan levin", "shader",
      "opengl", "webgl", "three.js", "graphics", "render", "gephi", "drawbot", "creativecoding", "recursion", "fractals", "图形", "着色器", "生成艺术"
    ]
  },
  {
    tag: "AI, Product & Interaction",
    patterns: [
      "product design", "product", "ux strategy", "service design", "midjourney", "stable diffusion", "gpt",
      "llm", "artificial intelligence", "machine learning", "ml4a", "wekinator", "machine learning for artists",
      "emotion from camera", "emotion recognition", "face-recognition", "facial expression", "computer vision",
      "ai tool", "ai art", "aiartists", "dreamstudio", "novelai", "creative ai", "ml repository", "affectiva", "aigc", "agentic", "copilot", "产品", "人工智能"
    ]
  },
  {
    tag: "Reading & Humanities",
    patterns: [
      "essay", "article", "journal", "magazine", "theory", "humanities", "culture", "philosophy", "documentary",
      "reading", "archive", "publication", "poetry", "rituals", "critical making", "tactical media",
      "future art ecosystems", "creative independent", "siglio", "人文", "阅读", "文化", "哲学", "随笔", "纪录片"
    ]
  },
  {
    tag: "Institutions, Schools & Opportunities",
    patterns: [
      "fund", "grant", "museum", "institution", "eyebeam", "foundation", "organization", "residency",
      "school", "university", "college", "academy", "risd", "parsons", "hku", "aiga", "icograda",
      "21_21 design sight", "neso", "chsi", "udemy", "library.upenn", "art org", "奖学金", "基金", "机构", "美术馆", "博物馆", "学校", "学院", "中央美术学院", "教务"
    ]
  },
  {
    tag: "Life, Learning & Personal Growth",
    patterns: [
      "career", "job", "resume", "cv", "interview", "hiring", "recruit", "language", "english", "japanese",
      "korean", "meditation", "mindfulness", "calming the mind", "study aid", "memory", "dalai lama", "happiness", "cooking", "recipe", "salisbury steak",
      "工作", "求职", "简历", "面试", "语言", "英语", "日语", "韩语"
    ]
  },
  {
    tag: "Needs Review",
    patterns: [
      "bookmarklet", "directory", "search", "toolbox", "resource list", "navigation", "misc", "latest file",
      "收藏夹", "导航", "工具箱", "目录", "杂项"
    ]
  }
];

const resourceTypeRules = [
  { tag: "Code Repository", patterns: ["github.com", "gitlab.com", "sourceforge", "repository"] },
  { tag: "Documentation", patterns: ["docs", "documentation", "manual", "developer.apple", "api reference"] },
  { tag: "Tool", patterns: ["tool", "app", "software", "platform", "generator", "jsfiddle", "gephi", "webflow", "wix"] },
  { tag: "Tutorial", patterns: ["tutorial", "guide", "course", "how to", "learn", "training"] },
  { tag: "Portfolio", patterns: ["portfolio", "behance", "dribbble", "notefolio", "cargocollective", "personal site"] },
  { tag: "Studio Site", patterns: ["studio", "agency", "workshop", "工作室", "设计工作室", "设计公司", "fw119.com", "火狼设计"] },
  { tag: "Gallery", patterns: ["gallery", "showcase", "inspiration", "awwwards", "one page love"] },
  { tag: "Article", patterns: ["article", "blog", "story", "post", "theatlantic.com", "theverge.com", "nofilmschool.com", "itsnicethat.com", "voicer.me", "blog.sina.com.cn"] },
  { tag: "Essay", patterns: ["essay", "theory", "critique", "journal"] },
  { tag: "Publication", patterns: ["magazine", "publication", "newsletter", "press"] },
  { tag: "Video", patterns: ["youtube", "vimeo", "bilibili", "tudou", "dailymotion", "video"] },
  { tag: "Research Report", patterns: ["research", "report", "study", "whitepaper", "future art ecosystems"] },
  { tag: "Institution", patterns: ["museum", "school", "university", "college", "institute", "foundation", "organization"] },
  { tag: "Opportunity", patterns: ["grant", "fund", "residency", "application", "hiring", "job"] },
  { tag: "Community", patterns: ["community", "forum", "network", "club", "collective"] },
  { tag: "Studio Site", patterns: ["landor", "jwt", "bbdo", "wkshanghai", "airside", "cdlab", "dongdao", "wangyuefei", "caaaad", "starting2000"] },
  { tag: "Search Result", patterns: ["baidu.com", "百度搜索"] },
  { tag: "Book", patterns: ["amazon.cn", "visual complexity", "book design", "books and drawings"] },
  { tag: "Guide", patterns: ["wikihow", "guides.library", "how to apply", "creating maps"] },
  { tag: "Product Page", patterns: ["welcome", "pricing", "packages", "download", "motion bro", "dreamstudio", "soundcloud", "gmail"] },
  { tag: "Reference", patterns: ["reference list", "resource list", "directory", "archive"] }
];

const actionRules = [
  { tag: "Read", patterns: ["article", "essay", "journal", "blog", "notes", "publication", "magazine"] },
  { tag: "Learn", patterns: ["tutorial", "guide", "course", "learn", "training", "how to"] },
  { tag: "Try", patterns: ["tool", "app", "generator", "prototype", "demo", "playground"] },
  { tag: "Reference", patterns: ["reference", "library", "directory", "collection", "gallery", "showcase", "portfolio"] },
  { tag: "Watch", patterns: ["video", "motion", "film", "vimeo", "youtube", "bilibili", "tudou", "dailymotion"] },
  { tag: "Monitor", patterns: ["newsletter", "feed", "weekly", "journal", "magazine", "source", "collective"] },
  { tag: "Clean Up", patterns: ["index of", "redirect", "expired", "latest file"] }
];

const canonicalTopicRules = [
  { tag: "Generative AI", patterns: ["aigc", "midjourney", "stable diffusion", "generative ai", "ai art", "生成图像"] },
  { tag: "AI Agents", patterns: ["ai agent", "agentic", "copilot", "autonomous agent", "multi-agent"] },
  { tag: "Emotion Computing", patterns: ["emotion", "affectiva", "facial expression", "emopy", "empathy"] },
  { tag: "Human-AI Interaction", patterns: ["human ai", "human-ai", "machine learning for artists", "ml4a", "wekinator"] },
  { tag: "Creative Coding", patterns: ["creative coding", "processing", "p5", "openframeworks", "drawbot", "generative art", "shader", "webgl"] },
  { tag: "Data Visualization", patterns: ["data visualization", "information mapping", "visual storytelling", "gephi", "graph visualization"] },
  { tag: "Design Systems", patterns: ["design system", "interface", "ui", "ux", "figma", "component"] },
  { tag: "Portfolio Inspiration", patterns: ["portfolio", "behance", "dribbble", "cargocollective", "studio"] },
  { tag: "HCI & Interaction Design", patterns: ["hci", "human-computer", "human computer", "interaction design", "tangible interaction", "wearable interaction", "ux collective", "人机交互", "交互设计"] },
  { tag: "New Media Art", patterns: ["new media", "media art", "unstable media", "v2.nl", "interactive art", "digital art", "net art", "新媒体", "新媒体艺术", "互动艺术", "数字艺术"] },
  { tag: "Tech Art & Computational Media", patterns: ["technology art", "art technology", "computational media", "creative coding", "openframeworks", "processing", "p5", "webgl", "shader", "科技艺术", "计算媒体", "创意编程"] },
  { tag: "Visual Storytelling", patterns: ["visual storytelling", "documentary", "cinema", "motion", "film", "storytelling"] },
  { tag: "Calm Technology", patterns: ["calm", "meditation", "mindful", "slow", "ritual", "awareness", "calming the mind"] },
  { tag: "Education & Learning", patterns: ["education", "learning", "school", "course", "study", "university", "college"] },
  { tag: "Cultural Institutions", patterns: ["museum", "foundation", "institute", "institution", "residency", "icograda", "aiga"] },
  { tag: "Research Platforms", patterns: ["research platform", "research lab", "critical making", "future art ecosystems", "journal", "archive", "observatory", "研究平台", "研究机构", "实验室"] },
  { tag: "Career Mobility", patterns: ["career", "job", "resume", "interview", "application", "hiring"] },
  { tag: "Language Learning", patterns: ["language", "english", "japanese", "korean", "英语", "日语", "韩语"] },
  { tag: "Chinese Design Studios", patterns: ["设计工作室", "设计公司", "工作室", "火狼设计", "fw119.com", "studio7.com.cn", "dongdao", "wkshanghai", "wangyuefei"] },
  { tag: "Dutch Design", patterns: ["dutch design", "netherlands design", "amsterdam design", "阿姆斯特丹设计", "荷兰设计"] },
  { tag: "Personal Knowledge Systems", patterns: ["knowledge", "memory", "mind map", "atlas", "notes", "archive"] }
];

const knownBookmarkCorrections = {
  "fw119.com": {
    url: "https://www.fw119.com/"
  }
};

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

export function applyKnownBookmarkCorrections(bookmark) {
  const domain = bookmark.domain || extractDomain(bookmark.url ?? "");
  const correction = knownBookmarkCorrections[domain];
  if (!correction) return bookmark;

  const url = correction.url ?? bookmark.url;
  const correctedDomain = extractDomain(url) || domain;

  return {
    ...bookmark,
    ...correction,
    url,
    domain: correctedDomain,
    normalized_url: normalizeUrl(url),
    possible_favicon: bookmark.possible_favicon ?? (correctedDomain ? `https://www.google.com/s2/favicons?domain=${correctedDomain}&sz=64` : null)
  };
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasPattern(text, pattern) {
  const normalizedPattern = pattern.toLowerCase();

  if (/[\u3400-\u9fff]/.test(normalizedPattern) || /[./:-]/.test(normalizedPattern)) {
    return text.includes(normalizedPattern);
  }

  if (normalizedPattern.includes(" ")) {
    return text.includes(normalizedPattern);
  }

  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedPattern)}([^a-z0-9]|$)`, "i").test(text);
}

function matchTags(source, rules) {
  const text = source.toLowerCase();
  return rules
    .filter((rule) => rule.patterns.some((pattern) => hasPattern(text, pattern)))
    .map((rule) => rule.tag ?? rule.type);
}

function matchRulesWithEvidence(source, rules, layer) {
  const text = source.toLowerCase();

  return rules
    .map((rule) => {
      const pattern = rule.patterns.find((item) => hasPattern(text, item));
      return pattern
        ? {
            layer,
            tag: rule.tag ?? rule.type,
            evidence: pattern
          }
        : null;
    })
    .filter(Boolean);
}

export function inferContentType(source) {
  return matchTags(source, contentTypeRules)[0] ?? "reference";
}

function inferPrimaryCategory(source) {
  return matchTags(source, categoryRules)[0] ?? "Needs Review";
}

function inferResourceTypeTags(source) {
  const tags = matchTags(source, resourceTypeRules);
  return tags.length ? [...new Set(tags)].slice(0, 3) : ["Reference"];
}

function inferActionTags(source, resourceTypeTags = [], primaryCategory = "Needs Review") {
  const tags = matchTags(source, actionRules);
  const nextTags = [...new Set(tags)];

  if (!nextTags.length) {
    if (resourceTypeTags.some((tag) => ["Tool", "App", "Code Repository"].includes(tag))) return ["Try"];
    if (resourceTypeTags.some((tag) => ["Article", "Essay", "Publication", "Research Report"].includes(tag))) return ["Read"];
    if (resourceTypeTags.some((tag) => ["Video", "Tutorial", "Course"].includes(tag))) return ["Learn"];
    if (resourceTypeTags.some((tag) => ["Portfolio", "Studio Site", "Gallery", "Case Study"].includes(tag))) return ["Reference"];
    if (primaryCategory === "Reading & Humanities") return ["Read"];
    if (primaryCategory === "Visual Inspiration & References" || primaryCategory === "Portfolios, Artists & Studios") return ["Reference"];
    if (primaryCategory === "Tools, Dev & Workflow") return ["Try"];
    if (primaryCategory === "Institutions, Schools & Opportunities") return ["Monitor"];
    return ["Review"];
  }

  return nextTags.slice(0, 3);
}

function inferSaveIntent({ resourceTypeTags, actionTags, primaryCategory, valueStatus }) {
  if (valueStatus === "outdated" || valueStatus === "low_relevance") return "cleanup_candidate";
  if (actionTags.includes("Monitor")) return "source_monitoring";
  if (actionTags.includes("Try")) return "tool_or_prototype_trial";
  if (actionTags.includes("Read") || actionTags.includes("Learn")) return "study_or_note_taking";
  if (resourceTypeTags.some((tag) => ["Portfolio", "Studio Site", "Gallery"].includes(tag))) return "visual_reference";
  if (primaryCategory === "Institutions, Schools & Opportunities") return "institution_or_opportunity_tracking";
  return "future_reference";
}

function inferUsefulnessReason({ primaryCategory, resourceTypeTags, actionTags, canonicalTopics, valueStatus }) {
  if (valueStatus === "outdated" || valueStatus === "low_relevance") {
    return "Likely useful as cleanup material or historical context rather than an active resource.";
  }

  if (actionTags.includes("Monitor")) {
    return "Useful as a recurring source to watch for new signals.";
  }

  if (resourceTypeTags.some((tag) => ["Tool", "App", "Code Repository", "Documentation"].includes(tag))) {
    return "Useful for future prototyping, technical implementation, or workflow comparison.";
  }

  if (resourceTypeTags.some((tag) => ["Portfolio", "Studio Site", "Gallery"].includes(tag))) {
    return "Useful as visual reference, taste evidence, or project moodboard material.";
  }

  if (resourceTypeTags.some((tag) => ["Article", "Essay", "Publication", "Research Report"].includes(tag))) {
    return "Useful for reading, note extraction, and building a stronger conceptual background.";
  }

  if (canonicalTopics.length) {
    return `Useful as evidence for the recurring interest: ${canonicalTopics.slice(0, 2).join(" / ")}.`;
  }

  return `Useful as a future reference inside ${primaryCategory}.`;
}

function inferSourceImportance({ domain, resourceTypeTags, actionTags, valueStatus }) {
  if (valueStatus === "outdated") return "dead_or_outdated";
  if (["github.com", "behance.net", "are.na", "figma.com", "nngroup.com", "uxdesign.cc"].some((source) => domain.endsWith(source))) {
    return "core_source";
  }
  if (actionTags.includes("Monitor") || resourceTypeTags.some((tag) => ["Publication", "Newsletter", "Community", "Institution"].includes(tag))) {
    return "specialist_source";
  }
  if (valueStatus === "low_relevance") return "noisy_source";
  return "one_off_source";
}

function inferClassificationConfidence({ primaryCategory, resourceTypeTags, actionTags, canonicalTopics, reasons }) {
  let score = 0;
  if (primaryCategory !== "Needs Review") score += 2;
  if (!resourceTypeTags.includes("Reference")) score += 1;
  if (!actionTags.includes("Review")) score += 1;
  if (canonicalTopics.length) score += 1;
  if (reasons.length >= 4) score += 1;

  if (score >= 5) return "high";
  if (score >= 3) return "medium";
  return "low";
}

export function inferRegionTags({ domain, title, folderPath }) {
  const combined = `${domain} ${title} ${folderPath}`.toLowerCase();
  const tags = [];
  const isNetherlands = /\.(nl)$/.test(domain) || /netherlands|dutch|amsterdam|rotterdam|eindhoven|utrecht|den haag|荷兰|阿姆斯特丹|鹿特丹|乌特勒支/.test(combined);
  const isEurope =
    isNetherlands ||
    /\.(de|fr|se|no|dk|fi|eu|it|es|at|ch|be)$/.test(domain) ||
    /\.co\.uk$/.test(domain) ||
    /europe|european|london|berlin|paris|stockholm|copenhagen|amsterdam|rotterdam|sweden|germany|france|austria|switzerland|united kingdom|英国|德国|法国|欧洲|欧美/.test(combined);
  const isChina =
    /\.(cn|com\.cn|edu\.cn)$/.test(domain) ||
    /china|chinese|shanghai|中国|国内|北京|上海|广州|深圳|香港|台湾|中文|火狼|东道|站酷|优设|中央美术学院|百度|土豆|新浪|互动中国/.test(combined);

  if (isChina) {
    tags.push("China");
  }
  if (isNetherlands) {
    tags.push("Netherlands");
  }
  if (/\.(jp|co\.jp)$/.test(domain) || /日本|japan|tokyo/.test(combined)) {
    tags.push("Japan");
  }
  if (/\.(kr|co\.kr)$/.test(domain) || /korea|노트폴리오|한국/.test(combined)) {
    tags.push("Korea");
  }
  if (isEurope) {
    tags.push("Europe");
  }
  if (/\.(us)$/.test(domain) || /united states|america|american|new york|california|silicon valley|美国/.test(combined)) {
    tags.push("North America");
  }

  return tags.length ? [...new Set(tags)] : ["Global"];
}

function inferCompositeCanonicalTopics({ source, primaryCategory, resourceTypeTags, regionTags, canonicalTopics }) {
  const text = source.toLowerCase();
  const tags = [...canonicalTopics];
  const isStudio = primaryCategory === "Portfolios, Artists & Studios" || resourceTypeTags.includes("Studio Site") || resourceTypeTags.includes("Portfolio");
  const isInstitution = primaryCategory === "Institutions, Schools & Opportunities" || resourceTypeTags.includes("Institution") || /museum|gallery|foundation|institute|institution|academy|school of art|art center|美术馆|博物馆|艺术机构|基金会|学院/.test(text);
  const isWestern = regionTags.includes("Europe") || regionTags.includes("North America");
  const isDutch = regionTags.includes("Netherlands");
  const hasDesignSignal = /design|branding|graphic design|visual|logo|type|studio|设计|品牌|视觉|平面|标志|工作室/.test(text);
  const hasArtInstitutionSignal = /art museum|museum|gallery|foundation|aiga|hku|kunsten|art center|design archives|美术馆|博物馆|艺术机构|艺术学院|基金会|画廊/.test(text);
  const hasTechArtSignal = /new media|media art|unstable media|v2\.nl|creative coding|processing|openframeworks|generative art|webgl|shader|gephi|科技艺术|新媒体|互动艺术|创意编程|生成艺术/.test(text);
  const hasHciSignal = /hci|human-computer|human computer|interaction design|ux collective|tangible|wearable|人机交互|交互设计/.test(text);
  const hasResearchSignal = /research platform|research lab|research|journal|critical making|future art ecosystems|observatory|研究平台|研究机构|研究|实验室/.test(text);

  if (isDutch && hasDesignSignal) tags.push("Dutch Design");
  if (isWestern && isStudio && hasDesignSignal) tags.push("Western Design Studios");
  if (isWestern && isInstitution && hasArtInstitutionSignal) tags.push("Western Art Institutions");
  if (isWestern && hasTechArtSignal) tags.push("Western Tech Art");
  if (hasTechArtSignal) tags.push("Tech Art & Computational Media");
  if (hasHciSignal) tags.push("HCI & Interaction Design");
  if (hasResearchSignal) tags.push("Research Platforms");

  return [...new Set(tags)].slice(0, 6);
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
  const action_tags = inferActionTags(source, resource_type_tags, primary_category);
  const region_tags = inferRegionTags({
    domain: bookmark.domain,
    title: bookmark.title,
    folderPath: bookmark.folder_path
  });
  const canonical_topics = inferCompositeCanonicalTopics({
    source,
    primaryCategory: primary_category,
    resourceTypeTags: resource_type_tags,
    regionTags: region_tags,
    canonicalTopics: [...new Set(matchTags(source, canonicalTopicRules))]
  });
  const classification_reasons = [
    ...matchRulesWithEvidence(source, categoryRules, "primary_category"),
    ...matchRulesWithEvidence(source, resourceTypeRules, "resource_type"),
    ...matchRulesWithEvidence(source, actionRules, "action"),
    ...matchRulesWithEvidence(source, canonicalTopicRules, "canonical_topic")
  ].slice(0, 8);

  const enriched = {
    ...bookmark,
    content_type,
    primary_category,
    resource_type_tags,
    action_tags,
    canonical_topics,
    worldview_tags,
    human_state_tags,
    interaction_paradigm_tags,
    system_model_tags,
    aesthetic_tags,
    medium_tags,
    region_tags
  };
  const value_status = inferValueStatus(enriched, context);
  const save_intent = inferSaveIntent({
    resourceTypeTags: resource_type_tags,
    actionTags: action_tags,
    primaryCategory: primary_category,
    valueStatus: value_status
  });

  return {
    ...enriched,
    value_status,
    save_intent,
    usefulness_reason: inferUsefulnessReason({
      primaryCategory: primary_category,
      resourceTypeTags: resource_type_tags,
      actionTags: action_tags,
      canonicalTopics: canonical_topics,
      valueStatus: value_status
    }),
    source_importance: inferSourceImportance({
      domain: bookmark.domain,
      resourceTypeTags: resource_type_tags,
      actionTags: action_tags,
      valueStatus: value_status
    }),
    classification_confidence: inferClassificationConfidence({
      primaryCategory: primary_category,
      resourceTypeTags: resource_type_tags,
      actionTags: action_tags,
      canonicalTopics: canonical_topics,
      reasons: classification_reasons
    }),
    classification_reasons
  };
}
