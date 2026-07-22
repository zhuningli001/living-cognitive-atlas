const defaultLanguage = "en";

const copy = {
  en: {
    eyebrow: "Memory Mirror Report",
    emptyTitle: "Connect a bookmark snapshot",
    emptySummary: "Scan bookmarks in the side panel first. This report reads only local extension storage.",
    emptyEyebrow: "No local profile yet",
    emptyHeading: "Open the side panel and scan bookmarks",
    emptyBody: "After scanning, this page becomes a full local report. No server is required.",
    export: "Export snapshot",
    clear: "Clear data",
    bookmarks: "Bookmarks",
    domains: "Domains",
    signals: "Signals",
    review: "Review",
    sourceBalance: "Source balance",
    sourceBroad: "Source broad",
    sourceWatch: "Source watch",
    sourceSkew: "Source skew",
    sourceTop: "Top 5",
    sourceBreadth: "Breadth",
    sourceNoPattern: "No source pattern yet.",
    topicsEyebrow: "Current attention",
    topicsTitle: "What the archive keeps returning to",
    dimensionsEyebrow: "Dominant dimensions",
    dimensionsTitle: "Profile mix",
    lineEyebrow: "Development line",
    lineTitle: "Growth through saved attention",
    collectionsEyebrow: "Smart return paths",
    collectionsTitle: "Useful doors back in",
    reviewEyebrow: "Review queue",
    reviewTitle: "Items that need human confirmation",
    recordsEyebrow: "Evidence sample",
    recordsTitle: "Recent normalized records",
    linkUnit: "links",
    noSignals: "No signals yet.",
    noReview: "No obvious review candidates.",
    exported: "Snapshot export started.",
    cleared: "Local extension data cleared.",
    loaded: "Report loaded from local extension storage."
  },
  zh: {
    eyebrow: "Memory Mirror 报告",
    emptyTitle: "连接书签快照",
    emptySummary: "请先在侧边栏扫描书签。这个报告只读取扩展本地存储。",
    emptyEyebrow: "还没有本地画像",
    emptyHeading: "打开侧边栏并扫描书签",
    emptyBody: "扫描后，这里会变成完整的本地报告。不需要服务器。",
    export: "导出快照",
    clear: "清除数据",
    bookmarks: "书签",
    domains: "来源",
    signals: "信号",
    review: "待确认",
    sourceBalance: "来源平衡",
    sourceBroad: "来源较广",
    sourceWatch: "来源观察",
    sourceSkew: "来源偏斜",
    sourceTop: "前 5 来源",
    sourceBreadth: "广度",
    sourceNoPattern: "还没有来源模式。",
    topicsEyebrow: "当前注意力",
    topicsTitle: "档案反复回到什么",
    dimensionsEyebrow: "主导维度",
    dimensionsTitle: "画像组合",
    lineEyebrow: "成长路径",
    lineTitle: "保存注意力的变化",
    collectionsEyebrow: "智能返回路径",
    collectionsTitle: "重新进入的入口",
    reviewEyebrow: "待确认队列",
    reviewTitle: "需要人工确认的内容",
    recordsEyebrow: "证据样本",
    recordsTitle: "最近标准化记录",
    linkUnit: "条链接",
    noSignals: "还没有信号。",
    noReview: "暂无明显待确认项目。",
    exported: "快照导出已开始。",
    cleared: "扩展本地数据已清除。",
    loaded: "已从扩展本地存储载入报告。"
  }
};

const nodes = {
  title: document.querySelector("#reportTitle"),
  summary: document.querySelector("#reportSummary"),
  emptyState: document.querySelector("#emptyState"),
  exportButton: document.querySelector("#exportButton"),
  clearButton: document.querySelector("#clearButton"),
  sourceLevel: document.querySelector("#sourceBalanceLevel"),
  sourceText: document.querySelector("#sourceBalanceText")
};

let currentSnapshot = null;
let currentLanguage = defaultLanguage;

nodes.exportButton.addEventListener("click", exportSnapshot);
nodes.clearButton.addEventListener("click", clearData);
loadReport();

async function loadReport() {
  try {
    const cached = await chrome.storage.local.get(["profileSnapshot", "preferredLanguage"]);
    currentLanguage = getSupportedLanguage(cached.preferredLanguage);
    applyStaticCopy();

    if (!cached.profileSnapshot) {
      renderEmpty();
      return;
    }

    currentSnapshot = cached.profileSnapshot;
    renderSnapshot(currentSnapshot);
    await chrome.storage.local.set({
      reportHandoffState: {
        status: "imported",
        snapshotGeneratedAt: currentSnapshot.generatedAt,
        importedAt: new Date().toISOString()
      }
    });
  } catch {
    renderEmpty();
  }
}

