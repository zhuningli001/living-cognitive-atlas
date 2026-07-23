"use client";

import { useEffect, useMemo, useState } from "react";
import { PROFILE_SNAPSHOT_SCHEMA_VERSION, validateProfileSnapshot } from "@/lib/bookmark-snapshot";
import { buildRuleSuggestionExport, buildRuleSuggestions } from "@/lib/feedback-rule-suggestions";
import { buildFeedbackExport, createProfileFeedbackDecision, feedbackActions, summarizeProfileFeedback } from "@/lib/profile-feedback";
import { buildImportedProfileReport } from "@/lib/imported-profile-report";
import { buildApprovedRulesExport, createApprovedRule } from "@/lib/rule-approval";
import { buildTaxonomyOverrideConfig, countTaxonomyOverrides, filterTaxonomyOverrideConfig, listTaxonomyOverrides } from "@/lib/taxonomy-overrides";

const storageKey = "living-cognitive-atlas:profile-snapshot";
const feedbackStorageKey = "living-cognitive-atlas:profile-feedback";
const approvedRulesStorageKey = "living-cognitive-atlas:approved-rules";
const appliedOverridesStorageKey = "living-cognitive-atlas:applied-overrides";
const languageStorageKey = "living-cognitive-atlas:preferred-language";
const extensionSnapshotRequestMessage = "living-cognitive-atlas:request-extension-snapshot";
const extensionSnapshotMessage = "living-cognitive-atlas:extension-snapshot";
const extensionSnapshotImportedMessage = "living-cognitive-atlas:extension-snapshot-imported";

const importReportFallbackCss = `
  body[data-surface="import-report"] {
    margin: 0;
    color: #1d1c1a;
    background: #f8f4ec;
    font-family: Avenir Next, Segoe UI, Helvetica Neue, Arial, sans-serif;
  }

  body[data-surface="import-report"] > div > header {
    position: sticky;
    top: 0;
    z-index: 40;
    border-bottom: 1px solid rgba(29, 28, 26, 0.08);
    background: rgba(248, 244, 236, 0.9);
    backdrop-filter: blur(14px);
  }

  body[data-surface="import-report"] > div > header > div,
  body[data-surface="import-report"] > div > main {
    max-width: 1120px;
    margin: 0 auto;
    padding-left: 24px;
    padding-right: 24px;
  }

  body[data-surface="import-report"] > div > header > div {
    display: flex;
    min-height: 72px;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  body[data-surface="import-report"] > div > header p,
  .import-eyebrow {
    margin: 0;
    color: #8e5f4d;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  body[data-surface="import-report"] > div > header h1 {
    margin: 4px 0 0;
    font-family: Georgia, Times New Roman, serif;
    font-size: 22px;
    font-weight: 500;
  }

  body[data-surface="import-report"] > div > header nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  body[data-surface="import-report"] > div > header a {
    border: 1px solid rgba(29, 28, 26, 0.08);
    border-radius: 999px;
    padding: 8px 15px;
    color: #1d1c1a;
    text-decoration: none;
    background: rgba(255, 253, 248, 0.55);
  }

  body[data-surface="import-report"] > div > main {
    padding-top: 32px;
    padding-bottom: 56px;
  }

  .import-page {
    background: #f8f4ec;
  }

  .import-stack {
    display: grid;
    gap: 24px;
  }

  .import-hero,
  .handoff-card,
  .import-profile-card,
  .import-report-block,
  .import-empty,
  .import-panel {
    border: 1px solid rgba(29, 28, 26, 0.1);
    border-radius: 8px;
    background: rgba(255, 253, 248, 0.82);
    box-shadow: 0 10px 30px rgba(40, 35, 28, 0.06);
  }

  .import-hero,
  .import-profile-card,
  .import-report-block,
  .import-empty,
  .import-panel {
    padding: 24px;
  }

  .handoff-card {
    padding: 18px;
    background: rgba(156, 168, 143, 0.12);
  }

  .import-title,
  .import-heading,
  .import-profile-title {
    margin: 8px 0 0;
    font-family: Georgia, Times New Roman, serif;
    font-weight: 500;
    line-height: 1.05;
  }

  .import-title {
    max-width: 820px;
    font-size: clamp(34px, 5vw, 58px);
  }

  .import-heading,
  .import-profile-title {
    font-size: clamp(28px, 3vw, 38px);
  }

  .import-body,
  .import-muted {
    margin-top: 14px;
    max-width: 760px;
    color: rgba(29, 28, 26, 0.62);
    font-size: 15px;
    line-height: 1.7;
  }

  .import-hero-grid,
  .import-control-grid,
  .handoff-layout {
    display: grid;
    gap: 16px;
  }

  .import-boundary {
    border: 1px solid rgba(63, 90, 75, 0.14);
    border-radius: 8px;
    padding: 16px;
    background: rgba(156, 168, 143, 0.12);
    color: rgba(29, 28, 26, 0.64);
    line-height: 1.55;
  }

  .import-control-grid {
    margin-top: 24px;
  }

  .import-file-control,
  .import-language-control,
  .import-soft-button,
  .import-danger-button,
  .import-primary-button {
    min-height: 46px;
    border: 1px solid rgba(29, 28, 26, 0.1);
    border-radius: 999px;
    padding: 11px 18px;
    font: inherit;
  }

  .import-file-control,
  .import-language-control,
  .import-soft-button {
    background: rgba(255, 253, 248, 0.72);
    color: rgba(29, 28, 26, 0.68);
  }

  .import-primary-button {
    border-color: #3f5a4b;
    color: #fff;
    background: #3f5a4b;
    cursor: pointer;
  }

  .import-danger-button {
    color: #8e5f4d;
    background: rgba(142, 95, 77, 0.08);
  }

  .import-status {
    margin-top: 14px;
    color: rgba(29, 28, 26, 0.55);
    font-size: 14px;
    line-height: 1.6;
  }

  .import-metric-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
  }

  .import-metric-card {
    display: block;
    border: 1px solid rgba(29, 28, 26, 0.08);
    border-radius: 8px;
    padding: 16px;
    text-decoration: none;
    background: rgba(245, 241, 232, 0.7);
  }

  @media (min-width: 780px) {
    .import-hero-grid {
      grid-template-columns: 1fr 320px;
      align-items: end;
    }

    .import-control-grid {
      grid-template-columns: 1fr auto auto;
      align-items: center;
    }

    .handoff-layout {
      grid-template-columns: 1fr auto;
      align-items: center;
    }
  }
`;

