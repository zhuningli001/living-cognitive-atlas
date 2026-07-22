import { buildProfileSnapshot, flattenBookmarkTree } from "./bookmark-profile-engine.js";

const defaultOwnerName = "Your";
const defaultLanguage = "en";
const scanButton = document.querySelector("#scanButton");
const exportButton = document.querySelector("#exportButton");
const openReportButton = document.querySelector("#openReportButton");
const ownerForm = document.querySelector("#ownerForm");
const ownerNameInput = document.querySelector("#ownerNameInput");
const languageSelect = document.querySelector("#languageSelect");
const clearDataButton = document.querySelector("#clearDataButton");
const statusText = document.querySelector("#statusText");
const flowSteps = {
  scan: document.querySelector("#flowStepScan"),
  report: document.querySelector("#flowStepReport"),
  import: document.querySelector("#flowStepImport")
};

const copy = {
  en: {
    titleFallback: "Your Bookmark",
    title: (ownerName) => `${ownerName}'s Bookmark`,
    localBoundary: "Read-only, local-first. No network calls.",
    displayName: "Display name",
    save: "Save",
    language: "Language",
    flowEyebrow: "Local setup",
    flowTitleEmpty: "Start with a read-only scan",
    flowTitleReady: "Snapshot ready for the report",
    flowTitleOpened: "Report opened",
    flowTitleImported: "Report opened",
    flowScanTitle: "Scan",
    flowScanBody: "Read bookmark titles, URLs, folders, and dates.",
    flowReportTitle: "Report",
    flowReportBody: "Open the full extension report when ready.",
    flowImportTitle: "Review",
    flowImportBody: "Use the report without leaving local storage.",
    scan: "Scan bookmarks",
    scanning: "Scanning...",
    export: "Export snapshot",
    fullReport: "Open full report",
    profile: "Profile",
    waiting: "Waiting for first scan",
    waitingSummary: "Open the side panel and scan Chrome bookmarks to build a compact personal dashboard.",
    bookmarks: "Bookmarks",
    domains: "Domains",
    signals: "Signals",
    review: "Review",
    linkUnit: "links",
    sourceBalance: "Source balance",
    sourcePrompt: "Scan bookmarks to check whether the profile is source-skewed.",
    sourceBroad: "Source broad",
    sourceWatch: "Source watch",
    sourceSkew: "Source skew",
    sourceNoPattern: "No source pattern yet.",
    sourceTop: "Top 5",
    sourceBreadth: "Breadth",
    currentAttention: "Current attention",
    developmentLine: "Development line",
    dominantDimensions: "Dominant dimensions",
    smartReturnPaths: "Smart return paths",
    reviewQueue: "Review queue",
    notScanned: "Not scanned",
    noSignals: "No signals yet.",
    noDimensions: "No dimensions yet.",
    noReturnPaths: "No return paths yet.",
    noReview: "No obvious review candidates.",
    loaded: "Loaded local snapshot. Scan again to refresh.",
    storageUnavailable: "Storage unavailable in this context.",
    savedName: (ownerName) => `Saved display name: ${ownerName}.`,
    savedLanguage: "Saved language setting.",
    saveNameFailed: "Could not save display name in this context.",
    saveLanguageFailed: "Could not save language in this context.",
    readingBookmarks: "Reading Chrome bookmarks...",
    scanComplete: "Scan complete. Snapshot saved locally.",
    readFailed: "Could not read bookmarks. Check extension permissions.",
    exportFirst: "Scan bookmarks before exporting.",
    exportStarted: "Snapshot export started. Keep the file local if it contains private bookmarks.",
    scanBeforeReport: "Scan bookmarks first, then open the full report.",
    reportOpened: "Full extension report opened.",
    reportImported: "Full extension report opened.",
    clearData: "Clear data",
    localData: "Local data",
    noLocalData: "No bookmark snapshot stored yet.",
    storedLocalData: (count, domains) => `${count} bookmarks and ${domains} domains stored locally.`,
    clearedData: "Extension snapshot cleared. Name and language settings were kept.",
    reportStorageUnavailable: "Could not open the extension report in this context."
  },
  zh: {
    titleFallback: "你的书签",
    title: (ownerName) => `${ownerName} 的书签`,
    localBoundary: "只读、本地优先，不发送网络请求。",
    displayName: "显示名",
    save: "保存",
    language: "语言",
    flowEyebrow: "本地设置",
    flowTitleEmpty: "先进行只读扫描",
    flowTitleReady: "快照已准备好进入报告",
    flowTitleOpened: "报告已打开",
    flowTitleImported: "报告已打开",
    flowScanTitle: "扫描",
    flowScanBody: "读取书签标题、URL、文件夹和保存日期。",
    flowReportTitle: "报告",
    flowReportBody: "准备好后打开扩展内完整报告。",
    flowImportTitle: "查看",
    flowImportBody: "不离开本地存储即可使用报告。",
    scan: "扫描书签",
    scanning: "扫描中...",
    export: "导出快照",
    fullReport: "打开完整报告",
    profile: "画像",
    waiting: "等待首次扫描",
    waitingSummary: "打开侧边栏并扫描 Chrome 书签，生成一个轻量个人看板。",
    bookmarks: "书签",
    domains: "来源",
    signals: "信号",
    review: "待确认",
    linkUnit: "条链接",
    sourceBalance: "来源平衡",
    sourcePrompt: "扫描书签后检查画像是否被少数来源拉偏。",
    sourceBroad: "来源较广",
    sourceWatch: "来源观察",
    sourceSkew: "来源偏斜",
    sourceNoPattern: "还没有来源模式。",
    sourceTop: "前 5 来源",
    sourceBreadth: "广度",
    currentAttention: "当前注意力",
    developmentLine: "成长路径",
    dominantDimensions: "主导维度",
    smartReturnPaths: "智能返回路径",
    reviewQueue: "待确认队列",
    notScanned: "尚未扫描",
    noSignals: "还没有信号。",
    noDimensions: "还没有维度。",
    noReturnPaths: "还没有返回路径。",
    noReview: "暂无明显待确认项目。",
    loaded: "已载入本地快照。再次扫描可刷新。",
    storageUnavailable: "当前环境无法使用本地存储。",
    savedName: (ownerName) => `已保存显示名：${ownerName}。`,
    savedLanguage: "已保存语言设置。",
    saveNameFailed: "当前环境无法保存显示名。",
    saveLanguageFailed: "当前环境无法保存语言设置。",
    readingBookmarks: "正在读取 Chrome 书签...",
    scanComplete: "扫描完成。快照已保存在本地。",
    readFailed: "无法读取书签，请检查扩展权限。",
    exportFirst: "请先扫描书签再导出。",
    exportStarted: "快照导出已开始。文件包含私人书签时请保存在本地。",
    scanBeforeReport: "请先扫描书签，再打开完整报告。",
    reportOpened: "扩展内完整报告已打开。",
    reportImported: "扩展内完整报告已打开。",
    clearData: "清除数据",
    localData: "本地数据",
    noLocalData: "还没有保存书签快照。",
    storedLocalData: (count, domains) => `本地已保存 ${count} 个书签、${domains} 个来源。`,
    clearedData: "扩展快照已清除。显示名和语言设置已保留。",
    reportStorageUnavailable: "当前环境无法打开扩展报告。"
  }
};

