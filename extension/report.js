const defaultLanguage = "en";

const copy = {
  en: {
    eyebrow: "Memory Mirror Report",
    emptyTitle: "Connect a bookmark snapshot",
    emptySummary: "Scan bookmarks in the side panel first. This report reads only local extension storage.",
    emptyEyebrow: "No local profile yet",
    emptyHeading: "Open the side panel and scan bookmarks",
    emptyBody: "After scanning, this page becomes a full local report. No server is required.",
    settings: "Settings",
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
    appliedRulesEyebrow: "Applied local rules",
    appliedRulesTitle: "What shaped this scan",
    appliedRulesEmpty: "No approved local rules were applied to this snapshot.",
    appliedRulesCount: (count) => `${count} approved local rules shaped this snapshot.`,
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
    feedbackEyebrow: "Profile calibration",
    feedbackTitle: "Your keyword choices",
    feedbackEmpty: "No choices yet. Select the words that fit, feel too broad, or do not fit you.",
    feedbackCount: (count) => `${count} keyword choices saved locally.`,
    calibrationEyebrow: "Keyword portrait",
    calibrationTitle: "Which words feel like you?",
    calibrationSummary: "Based on your bookmark library, I generated a first keyword portrait. Choose what fits, what feels too broad, and what does not fit. It is okay if you are unsure.",
    calibrationKeywords: "Core keywords",
    calibrationDimensions: "Profile dimensions",
    calibrationKeywordPrompt: (label, count) => `I see "${label}" as one recurring keyword in your saved links, across ${count} links.`,
    calibrationDimensionPrompt: (label, share) => `I see "${label}" as one possible profile dimension, at ${share}%.`,
    feedbackAccurate: "Fits",
    feedbackWrong: "Not me",
    feedbackBroad: "Too broad",
    feedbackUseful: "Useful",
    feedbackNotUseful: "Not useful",
    rulesEyebrow: "Rule approval",
    rulesTitle: "Approve what the system should remember",
    rulesSummary: "Feedback becomes suggestions first. Approved rules stay local and can shape later scans.",
    rulesEmpty: "No rule suggestions yet. Add feedback above first.",
    pendingRules: (count) => `${count} pending`,
    approvedRules: (count) => `${count} approved`,
    approveRule: "Approve",
    ignoreRule: "Ignore",
    approvedState: "Approved",
    pendingState: "Pending",
    ruleApproved: "Rule approved locally.",
    ruleIgnored: "Rule ignored locally.",
    ruleTopicAccurate: (label) => `Keep "${label}" as a trusted recurring topic.`,
    ruleTopicBroad: (label) => `Treat "${label}" as too broad and ask for more specific subtopics later.`,
    ruleTopicWrong: (label) => `Send "${label}" into review instead of trusting it automatically.`,
    ruleDimensionAccurate: (label) => `Keep "${label}" as a trusted profile dimension.`,
    ruleDimensionWrong: (label) => `Lower confidence for "${label}" when building the profile mix.`,
    ruleCollectionUseful: (label) => `Keep "${label}" as a useful smart return path.`,
    ruleCollectionNotUseful: (label) => `Demote "${label}" when suggesting smart return paths.`,
    linkUnit: "links",
    noSignals: "No signals yet.",
    noReview: "No obvious review candidates.",
    exported: "Snapshot export started.",
    cleared: "Local extension data cleared.",
    loaded: "Report loaded from local extension storage.",
    optionsUnavailable: "Could not open settings in this context."
  },
  zh: {
    eyebrow: "Memory Mirror 报告",
    emptyTitle: "连接书签快照",
    emptySummary: "请先在侧边栏扫描书签。这个报告只读取扩展本地存储。",
    emptyEyebrow: "还没有本地画像",
    emptyHeading: "打开侧边栏并扫描书签",
    emptyBody: "扫描后，这里会变成完整的本地报告。不需要服务器。",
    settings: "设置",
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
    appliedRulesEyebrow: "已应用本地规则",
    appliedRulesTitle: "这次扫描被什么规则影响",
    appliedRulesEmpty: "这次快照还没有应用已批准的本地规则。",
    appliedRulesCount: (count) => `${count} 条已批准本地规则影响了这次快照。`,
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
    feedbackEyebrow: "画像校准",
    feedbackTitle: "你的关键词选择",
    feedbackEmpty: "还没有选择。请从下面选出符合你、太宽泛、或不符合你的词。",
    feedbackCount: (count) => `已在本地保存 ${count} 个关键词选择。`,
    calibrationEyebrow: "关键词画像",
    calibrationTitle: "哪些词像你？",
    calibrationSummary: "根据你的书签库，我先生成了一组关键词画像。请选择你觉得符合的、太宽泛的，或者完全不符合的。不确定也没关系，这本来就是一层校准。",
    calibrationKeywords: "核心关键词",
    calibrationDimensions: "画像维度",
    calibrationKeywordPrompt: (label, count) => `我把「${label}」理解为你书签里反复出现的关键词之一，覆盖 ${count} 条链接。`,
    calibrationDimensionPrompt: (label, share) => `我把「${label}」理解为一个可能的画像维度，占 ${share}%。`,
    feedbackAccurate: "符合",
    feedbackWrong: "不符合",
    feedbackBroad: "太宽泛",
    feedbackUseful: "有用",
    feedbackNotUseful: "没用",
    rulesEyebrow: "规则批准",
    rulesTitle: "确认系统应该记住什么",
    rulesSummary: "反馈会先变成建议。只有你批准后，规则才会保存在本地，并用于之后的分析。",
    rulesEmpty: "还没有规则建议。请先在上方做几个反馈。",
    pendingRules: (count) => `${count} 条待确认`,
    approvedRules: (count) => `${count} 条已批准`,
    approveRule: "批准",
    ignoreRule: "忽略",
    approvedState: "已批准",
    pendingState: "待确认",
    ruleApproved: "规则已保存在本地。",
    ruleIgnored: "规则已在本地忽略。",
    ruleTopicAccurate: (label) => `将「${label}」保留为可信的重复主题。`,
    ruleTopicBroad: (label) => `将「${label}」视为太宽泛，之后提示拆成更具体的子主题。`,
    ruleTopicWrong: (label) => `将「${label}」放入复核，而不是自动信任。`,
    ruleDimensionAccurate: (label) => `将「${label}」保留为可信画像维度。`,
    ruleDimensionWrong: (label) => `生成画像组合时降低「${label}」的置信度。`,
    ruleCollectionUseful: (label) => `将「${label}」保留为有用的智能返回路径。`,
    ruleCollectionNotUseful: (label) => `推荐智能返回路径时降低「${label}」优先级。`,
    linkUnit: "条链接",
    noSignals: "还没有信号。",
    noReview: "暂无明显待确认项目。",
    exported: "快照导出已开始。",
    cleared: "扩展本地数据已清除。",
    loaded: "已从扩展本地存储载入报告。",
    optionsUnavailable: "当前环境无法打开设置。"
  }
};