function renderSnapshot(snapshot) {
  document.querySelectorAll(".report-only").forEach((node) => {
    node.hidden = false;
  });
  nodes.emptyState.hidden = true;
  nodes.exportButton.disabled = false;
  nodes.clearButton.disabled = false;

  nodes.title.textContent = snapshot.headline;
  nodes.summary.textContent = snapshot.summary;
  setText("#bookmarkCount", formatNumber(snapshot.metrics.bookmarks));
  setText("#domainCount", formatNumber(snapshot.metrics.domains));
  setText("#signalCount", formatNumber(snapshot.metrics.topics));
  setText("#reviewCount", formatNumber(snapshot.metrics.review));

  renderSourceBalance(snapshot.sourceBalance);
  renderTopics(snapshot.topics);
  renderDimensions(snapshot.dimensions);
  renderPhases(snapshot.phases);
  renderCollections(snapshot.collections);
  renderReview(snapshot.reviewQueue.slice(0, 12));
  renderRecords(snapshot.records.slice(0, 12));
}

function renderEmpty() {
  currentSnapshot = null;
  document.querySelectorAll(".report-only").forEach((node) => {
    node.hidden = true;
  });
  nodes.emptyState.hidden = false;
  nodes.exportButton.disabled = true;
  nodes.clearButton.disabled = true;
  nodes.title.textContent = t("emptyTitle");
  nodes.summary.textContent = t("emptySummary");
}

function renderSourceBalance(sourceBalance) {
  const note = sourceBalance || { level: "low", topFiveShare: 0, breadthShare: 0 };
  nodes.sourceLevel.textContent = getSourceLevelLabel(note.level);
  nodes.sourceLevel.dataset.level = note.level;
  nodes.sourceText.textContent = `${formatSourceBalanceNote(note)} ${t("sourceTop")}: ${note.topFiveShare || 0}%. ${t("sourceBreadth")}: ${note.breadthShare || 0}%.`;
}

function renderTopics(topics) {
  const node = document.querySelector("#topicList");
  node.textContent = "";
  if (!topics.length) {
    node.append(createEmpty(t("noSignals")));
    return;
  }

  for (const topic of topics) {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = `${localizeAnalysisLabel(topic.label)} - ${topic.count}`;
    node.append(pill);
  }
}

function renderDimensions(dimensions) {
  const node = document.querySelector("#dimensionList");
  node.textContent = "";
  for (const dimension of dimensions) {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div>
        <span>${escapeHtml(localizeAnalysisLabel(dimension.label))}</span>
        <strong>${dimension.share}%</strong>
      </div>
      <div class="bar-track"><span style="width: ${dimension.share}%"></span></div>
    `;
    node.append(row);
  }
}

function renderPhases(phases) {
  const node = document.querySelector("#phaseList");
  node.textContent = "";
  for (const phase of phases) {
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="phase-year">${escapeHtml(phase.year)}</span>
      <div class="phase-body">
        <p>${escapeHtml(phase.meta)}</p>
        <strong>${escapeHtml(localizeAnalysisLabel(phase.title))}</strong>
        <p>${escapeHtml(localizeAnalysisLabel(phase.note))}</p>
      </div>
    `;
    node.append(item);
  }
}

function renderCollections(collections) {
  const node = document.querySelector("#collectionList");
  node.textContent = "";
  for (const collection of collections) {
    const item = document.createElement("div");
    item.className = "collection-item";
    item.innerHTML = `
      <strong>${escapeHtml(localizeAnalysisLabel(collection.label))}</strong>
      <span>${collection.count} ${t("linkUnit")}</span>
    `;
    node.append(item);
  }
}

function renderReview(items) {
  const node = document.querySelector("#reviewList");
  node.textContent = "";
  if (!items.length) {
    node.append(createEmpty(t("noReview")));
    return;
  }

  for (const item of items) {
    const row = document.createElement("li");
    row.innerHTML = `
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.domain)} - ${escapeHtml(localizeAnalysisLabel(item.reason))}</span>
    `;
    node.append(row);
  }
}

function renderRecords(records) {
  const node = document.querySelector("#recordList");
  node.textContent = "";
  for (const record of records) {
    const row = document.createElement("div");
    row.className = "record-row";
    row.innerHTML = `
      <a href="${escapeAttribute(record.url)}" target="_blank" rel="noreferrer">${escapeHtml(record.title)}</a>
      <span>${escapeHtml(record.domain)} - ${escapeHtml(record.folderPathLabel || localizeAnalysisLabel(record.resourceType))}</span>
    `;
    node.append(row);
  }
}

