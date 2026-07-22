const defaultLanguage = "en";
const defaultOwnerName = "Your";

const copy = {
  en: {
    optionsEyebrow: "Memory Mirror Settings",
    optionsTitle: "Keep the mirror local and understandable.",
    optionsSummary: "Manage display name, language, export, reset, and the privacy boundary for this extension.",
    localOnly: "Local only",
    identityEyebrow: "Identity",
    identityTitle: "Display name",
    identityBody: "Used only to label the side panel and report.",
    ownerNameLabel: "Name",
    saveName: "Save",
    languageEyebrow: "Language",
    languageTitle: "Interface language",
    languageBody: "Applies to the side panel, report, and settings page.",
    languageLabel: "Language",
    dataEyebrow: "Local data",
    dataTitle: "Snapshot controls",
    dataBody: "Bookmark profile data stays in Chrome extension storage unless you export it.",
    noSnapshot: "No snapshot",
    noSnapshotDetail: "Scan bookmarks from the side panel first.",
    snapshotReady: "Snapshot ready",
    snapshotDetail: (bookmarks, domains, feedback, rules) => `${bookmarks} bookmarks, ${domains} domains, ${feedback} feedback items, and ${rules} approved rules stored locally.`,
    export: "Export private snapshot",
    clear: "Clear local profile data",
    privacyEyebrow: "Privacy boundary",
    privacyTitle: "What this MVP does and does not read",
    savedName: (ownerName) => `Saved display name: ${ownerName}.`,
    savedLanguage: "Saved language setting.",
    exported: "Snapshot export started. Keep this file private.",
    cleared: "Local profile data cleared. Chrome bookmarks were not changed.",
    storageUnavailable: "Storage unavailable in this context.",
    exportFirst: "Scan bookmarks before exporting.",
    privacy: [
      {
        title: "Reads bookmarks after permission",
        body: "The MVP uses bookmark titles, URLs, domains, folder paths, and save dates after the user scans."
      },
      {
        title: "Does not edit bookmarks",
        body: "It does not delete, move, create, or rewrite Chrome bookmarks."
      },
      {
        title: "Does not read browsing history",
        body: "The extension does not request history, all-site access, cookies, passwords, identity, or tab content."
      },
      {
        title: "Exports are private data",
        body: "Snapshot JSON can include private URLs and inferred interests, so exports should be handled carefully."
      }
    ]
  },
  zh: {
    optionsEyebrow: "Memory Mirror 设置",
    optionsTitle: "让这面镜子保持本地、清楚、可控。",
    optionsSummary: "管理显示名、语言、导出、清除数据，以及这个插件的隐私边界。",
    localOnly: "仅本地",
    identityEyebrow: "身份",
    identityTitle: "显示名",
    identityBody: "只用于侧边栏和报告标题，不会读取 Google 账户名称。",
    ownerNameLabel: "名称",
    saveName: "保存",
    languageEyebrow: "语言",
    languageTitle: "界面语言",
    languageBody: "会应用到侧边栏、报告页和设置页。",
    languageLabel: "语言",
    dataEyebrow: "本地数据",
    dataTitle: "快照控制",
    dataBody: "书签画像数据默认保存在 Chrome 扩展本地存储，除非你主动导出。",
    noSnapshot: "没有快照",
    noSnapshotDetail: "请先从侧边栏扫描书签。",
    snapshotReady: "快照已准备",
    snapshotDetail: (bookmarks, domains, feedback, rules) => `本地已保存 ${bookmarks} 个书签、${domains} 个来源、${feedback} 条反馈、${rules} 条已批准规则。`,
    export: "导出私有快照",
    clear: "清除本地画像数据",
    privacyEyebrow: "隐私边界",
    privacyTitle: "这个 MVP 会读什么、不会读什么",
    savedName: (ownerName) => `已保存显示名：${ownerName}。`,
    savedLanguage: "已保存语言设置。",
    exported: "快照导出已开始。请把这个文件当作私人数据保存。",
    cleared: "本地画像数据已清除。Chrome 书签没有被修改。",
    storageUnavailable: "当前环境无法使用本地存储。",
    exportFirst: "请先扫描书签再导出。",
    privacy: [
      {
        title: "授权后读取书签",
        body: "MVP 会在用户主动扫描后使用书签标题、URL、域名、文件夹路径和保存时间。"
      },
      {
        title: "不会修改书签",
        body: "不会删除、移动、新建或改写 Chrome 书签。"
      },
      {
        title: "不会读取浏览历史",
        body: "插件不请求 history、全站访问、cookies、密码、identity 或页面内容权限。"
      },
      {
        title: "导出文件属于私人数据",
        body: "Snapshot JSON 可能包含私人 URL 和推断兴趣，所以导出后请谨慎保存和分享。"
      }
    ]
  }
};