const copy = {
  en: {
    importEyebrow: "Snapshot import",
    importTitle: "Connect a bookmark snapshot to begin",
    importBody: "This report starts empty. Import the latest extension snapshot or choose an exported JSON file before any personal analysis appears.",
    localBoundaryTitle: "Local boundary",
    localBoundaryBody: "Bookmarks only. No server upload. No cloud analysis. No bookmark changes.",
    language: "Language",
    english: "English",
    chinese: "中文",
    readingSnapshot: "Reading snapshot...",
    chooseJson: "Choose exported JSON",
    clearSnapshot: "Clear local snapshot",
    noDataEyebrow: "No profile data yet",
    noDataTitle: "Scan or import to create the dashboard",
    noDataBody: "First-time users should see a clean state here. The personal dashboard appears only after the extension hands off a snapshot or the user chooses a local JSON file.",
    noDataHint: "Extension flow: Scan bookmarks -> Open full report -> Import latest snapshot.",
    reportErrorEyebrow: "Local report needs reset",
    reportErrorTitle: "This saved snapshot could not render",
    reportErrorBody: "The local browser cache may contain an older or incompatible snapshot. Reset report data, then import the latest extension snapshot again.",
    handoffEyebrow: "Extension handoff",
    handoffTitle: "Latest extension snapshot is ready",
    handoffTitleImported: "Current extension snapshot is imported",
    handoffTitleNew: "Newer extension snapshot is ready",
    handoffBody: "This snapshot came from extension local storage. Import keeps the report local to this browser.",
    handoffBodyImported: "The report is already using this extension snapshot.",
    handoffBodyNew: "Importing will replace the current local report snapshot, while keeping feedback and approved rules.",
    generated: "generated",
    importLatest: "Import latest snapshot",
    importNewer: "Import newer snapshot",
    importedLatest: "Imported",
    importedProfile: "Imported profile · web taxonomy pass",
    sourceSnapshotSaid: "Source snapshot said:",
    recalculates: "This page recalculates categories, dimensions, review risk, and return paths from imported records.",
    metrics: {
      bookmarks: "Bookmarks",
      domains: "Domains",
      interestPhases: "Interest phases",
      ruleSuggestions: "Rule suggestions",
      approvedRules: "Approved rules",
      overrideConfig: "Override config",
      appliedOverrides: "Applied overrides"
    },
    blocks: {
      currentAttention: "Current attention",
      weightedInterests: "Weighted interests from imported records",
      dominantDimensions: "Dominant dimensions",
      profileMix: "Profile mix",
      developmentLine: "Development line",
      growthPath: "Growth path from saved years",
      smartReturnPaths: "Smart return paths",
      practicalDoors: "Practical doors",
      reviewQueue: "Review queue",
      humanConfirmation: "What needs human confirmation",
      evidenceSample: "Evidence sample",
      normalizedRecords: "Normalized records",
      feedbackLoop: "Feedback loop",
      feedbackTitle: "Small decisions that teach the system",
      ruleSeed: "Rule-learning seed",
      exportFeedback: "Export local feedback"
    },
    feedbackBody: "These decisions are saved only in this browser. Export them later to convert repeated corrections into taxonomy rules.",
    exportFeedbackJson: "Export feedback JSON",
    clearFeedback: "Clear feedback",
    ruleSuggestionsEyebrow: "Rule suggestions",
    ruleSuggestionsTitle: "What the system is learning",
    ruleSuggestionsBody: "These are provisional suggestions from local feedback. They do not change taxonomy rules until explicitly approved later.",
    exportSuggestions: "Export suggestions JSON",
    noSuggestions: "Add a few feedback decisions in the review queue to let the system propose reusable rules.",
    approvedRulesEyebrow: "Approved rules",
    approvedRulesTitle: "Rules the user has accepted",
    approvedRulesBody: "Approved rules are saved locally. They still do not mutate the taxonomy file; this is the approval layer before durable rule writing.",
    exportApproved: "Export approved rules",
    clearApproved: "Clear approved",
    noApproved: "Approve a rule suggestion above to create a local approved rule.",
    localOverrides: "Local taxonomy overrides",
    overridesTitle: "Approved rules as executable config",
    overridesBody: "This config is generated from approved rules. Apply is explicit and only changes this browser-local report.",
    applyAll: "Apply all to report",
    undoApplied: "Undo applied",
    exportConfig: "Export config",
    resetReportData: "Reset report data",
    applied: "applied",
    approveRule: "Approve rule",
    revoke: "Revoke",
    evidence: "evidence",
    evidenceItems: "evidence item(s)",
    approved: "approved",
    applyToReport: "Apply to report",
    appliedToReport: "Applied to report",
    undo: "Undo",
    noOverrides: "Approve suggestions first; accepted rules will appear here as a local taxonomy override config.",
    links: "links",
    importedSnapshot: "Imported snapshot",
    sourceBalance: "Source balance",
    topFive: "Top 5",
    breadth: "breadth",
    sourceBroad: "Broad",
    sourceWatch: "Watch",
    sourceSkewed: "Skewed",
    sourceCheck: "Check",
    feedbackActions: {
      accurate: "Accurate",
      wrong_topic: "Wrong topic",
      important: "Important",
      review_later: "Review later"
    },
    feedbackDescriptions: {
      accurate: "The current classification looks right.",
      wrong_topic: "The item needs a different topic or category.",
      important: "The item matters and should be weighted higher.",
      review_later: "Keep this in the queue without deciding now."
    },
    status: {
      initial: "Import the JSON snapshot exported by the Chrome extension.",
      cached: "Loaded the last local snapshot from this browser.",
      handoffReady: "Latest extension snapshot is ready to import.",
      handoffAlreadyImported: "Current extension snapshot is already imported.",
      reading: "Reading local JSON...",
      importFailed: "Import failed.",
      parseFailed: "Could not parse this file as a valid JSON snapshot.",
      importedFile: (fileName) => `Imported ${fileName}. Snapshot stays in this browser.`,
      noHandoff: "No recent extension snapshot is available yet.",
      importedHandoff: "Imported latest extension snapshot. Report recalculated locally.",
      clearedSnapshot: "Local snapshot cleared.",
      clearedReportData: "Local report data reset.",
      savedFeedback: (label) => `Saved feedback: ${label}.`,
      clearedFeedback: "Local feedback cleared.",
      noFeedback: "No feedback decisions to export yet.",
      feedbackExport: "Feedback export started.",
      noSuggestions: "No rule suggestions to export yet.",
      suggestionsExport: "Rule suggestions export started.",
      approvedRule: (target) => `Approved local rule: ${target}.`,
      revokedRule: "Approved rule revoked.",
      clearedApproved: "Approved rules cleared.",
      noApproved: "No approved rules to export yet.",
      approvedExport: "Approved rules export started.",
      noOverrides: "No taxonomy overrides to export yet.",
      overridesExport: "Taxonomy override export started.",
      appliedOverride: "Applied override to this local report.",
      removedOverride: "Removed override from this local report.",
      appliedAll: "Applied all overrides to this local report.",
      clearedApplied: "Applied overrides cleared from this local report."
    }
  },
  zh: {
    importEyebrow: "快照导入",
    importTitle: "连接书签快照后开始",
    importBody: "这个报告页初始是空的。只有导入扩展里的最新快照，或选择本地 JSON 文件后，才会出现个人分析。",
    localBoundaryTitle: "本地边界",
    localBoundaryBody: "只读书签。不上传服务端。不做云端分析。不修改书签。",
    language: "语言",
    english: "English",
    chinese: "中文",
    readingSnapshot: "正在读取快照...",
    chooseJson: "选择导出的 JSON",
    clearSnapshot: "清除本地快照",
    noDataEyebrow: "还没有个人数据",
    noDataTitle: "扫描或导入后生成看板",
    noDataBody: "首次进入应该是干净状态。只有扩展交接快照，或用户选择本地 JSON 文件后，个人看板才会出现。",
    noDataHint: "插件流程：扫描书签 -> 打开完整报告 -> 导入最新快照。",
    reportErrorEyebrow: "本地报告需要重置",
    reportErrorTitle: "这份已保存快照暂时无法渲染",
    reportErrorBody: "当前浏览器缓存里可能有旧版或不兼容的 snapshot。请重置报告数据，然后重新导入插件里的最新快照。",
    handoffEyebrow: "扩展交接",
    handoffTitle: "最新扩展快照已准备好",
    handoffTitleImported: "当前扩展快照已导入",
    handoffTitleNew: "有更新的扩展快照可导入",
    handoffBody: "这个快照来自扩展的本地存储。导入后，报告仍然只保存在当前浏览器。",
    handoffBodyImported: "当前报告已经在使用这个扩展快照。",
    handoffBodyNew: "导入后会替换当前本地报告快照，但保留反馈和已批准规则。",
    generated: "生成于",
    importLatest: "导入最新快照",
    importNewer: "导入更新快照",
    importedLatest: "已导入",
    importedProfile: "已导入画像 · Web taxonomy 分析",
    sourceSnapshotSaid: "原始快照判断：",
    recalculates: "本页会基于导入记录重新计算分类、维度、待确认风险和返回路径。",
    metrics: {
      bookmarks: "书签",
      domains: "来源",
      interestPhases: "兴趣阶段",
      ruleSuggestions: "规则建议",
      approvedRules: "已批准规则",
      overrideConfig: "覆盖配置",
      appliedOverrides: "已应用覆盖"
    },
    blocks: {
      currentAttention: "当前注意力",
      weightedInterests: "从导入记录计算的兴趣权重",
      dominantDimensions: "主导维度",
      profileMix: "画像组合",
      developmentLine: "成长路径",
      growthPath: "按保存年份生成的变化路径",
      smartReturnPaths: "智能返回路径",
      practicalDoors: "可直接使用的入口",
      reviewQueue: "待确认队列",
      humanConfirmation: "需要人工确认的内容",
      evidenceSample: "证据样本",
      normalizedRecords: "标准化记录",
      feedbackLoop: "反馈循环",
      feedbackTitle: "教会系统的小决策",
      ruleSeed: "规则学习种子",
      exportFeedback: "导出本地反馈"
    },
    feedbackBody: "这些决策只保存在当前浏览器。之后可以导出，用来把重复修正转化成 taxonomy 规则。",
    exportFeedbackJson: "导出反馈 JSON",
    clearFeedback: "清除反馈",
    ruleSuggestionsEyebrow: "规则建议",
    ruleSuggestionsTitle: "系统正在学到什么",
    ruleSuggestionsBody: "这些是从本地反馈生成的临时建议。只有明确批准后，才会进入后续规则层。",
    exportSuggestions: "导出建议 JSON",
    noSuggestions: "先在待确认队列里做几个反馈，系统才会提出可复用规则。",
    approvedRulesEyebrow: "已批准规则",
    approvedRulesTitle: "用户已经接受的规则",
    approvedRulesBody: "已批准规则保存在本地。它们仍然不会自动改写 taxonomy 文件，这是进入长期规则前的同意层。",
    exportApproved: "导出已批准规则",
    clearApproved: "清除已批准",
    noApproved: "先批准上方某条规则建议，才会生成本地 approved rule。",
    localOverrides: "本地 taxonomy 覆盖",
    overridesTitle: "把已批准规则变成可执行配置",
    overridesBody: "这个配置由已批准规则生成。应用动作是显式的，只影响当前浏览器本地报告。",
    applyAll: "全部应用到报告",
    undoApplied: "撤销已应用",
    exportConfig: "导出配置",
    resetReportData: "重置报告数据",
    applied: "已应用",
    approveRule: "批准规则",
    revoke: "撤销",
    evidence: "证据",
    evidenceItems: "条证据",
    approved: "已批准",
    applyToReport: "应用到报告",
    appliedToReport: "已应用到报告",
    undo: "撤销",
    noOverrides: "先批准规则建议；接受后的规则会在这里变成本地 taxonomy override config。",
    links: "条链接",
    importedSnapshot: "已导入快照",
    sourceBalance: "来源平衡",
    topFive: "前 5 来源",
    breadth: "广度",
    sourceBroad: "较广",
    sourceWatch: "观察",
    sourceSkewed: "偏斜",
    sourceCheck: "检查",
    feedbackActions: {
      accurate: "准确",
      wrong_topic: "主题不对",
      important: "重要",
      review_later: "稍后确认"
    },
    feedbackDescriptions: {
      accurate: "当前分类看起来是对的。",
      wrong_topic: "这个条目需要不同的主题或分类。",
      important: "这个条目很重要，权重应该更高。",
      review_later: "先保留在队列里，暂时不判断。"
    },
    status: {
      initial: "导入 Chrome 扩展导出的 JSON 快照。",
      cached: "已从当前浏览器载入上一次本地快照。",
      handoffReady: "最新扩展快照已准备好，可以导入。",
      handoffAlreadyImported: "当前扩展快照已经导入。",
      reading: "正在读取本地 JSON...",
      importFailed: "导入失败。",
      parseFailed: "无法把这个文件解析为有效 JSON 快照。",
      importedFile: (fileName) => `已导入 ${fileName}。快照只保存在当前浏览器。`,
      noHandoff: "还没有可用的扩展快照。",
      importedHandoff: "已导入最新扩展快照。报告已在本地重新计算。",
      clearedSnapshot: "本地快照已清除。",
      clearedReportData: "本地报告数据已重置。",
      savedFeedback: (label) => `已保存反馈：${label}。`,
      clearedFeedback: "本地反馈已清除。",
      noFeedback: "还没有可导出的反馈。",
      feedbackExport: "反馈导出已开始。",
      noSuggestions: "还没有可导出的规则建议。",
      suggestionsExport: "规则建议导出已开始。",
      approvedRule: (target) => `已批准本地规则：${target}。`,
      revokedRule: "已撤销批准规则。",
      clearedApproved: "已清除批准规则。",
      noApproved: "还没有可导出的批准规则。",
      approvedExport: "批准规则导出已开始。",
      noOverrides: "还没有可导出的 taxonomy 覆盖配置。",
      overridesExport: "taxonomy 覆盖配置导出已开始。",
      appliedOverride: "已把覆盖应用到当前本地报告。",
      removedOverride: "已从当前本地报告移除覆盖。",
      appliedAll: "已把全部覆盖应用到当前本地报告。",
      clearedApplied: "已清除当前本地报告里的已应用覆盖。"
    }
  }
};