function exportSnapshot() {
  if (!currentSnapshot) return;
  const payload = JSON.stringify(currentSnapshot, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  anchor.href = url;
  anchor.download = `bookmark-profile-snapshot-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function clearData() {
  await chrome.storage.local.remove(["profileSnapshot", "reportHandoffState"]);
  renderEmpty();
}

function applyStaticCopy() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  setText("#reportEyebrow", t("eyebrow"));
  setText("#exportButton", t("export"));
  setText("#clearButton", t("clear"));
  setText("#bookmarkLabel", t("bookmarks"));
  setText("#domainLabel", t("domains"));
  setText("#signalLabel", t("signals"));
  setText("#reviewLabel", t("review"));
  setText("#sourceBalanceLevel", t("sourceBalance"));
  setText("#topicsEyebrow", t("topicsEyebrow"));
  setText("#topicsTitle", t("topicsTitle"));
  setText("#dimensionsEyebrow", t("dimensionsEyebrow"));
  setText("#dimensionsTitle", t("dimensionsTitle"));
  setText("#lineEyebrow", t("lineEyebrow"));
  setText("#lineTitle", t("lineTitle"));
  setText("#collectionsEyebrow", t("collectionsEyebrow"));
  setText("#collectionsTitle", t("collectionsTitle"));
  setText("#reviewEyebrow", t("reviewEyebrow"));
  setText("#reviewTitle", t("reviewTitle"));
  setText("#recordsEyebrow", t("recordsEyebrow"));
  setText("#recordsTitle", t("recordsTitle"));
  document.querySelector("#emptyState .eyebrow").textContent = t("emptyEyebrow");
  document.querySelector("#emptyState h2").textContent = t("emptyHeading");
  document.querySelector("#emptyState p:last-child").textContent = t("emptyBody");
}

function t(key) {
  return copy[currentLanguage]?.[key] ?? copy[defaultLanguage][key] ?? key;
}

function getSupportedLanguage(language) {
  return copy[language] ? language : defaultLanguage;
}

function getSourceLevelLabel(level) {
  if (level === "high") return t("sourceSkew");
  if (level === "medium") return t("sourceWatch");
  return t("sourceBroad");
}

function formatSourceBalanceNote(sourceBalance) {
  const topDomain = sourceBalance.topDomain?.label;
  if (!topDomain) return t("sourceNoPattern");

  if (currentLanguage === "zh") {
    if (sourceBalance.level === "high") return `${topDomain} 占 ${sourceBalance.topShare}%，画像明显受该来源影响。`;
    if (sourceBalance.level === "medium") return `前 5 来源占 ${sourceBalance.topFiveShare}%，需要保留来源偏差意识。`;
    return "来源分布较广，画像不太依赖单一站点。";
  }

  if (sourceBalance.level === "high") return `${topDomain} shapes ${sourceBalance.topShare}% of this profile.`;
  if (sourceBalance.level === "medium") return `Top sources shape ${sourceBalance.topFiveShare}% of this profile.`;
  return "Sources are broadly distributed.";
}

function createEmpty(text) {
  const node = document.createElement("p");
  node.textContent = text;
  return node;
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function localizeAnalysisLabel(label) {
  if (currentLanguage !== "zh") return label;
  return zhAnalysisLabels[label] || label;
}

const zhAnalysisLabels = {
  article: "文章",
  documentation: "文档",
  portfolio: "作品集",
  reference: "参考",
  "code/tool": "代码 / 工具",
  video: "视频",
  "Design systems": "设计系统",
  "Visual reference": "视觉参考",
  "AI product": "AI 产品",
  "Creative coding": "创意编程",
  "Personal knowledge": "个人知识",
  Learning: "学习",
  "Culture research": "文化研究",
  "General reference": "通用参考",
  "Design / visual systems": "设计 / 视觉系统",
  "HCI / interaction intelligence": "HCI / 交互智能",
  "Art institutions & cultural research": "艺术机构与文化研究",
  "Personal knowledge systems": "个人知识系统",
  "AI product curiosity": "AI 产品兴趣",
  "Read & learn": "阅读与学习",
  "Tools to try": "可尝试工具",
  Inspiration: "灵感",
  "Build memory": "构建记忆",
  Foundation: "基础期",
  Expansion: "扩展期",
  Synthesis: "综合期",
  "Current focus": "当前焦点",
  "First snapshot": "首次快照",
  "Possible duplicate": "可能重复",
  "Missing save date": "缺少保存日期",
  "Weak title": "标题信息弱",
  "Needs clearer topic": "需要更清晰主题",
  "Dominant return pattern: Design systems.": "主导返回模式：设计系统。",
  "Dominant return pattern: Visual reference.": "主导返回模式：视觉参考。",
  "Dominant return pattern: AI product.": "主导返回模式：AI 产品。",
  "Dominant return pattern: Creative coding.": "主导返回模式：创意编程。",
  "Dominant return pattern: Personal knowledge.": "主导返回模式：个人知识。",
  "Dominant return pattern: Learning.": "主导返回模式：学习。",
  "Dominant return pattern: Culture research.": "主导返回模式：文化研究。",
  "Dominant return pattern: General reference.": "主导返回模式：通用参考。"
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