let currentSnapshot = null;
let currentLanguage = defaultLanguage;
let currentOwnerName = "";
let currentFlowStage = "empty";
let currentReportHandoffState = null;

scanButton.addEventListener("click", scanBookmarks);
exportButton.addEventListener("click", exportSnapshot);
openReportButton.addEventListener("click", openFullReport);
ownerForm.addEventListener("submit", saveOwnerName);
languageSelect.addEventListener("change", saveLanguage);
clearDataButton.addEventListener("click", clearExtensionData);
chrome.storage.onChanged.addListener(handleStorageChange);
loadCachedSnapshot();

async function loadCachedSnapshot() {
  try {
    const cached = await chrome.storage.local.get(["profileSnapshot", "ownerName", "preferredLanguage", "reportHandoffState"]);
    setLanguage(cached.preferredLanguage || defaultLanguage);
    setOwnerName(cached.ownerName || defaultOwnerName);
    currentReportHandoffState = cached.reportHandoffState || null;
    applyStaticCopy();

    if (cached.profileSnapshot) {
      currentSnapshot = cached.profileSnapshot;
      renderSnapshot(currentSnapshot);
      setExportReady(true);
      setReportReady(true);
      setFlowStage(getSnapshotFlowStage(currentSnapshot));
      setStatus(t("loaded"));
    } else {
      setFlowStage("empty");
    }

    updateLocalDataStatus();
  } catch {
    applyStaticCopy();
    updateLocalDataStatus();
    setStatus(t("storageUnavailable"));
  }
}

async function saveOwnerName(event) {
  event.preventDefault();
  const ownerName = cleanOwnerName(ownerNameInput.value) || defaultOwnerName;

  try {
    await chrome.storage.local.set({ ownerName });
    setOwnerName(ownerName);
    setStatus(t("savedName", ownerName));
  } catch {
    setStatus(t("saveNameFailed"));
  }
}