const nodes = {
  ownerForm: document.querySelector("#ownerForm"),
  ownerNameInput: document.querySelector("#ownerNameInput"),
  languageSelect: document.querySelector("#languageSelect"),
  exportButton: document.querySelector("#exportButton"),
  clearButton: document.querySelector("#clearButton"),
  saveStatus: document.querySelector("#saveStatus"),
  snapshotState: document.querySelector("#snapshotState"),
  snapshotDetail: document.querySelector("#snapshotDetail"),
  privacyList: document.querySelector("#privacyList")
};

let currentLanguage = defaultLanguage;
let currentSnapshot = null;
let currentFeedback = createEmptyFeedback();
let currentApprovedRules = createEmptyRuleStore("approved-rules/v1");

nodes.ownerForm.addEventListener("submit", saveOwnerName);
nodes.languageSelect.addEventListener("change", saveLanguage);
nodes.exportButton.addEventListener("click", exportSnapshot);
nodes.clearButton.addEventListener("click", clearLocalProfileData);
chrome.storage.onChanged.addListener(handleStorageChange);
loadOptions();

async function loadOptions() {
  try {
    const cached = await chrome.storage.local.get(["ownerName", "preferredLanguage", "profileSnapshot", "profileFeedback", "approvedRules"]);
    currentLanguage = getSupportedLanguage(cached.preferredLanguage);
    currentSnapshot = cached.profileSnapshot || null;
    currentFeedback = normalizeFeedback(cached.profileFeedback);
    currentApprovedRules = normalizeRuleStore(cached.approvedRules, "approved-rules/v1");
    nodes.ownerNameInput.value = cleanOwnerName(cached.ownerName) === defaultOwnerName ? "" : cleanOwnerName(cached.ownerName);
    nodes.languageSelect.value = currentLanguage;
    applyCopy();
    renderSnapshotState();
  } catch {
    applyCopy();
    renderSnapshotState();
    setStatus(t("storageUnavailable"));
  }
}

async function saveOwnerName(event) {
  event.preventDefault();
  const ownerName = cleanOwnerName(nodes.ownerNameInput.value) || defaultOwnerName;

  try {
    await chrome.storage.local.set({ ownerName });
    nodes.ownerNameInput.value = ownerName === defaultOwnerName ? "" : ownerName;
    setStatus(t("savedName", ownerName));
  } catch {
    setStatus(t("storageUnavailable"));
  }
}