const nodes = {
  title: document.querySelector("#reportTitle"),
  summary: document.querySelector("#reportSummary"),
  emptyState: document.querySelector("#emptyState"),
  settingsButton: document.querySelector("#settingsButton"),
  exportButton: document.querySelector("#exportButton"),
  clearButton: document.querySelector("#clearButton"),
  sourceLevel: document.querySelector("#sourceBalanceLevel"),
  sourceText: document.querySelector("#sourceBalanceText"),
  appliedRulesSummary: document.querySelector("#appliedRulesSummary"),
  appliedRuleList: document.querySelector("#appliedRuleList"),
  feedbackSummary: document.querySelector("#feedbackSummary"),
  feedbackCount: document.querySelector("#feedbackCount"),
  calibrationList: document.querySelector("#calibrationList"),
  ruleList: document.querySelector("#ruleList"),
  pendingRuleCount: document.querySelector("#pendingRuleCount"),
  approvedRuleCount: document.querySelector("#approvedRuleCount")
};

let currentSnapshot = null;
let currentLanguage = defaultLanguage;
let currentFeedback = createEmptyFeedback();
let currentApprovedRules = createEmptyRuleStore("approved-rules/v1");
let currentIgnoredRuleSuggestions = createEmptyRuleStore("ignored-rule-suggestions/v1");