async function saveLanguage() {
  const preferredLanguage = getSupportedLanguage(languageSelect.value);

  try {
    await chrome.storage.local.set({ preferredLanguage });
    setLanguage(preferredLanguage);
    applyStaticCopy();
    if (currentSnapshot) renderSnapshot(currentSnapshot);
    setStatus(t("savedLanguage"));
  } catch {
    setStatus(t("saveLanguageFailed"));
  }
}

async function scanBookmarks() {
  setBusy(true);
  setStatus(t("readingBookmarks"));

  try {
    const tree = await chrome.bookmarks.getTree();
    const records = flattenBookmarkTree(tree);
    const snapshot = buildProfileSnapshot(records, { source: "chrome-extension-sidepanel" });

    await chrome.storage.local.set({
      profileSnapshot: snapshot,
      reportHandoffState: {
        status: "snapshot_ready",
        snapshotGeneratedAt: snapshot.generatedAt,
        updatedAt: new Date().toISOString()
      }
    });
    currentReportHandoffState = {
      status: "snapshot_ready",
      snapshotGeneratedAt: snapshot.generatedAt
    };
    currentSnapshot = snapshot;
    renderSnapshot(snapshot);
    setExportReady(true);
    setReportReady(true);
    setFlowStage("snapshotReady");
    updateLocalDataStatus();
    setStatus(t("scanComplete"));
  } catch (error) {
    console.error(error);
    setStatus(t("readFailed"));
  } finally {
    setBusy(false);
  }
}

function exportSnapshot() {
  if (!currentSnapshot) {
    setStatus(t("exportFirst"));
    return;
  }

  const payload = JSON.stringify(currentSnapshot, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  anchor.href = url;
  anchor.download = `bookmark-profile-snapshot-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus(t("exportStarted"));
}

async function openFullReport() {
  if (!currentSnapshot) {
    setStatus(t("scanBeforeReport"));
    return;
  }

  try {
    await markReportOpened();
    await chrome.tabs.create({ url: chrome.runtime.getURL("report.html") });
    setFlowStage("imported");
    setStatus(t("reportOpened"));
  } catch {
    setStatus(t("reportStorageUnavailable"));
  }
}

async function clearExtensionData() {
  try {
    await chrome.storage.local.remove(["profileSnapshot", "reportHandoffState"]);
    currentSnapshot = null;
    currentReportHandoffState = null;
    setExportReady(false);
    setReportReady(false);
    setFlowStage("empty");
    setAnalysisVisible(false);
    resetSnapshotUi();
    updateLocalDataStatus();
    setStatus(t("clearedData"));
  } catch {
    setStatus(t("storageUnavailable"));
  }
}

function handleStorageChange(changes, areaName) {
  if (areaName !== "local") return;
  if (changes.profileSnapshot) {
    currentSnapshot = changes.profileSnapshot.newValue || null;
    if (!currentSnapshot) {
      currentReportHandoffState = null;
      setExportReady(false);
      setReportReady(false);
      setFlowStage("empty");
      setAnalysisVisible(false);
      resetSnapshotUi();
      updateLocalDataStatus();
      return;
    }

    renderSnapshot(currentSnapshot);
    setExportReady(true);
    setReportReady(true);
    updateLocalDataStatus();
  }

  if (changes.reportHandoffState) {
    currentReportHandoffState = changes.reportHandoffState.newValue || null;
    if (currentSnapshot) {
      setFlowStage(getSnapshotFlowStage(currentSnapshot));
      if (currentReportHandoffState?.status === "imported") setStatus(t("reportImported"));
    }
  }
}

async function markReportOpened() {
  if (!currentSnapshot) return;

  currentReportHandoffState = {
    status: "imported",
    snapshotGeneratedAt: currentSnapshot.generatedAt,
    importedAt: new Date().toISOString()
  };

  try {
    await chrome.storage.local.set({ reportHandoffState: currentReportHandoffState });
  } catch {
    // Opening the report is still useful even if completion state cannot be persisted.
  }
}

function getSnapshotFlowStage(snapshot) {
  if (!snapshot) return "empty";
  if (currentReportHandoffState?.snapshotGeneratedAt !== snapshot.generatedAt) return "snapshotReady";
  if (currentReportHandoffState.status === "imported") return "imported";
  if (currentReportHandoffState.status === "report_opened") return "reportOpened";
  return "snapshotReady";
}

function renderSnapshot(snapshot) {
  setAnalysisVisible(true);
  setText("#headline", snapshot.headline);
  setText("#summaryText", snapshot.summary);
  setText("#bookmarkCount", formatNumber(snapshot.metrics.bookmarks));
  setText("#domainCount", formatNumber(snapshot.metrics.domains));
  setText("#topicCount", formatNumber(snapshot.metrics.topics));
  setText("#reviewCount", formatNumber(snapshot.metrics.review));
  setText("#updatedAt", formatTime(snapshot.generatedAt));
  renderSourceBalance(snapshot.sourceBalance);

  renderPills("#topicList", snapshot.topics, (item) => `${localizeAnalysisLabel(item.label)} - ${item.count}`);
  renderPhases(snapshot.phases);
  renderDimensions(snapshot.dimensions);
  renderCollections(snapshot.collections);
  renderReviewQueue(snapshot.reviewQueue.slice(0, 5));
}

function renderSourceBalance(sourceBalance) {
  const note = sourceBalance || {
    level: "low",
    note: t("sourceNoPattern"),
    topFiveShare: 0,
    breadthShare: 0
  };
  const levelNode = document.querySelector("#sourceBalanceLevel");
  const textNode = document.querySelector("#sourceBalanceText");

  levelNode.textContent = getSourceLevelLabel(note.level);
  levelNode.dataset.level = note.level;
  textNode.textContent = `${formatSourceBalanceNote(note)} ${t("sourceTop")}: ${note.topFiveShare}%. ${t("sourceBreadth")}: ${note.breadthShare}%.`;
}

function renderPills(selector, items, formatter) {
  const node = document.querySelector(selector);
  node.textContent = "";

  if (!items.length) {
    node.append(createEmpty(t("noSignals")));
    return;
  }

  for (const item of items) {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = formatter(item);
    node.append(pill);
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
        <span class="phase-meta">${escapeHtml(phase.meta)}</span>
        <strong class="phase-title">${escapeHtml(localizeAnalysisLabel(phase.title))}</strong>
        <span class="phase-note">${escapeHtml(phase.note)}</span>
      </div>
    `;
    node.append(item);
  }
}