async function saveLanguage() {
  const preferredLanguage = getSupportedLanguage(nodes.languageSelect.value);

  try {
    await chrome.storage.local.set({ preferredLanguage });
    currentLanguage = preferredLanguage;
    applyCopy();
    renderSnapshotState();
    setStatus(t("savedLanguage"));
  } catch {
    setStatus(t("storageUnavailable"));
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
  anchor.download = `private-bookmark-profile-snapshot-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus(t("exported"));
}

async function clearLocalProfileData() {
  try {
    await chrome.storage.local.remove([
      "profileSnapshot",
      "reportHandoffState",
      "profileFeedback",
      "approvedRules",
      "ignoredRuleSuggestions"
    ]);
    currentSnapshot = null;
    currentFeedback = createEmptyFeedback();
    currentApprovedRules = createEmptyRuleStore("approved-rules/v1");
    renderSnapshotState();
    setStatus(t("cleared"));
  } catch {
    setStatus(t("storageUnavailable"));
  }
}

function handleStorageChange(changes, areaName) {
  if (areaName !== "local") return;

  if (changes.profileSnapshot) {
    currentSnapshot = changes.profileSnapshot.newValue || null;
    renderSnapshotState();
  }

  if (changes.profileFeedback) {
    currentFeedback = normalizeFeedback(changes.profileFeedback.newValue);
    renderSnapshotState();
  }

  if (changes.approvedRules) {
    currentApprovedRules = normalizeRuleStore(changes.approvedRules.newValue, "approved-rules/v1");
    renderSnapshotState();
  }

  if (changes.preferredLanguage) {
    currentLanguage = getSupportedLanguage(changes.preferredLanguage.newValue);
    nodes.languageSelect.value = currentLanguage;
    applyCopy();
    renderSnapshotState();
  }

  if (changes.ownerName) {
    const ownerName = cleanOwnerName(changes.ownerName.newValue);
    nodes.ownerNameInput.value = ownerName === defaultOwnerName ? "" : ownerName;
  }
}

function renderSnapshotState() {
  const hasSnapshot = Boolean(currentSnapshot);
  nodes.exportButton.disabled = !hasSnapshot;
  nodes.clearButton.disabled = !hasSnapshot;
  nodes.snapshotState.textContent = hasSnapshot ? t("snapshotReady") : t("noSnapshot");
  nodes.snapshotDetail.textContent = hasSnapshot
    ? t(
        "snapshotDetail",
        formatNumber(currentSnapshot.metrics?.bookmarks),
        formatNumber(currentSnapshot.metrics?.domains),
        formatNumber(Object.keys(currentFeedback.items).length),
        formatNumber(Object.keys(currentApprovedRules.items).length)
      )
    : t("noSnapshotDetail");
}

function applyCopy() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  setText("#optionsEyebrow", t("optionsEyebrow"));
  setText("#optionsTitle", t("optionsTitle"));
  setText("#optionsSummary", t("optionsSummary"));
  setText("#saveStatus", t("localOnly"));
  setText("#identityEyebrow", t("identityEyebrow"));
  setText("#identityTitle", t("identityTitle"));
  setText("#identityBody", t("identityBody"));
  setText("#ownerNameLabel", t("ownerNameLabel"));
  setText("#saveNameButton", t("saveName"));
  setText("#languageEyebrow", t("languageEyebrow"));
  setText("#languageTitle", t("languageTitle"));
  setText("#languageBody", t("languageBody"));
  setText("#languageLabel", t("languageLabel"));
  setText("#dataEyebrow", t("dataEyebrow"));
  setText("#dataTitle", t("dataTitle"));
  setText("#dataBody", t("dataBody"));
  setText("#exportButton", t("export"));
  setText("#clearButton", t("clear"));
  setText("#privacyEyebrow", t("privacyEyebrow"));
  setText("#privacyTitle", t("privacyTitle"));
  renderPrivacyList();
}

function renderPrivacyList() {
  nodes.privacyList.textContent = "";

  copy[currentLanguage].privacy.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "privacy-item";
    row.innerHTML = `
      <span>${index + 1}</span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.body)}</p>
      </div>
    `;
    nodes.privacyList.append(row);
  });
}

function setStatus(message) {
  nodes.saveStatus.textContent = message;
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function t(key, ...args) {
  const value = copy[currentLanguage]?.[key] ?? copy[defaultLanguage][key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function getSupportedLanguage(language) {
  return copy[language] ? language : defaultLanguage;
}

function cleanOwnerName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 32);
}

function createEmptyFeedback() {
  return {
    schemaVersion: "profile-feedback/v1",
    updatedAt: null,
    items: {}
  };
}

function normalizeFeedback(feedback) {
  if (!feedback || typeof feedback !== "object" || !feedback.items || typeof feedback.items !== "object") {
    return createEmptyFeedback();
  }

  return {
    schemaVersion: feedback.schemaVersion || "profile-feedback/v1",
    updatedAt: feedback.updatedAt || null,
    items: feedback.items
  };
}

function createEmptyRuleStore(schemaVersion) {
  return {
    schemaVersion,
    updatedAt: null,
    items: {}
  };
}

function normalizeRuleStore(store, schemaVersion) {
  if (!store || typeof store !== "object" || !store.items || typeof store.items !== "object") {
    return createEmptyRuleStore(schemaVersion);
  }

  return {
    schemaVersion: store.schemaVersion || schemaVersion,
    updatedAt: store.updatedAt || null,
    items: store.items
  };
}

function formatNumber(value) {
  return new Intl.NumberFormat(currentLanguage === "zh" ? "zh-CN" : "en-US").format(value || 0);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