nodes.settingsButton.addEventListener("click", openSettings);
nodes.exportButton.addEventListener("click", exportSnapshot);
nodes.clearButton.addEventListener("click", clearData);
document.addEventListener("click", handleFeedbackClick);
document.addEventListener("click", handleRuleClick);
chrome.storage.onChanged.addListener(handleStorageChange);
loadReport();

async function loadReport() {
  try {
    const cached = await chrome.storage.local.get([
      "profileSnapshot",
      "preferredLanguage",
      "profileFeedback",
      "approvedRules",
      "ignoredRuleSuggestions"
    ]);
    currentLanguage = getSupportedLanguage(cached.preferredLanguage);
    currentFeedback = normalizeFeedback(cached.profileFeedback);
    currentApprovedRules = normalizeRuleStore(cached.approvedRules, "approved-rules/v1");
    currentIgnoredRuleSuggestions = normalizeRuleStore(cached.ignoredRuleSuggestions, "ignored-rule-suggestions/v1");
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
  renderAppliedRules(snapshot.appliedRules);
  renderFeedbackStatus();
  renderProfileCalibration(snapshot);
  renderRuleSuggestions();
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

function renderAppliedRules(appliedRules) {
  const items = Array.isArray(appliedRules?.items) ? appliedRules.items : [];
  nodes.appliedRuleList.textContent = "";
  nodes.appliedRulesSummary.textContent = items.length ? t("appliedRulesCount", items.length) : t("appliedRulesEmpty");

  if (!items.length) {
    nodes.appliedRuleList.append(createEmpty(t("appliedRulesEmpty")));
    return;
  }

  for (const item of items) {
    const row = document.createElement("div");
    row.className = "applied-rule-item";
    row.innerHTML = `
      <strong>${escapeHtml(localizeAnalysisLabel(item.label))}</strong>
      <span>${escapeHtml(localizeAnalysisLabel(item.note || item.effect || item.ruleType))}</span>
    `;
    nodes.appliedRuleList.append(row);
  }
}

function renderProfileCalibration(snapshot) {
  nodes.calibrationList.textContent = "";
  const keywordItems = (snapshot.topics || []).slice(0, 5).map((topic) => ({
    type: "topic",
    label: topic.label,
    body: t("calibrationKeywordPrompt", localizeAnalysisLabel(topic.label), formatNumber(topic.count)),
    actions: ["accurate", "too_broad", "wrong"]
  }));
  const dimensionItems = (snapshot.dimensions || []).slice(0, 3).map((dimension) => ({
    type: "dimension",
    label: dimension.label,
    body: t("calibrationDimensionPrompt", localizeAnalysisLabel(dimension.label), dimension.share),
    actions: ["accurate", "wrong"]
  }));

  if (keywordItems.length) {
    nodes.calibrationList.append(createCalibrationGroup(t("calibrationKeywords"), keywordItems));
  }

  if (dimensionItems.length) {
    nodes.calibrationList.append(createCalibrationGroup(t("calibrationDimensions"), dimensionItems));
  }
}

function createCalibrationGroup(title, items) {
  const group = document.createElement("div");
  group.className = "calibration-group";
  group.innerHTML = `<h3>${escapeHtml(title)}</h3>`;

  for (const item of items) {
    const selected = getFeedbackValue(getFeedbackTargetId(item.type, item.label));
    const row = document.createElement("div");
    row.className = "calibration-item";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(localizeAnalysisLabel(item.label))}</strong>
        <p>${escapeHtml(item.body)}</p>
      </div>
      ${renderFeedbackButtons(item.type, item.label, item.actions, selected)}
    `;
    group.append(row);
  }

  return group;
}

function renderTopics(topics) {
  const node = document.querySelector("#topicList");
  node.textContent = "";
  if (!topics.length) {
    node.append(createEmpty(t("noSignals")));
    return;
  }

  for (const topic of topics) {
    node.append(createSignalItem(topic.label, `${topic.count} ${t("linkUnit")}`));
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
    node.append(createSignalItem(collection.label, `${collection.count} ${t("linkUnit")}`));
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

async function handleFeedbackClick(event) {
  const button = event.target.closest("[data-feedback-action]");
  if (!button || !currentSnapshot) return;

  const { feedbackType, feedbackLabel, feedbackAction } = button.dataset;
  const targetId = getFeedbackTargetId(feedbackType, feedbackLabel);
  const existing = currentFeedback.items[targetId] || {};
  const nextValue = existing.value === feedbackAction ? "" : feedbackAction;

  currentFeedback = {
    schemaVersion: "profile-feedback/v1",
    updatedAt: new Date().toISOString(),
    items: {
      ...currentFeedback.items
    }
  };

  if (nextValue) {
    currentFeedback.items[targetId] = {
      targetId,
      targetType: feedbackType,
      label: feedbackLabel,
      value: nextValue,
      snapshotGeneratedAt: currentSnapshot.generatedAt,
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } else {
    delete currentFeedback.items[targetId];
  }

  await chrome.storage.local.set({ profileFeedback: currentFeedback });
  renderSnapshot(currentSnapshot);
}

async function handleRuleClick(event) {
  const button = event.target.closest("[data-rule-action]");
  if (!button || !currentSnapshot) return;

  const { ruleAction, ruleId } = button.dataset;
  const suggestion = getRuleSuggestions().find((item) => item.id === ruleId);
  if (!suggestion) return;

  if (ruleAction === "approve") {
    currentApprovedRules = {
      schemaVersion: "approved-rules/v1",
      updatedAt: new Date().toISOString(),
      items: {
        ...currentApprovedRules.items,
        [ruleId]: {
          ...suggestion,
          status: "approved",
          approvedAt: new Date().toISOString()
        }
      }
    };

    currentIgnoredRuleSuggestions = removeRuleFromStore(currentIgnoredRuleSuggestions, ruleId, "ignored-rule-suggestions/v1");
    await chrome.storage.local.set({
      approvedRules: currentApprovedRules,
      ignoredRuleSuggestions: currentIgnoredRuleSuggestions
    });
    renderRuleSuggestions();
    return;
  }

  if (ruleAction === "ignore") {
    currentIgnoredRuleSuggestions = {
      schemaVersion: "ignored-rule-suggestions/v1",
      updatedAt: new Date().toISOString(),
      items: {
        ...currentIgnoredRuleSuggestions.items,
        [ruleId]: {
          ...suggestion,
          status: "ignored",
          ignoredAt: new Date().toISOString()
        }
      }
    };

    currentApprovedRules = removeRuleFromStore(currentApprovedRules, ruleId, "approved-rules/v1");
    await chrome.storage.local.set({
      approvedRules: currentApprovedRules,
      ignoredRuleSuggestions: currentIgnoredRuleSuggestions
    });
    renderRuleSuggestions();
  }
}

async function openSettings() {
  try {
    if (chrome.runtime.openOptionsPage) {
      await chrome.runtime.openOptionsPage();
      return;
    }

    await chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  } catch {
    console.warn(t("optionsUnavailable"));
  }
}

async function clearData() {
  await chrome.storage.local.remove([
    "profileSnapshot",
    "reportHandoffState",
    "profileFeedback",
    "approvedRules",
    "ignoredRuleSuggestions"
  ]);
  currentFeedback = createEmptyFeedback();
  currentApprovedRules = createEmptyRuleStore("approved-rules/v1");
  currentIgnoredRuleSuggestions = createEmptyRuleStore("ignored-rule-suggestions/v1");
  renderEmpty();
}

function handleStorageChange(changes, areaName) {
  if (areaName !== "local") return;

  if (changes.preferredLanguage) {
    currentLanguage = getSupportedLanguage(changes.preferredLanguage.newValue);
    applyStaticCopy();
    if (currentSnapshot) renderSnapshot(currentSnapshot);
  }

  if (changes.profileSnapshot) {
    currentSnapshot = changes.profileSnapshot.newValue || null;
    if (currentSnapshot) {
      renderSnapshot(currentSnapshot);
    } else {
      renderEmpty();
    }
  }

  if (changes.profileFeedback) {
    currentFeedback = normalizeFeedback(changes.profileFeedback.newValue);
    renderFeedbackStatus();
    if (currentSnapshot) renderSnapshot(currentSnapshot);
  }

  if (changes.approvedRules) {
    currentApprovedRules = normalizeRuleStore(changes.approvedRules.newValue, "approved-rules/v1");
    renderRuleSuggestions();
  }

  if (changes.ignoredRuleSuggestions) {
    currentIgnoredRuleSuggestions = normalizeRuleStore(changes.ignoredRuleSuggestions.newValue, "ignored-rule-suggestions/v1");
    renderRuleSuggestions();
  }
}

function applyStaticCopy() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  setText("#reportEyebrow", t("eyebrow"));
  setText("#settingsButton", t("settings"));
  setText("#exportButton", t("export"));
  setText("#clearButton", t("clear"));
  setText("#bookmarkLabel", t("bookmarks"));
  setText("#domainLabel", t("domains"));
  setText("#signalLabel", t("signals"));
  setText("#reviewLabel", t("review"));
  setText("#sourceBalanceLevel", t("sourceBalance"));
  setText("#appliedRulesEyebrow", t("appliedRulesEyebrow"));
  setText("#appliedRulesTitle", t("appliedRulesTitle"));
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
  setText("#feedbackEyebrow", t("feedbackEyebrow"));
  setText("#feedbackTitle", t("feedbackTitle"));
  setText("#calibrationEyebrow", t("calibrationEyebrow"));
  setText("#calibrationTitle", t("calibrationTitle"));
  setText("#calibrationSummary", t("calibrationSummary"));
  setText("#rulesEyebrow", t("rulesEyebrow"));
  setText("#rulesTitle", t("rulesTitle"));
  setText("#rulesSummary", t("rulesSummary"));
  document.querySelector("#emptyState .eyebrow").textContent = t("emptyEyebrow");
  document.querySelector("#emptyState h2").textContent = t("emptyHeading");
  document.querySelector("#emptyState p:last-child").textContent = t("emptyBody");
}

function createSignalItem(label, meta) {
  const item = document.createElement("div");
  item.className = "feedback-item";
  item.innerHTML = `
    <div>
      <strong>${escapeHtml(localizeAnalysisLabel(label))}</strong>
      <span>${escapeHtml(meta)}</span>
    </div>
  `;
  return item;
}

function renderFeedbackButtons(type, label, actions, selected) {
  return `
    <div class="feedback-actions" aria-label="${escapeAttribute(localizeAnalysisLabel(label))} feedback">
      ${actions.map((action) => `
        <button
          type="button"
          data-feedback-type="${escapeAttribute(type)}"
          data-feedback-label="${escapeAttribute(label)}"
          data-feedback-action="${escapeAttribute(action)}"
          data-selected="${selected === action ? "true" : "false"}"
        >${escapeHtml(getFeedbackActionLabel(action))}</button>
      `).join("")}
    </div>
  `;
}

function renderFeedbackStatus() {
  const count = Object.keys(currentFeedback.items).length;
  nodes.feedbackCount.textContent = formatNumber(count);
  nodes.feedbackSummary.textContent = count ? t("feedbackCount", count) : t("feedbackEmpty");
}

function renderRuleSuggestions() {
  const suggestions = getRuleSuggestions();
  const visibleSuggestions = suggestions.filter((suggestion) => !currentIgnoredRuleSuggestions.items[suggestion.id]);
  const approvedCount = Object.keys(currentApprovedRules.items).length;
  const pendingCount = visibleSuggestions.filter((suggestion) => !currentApprovedRules.items[suggestion.id]).length;

  nodes.pendingRuleCount.textContent = t("pendingRules", pendingCount);
  nodes.approvedRuleCount.textContent = t("approvedRules", approvedCount);
  nodes.ruleList.textContent = "";

  if (!visibleSuggestions.length) {
    nodes.ruleList.append(createEmpty(t("rulesEmpty")));
    return;
  }

  for (const suggestion of visibleSuggestions) {
    const isApproved = Boolean(currentApprovedRules.items[suggestion.id]);
    const item = document.createElement("div");
    item.className = "rule-item";
    item.dataset.state = isApproved ? "approved" : "pending";
    item.innerHTML = `
      <div>
        <span>${escapeHtml(isApproved ? t("approvedState") : t("pendingState"))}</span>
        <strong>${escapeHtml(localizeAnalysisLabel(suggestion.label))}</strong>
        <p>${escapeHtml(suggestion.body)}</p>
      </div>
      <div class="rule-actions">
        <button
          type="button"
          data-rule-action="approve"
          data-rule-id="${escapeAttribute(suggestion.id)}"
          ${isApproved ? "disabled" : ""}
        >${escapeHtml(t("approveRule"))}</button>
        <button
          type="button"
          data-rule-action="ignore"
          data-rule-id="${escapeAttribute(suggestion.id)}"
        >${escapeHtml(t("ignoreRule"))}</button>
      </div>
    `;
    nodes.ruleList.append(item);
  }
}

function getRuleSuggestions() {
  return Object.values(currentFeedback.items)
    .filter((item) => item?.targetType && item?.label && item?.value)
    .map((item) => createRuleSuggestion(item))
    .filter(Boolean)
    .sort((a, b) => `${a.targetType}:${a.label}`.localeCompare(`${b.targetType}:${b.label}`));
}

function createRuleSuggestion(feedbackItem) {
  const id = `rule:${feedbackItem.targetType}:${feedbackItem.label}:${feedbackItem.value}`;
  const localizedLabel = localizeAnalysisLabel(feedbackItem.label);
  const base = {
    id,
    targetType: feedbackItem.targetType,
    label: feedbackItem.label,
    feedbackValue: feedbackItem.value,
    snapshotGeneratedAt: feedbackItem.snapshotGeneratedAt,
    createdFromFeedbackAt: feedbackItem.updatedAt || feedbackItem.createdAt || null
  };

  if (feedbackItem.targetType === "topic" && feedbackItem.value === "accurate") {
    return { ...base, ruleType: "trust_topic", body: t("ruleTopicAccurate", localizedLabel) };
  }

  if (feedbackItem.targetType === "topic" && feedbackItem.value === "too_broad") {
    return { ...base, ruleType: "refine_topic", body: t("ruleTopicBroad", localizedLabel) };
  }

  if (feedbackItem.targetType === "topic" && feedbackItem.value === "wrong") {
    return { ...base, ruleType: "review_topic", body: t("ruleTopicWrong", localizedLabel) };
  }

  if (feedbackItem.targetType === "dimension" && feedbackItem.value === "accurate") {
    return { ...base, ruleType: "trust_dimension", body: t("ruleDimensionAccurate", localizedLabel) };
  }

  if (feedbackItem.targetType === "dimension" && feedbackItem.value === "wrong") {
    return { ...base, ruleType: "lower_dimension_confidence", body: t("ruleDimensionWrong", localizedLabel) };
  }

  if (feedbackItem.targetType === "collection" && feedbackItem.value === "useful") {
    return { ...base, ruleType: "keep_collection", body: t("ruleCollectionUseful", localizedLabel) };
  }

  if (feedbackItem.targetType === "collection" && feedbackItem.value === "not_useful") {
    return { ...base, ruleType: "demote_collection", body: t("ruleCollectionNotUseful", localizedLabel) };
  }

  return null;
}

function getFeedbackTargetId(type, label) {
  return `${type}:${label}`;
}

function getFeedbackValue(targetId) {
  return currentFeedback.items[targetId]?.value || "";
}

function getFeedbackActionLabel(action) {
  if (action === "accurate") return t("feedbackAccurate");
  if (action === "wrong") return t("feedbackWrong");
  if (action === "too_broad") return t("feedbackBroad");
  if (action === "useful") return t("feedbackUseful");
  if (action === "not_useful") return t("feedbackNotUseful");
  return action;
}

function createEmptyFeedback() {
  return {
    schemaVersion: "profile-feedback/v1",
    updatedAt: null,
    items: {}
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

function removeRuleFromStore(store, ruleId, schemaVersion) {
  const nextStore = {
    schemaVersion,
    updatedAt: new Date().toISOString(),
    items: {
      ...store.items
    }
  };
  delete nextStore.items[ruleId];
  return nextStore;
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

function t(key, ...args) {
  const value = copy[currentLanguage]?.[key] ?? copy[defaultLanguage][key] ?? key;
  return typeof value === "function" ? value(...args) : value;
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