function renderDimensions(dimensions) {
  const node = document.querySelector("#dimensionList");
  node.textContent = "";

  if (!dimensions.length) {
    node.append(createEmpty(t("noDimensions")));
    return;
  }

  for (const dimension of dimensions) {
    const row = document.createElement("div");
    row.className = "dimension-row";
    row.innerHTML = `
      <div class="dimension-topline">
        <span>${escapeHtml(localizeAnalysisLabel(dimension.label))}</span>
        <strong>${dimension.share}%</strong>
      </div>
      <div class="bar"><span style="width: ${dimension.share}%"></span></div>
    `;
    node.append(row);
  }
}

function renderCollections(collections) {
  const node = document.querySelector("#collectionList");
  node.textContent = "";

  if (!collections.length) {
    node.append(createEmpty(t("noReturnPaths")));
    return;
  }

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

function renderReviewQueue(items) {
  const node = document.querySelector("#reviewList");
  node.textContent = "";

  if (!items.length) {
    node.append(createEmpty(t("noReview")));
    return;
  }

  for (const item of items) {
    const row = document.createElement("li");
    row.textContent = `${item.title} - ${item.domain} - ${localizeAnalysisLabel(item.reason)}`;
    node.append(row);
  }
}

function createEmpty(text) {
  const node = document.createElement("p");
  node.className = "empty";
  node.textContent = text;
  return node;
}

function setBusy(isBusy) {
  scanButton.disabled = isBusy;
  scanButton.textContent = isBusy ? t("scanning") : t("scan");
}

function setExportReady(isReady) {
  exportButton.disabled = !isReady;
}

function setReportReady(isReady) {
  openReportButton.disabled = !isReady;
}

function setAnalysisVisible(isVisible) {
  document.querySelectorAll(".analysis-only").forEach((node) => {
    node.hidden = !isVisible;
  });
}

function setStatus(message) {
  statusText.textContent = message;
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function setLanguage(language) {
  currentLanguage = getSupportedLanguage(language);
  languageSelect.value = currentLanguage;
}

function resetSnapshotUi() {
  setText("#headline", t("waiting"));
  setText("#summaryText", t("waitingSummary"));
  setText("#bookmarkCount", "0");
  setText("#domainCount", "0");
  setText("#topicCount", "0");
  setText("#reviewCount", "0");
  setText("#updatedAt", t("notScanned"));
  setText("#sourceBalanceLevel", t("sourceBalance"));
  setText("#sourceBalanceText", t("sourcePrompt"));
  document.querySelectorAll("#topicList, #phaseList, #dimensionList, #collectionList, #reviewList").forEach((node) => {
    node.textContent = "";
  });
}

function updateLocalDataStatus() {
  const hasSnapshot = Boolean(currentSnapshot);
  clearDataButton.disabled = !hasSnapshot;
  setText(
    "#localDataText",
    hasSnapshot
      ? t("storedLocalData", formatNumber(currentSnapshot.metrics?.bookmarks), formatNumber(currentSnapshot.metrics?.domains))
      : t("noLocalData")
  );
}

function applyStaticCopy() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  setText("#statusText", t("localBoundary"));
  setText('label[for="ownerNameInput"]', t("displayName"));
  setText("#ownerForm button", t("save"));
  setText('label[for="languageSelect"]', t("language"));
  setText("#flowEyebrow", t("flowEyebrow"));
  setText("#flowStepScanTitle", t("flowScanTitle"));
  setText("#flowStepScanBody", t("flowScanBody"));
  setText("#flowStepReportTitle", t("flowReportTitle"));
  setText("#flowStepReportBody", t("flowReportBody"));
  setText("#flowStepImportTitle", t("flowImportTitle"));
  setText("#flowStepImportBody", t("flowImportBody"));
  setText("#localDataLabel", t("localData"));
  setText("#clearDataButton", t("clearData"));
  setText("#exportButton", t("export"));
  setText("#openReportButton", t("fullReport"));
  setText(".summary-block .section-label", t("profile"));
  setText("#headline", currentSnapshot?.headline || t("waiting"));
  setText("#summaryText", currentSnapshot?.summary || t("waitingSummary"));
  setText("#bookmarkCount + p", t("bookmarks"));
  setText("#domainCount + p", t("domains"));
  setText("#topicCount + p", t("signals"));
  setText("#reviewCount + p", t("review"));
  setText("#sourceBalanceLevel", t("sourceBalance"));
  setText("#sourceBalanceText", currentSnapshot ? document.querySelector("#sourceBalanceText")?.textContent : t("sourcePrompt"));
  setText("#updatedAt", currentSnapshot ? formatTime(currentSnapshot.generatedAt) : t("notScanned"));
  setText("#currentAttentionLabel", t("currentAttention"));
  setText("#developmentLineLabel", t("developmentLine"));
  setText("#dominantDimensionsLabel", t("dominantDimensions"));
  setText("#smartReturnPathsLabel", t("smartReturnPaths"));
  setText("#reviewQueueLabel", t("reviewQueue"));
  updateLocalDataStatus();
  renderFlowStage();
  setBusy(false);
  setOwnerName(currentOwnerName || defaultOwnerName);
}

function setFlowStage(stage) {
  currentFlowStage = stage;
  renderFlowStage();
}

function renderFlowStage() {
  const states = {
    empty: { scan: "active", report: "idle", import: "idle", title: t("flowTitleEmpty") },
    snapshotReady: { scan: "done", report: "active", import: "idle", title: t("flowTitleReady") },
    reportOpened: { scan: "done", report: "done", import: "active", title: t("flowTitleOpened") },
    imported: { scan: "done", report: "done", import: "done", title: t("flowTitleImported") }
  }[currentFlowStage] || { scan: "active", report: "idle", import: "idle", title: t("flowTitleEmpty") };

  setText("#flowTitle", states.title);
  flowSteps.scan.dataset.state = states.scan;
  flowSteps.report.dataset.state = states.report;
  flowSteps.import.dataset.state = states.import;
}

function setOwnerName(ownerName) {
  const cleanName = cleanOwnerName(ownerName) || defaultOwnerName;
  currentOwnerName = cleanName;
  ownerNameInput.value = cleanName === defaultOwnerName ? "" : cleanName;
  setText("#profileTitle", cleanName === defaultOwnerName ? t("titleFallback") : t("title", cleanName));
}

function cleanOwnerName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 32);
}

function t(key, ...args) {
  const value = copy[currentLanguage]?.[key] ?? copy[defaultLanguage][key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function getSupportedLanguage(language) {
  return copy[language] ? language : defaultLanguage;
}

function localizeAnalysisLabel(label) {
  if (currentLanguage !== "zh") return label;
  return zhAnalysisLabels[label] || label;
}

const zhAnalysisLabels = {
  accurate: "准确",
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
  "Needs clearer topic": "需要更清晰主题"
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatTime(value) {
  if (!value) return t("notScanned");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t("notScanned");
  return date.toLocaleString(currentLanguage === "zh" ? "zh-CN" : [], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