export default function ImportProfileSnapshotPage() {
  const [snapshot, setSnapshot] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [approvedRules, setApprovedRules] = useState({});
  const [appliedOverrides, setAppliedOverrides] = useState({});
  const [pendingExtensionSnapshot, setPendingExtensionSnapshot] = useState(null);
  const [language, setLanguage] = useState("en");
  const [isFeedbackLoaded, setIsFeedbackLoaded] = useState(false);
  const [isApprovedRulesLoaded, setIsApprovedRulesLoaded] = useState(false);
  const [isAppliedOverridesLoaded, setIsAppliedOverridesLoaded] = useState(false);
  const [status, setStatus] = useState(copy.en.status.initial);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const t = (key) => getCopyValue(copy[language], key) ?? getCopyValue(copy.en, key) ?? key;
  const ts = (key, ...args) => {
    const value = copy[language]?.status?.[key] ?? copy.en.status[key] ?? key;
    return typeof value === "function" ? value(...args) : value;
  };

  function setPreferredLanguage(event) {
    const nextLanguage = copy[event.target.value] ? event.target.value : "en";
    setLanguage(nextLanguage);
    setStatus(statusCopy(nextLanguage, "initial"));
  }

  useEffect(() => {
    document.body.dataset.surface = "import-report";
    return () => {
      delete document.body.dataset.surface;
    };
  }, []);

  useEffect(() => {
    const cachedLanguage = window.localStorage.getItem(languageStorageKey);
    if (cachedLanguage && copy[cachedLanguage]) setLanguage(cachedLanguage);

    const cached = window.localStorage.getItem(storageKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const result = validateProfileSnapshot(parsed);
        if (result.ok) {
          setSnapshot(result.snapshot);
          setStatus(statusCopy(cachedLanguage || "en", "cached"));
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    try {
      const cachedFeedback = window.localStorage.getItem(feedbackStorageKey);
      if (cachedFeedback) setFeedback(JSON.parse(cachedFeedback));
    } catch {
      window.localStorage.removeItem(feedbackStorageKey);
    } finally {
      setIsFeedbackLoaded(true);
    }

    try {
      const cachedApprovedRules = window.localStorage.getItem(approvedRulesStorageKey);
      if (cachedApprovedRules) setApprovedRules(JSON.parse(cachedApprovedRules));
    } catch {
      window.localStorage.removeItem(approvedRulesStorageKey);
    } finally {
      setIsApprovedRulesLoaded(true);
    }

    try {
      const cachedAppliedOverrides = window.localStorage.getItem(appliedOverridesStorageKey);
      if (cachedAppliedOverrides) setAppliedOverrides(JSON.parse(cachedAppliedOverrides));
    } catch {
      window.localStorage.removeItem(appliedOverridesStorageKey);
    } finally {
      setIsAppliedOverridesLoaded(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  useEffect(() => {
    if (!isFeedbackLoaded) return;
    window.localStorage.setItem(feedbackStorageKey, JSON.stringify(feedback));
  }, [feedback, isFeedbackLoaded]);

  useEffect(() => {
    if (!isApprovedRulesLoaded) return;
    window.localStorage.setItem(approvedRulesStorageKey, JSON.stringify(approvedRules));
  }, [approvedRules, isApprovedRulesLoaded]);

  useEffect(() => {
    if (!isAppliedOverridesLoaded) return;
    window.localStorage.setItem(appliedOverridesStorageKey, JSON.stringify(appliedOverrides));
  }, [appliedOverrides, isAppliedOverridesLoaded]);

  useEffect(() => {
    function handleExtensionSnapshot(event) {
      if (event.source !== window || event.origin !== window.location.origin) return;
      if (event.data?.source !== extensionSnapshotMessage) return;

      const result = validateProfileSnapshot(event.data.snapshot);
      if (!result.ok) return;

      if (copy[event.data.preferredLanguage]) setLanguage(event.data.preferredLanguage);
      setPendingExtensionSnapshot(result.snapshot);
      setStatus(
        statusCopy(
          event.data.preferredLanguage || language,
          result.snapshot.generatedAt === snapshot?.generatedAt ? "handoffAlreadyImported" : "handoffReady"
        )
      );
    }

    window.addEventListener("message", handleExtensionSnapshot);
    requestExtensionSnapshot();
    const retry = window.setTimeout(requestExtensionSnapshot, 750);

    return () => {
      window.clearTimeout(retry);
      window.removeEventListener("message", handleExtensionSnapshot);
    };
  }, [language, snapshot?.generatedAt]);

  function requestExtensionSnapshot() {
    window.postMessage({ source: extensionSnapshotRequestMessage }, window.location.origin);
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsReading(true);
    setError("");
    setStatus(ts("reading"));

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = validateProfileSnapshot(parsed);

      if (!result.ok) {
        setSnapshot(null);
        setError(result.error);
        setStatus(ts("importFailed"));
        return;
      }

      setSnapshot(result.snapshot);
      window.localStorage.setItem(storageKey, JSON.stringify(result.snapshot));
      setStatus(ts("importedFile", file.name));
    } catch {
      setSnapshot(null);
      setError(ts("parseFailed"));
      setStatus(ts("importFailed"));
    } finally {
      setIsReading(false);
      event.target.value = "";
    }
  }

  function importPendingExtensionSnapshot() {
    if (!pendingExtensionSnapshot) {
      setStatus(ts("noHandoff"));
      return;
    }

    setSnapshot(pendingExtensionSnapshot);
    window.localStorage.setItem(storageKey, JSON.stringify(pendingExtensionSnapshot));
    notifyExtensionSnapshotImported(pendingExtensionSnapshot);
    setStatus(ts("importedHandoff"));
  }

  function notifyExtensionSnapshotImported(importedSnapshot) {
    window.postMessage(
      {
        source: extensionSnapshotImportedMessage,
        snapshotGeneratedAt: importedSnapshot.generatedAt
      },
      window.location.origin
    );
  }

  function clearSnapshot() {
    window.localStorage.removeItem(storageKey);
    setSnapshot(null);
    setError("");
    setStatus(ts("clearedSnapshot"));
  }

  function resetReportData() {
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(feedbackStorageKey);
    window.localStorage.removeItem(approvedRulesStorageKey);
    window.localStorage.removeItem(appliedOverridesStorageKey);
    setSnapshot(null);
    setFeedback({});
    setApprovedRules({});
    setAppliedOverrides({});
    setError("");
    setStatus(ts("clearedReportData"));
  }

  function handleFeedback(item, action) {
    const decision = createProfileFeedbackDecision(item, action, {
      generatedAt: report.source.generatedAt
    });

    setFeedback((current) => ({
      ...current,
      [item.id]: decision
    }));
    setStatus(ts("savedFeedback", getFeedbackLabel(action, language)));
  }

  function clearFeedback() {
    window.localStorage.removeItem(feedbackStorageKey);
    setFeedback({});
    setStatus(ts("clearedFeedback"));
  }

  function exportFeedback() {
    const decisions = Object.values(feedback);
    if (!decisions.length) {
      setStatus(ts("noFeedback"));
      return;
    }

    const payload = buildFeedbackExport(decisions, {
      generatedAt: report?.source.generatedAt
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `bookmark-profile-feedback-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(ts("feedbackExport"));
  }

  function exportRuleSuggestions() {
    if (!ruleSuggestions.length) {
      setStatus(ts("noSuggestions"));
      return;
    }

    const payload = buildRuleSuggestionExport(ruleSuggestions, {
      generatedAt: report?.source.generatedAt
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `bookmark-rule-suggestions-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(ts("suggestionsExport"));
  }

  function approveRuleSuggestion(suggestion) {
    const approvedRule = createApprovedRule(suggestion, {
      generatedAt: report?.source.generatedAt
    });

    setApprovedRules((current) => ({
      ...current,
      [suggestion.id]: approvedRule
    }));
    setStatus(ts("approvedRule", suggestion.target));
  }

  function revokeApprovedRule(suggestionId) {
    setApprovedRules((current) => {
      const next = { ...current };
      delete next[suggestionId];
      return next;
    });
    setStatus(ts("revokedRule"));
  }

  function clearApprovedRules() {
    window.localStorage.removeItem(approvedRulesStorageKey);
    setApprovedRules({});
    setStatus(ts("clearedApproved"));
  }

  function exportApprovedRules() {
    const rules = Object.values(approvedRules);
    if (!rules.length) {
      setStatus(ts("noApproved"));
      return;
    }

    const payload = buildApprovedRulesExport(rules, {
      generatedAt: report?.source.generatedAt
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `approved-bookmark-rules-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(ts("approvedExport"));
  }

  function exportTaxonomyOverrides() {
    const overrideCount = countTaxonomyOverrides(taxonomyOverrideConfig);
    if (!overrideCount) {
      setStatus(ts("noOverrides"));
      return;
    }

    const blob = new Blob([JSON.stringify(taxonomyOverrideConfig, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `taxonomy-overrides-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(ts("overridesExport"));
  }

  function applyOverrideToReport(overrideId) {
    setAppliedOverrides((current) => ({
      ...current,
      [overrideId]: true
    }));
    setStatus(ts("appliedOverride"));
  }

  function undoAppliedOverride(overrideId) {
    setAppliedOverrides((current) => {
      const next = { ...current };
      delete next[overrideId];
      return next;
    });
    setStatus(ts("removedOverride"));
  }

  function applyAllOverridesToReport() {
    setAppliedOverrides(
      Object.fromEntries(taxonomyOverrideItems.map((item) => [item.id, true]))
    );
    setStatus(ts("appliedAll"));
  }

  function clearAppliedOverrides() {
    window.localStorage.removeItem(appliedOverridesStorageKey);
    setAppliedOverrides({});
    setStatus(ts("clearedApplied"));
  }

  const feedbackDecisions = useMemo(() => Object.values(feedback), [feedback]);
  const feedbackSummary = useMemo(() => summarizeProfileFeedback(feedbackDecisions), [feedbackDecisions]);
  const ruleSuggestions = useMemo(() => buildRuleSuggestions(feedbackDecisions), [feedbackDecisions]);
  const approvedRuleList = useMemo(() => Object.values(approvedRules), [approvedRules]);
  const taxonomyOverrideConfig = useMemo(
    () => buildTaxonomyOverrideConfig(approvedRuleList, { generatedAt: snapshot?.generatedAt }),
    [approvedRuleList, snapshot?.generatedAt]
  );
  const taxonomyOverrideItems = useMemo(() => listTaxonomyOverrides(taxonomyOverrideConfig), [taxonomyOverrideConfig]);
  const appliedOverrideIds = useMemo(() => Object.keys(appliedOverrides).filter((key) => appliedOverrides[key]), [appliedOverrides]);
  const appliedTaxonomyOverrideConfig = useMemo(
    () => filterTaxonomyOverrideConfig(taxonomyOverrideConfig, appliedOverrideIds),
    [taxonomyOverrideConfig, appliedOverrideIds]
  );
  const reportResult = useMemo(() => {
    if (!snapshot) return { report: null, error: "" };

    try {
      return {
        report: buildImportedProfileReport(snapshot, { taxonomyOverrideConfig: appliedTaxonomyOverrideConfig }),
        error: ""
      };
    } catch (error) {
      console.error(error);
      return {
        report: null,
        error: error instanceof Error ? error.message : "Report generation failed."
      };
    }
  }, [snapshot, appliedTaxonomyOverrideConfig]);
  const report = reportResult.report;
  const topRecords = useMemo(() => {
    if (!report) return [];
    return report.items
      .filter((record) => record.title && record.domain)
      .slice(0, 8);
  }, [report]);
  const pendingSnapshotState = getPendingSnapshotState(snapshot, pendingExtensionSnapshot);
  const hasReportLocalData = Boolean(
    snapshot ||
    feedbackDecisions.length ||
    approvedRuleList.length ||
    appliedOverrideIds.length
  );
  const handoffTitle = getHandoffTitle(pendingSnapshotState, copy[language]);
  const handoffBody = getHandoffBody(pendingSnapshotState, copy[language]);
  const handoffButtonLabel = getHandoffButtonLabel(pendingSnapshotState, copy[language]);
  const isPendingSnapshotImported = pendingSnapshotState === "imported";

  return (
    <div className="import-page -mx-6 -my-8 bg-[#f8f4ec] px-6 py-8 lg:-mx-10 lg:-my-10 lg:px-10 lg:py-10">
    <div className="import-stack space-y-7">
      <section className="import-hero rounded-[2rem] border border-black/5 bg-white/75 p-7 shadow-atlas">
        <p className="import-eyebrow text-xs uppercase tracking-[0.28em] text-rust/60">{t("importEyebrow")}</p>
        <div className="import-hero-grid mt-3 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <h2 className="import-title max-w-4xl font-serif text-5xl leading-none text-ink">{t("importTitle")}</h2>
            <p className="import-body mt-5 max-w-3xl text-base leading-8 text-ink/68">
              {t("importBody")}
            </p>
          </div>
          <div className="import-boundary rounded-[1.25rem] border border-pine/10 bg-sage/10 p-4 text-sm leading-6 text-ink/62">
            <p className="font-medium text-pine">{t("localBoundaryTitle")}</p>
            <p className="mt-2">{t("localBoundaryBody")}</p>
          </div>
        </div>

        <div className="import-control-grid mt-7 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <label className="import-file-control flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/70 transition hover:bg-white">
            <span>{isReading ? t("readingSnapshot") : t("chooseJson")}</span>
            <input type="file" accept="application/json,.json" className="sr-only" disabled={isReading} onChange={handleFileChange} />
          </label>
          <label className="import-language-control flex min-h-14 items-center gap-2 rounded-full border border-black/5 bg-paper/80 px-4 py-3 text-sm text-ink/58">
            <span>{t("language")}</span>
            <select value={language} onChange={setPreferredLanguage} className="bg-transparent text-sm text-ink outline-none">
              <option value="en">{t("english")}</option>
              <option value="zh">{t("chinese")}</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-3 md:justify-end">
          {snapshot ? (
            <button
              type="button"
              onClick={clearSnapshot}
              className="import-soft-button min-h-14 rounded-full border border-black/5 bg-white/70 px-5 py-3 text-sm text-ink/62 transition hover:bg-white"
            >
              {t("clearSnapshot")}
            </button>
          ) : null}
          {hasReportLocalData ? (
            <button
              type="button"
              onClick={resetReportData}
              className="import-danger-button min-h-14 rounded-full border border-rust/15 bg-rust/5 px-5 py-3 text-sm text-rust transition hover:bg-rust/10"
            >
              {t("resetReportData")}
            </button>
          ) : null}
          </div>
        </div>

        <p className="import-status mt-4 text-sm leading-6 text-ink/55">{status}</p>
        {error ? <p className="mt-2 text-sm leading-6 text-rust">{error}</p> : null}
      </section>

      {pendingExtensionSnapshot ? (
        <section className="handoff-card rounded-[2rem] border border-pine/10 bg-sage/10 p-5 shadow-atlas">
          <div className="handoff-layout flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="import-eyebrow text-xs uppercase tracking-[0.22em] text-pine/70">{t("handoffEyebrow")}</p>
              <h3 className="import-heading mt-2 font-serif text-2xl leading-tight text-ink">{handoffTitle}</h3>
              <p className="import-muted mt-2 text-sm leading-6 text-ink/58">
                {pendingExtensionSnapshot.metrics.bookmarks.toLocaleString()} {t("metrics.bookmarks").toLowerCase()} · {pendingExtensionSnapshot.metrics.domains.toLocaleString()} {t("metrics.domains").toLowerCase()} · {t("generated")} {formatDate(pendingExtensionSnapshot.generatedAt, language)}
              </p>
              <p className="mt-1 text-xs leading-5 text-ink/48">{handoffBody}</p>
            </div>
            <button
              type="button"
              disabled={isPendingSnapshotImported}
              onClick={importPendingExtensionSnapshot}
              className="import-primary-button min-h-12 rounded-full bg-pine px-5 py-3 text-sm text-white shadow-atlas transition hover:bg-pine/90 disabled:cursor-not-allowed disabled:bg-pine/45"
            >
              {handoffButtonLabel}
            </button>
          </div>
        </section>
      ) : null}

      {report ? (
        <>
          <section className="import-profile-card rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="import-eyebrow text-xs uppercase tracking-[0.22em] text-rust/60">{t("importedProfile")}</p>
                <h3 className="import-profile-title mt-2 font-serif text-4xl leading-tight text-ink">{report.profile.headline}</h3>
                <p className="import-body mt-4 max-w-4xl text-base leading-8 text-ink/66">{report.profile.summary}</p>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-ink/45">
                  {t("sourceSnapshotSaid")} {report.source.originalHeadline}. {t("recalculates")}
                </p>
              </div>
              <div className="rounded-full border border-black/5 bg-paper/75 px-4 py-2 text-xs text-ink/52">
                {formatDate(report.source.generatedAt, language)}
              </div>
            </div>
            <div className="import-metric-grid mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label={t("metrics.bookmarks")} value={report.dashboard.totals.total} />
              <MetricCard label={t("metrics.domains")} value={report.dashboard.totals.uniqueDomains} />
              <MetricCard label={t("metrics.interestPhases")} value={report.dashboard.totals.interestPhases} />
              <MetricCard label={t("metrics.ruleSuggestions")} value={ruleSuggestions.length} href="#rule-suggestions" />
              <MetricCard label={t("metrics.approvedRules")} value={approvedRuleList.length} href="#approved-rules" />
              <MetricCard label={t("metrics.overrideConfig")} value={taxonomyOverrideItems.length} href="#taxonomy-overrides" />
              <MetricCard label={t("metrics.appliedOverrides")} value={appliedOverrideIds.length} href="#taxonomy-overrides" />
            </div>
            <SourceBalanceNote sourceBalance={report.dashboard.sourceBalance} uiCopy={copy[language]} />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1fr_0.86fr]">
            <ReportBlock eyebrow={t("blocks.currentAttention")} title={t("blocks.weightedInterests")}>
              <div className="flex flex-wrap gap-2">
                {report.profile.interests.slice(0, 12).map((topic) => (
                  <span key={topic.label} className="rounded-full border border-black/5 bg-paper/75 px-3 py-1.5 text-sm text-ink/62">
                    {localizeAnalysisLabel(topic.label, language)} - {topic.count}
                  </span>
                ))}
              </div>
            </ReportBlock>

            <ReportBlock eyebrow={t("blocks.dominantDimensions")} title={t("blocks.profileMix")}>
              <div className="space-y-4">
                {report.profile.dimensions.map((dimension) => (
                  <SignalBar key={dimension.label} label={localizeAnalysisLabel(dimension.label, language)} value={dimension.share} suffix="%" />
                ))}
              </div>
            </ReportBlock>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <ReportBlock eyebrow={t("blocks.developmentLine")} title={t("blocks.growthPath")}>
              <div className="space-y-4">
                {report.dashboard.evolutionStages.map((phase) => (
                  <article key={`${phase.range}-${phase.label}`} className="grid grid-cols-[58px_1fr] gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full border border-pine/25 bg-paper font-serif text-sm text-ink">
                      {phase.range.split("-").at(-1)}
                    </div>
                    <div className="border-l border-black/10 pl-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-rust/55">{phase.range} · {phase.bookmarkCount} {t("links")}</p>
                      <h4 className="mt-1 font-serif text-xl leading-tight text-ink">{localizeAnalysisLabel(phase.label, language)}</h4>
                      <p className="mt-2 text-sm leading-6 text-ink/58">{phase.narrative}</p>
                    </div>
                  </article>
                ))}
              </div>
            </ReportBlock>

            <ReportBlock eyebrow={t("blocks.smartReturnPaths")} title={t("blocks.practicalDoors")}>
              <div className="grid gap-3 sm:grid-cols-2">
                {report.dashboard.smartCollections.map((collection) => (
                  <div key={collection.label} className="rounded-[1rem] border border-black/5 bg-paper/70 p-4">
                    <p className="text-sm text-ink/62">{localizeAnalysisLabel(collection.label, language)}</p>
                    <p className="mt-2 font-serif text-3xl text-ink">{collection.count}</p>
                  </div>
                ))}
              </div>
            </ReportBlock>
          </section>

          <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <ReportBlock eyebrow={t("blocks.reviewQueue")} title={t("blocks.humanConfirmation")}>
              <div className="space-y-3">
                {report.review.priorityItems.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-[1rem] border border-black/5 bg-paper/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm text-ink/72">{item.title}</p>
                        <p className="mt-1 text-xs text-ink/45">
                          {item.domain} - {localizeAnalysisLabel(item.primary_category, language)} - {localizeAnalysisLabel(item.classification_confidence, language)}
                        </p>
                      </div>
                      {feedback[item.id] ? (
                        <span className="shrink-0 rounded-full bg-sage/20 px-2.5 py-1 text-[11px] text-pine">
                          {getFeedbackLabel(feedback[item.id].action, language)}
                        </span>
                      ) : null}
                    </div>
                    <FeedbackButtons item={item} activeAction={feedback[item.id]?.action} onSelect={handleFeedback} language={language} />
                  </div>
                ))}
              </div>
            </ReportBlock>

            <ReportBlock eyebrow={t("blocks.evidenceSample")} title={t("blocks.normalizedRecords")}>
              <div className="divide-y divide-black/5 rounded-[1.25rem] border border-black/5 bg-paper/60">
                {topRecords.map((record) => (
                  <div key={record.id} className="grid gap-1 px-4 py-3 md:grid-cols-[1fr_140px] md:items-center">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink/72">{record.title}</p>
                      <p className="mt-1 truncate text-xs text-ink/42">{record.folder_path || record.domain}</p>
                    </div>
                    <p className="truncate text-xs text-ink/45 md:text-right">
                      {formatRecordTags(record, language)}
                    </p>
                  </div>
                ))}
              </div>
            </ReportBlock>
          </section>

          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <ReportBlock eyebrow={t("blocks.feedbackLoop")} title={t("blocks.feedbackTitle")}>
              <div className="grid gap-3 sm:grid-cols-2">
                {feedbackSummary.map((item) => (
                  <div key={item.id} className="rounded-[1rem] border border-black/5 bg-paper/70 p-4">
                    <p className="text-sm text-ink/62">{getFeedbackLabel(item.id, language)}</p>
                    <p className="mt-2 font-serif text-3xl text-ink">{item.count}</p>
                    <p className="mt-1 text-xs leading-5 text-ink/45">{getFeedbackDescription(item.id, language)}</p>
                  </div>
                ))}
              </div>
            </ReportBlock>

            <ReportBlock eyebrow={t("blocks.ruleSeed")} title={t("blocks.exportFeedback")}>
              <p className="text-sm leading-7 text-ink/58">
                {t("feedbackBody")}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!feedbackDecisions.length}
                  onClick={exportFeedback}
                  className="rounded-full bg-pine px-5 py-3 text-sm text-white shadow-atlas transition hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("exportFeedbackJson")}
                </button>
                <button
                  type="button"
                  disabled={!feedbackDecisions.length}
                  onClick={clearFeedback}
                  className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/62 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("clearFeedback")}
                </button>
              </div>
            </ReportBlock>
          </section>

          <section id="rule-suggestions" className="scroll-mt-28 rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{t("ruleSuggestionsEyebrow")}</p>
                <h3 className="mt-2 font-serif text-3xl leading-tight text-ink">{t("ruleSuggestionsTitle")}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/58">
                  {t("ruleSuggestionsBody")}
                </p>
              </div>
              <button
                type="button"
                disabled={!ruleSuggestions.length}
                onClick={exportRuleSuggestions}
                className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/62 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t("exportSuggestions")}
              </button>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {ruleSuggestions.length ? (
                ruleSuggestions.map((suggestion) => (
                  <RuleSuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    approvedRule={approvedRules[suggestion.id]}
                    onApprove={approveRuleSuggestion}
                    onRevoke={revokeApprovedRule}
                    language={language}
                  />
                ))
              ) : (
                <p className="rounded-[1rem] border border-dashed border-black/10 bg-paper/45 p-5 text-sm leading-7 text-ink/55 lg:col-span-2">
                  {t("noSuggestions")}
                </p>
              )}
            </div>
          </section>

          <section id="approved-rules" className="scroll-mt-28 rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{t("approvedRulesEyebrow")}</p>
                <h3 className="mt-2 font-serif text-3xl leading-tight text-ink">{t("approvedRulesTitle")}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/58">
                  {t("approvedRulesBody")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!approvedRuleList.length}
                  onClick={exportApprovedRules}
                  className="rounded-full bg-pine px-5 py-3 text-sm text-white shadow-atlas transition hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("exportApproved")}
                </button>
                <button
                  type="button"
                  disabled={!approvedRuleList.length}
                  onClick={clearApprovedRules}
                  className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/62 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("clearApproved")}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {approvedRuleList.length ? (
                approvedRuleList.map((rule) => (
                  <article key={rule.suggestionId} className="rounded-[1rem] border border-pine/10 bg-sage/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.18em] text-pine/70">{localizeAnalysisLabel(rule.type, language)}</p>
                        <h4 className="mt-1 truncate font-serif text-xl text-ink">{localizeAnalysisLabel(rule.target, language)}</h4>
                      </div>
                      <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-[11px] text-pine">
                        {t("approved")}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-ink/62">{localizeAnalysisLabel(rule.proposedRule, language)}</p>
                    <p className="mt-3 text-xs text-ink/42">{rule.evidenceCount} {t("evidenceItems")} · {formatDate(rule.approvedAt, language)}</p>
                  </article>
                ))
              ) : (
                <p className="rounded-[1rem] border border-dashed border-black/10 bg-paper/45 p-5 text-sm leading-7 text-ink/55 lg:col-span-2">
                  {t("noApproved")}
                </p>
              )}
            </div>
          </section>

          <section id="taxonomy-overrides" className="scroll-mt-28 rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{t("localOverrides")}</p>
                <h3 className="mt-2 font-serif text-3xl leading-tight text-ink">{t("overridesTitle")}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/58">
                  {t("overridesBody")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!taxonomyOverrideItems.length}
                  onClick={applyAllOverridesToReport}
                  className="rounded-full bg-pine px-5 py-3 text-sm text-white shadow-atlas transition hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("applyAll")}
                </button>
                <button
                  type="button"
                  disabled={!appliedOverrideIds.length}
                  onClick={clearAppliedOverrides}
                  className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/62 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("undoApplied")}
                </button>
                <button
                  type="button"
                  disabled={!taxonomyOverrideItems.length}
                  onClick={exportTaxonomyOverrides}
                  className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/62 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("exportConfig")}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {taxonomyOverrideItems.length ? (
                taxonomyOverrideItems.map((item) => (
                  <article key={`${item.type}-${item.target}`} className="rounded-[1rem] border border-black/5 bg-paper/65 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.18em] text-rust/55">{localizeAnalysisLabel(item.type, language)}</p>
                        <h4 className="mt-1 truncate font-serif text-xl text-ink">{localizeAnalysisLabel(item.target, language)}</h4>
                      </div>
                      <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-[11px] text-pine">
                        {appliedOverrides[item.id] ? t("applied") : `${item.evidenceCount} ${t("evidence")}`}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-ink/62">{localizeAnalysisLabel(item.detail, language)}</p>
                    <p className="mt-2 text-xs leading-5 text-ink/42">{localizeAnalysisLabel(item.reason, language)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={Boolean(appliedOverrides[item.id])}
                        onClick={() => applyOverrideToReport(item.id)}
                        className="rounded-full bg-pine px-4 py-2 text-xs text-white transition hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {appliedOverrides[item.id] ? t("appliedToReport") : t("applyToReport")}
                      </button>
                      {appliedOverrides[item.id] ? (
                        <button
                          type="button"
                          onClick={() => undoAppliedOverride(item.id)}
                          className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-xs text-ink/58 transition hover:bg-white"
                        >
                          {t("undo")}
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-[1rem] border border-dashed border-black/10 bg-paper/45 p-5 text-sm leading-7 text-ink/55 lg:col-span-2">
                  {t("noOverrides")}
                </p>
              )}
            </div>
          </section>
        </>
      ) : snapshot ? (
        <section className="import-empty rounded-[2rem] border border-dashed border-rust/20 bg-white/55 p-8 text-center">
          <p className="import-eyebrow text-xs uppercase tracking-[0.22em] text-rust/60">{t("reportErrorEyebrow")}</p>
          <h3 className="import-heading mt-2 font-serif text-3xl text-ink">{t("reportErrorTitle")}</h3>
          <p className="import-muted mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink/58">
            {t("reportErrorBody")}
          </p>
          {reportResult.error ? <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-rust/70">{reportResult.error}</p> : null}
          <button
            type="button"
            onClick={resetReportData}
            className="import-danger-button mt-5 min-h-12 rounded-full border border-rust/15 bg-rust/5 px-5 py-3 text-sm text-rust transition hover:bg-rust/10"
          >
            {t("resetReportData")}
          </button>
        </section>
      ) : (
        <section className="import-empty rounded-[2rem] border border-dashed border-black/10 bg-white/45 p-8 text-center">
          <p className="import-eyebrow text-xs uppercase tracking-[0.22em] text-rust/60">{t("noDataEyebrow")}</p>
          <h3 className="import-heading mt-2 font-serif text-3xl text-ink">{t("noDataTitle")}</h3>
          <p className="import-muted mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink/58">
            {t("noDataBody")}
          </p>
          <p className="mt-3 text-xs text-ink/42">{t("noDataHint")}</p>
          <p className="mt-3 text-xs text-ink/38">{PROFILE_SNAPSHOT_SCHEMA_VERSION}</p>
        </section>
      )}
    </div>
    </div>
  );
}

function RuleSuggestionCard({ suggestion, approvedRule, onApprove, onRevoke, language }) {
  const uiCopy = copy[language] ?? copy.en;

  return (
    <article className="rounded-[1rem] border border-black/5 bg-paper/65 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-rust/55">{localizeAnalysisLabel(suggestion.label, language)}</p>
          <h4 className="mt-1 truncate font-serif text-xl text-ink">{localizeAnalysisLabel(suggestion.target, language)}</h4>
        </div>
        <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-[11px] text-pine">
          {localizeAnalysisLabel(suggestion.confidence, language)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/60">{localizeAnalysisLabel(suggestion.description, language)}</p>
      <p className="mt-3 rounded-[0.75rem] border border-pine/10 bg-sage/10 p-3 text-sm leading-6 text-ink/62">
        {localizeAnalysisLabel(suggestion.proposedRule, language)}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-ink/42">
        <span>{localizeAnalysisLabel(suggestion.scope, language)}</span>
        <span>{suggestion.evidenceCount} {uiCopy.evidenceItems}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={Boolean(approvedRule)}
          onClick={() => onApprove(suggestion)}
          className="rounded-full bg-pine px-4 py-2 text-xs text-white transition hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {approvedRule ? uiCopy.approved : uiCopy.approveRule}
        </button>
        {approvedRule ? (
          <button
            type="button"
            onClick={() => onRevoke(suggestion.id)}
            className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-xs text-ink/58 transition hover:bg-white"
          >
            {uiCopy.revoke}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function FeedbackButtons({ item, activeAction, onSelect, language }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {feedbackActions.map((action) => {
        const isActive = activeAction === action.id;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(item, action.id)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              isActive
                ? "border-pine bg-pine text-white"
                : "border-black/5 bg-white/60 text-ink/56 hover:border-pine/20 hover:bg-white"
            }`}
          >
            {getFeedbackLabel(action.id, language)}
          </button>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value, href }) {
  const content = (
    <>
      <p className="text-xs uppercase tracking-[0.18em] text-rust/50">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink">{Number(value).toLocaleString()}</p>
    </>
  );

  if (href) {
    return (
      <a href={href} className="import-metric-card rounded-[1.25rem] border border-black/5 bg-paper/70 p-4 transition hover:border-pine/20 hover:bg-white">
        {content}
      </a>
    );
  }

  return (
    <div className="import-metric-card rounded-[1.25rem] border border-black/5 bg-paper/70 p-4">
      {content}
    </div>
  );
}

function getPendingSnapshotState(snapshot, pendingExtensionSnapshot) {
  if (!pendingExtensionSnapshot) return "none";
  if (!snapshot) return "ready";
  if (snapshot.generatedAt === pendingExtensionSnapshot.generatedAt) return "imported";
  return "new";
}

function getHandoffTitle(state, uiCopy) {
  if (state === "imported") return uiCopy.handoffTitleImported;
  if (state === "new") return uiCopy.handoffTitleNew;
  return uiCopy.handoffTitle;
}

function getHandoffBody(state, uiCopy) {
  if (state === "imported") return uiCopy.handoffBodyImported;
  if (state === "new") return uiCopy.handoffBodyNew;
  return uiCopy.handoffBody;
}

function getHandoffButtonLabel(state, uiCopy) {
  if (state === "imported") return uiCopy.importedLatest;
  if (state === "new") return uiCopy.importNewer;
  return uiCopy.importLatest;
}

function ReportBlock({ eyebrow, title, children }) {
  return (
    <section className="import-report-block rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
      <p className="import-eyebrow text-xs uppercase tracking-[0.22em] text-rust/60">{eyebrow}</p>
      <h3 className="import-heading mt-2 font-serif text-3xl leading-tight text-ink">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SourceBalanceNote({ sourceBalance, uiCopy }) {
  if (!sourceBalance) return null;

  const levelLabel = {
    low: uiCopy.sourceBroad,
    medium: uiCopy.sourceWatch,
    high: uiCopy.sourceSkewed
  }[sourceBalance.level] ?? uiCopy.sourceCheck;

  return (
    <div className="mt-4 flex flex-col gap-2 rounded-[1rem] border border-black/5 bg-paper/60 px-4 py-3 text-sm text-ink/58 md:flex-row md:items-center md:justify-between">
      <p>
        <span className="mr-2 font-medium text-pine">{uiCopy.sourceBalance} · {levelLabel}</span>
        {formatSourceBalanceNote(sourceBalance, uiCopy)}
      </p>
      <span className="shrink-0 text-xs text-ink/42">
        {uiCopy.topFive}: {sourceBalance.topFiveShare}% · {uiCopy.breadth}: {sourceBalance.breadthShare}%
      </span>
    </div>
  );
}

function SignalBar({ label, value, suffix = "" }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-ink/66">{label}</span>
        <span className="font-serif text-lg text-ink">{value}{suffix}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-black/5">
        <div className="h-full rounded-full bg-pine/70" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

function formatRecordTags(record, language) {
  const tags = record.representative_tags.length ? record.representative_tags.slice(0, 2) : [record.content_type];
  return tags.filter(Boolean).map((tag) => localizeAnalysisLabel(tag, language)).join(" / ");
}

function localizeAnalysisLabel(value, language = "en") {
  if (language !== "zh" || !value) return value;

  const text = String(value);
  const normalized = text.replaceAll("_", " ");
  const exact = zhAnalysisLabels[text] ?? zhAnalysisLabels[normalized];
  if (exact) return exact;

  const domainImportant = text.match(/^(.+) has (\d+) important feedback decision\(s\), often around (.+)\.$/);
  if (domainImportant) return `${domainImportant[1]} 有 ${domainImportant[2]} 条重要反馈，常围绕 ${localizeAnalysisLabel(domainImportant[3], language)}。`;

  const domainWrongTopic = text.match(/^(.+) has (\d+) wrong-topic feedback decision\(s\), suggesting a domain-specific topic rule is needed\.$/);
  if (domainWrongTopic) return `${domainWrongTopic[1]} 有 ${domainWrongTopic[2]} 条主题不对反馈，说明需要站点专属主题规则。`;

  const categoryAccurate = text.match(/^(.+) has (\d+) accurate feedback decision\(s\), so the current rule may be reliable\.$/);
  if (categoryAccurate) return `${localizeAnalysisLabel(categoryAccurate[1], language)} 有 ${categoryAccurate[2]} 条准确反馈，当前规则可能可靠。`;

  const categoryDeferred = text.match(/^(.+) has (\d+) review-later decision\(s\), so it should remain observational before becoming a strong rule\.$/);
  if (categoryDeferred) return `${localizeAnalysisLabel(categoryDeferred[1], language)} 有 ${categoryDeferred[2]} 条稍后确认反馈，应先保持观察，不急着固化为强规则。`;

  const treatSource = text.match(/^Treat (.+) as a higher-importance source(?: for (.+))?\.$/);
  if (treatSource) {
    return `将 ${treatSource[1]} 视为更高重要性的来源${treatSource[2] ? `，用于 ${localizeAnalysisLabel(treatSource[2], language)}` : ""}。`;
  }

  const topicOverride = text.match(/^Create a topic override for (.+?)(?: instead of defaulting to (.+))?\.$/);
  if (topicOverride) {
    return `为 ${topicOverride[1]} 创建主题覆盖规则${topicOverride[2] ? `，而不是默认归入 ${localizeAnalysisLabel(topicOverride[2], language)}` : ""}。`;
  }

  const keepRule = text.match(/^Keep (.+) classification rules when similar evidence appears(?: from (.+))?\.$/);
  if (keepRule) {
    return `当相似证据出现时，保留 ${localizeAnalysisLabel(keepRule[1], language)} 的分类规则${keepRule[2] ? `，尤其来自 ${keepRule[2]}` : ""}。`;
  }

  const deferRule = text.match(/^Do not harden (.+) into a stronger rule yet(?: for (.+))?\.$/);
  if (deferRule) {
    return `暂时不要把 ${localizeAnalysisLabel(deferRule[1], language)} 固化为更强规则${deferRule[2] ? `，尤其是 ${localizeAnalysisLabel(deferRule[2], language)}` : ""}。`;
  }

  const reviewTopic = text.match(/^Review topic override: (.+)\.$/);
  if (reviewTopic) return `复核主题覆盖：${reviewTopic[1].split(" / ").map((tag) => localizeAnalysisLabel(tag, language)).join(" / ")}。`;

  return text;
}

const zhAnalysisLabels = {
  accurate: "准确",
  high: "高",
  medium: "中",
  low: "低",
  domain: "站点",
  category: "分类",
  repeated_signal: "重复信号",
  "repeated signal": "重复信号",
  early_signal: "早期信号",
  "early signal": "早期信号",
  increase_importance: "提高重要性",
  needs_topic_rule: "需要主题规则",
  keep_rule: "保留当前规则",
  defer_rule: "延后规则",
  "Increase importance": "提高重要性",
  "Needs topic rule": "需要主题规则",
  "Keep current rule": "保留当前规则",
  "Defer rule": "延后规则",
  "Source importance": "来源重要性",
  "Topic review": "主题复核",
  "Confirmed category": "已确认分类",
  "Deferred category": "延后分类",
  "Set source importance to core_source.": "将来源重要性设为核心来源。",
  "Review domain-specific topic override.": "复核这个站点的专属主题覆盖。",
  "Keep current category rule.": "保留当前分类规则。",
  "Keep as observational signal.": "保留为观察信号。",
  documentation: "文档",
  tutorial: "教程",
  portfolio: "作品集",
  tool: "工具",
  community: "社群",
  article: "文章",
  video: "视频",
  research: "研究",
  inspiration: "灵感",
  reference: "参考",
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
  "Sources to monitor": "可持续关注来源",
  Foundation: "基础期",
  Expansion: "扩展期",
  Synthesis: "综合期",
  "Current focus": "当前焦点",
  "New phase": "新阶段",
  "Open curiosity": "开放兴趣",
  Archive: "归档",
  Read: "阅读",
  Learn: "学习",
  Monitor: "关注",
  Try: "试用",
  Reference: "参考",
  "Needs Review": "需要确认",
  "Visual Inspiration & References": "视觉灵感与参考",
  "Portfolios, Artists & Studios": "作品集、艺术家与工作室",
  "Design Systems & Interface Resources": "设计系统与界面资源",
  "Tools, Dev & Workflow": "工具、开发与工作流",
  "Creative Coding & Computational Media": "创意编程与计算媒体",
  "AI, Product & Interaction": "AI、产品与交互",
  "Reading & Humanities": "阅读与人文",
  "Institutions, Schools & Opportunities": "机构、学校与机会",
  "Life, Learning & Personal Growth": "生活、学习与个人成长",
  "Code Repository": "代码仓库",
  Documentation: "文档",
  Tool: "工具",
  Tutorial: "教程",
  Portfolio: "作品集",
  "Studio Site": "工作室网站",
  Gallery: "图库",
  Article: "文章",
  Essay: "随笔",
  Publication: "出版物",
  Video: "视频",
  "Research Report": "研究报告",
  Institution: "机构",
  Opportunity: "机会",
  Community: "社群",
  "Search Result": "搜索结果",
  Book: "书籍",
  "Human × AI coexistence": "人与 AI 共存",
  "Calm technology": "平静技术",
  "Decentralized creativity": "去中心化创造",
  "Ambient intelligence": "环境智能",
  "Emotional computing": "情感计算",
  "Future parenting": "未来育儿",
  "Slowness & calm": "缓慢与平静",
  "Collective intelligence": "集体智能",
  "Systemic thinking": "系统思维",
  "Creative autonomy": "创作自主",
  Flow: "心流",
  Presence: "临在",
  Intimacy: "亲密",
  Curiosity: "好奇",
  Reflection: "反思",
  Healing: "疗愈",
  Empowerment: "赋能",
  Exploration: "探索",
  "Cognitive overload": "认知过载",
  "Emotional safety": "情绪安全",
  Conversational: "对话式",
  Agentic: "代理式",
  Ambient: "环境式",
  "Invisible UI": "隐形界面",
  Spatial: "空间式",
  Narrative: "叙事式",
  Adaptive: "自适应",
  "System-driven": "系统驱动",
  Behavioral: "行为式",
  Motion: "动态影像",
  Installation: "装置",
  Product: "产品",
  Interface: "界面",
  Sound: "声音",
  "Product Page": "产品页"
};

function formatDate(value, language = "en") {
  const uiCopy = copy[language] ?? copy.en;
  if (!value) return uiCopy.importedSnapshot;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return uiCopy.importedSnapshot;
  return date.toLocaleString(language === "zh" ? "zh-CN" : [], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getFeedbackLabel(id, language = "en") {
  return copy[language]?.feedbackActions?.[id] ?? copy.en.feedbackActions[id] ?? id;
}

function getFeedbackDescription(id, language = "en") {
  return copy[language]?.feedbackDescriptions?.[id] ?? copy.en.feedbackDescriptions[id] ?? "";
}

function formatSourceBalanceNote(sourceBalance, uiCopy) {
  if (uiCopy === copy.zh) {
    if (sourceBalance.level === "high" && sourceBalance.topDomain?.label) {
      return `${sourceBalance.topDomain.label} 占 ${sourceBalance.topShare}%，画像明显受该来源影响。`;
    }
    if (sourceBalance.level === "medium") {
      return `前 5 来源占 ${sourceBalance.topFiveShare}%，需要保留来源偏差意识。`;
    }
    return "来源分布较广，画像不太依赖单一站点。";
  }

  return sourceBalance.note;
}

function getCopyValue(source, path) {
  return path.split(".").reduce((current, key) => current?.[key], source);
}

function statusCopy(language, key, ...args) {
  const value = copy[language]?.status?.[key] ?? copy.en.status[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}
