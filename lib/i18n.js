import { cookies } from "next/headers";

const copy = {
  en: {
    shell: {
      eyebrow: "Ningli Bookmark",
      title: "Ningli-Bookmark-living cognitive atlas",
      links: [
        { href: "/", label: "Home" },
        { href: "/atlas", label: "Atlas" },
        { href: "/search", label: "Search" },
        { href: "/evolution", label: "Evolution" },
        { href: "/signals", label: "Signals" },
        { href: "/reclassify", label: "Reclassify" },
        { href: "/cold-storage", label: "Cold Storage" },
        { href: "/settings", label: "Settings" }
      ]
    },
    home: {
      heroEyebrow: "Bookmark system",
      heroTitle: "A cleaner classification system for creative references, tools, reading, and emerging signals.",
      heroBody:
        "The archive now centers on a new primary structure: category, resource type, and action. Old folders are treated as evidence, not as the final navigation system.",
      quickActions: "Quick actions",
      workflowTitle: "What you can do now",
      workflowItems: [
        "Browse the archive by cleaner primary categories",
        "Reclassify messy legacy folders into the new structure",
        "Export a curated library or review weekly signals"
      ],
      openSearch: "Open Search",
      openSignals: "Open Signals",
      openSettings: "Open Settings",
      openExport: "Download Curated JSON",
      connectionEyebrow: "Category paths",
      stats: {
        bookmarks: "Bookmarks",
        domains: "Domains",
        worldview: "Primary Categories",
        duplicates: "Repeat-save Clusters"
      },
      curatedEyebrow: "Representative tags",
      curatedTitle: "Keep fewer labels, keep the useful ones",
      categoryEyebrow: "Featured categories",
      categoryTitle: "The new structure at a glance",
      exportsEyebrow: "Export",
      exportsTitle: "Share the atlas as a curated library",
      exportCurated: "Download curated JSON",
      exportCsv: "Download curated CSV",
      exportAll: "Download full atlas JSON",
      moodboardTitle: "Visual directions",
      moodboardBody: "A clearer visual board grouped by larger aesthetic or worldview directions.",
      signalsTitle: "Signal board preview"
    },
    atlas: {
      eyebrow: "Atlas View",
      title: "Browse the archive through the new primary structure.",
      tabs: {
        primary_category: "Category",
        resource_type_tags: "Resource Type",
        action_tags: "Action"
      },
      linked: "linked references"
    },
    reclassify: {
      eyebrow: "Reclassify",
      title: "Use old folders as evidence, not as the final structure.",
      body:
        "This view helps translate messy legacy folders into cleaner categories, resource types, and actions. Treat old folders as temporary signals, then move the system to the new structure.",
      oldFolders: "Legacy folders",
      oldFoldersTitle: "Where the old structure points now",
      blueprint: "Category blueprint",
      blueprintTitle: "The cleaner structure to keep"
    },
    search: {
      eyebrow: "Search View",
      title: "Search across curiosity, taste, and signal.",
      keyword: "Keyword",
      year: "Year",
      status: "Value Status",
      category: "Category",
      resourceType: "Resource Type",
      action: "Action",
      tag: "Tag",
      apply: "Apply filters",
      reset: "Reset",
      matched: "bookmarks matched."
    },
    evolution: {
      eyebrow: "Evolution Map",
      title: "Interest shifts across years, themes, and creative identity.",
      phases: "Dominant themes by period",
      intensity: "Bookmark intensity timeline",
      shifts: "How the center of gravity changed"
    },
    cold: {
      eyebrow: "Cold Storage",
      title: "Stale links, duplicates, and low-current-value residue.",
      repeats: "Repeat-saving patterns",
      repeatsTitle: "Duplicate clusters with long memory"
    },
    signals: {
      eyebrow: "Signals Board",
      title: "Tracked UX and product sources for weekly review.",
      body:
        "This board is designed as a lightweight weekly watchlist. It can later power scheduled summaries, push digests, and a shareable trend board.",
      live: "Live source watchlist",
      fallback: "If a source cannot be reached right now, the board still shows the tracked source so your workflow stays stable."
    },
    settings: {
      eyebrow: "Settings",
      title: "Keep the system simple, maintainable, and bilingual.",
      language: "Language",
      languageBody: "Switch the interface between Chinese and English. The choice is saved locally in this browser.",
      workflow: "Long-term use",
      workflowBody:
        "Update flow: export a new Chrome bookmarks HTML, run the parser, refresh the dashboard, then export a curated library for sharing.",
      sources: "Signals workflow",
      sourcesBody:
        "Tracked UX sources live in local configuration. Add or remove them as your weekly signal board evolves."
    }
  },
  zh: {
    shell: {
      eyebrow: "Ningli Bookmark",
      title: "Ningli-Bookmark-living cognitive atlas",
      links: [
        { href: "/", label: "首页" },
        { href: "/atlas", label: "图谱" },
        { href: "/search", label: "搜索" },
        { href: "/evolution", label: "演化" },
        { href: "/signals", label: "信号板" },
        { href: "/reclassify", label: "重归类" },
        { href: "/cold-storage", label: "冷存" },
        { href: "/settings", label: "设置" }
      ]
    },
    home: {
      heroEyebrow: "书签系统",
      heroTitle: "用更清晰的主分类系统整理你的创意参考、工具、阅读与新信号。",
      heroBody:
        "现在系统的核心不再是旧 folder，而是新的主结构：分类、资源类型、动作。旧 folder 只保留为判断线索，不再做主导航。",
      quickActions: "快速操作",
      workflowTitle: "你现在可以做什么",
      workflowItems: [
        "按更清晰的主分类浏览整个档案",
        "把混乱的旧 folder 重归类到新结构",
        "导出精选收藏，或查看每周信号来源"
      ],
      openSearch: "打开搜索",
      openSignals: "打开信号板",
      openSettings: "打开设置",
      openExport: "下载精选 JSON",
      connectionEyebrow: "分类路径",
      stats: {
        bookmarks: "书签总量",
        domains: "域名数量",
        worldview: "主分类",
        duplicates: "重复保存簇"
      },
      curatedEyebrow: "代表标签",
      curatedTitle: "少而准，保留真正有用的标签",
      categoryEyebrow: "重点分类",
      categoryTitle: "新的主结构一眼看清",
      exportsEyebrow: "导出分享",
      exportsTitle: "把图谱整理成可下载、可分享的收藏目录",
      exportCurated: "下载精选 JSON",
      exportCsv: "下载精选 CSV",
      exportAll: "下载完整 JSON",
      moodboardTitle: "视觉方向板",
      moodboardBody: "按更大的审美或世界观方向分组，让视觉内容更清楚，不再像碎片。",
      signalsTitle: "每周信号预览"
    },
    atlas: {
      eyebrow: "图谱视图",
      title: "通过新的主结构来浏览整个档案。",
      tabs: {
        primary_category: "主分类",
        resource_type_tags: "资源类型",
        action_tags: "动作"
      },
      linked: "条关联参考"
    },
    reclassify: {
      eyebrow: "重归类",
      title: "把旧 folder 当证据，不要再当最终结构。",
      body:
        "这个页面用来把混乱的历史 folder 翻译成更干净的新分类：主分类、资源类型、动作。旧 folder 只保留为线索层，不再做主导航。",
      oldFolders: "旧文件夹",
      oldFoldersTitle: "旧结构现在指向哪里",
      blueprint: "分类蓝图",
      blueprintTitle: "建议长期保留的新结构"
    },
    search: {
      eyebrow: "搜索视图",
      title: "按兴趣、判断与信号来搜索。",
      keyword: "关键词",
      year: "年份",
      status: "状态",
      category: "分类",
      resourceType: "资源类型",
      action: "动作",
      tag: "标签",
      apply: "应用筛选",
      reset: "重置",
      matched: "条书签匹配"
    },
    evolution: {
      eyebrow: "演化地图",
      title: "按年份、主题与创作身份来观察兴趣迁移。",
      phases: "阶段主导主题",
      intensity: "年度收藏强度",
      shifts: "重心如何迁移"
    },
    cold: {
      eyebrow: "冷存区",
      title: "过时链接、重复保存与当前低价值残留。",
      repeats: "重复保存模式",
      repeatsTitle: "具有长期记忆的重复聚类"
    },
    signals: {
      eyebrow: "信号看板",
      title: "追踪关键 UX / 产品来源，形成每周复盘板。",
      body:
        "这个页面是轻量版的每周 watchlist，后面可以继续接成自动摘要、推送 digest，以及可分享的趋势看板。",
      live: "动态来源列表",
      fallback: "如果某个来源暂时无法抓取，看板仍会保留来源本身，保证你的工作流稳定。"
    },
    settings: {
      eyebrow: "设置",
      title: "让系统保持精简、可维护，并支持中英文切换。",
      language: "语言",
      languageBody: "在中文和英文之间切换界面。选择会保存在当前浏览器。",
      workflow: "长期使用方式",
      workflowBody:
        "更新流程：重新导出 Chrome 书签 HTML，运行解析脚本，刷新仪表盘，然后导出精选收藏目录用于分享。",
      sources: "信号板维护",
      sourcesBody:
        "UX 信号来源保存在本地配置里。你可以随着每周研究重点增减来源。"
    }
  }
};

export async function getLang() {
  const store = await cookies();
  return store.get("atlas-lang")?.value === "zh" ? "zh" : "en";
}

export async function getCopy(section) {
  const lang = await getLang();
  return {
    lang,
    copy: copy[lang][section]
  };
}

export async function getAllCopy() {
  const lang = await getLang();
  return {
    lang,
    copy: copy[lang]
  };
}
