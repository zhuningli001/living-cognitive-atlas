import { cookies } from "next/headers";

const copy = {
  en: {
    shell: {
      eyebrow: "Ningli Bookmark",
      title: "Ningli-Bookmark-living cognitive atlas",
      links: [
        { href: "/", label: "Home" },
        { href: "/profile", label: "Profile" },
        { href: "/atlas", label: "Atlas" },
        { href: "/search", label: "Search" },
        { href: "/playbook", label: "Playbook" },
        { href: "/optimize", label: "Optimize" }
      ]
    },
    home: {
      heroEyebrow: "Bookmark system",
      heroTitle: "Find, reuse, and understand your saved web.",
      heroBody:
        "A lightweight command surface for bookmarks: quick access first, deeper search and insight when needed.",
      quickActions: "Quick actions",
      workflowTitle: "What you can do now",
      workflowItems: [
        "Browse the archive by cleaner primary categories",
        "Reclassify messy legacy folders into the new structure",
        "Export a curated library or scan weekly learning updates"
      ],
      openSearch: "Open Search",
      openSignals: "Open Signals",
      openSettings: "Open Settings",
      openExport: "Download Curated JSON",
      searchAction: "Find resources",
      signalsAction: "Learn what’s new",
      connectionEyebrow: "Category paths",
      focusStripEyebrow: "Today at a glance",
      metrics: {
        tools: "Tools",
        monitor: "Learning sources"
      },
      todaysReturnEyebrow: "Return prompt",
      todaysReturnTitle: "Three older links worth a glance",
      todaysReturnBody:
        "These are resurfaced by archive relevance, not live updates yet. Later this can combine recent interests and source monitoring.",
      whyNow: "Why now",
      whyRecommended: "Why recommended",
      reasonTopicPrefix: "It matches a recurring topic in your archive:",
      reasonFallback: "It is an older saved resource that may still help with reference, learning, or project reuse.",
      attentionEyebrow: "Attention map",
      attentionTitle: "Recent keywords as a light mind map",
      attentionBody:
        "A single-color bubble view of what has appeared most often in recently saved or resurfaced bookmarks. It shows archive attention, not live trends.",
      attentionCenterEyebrow: "Current",
      attentionCenter: "Focus",
      attentionOpenKeyword: "Open keyword",
      attentionSelectedEyebrow: "Selected",
      attentionRelatedEyebrow: "Related",
      attentionLinkUnit: "links",
      attentionViews: {
        recent: {
          label: "Recent focus",
          body: "What appears most often in recently saved or resurfaced bookmarks. This is the most useful homepage view.",
          centerEyebrow: "Current",
          center: "Focus"
        },
        overview: {
          label: "Keyword overview",
          body: "A broader keyword map across the whole archive. It is intentionally compressed so the homepage stays readable.",
          centerEyebrow: "Whole",
          center: "Atlas"
        },
        reuse: {
          label: "Reuse clues",
          body: "Topics and resource types most likely to become references, tools, notes, or project material later.",
          centerEyebrow: "Future",
          center: "Reuse"
        }
      },
      smartCollectionsEyebrow: "Use-mode board",
      smartCollectionsTitle: "Open the archive by how you actually return to it",
      smartCollectionsBody:
        "Taxonomy keeps the archive understandable; these cards make it usable. Jump into accounts, learning, tools, admin portals, references, and sources worth following.",
      openCollection: "Open",
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
      signalsTitle: "Signal board preview",
      deeperEyebrow: "Deeper layers",
      deeperTitle: "Use these when you need precision or reflection",
      atlasLink: "Atlas",
      atlasBody: "Inspect the classification layer and topic structure.",
      evolutionLink: "Evolution",
      evolutionBody: "See long-term shifts in attention and interests.",
      optimizeLink: "Optimization tasks",
      optimizeBody: "Tune messy labels in short guided batches from Settings.",
      exportBody: "Download a shareable curated library.",
      rediscoveryEyebrow: "Rediscovery",
      rediscoveryTitle: "Older links resurfacing now"
    },
    atlas: {
      eyebrow: "Atlas View",
      title: "Switch views to understand the same bookmark archive.",
      body:
        "These are not filters. They regroup the same bookmarks by what they are about, what form they take, or how you may return to them.",
      viewTabs: {
        structure: "Structure",
        profile: "Information Mirror",
        evolution: "Evolution"
      },
      viewLabel: "View",
      viewTabDescriptions: {
        structure: "Regroup links",
        profile: "Read your patterns",
        evolution: "See long-term shifts"
      },
      currentView: "Current view",
      groups: "groups",
      resultDisplay: "Result display",
      allGroups: "All",
      groupByLabel: "Group by",
      showLabel: "Show",
      layoutLabel: "View",
      sizeLabel: "Size",
      layouts: {
        list: "List",
        grid: "Grid"
      },
      sizes: {
        small: "Small",
        medium: "Medium",
        large: "Large"
      },
      tabs: {
        primary_category: "By Category",
        resource_type_tags: "By Resource Form",
        action_tags: "By Return Action"
      },
      viewDescriptions: {
        primary_category: "Shows your knowledge and life domains: design, art, tools, learning, admin, institutions, and more.",
        resource_type_tags: "Shows what each link is: tool, article, portfolio, community, institution, course, plugin, or account portal.",
        action_tags: "Shows what you are likely to do when you come back: read, learn, try, monitor, reference, review, or clean up."
      },
      linked: "linked references",
      profileEyebrow: "Information mirror",
      profileViewEyebrow: "Information mirror",
      profileViewTitle: "What the archive says about your attention.",
      profileViewBody:
        "This view turns saved links into a lightweight self-portrait: regions, resource modes, return habits, repeated interests, and classification leads.",
      profileRegions: "Regions",
      profileResourceMode: "Resource mode",
      profileActionMode: "Return mode",
      profileNextRules: "Classification leads",
      evolutionViewEyebrow: "Evolution lens",
      evolutionViewTitle: "How attention changed across time.",
      evolutionViewBody:
        "This view keeps the timeline inside Atlas so long-term shifts are read as part of your information identity, not as a separate report.",
      evolutionPhases: "Dominant phases",
      evolutionIntensity: "Bookmark intensity",
      evolutionShifts: "Phase shifts",
      evolutionShiftPrefix: "Center moved from"
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
    optimize: {
      eyebrow: "Optimize",
      title: "Make the archive cleaner without turning it into homework.",
      body:
        "This is the system-maintenance layer: AI suggestions, uncertain labels, cold storage, rule learning, export, and preferences live here so the main navigation stays light.",
      queuesEyebrow: "Review queues",
      queuesTitle: "Small tasks that improve future retrieval",
      actionsEyebrow: "System actions",
      actionsTitle: "Keep the archive portable and tuneable",
      cards: {
        reclassify: {
          title: "Reclassify suggestions",
          body: "Translate messy old folders into the cleaner taxonomy.",
          href: "/reclassify"
        },
        review: {
          title: "Light review batch",
          body: "Confirm low-confidence or generic labels in short sessions.",
          href: "/review"
        },
        cold: {
          title: "Cold storage",
          body: "Inspect stale, duplicate, or low-current-value resources.",
          href: "/cold-storage"
        },
        rules: {
          title: "Rule learning",
          body: "Teach the system recurring domain and category decisions.",
          href: "/settings#optimization"
        },
        settings: {
          title: "Preferences",
          body: "Language, workflow notes, source plan, and export options.",
          href: "/settings"
        },
        export: {
          title: "Export library",
          body: "Download a curated JSON or CSV copy of the archive.",
          href: "/api/export?type=curated&format=json"
        }
      },
      metricLabels: {
        taxonomyGroups: "taxonomy groups",
        lowConfidence: "low confidence",
        coldLinks: "cold links",
        genericReferences: "generic references",
        domains: "domains",
        curatedLinks: "curated links"
      },
      open: "Open"
    },
    review: {
      eyebrow: "Review Workflow",
      title: "Turn uncertain bookmarks into clearer information assets.",
      body:
        "This page collects low-confidence classifications, generic references, source-monitoring candidates, and cleanup queues. It is designed to keep review lightweight instead of turning the archive into another chore.",
      metrics: {
        total: "Total",
        needsReview: "Needs Review",
        lowConfidence: "Low Confidence",
        genericReference: "Generic Reference",
        monitor: "Monitor",
        cleanup: "Cleanup"
      },
      priorityEyebrow: "Review queue",
      priorityTitle: "Start with the highest-ambiguity items",
      priorityBody:
        "These links have weak category evidence, generic resource types, or unclear next actions. Reviewing them improves future search and personal insight quality.",
      lowConfidenceTitle: "Low-confidence classification",
      genericReferenceTitle: "Generic reference cleanup",
      session: {
        eyebrow: "5-minute session",
        title: "Review one small batch, then stop.",
        body:
          "Decide only what is needed for better retrieval: accept the suggestion, mark as monitor source, send to cleanup, or skip. The goal is momentum, not perfect cataloging.",
        progress: "Session progress",
        left: "items left in this queue",
        category: "Suggested category",
        resourceType: "Resource type",
        note: "Optional note",
        why: "Why this is useful",
        accept: "Accept suggestion",
        monitor: "Monitor source",
        cleanup: "Cleanup later",
        skip: "Skip",
        open: "Open page",
        doneTitle: "This batch is clear.",
        doneBody: "You can export the local decisions or come back later for another small session.",
        localOnly: "Prototype note: decisions are saved locally in this browser first; later they can become taxonomy rules.",
        export: "Export decisions",
        learnedRule: "Noted: {domain} is leaning toward {category} / {resourceType}.",
        learnedMonitor: "Noted: {domain} may be worth monitoring as a learning source.",
        learnedSkip: "Skipped. The system will not use this item as a rule signal."
      }
    },
    collections: {
      eyebrow: "Smart Collection",
      items: "items",
      openSearch: "Open as search",
      backHome: "Back home",
      recommended: "Recommended list",
      recommendedTitle: "Sorted for quick return",
      recommendedBody:
        "Items are ranked by value status, confidence, repeated interest, source importance, and topic signal.",
      subgroups: "Subgroups",
      subgroupsTitle: "Narrow by practical use",
      allItems: "All items"
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
      collection: "Collection",
      group: "Subgroup",
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
      eyebrow: "Learning Updates",
      title: "Tracked UX and product sources for lightweight learning.",
      body:
        "This board is designed as a lightweight update view. It can later power scheduled summaries, push digests, and a shareable learning board.",
      live: "Learning source list",
      fallback: "If a source cannot be reached right now, the board still shows the tracked source so your workflow stays stable."
    },
    settings: {
      eyebrow: "Settings",
      title: "Keep the system simple, maintainable, and bilingual.",
      language: "Language",
      languageBody: "Switch the interface between Chinese and English. The choice is saved locally in this browser.",
      optimization: {
        eyebrow: "Optimization tasks",
        title: "A small guided path for improving the archive.",
        body:
          "These are maintenance tasks, so they live here instead of the homepage. The goal is to finish a tiny batch, not reorganize everything at once.",
        needsCategory: "Unclear category",
        lowConfidence: "Low-confidence rules",
        genericReference: "Too-generic resource type",
        guideEyebrow: "5-minute flow",
        steps: [
          "1. Open one queue with the largest number.",
          "2. Check only title, domain, and current tags.",
          "3. Fix or accept a small batch, then stop."
        ],
        start: "Start guided cleanup"
      },
      learning: {
        eyebrow: "System learning",
        title: "Organizing habits the system has noticed",
        body:
          "This stays out of the homepage. After a few review decisions, the system surfaces only the patterns that may become long-term rules.",
        categoryRule: "{domain} → classify more often as {value}",
        resourceRule: "{domain} → treat more often as {value}",
        monitorRule: "{domain} → consider as a monitored learning source",
        confidence: {
          early: "early signal",
          medium: "repeated signal",
          strong: "strong signal"
        },
        examples: "examples",
        basedOn: "Based on:",
        approve: "Approve",
        approvedState: "Approved",
        ignore: "Ignore",
        approved: "approved",
        empty: "Complete a few 5-minute review decisions first; the system will show rule suggestions here when a pattern appears.",
        localOnly: "Prototype note: approval is saved locally first. Later this can write into taxonomy rules or agent memory."
      },
      workflow: "Long-term use",
      workflowBody:
        "Update flow: export a new Chrome bookmarks HTML, run the parser, refresh the dashboard, then export a curated library for sharing.",
      sources: "Learning source upkeep",
      sourcesBody:
        "Tracked UX sources live in local configuration. Add or remove them as your learning board evolves."
    }
  },
  zh: {
    shell: {
      eyebrow: "Ningli Bookmark",
      title: "Ningli-Bookmark-living cognitive atlas",
      links: [
        { href: "/", label: "首页" },
        { href: "/profile", label: "画像" },
        { href: "/atlas", label: "图谱" },
        { href: "/search", label: "搜索" },
        { href: "/playbook", label: "手册" },
        { href: "/optimize", label: "优化" }
      ]
    },
    home: {
      heroEyebrow: "书签系统",
      heroTitle: "快速找回、复用，并理解你存过的网络资源。",
      heroBody:
        "这是一个轻量的书签控制台：先给你快捷入口，需要时再进入搜索、复核和分析。",
      quickActions: "快速操作",
      workflowTitle: "你现在可以做什么",
      workflowItems: [
        "按更清晰的主分类浏览整个档案",
        "把混乱的旧 folder 重归类到新结构",
        "导出精选收藏，或查看每周新知来源"
      ],
      openSearch: "打开搜索",
      openSignals: "打开新知速览",
      openSettings: "打开设置",
      openExport: "下载精选 JSON",
      searchAction: "快速找资源",
      signalsAction: "新知识速览",
      connectionEyebrow: "分类路径",
      focusStripEyebrow: "今日概览",
      metrics: {
        tools: "工具插件",
        monitor: "学习来源"
      },
      todaysReturnEyebrow: "回看提示",
      todaysReturnTitle: "今天可以顺手看 3 条旧链接",
      todaysReturnBody:
        "现在先按档案相关性重新浮现，不假装有实时更新。后面可以再结合你最近兴趣和来源监控。",
      whyNow: "为什么现在",
      whyRecommended: "推荐理由",
      reasonTopicPrefix: "它对应你档案里反复出现的主题：",
      reasonFallback: "这是一个较早保存、但仍可能用于参考、学习或项目复用的资源。",
      attentionEyebrow: "注意力地图",
      attentionTitle: "把近期关键词变成轻量气泡图",
      attentionBody:
        "用单色气泡展示最近保存或重新浮现的书签里，出现频率较高的主题。它反映的是档案注意力，不是实时趋势。",
      attentionCenterEyebrow: "当前",
      attentionCenter: "关注点",
      attentionOpenKeyword: "打开关键词",
      attentionSelectedEyebrow: "已选中",
      attentionRelatedEyebrow: "相关",
      attentionLinkUnit: "条链接",
      attentionViews: {
        recent: {
          label: "最近关注",
          body: "最近保存或重新浮现的书签里，出现频率最高的主题。这个视角最适合放在首页。",
          centerEyebrow: "当前",
          center: "关注点"
        },
        overview: {
          label: "关键词全览",
          body: "从整个档案里压缩出的关键词地图。它会更复杂，所以这里只保留轻量摘要。",
          centerEyebrow: "全局",
          center: "图谱"
        },
        reuse: {
          label: "可回用线索",
          body: "更偏向之后能变成参考、工具、笔记或项目素材的主题和资源类型。",
          centerEyebrow: "未来",
          center: "复用"
        }
      },
      smartCollectionsEyebrow: "使用入口看板",
      smartCollectionsTitle: "按你真实回来看书签的方式打开档案",
      smartCollectionsBody:
        "底层 taxonomy 负责理解和分类；这些卡片负责帮你使用。可以快速进入账号社群、阅读学习、工具插件、办事入口、灵感参考和新知来源。",
      openCollection: "打开",
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
      signalsTitle: "每周信号预览",
      deeperEyebrow: "深入层",
      deeperTitle: "需要精确查找或自我观察时再进入",
      atlasLink: "图谱",
      atlasBody: "查看底层分类、主题与资源结构。",
      evolutionLink: "演化",
      evolutionBody: "观察长期注意力和兴趣如何变化。",
      optimizeLink: "优化任务",
      optimizeBody: "从设置里用小批次方式整理混乱标签。",
      exportBody: "下载可分享的精选目录。",
      rediscoveryEyebrow: "重新发现",
      rediscoveryTitle: "现在值得浮上来的旧链接"
    },
    atlas: {
      eyebrow: "图谱视图",
      title: "切换不同视角，理解同一批书签。",
      body:
        "这里不是筛选器，而是把同一批书签按不同维度重新分组：它属于什么领域、它是什么资源形态、你回来时打算怎么用。",
      viewTabs: {
        structure: "结构",
        profile: "信息镜子",
        evolution: "兴趣演化"
      },
      viewLabel: "视角",
      viewTabDescriptions: {
        structure: "重新组织链接",
        profile: "观察你的模式",
        evolution: "查看长期变化"
      },
      currentView: "当前视角",
      groups: "组",
      resultDisplay: "结果显示",
      allGroups: "全部",
      groupByLabel: "分组",
      showLabel: "显示",
      layoutLabel: "视图",
      sizeLabel: "大小",
      layouts: {
        list: "列表",
        grid: "网格"
      },
      sizes: {
        small: "小",
        medium: "中",
        large: "大"
      },
      tabs: {
        primary_category: "按主分类看",
        resource_type_tags: "按资源形态看",
        action_tags: "按使用动作看"
      },
      viewDescriptions: {
        primary_category: "看你的知识和生活领域：设计、艺术、工具、学习、办事入口、机构平台等。",
        resource_type_tags: "看每个链接是什么形态：工具、文章、作品集、社群、机构官网、课程、插件或账号入口。",
        action_tags: "看你下次回来可能要做什么：阅读、学习、尝试、监控、参考、复核或清理。"
      },
      linked: "条关联参考",
      profileEyebrow: "信息镜子",
      profileViewEyebrow: "信息镜子",
      profileViewTitle: "从书签看见你的注意力结构。",
      profileViewBody:
        "这个视角把收藏链接变成轻量自画像：地域语境、资源形态、回看方式、反复出现的兴趣点，以及下一步分类线索。",
      profileRegions: "地域语境",
      profileResourceMode: "资源形态",
      profileActionMode: "回看方式",
      profileNextRules: "下一步分类线索",
      evolutionViewEyebrow: "演化视角",
      evolutionViewTitle: "你的关注点如何随时间变化。",
      evolutionViewBody:
        "把时间线放回图谱里，长期变化就不再像单独报告，而是你信息身份的一部分。",
      evolutionPhases: "主要阶段",
      evolutionIntensity: "收藏强度",
      evolutionShifts: "阶段转向",
      evolutionShiftPrefix: "重心从"
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
    optimize: {
      eyebrow: "优化",
      title: "让信息库更干净，但不要变成额外作业。",
      body:
        "这里是系统维护层：AI 分类建议、不确定标签、冷存、规则学习、导出和偏好设置都放在这里，让主导航保持轻量。",
      queuesEyebrow: "复核队列",
      queuesTitle: "用小任务持续提高之后的检索质量",
      actionsEyebrow: "系统动作",
      actionsTitle: "让信息库可调、可迁移、可复用",
      cards: {
        reclassify: {
          title: "重归类建议",
          body: "把混乱的旧文件夹翻译成更干净的新分类。",
          href: "/reclassify"
        },
        review: {
          title: "轻量复核",
          body: "用短 session 确认低置信或过泛标签。",
          href: "/review"
        },
        cold: {
          title: "冷存检查",
          body: "查看过时、重复、当前低价值但仍可保留的资源。",
          href: "/cold-storage"
        },
        rules: {
          title: "规则学习",
          body: "把反复出现的域名和分类判断教给系统。",
          href: "/settings#optimization"
        },
        settings: {
          title: "偏好设置",
          body: "语言、工作流说明、来源计划和导出选项。",
          href: "/settings"
        },
        export: {
          title: "导出信息库",
          body: "下载精选 JSON 或 CSV，方便备份和迁移。",
          href: "/api/export?type=curated&format=json"
        }
      },
      metricLabels: {
        taxonomyGroups: "分类组",
        lowConfidence: "低置信",
        coldLinks: "冷存链接",
        genericReferences: "过泛参考",
        domains: "域名",
        curatedLinks: "精选链接"
      },
      open: "打开"
    },
    review: {
      eyebrow: "复核工作流",
      title: "把不确定的书签转成更清晰的信息资产。",
      body:
        "这个页面集中处理低置信分类、过泛资源、值得监控的来源和清理队列。目标不是增加整理负担，而是用很小的复核动作持续提高检索和画像质量。",
      metrics: {
        total: "总量",
        needsReview: "待归类",
        lowConfidence: "低置信",
        genericReference: "过泛参考",
        monitor: "可监控",
        cleanup: "待清理"
      },
      priorityEyebrow: "复核队列",
      priorityTitle: "先处理最不确定的资源",
      priorityBody:
        "这些链接缺少清晰分类证据、资源类型过泛，或下一步动作不明确。复核它们会直接提升后续搜索、回看和个人画像质量。",
      lowConfidenceTitle: "低置信分类",
      genericReferenceTitle: "过泛参考清理",
      session: {
        eyebrow: "5 分钟整理",
        title: "一次只处理一小批，然后停。",
        body:
          "只做能提升找回效率的判断：接受建议、加入监控、之后清理，或跳过。目标不是完美编目，而是让信息库慢慢变准。",
        progress: "本轮进度",
        left: "条还在队列里",
        category: "建议分类",
        resourceType: "资源类型",
        note: "可选备注",
        why: "为什么值得处理",
        accept: "接受建议",
        monitor: "加入监控",
        cleanup: "之后清理",
        skip: "跳过",
        open: "打开页面",
        doneTitle: "这一小批已经清完。",
        doneBody: "你可以导出本地决策，或者之后再回来处理下一小批。",
        localOnly: "原型说明：这些决策先保存在当前浏览器本地，之后可以沉淀成 taxonomy 规则。",
        export: "导出决策",
        learnedRule: "已记住：{domain} 更偏向 {category} / {resourceType}。",
        learnedMonitor: "已记住：{domain} 可能值得作为新知来源持续关注。",
        learnedSkip: "已跳过：系统不会把这条作为规则信号。"
      }
    },
    collections: {
      eyebrow: "智能集合",
      items: "条",
      openSearch: "作为搜索打开",
      backHome: "回到首页",
      recommended: "推荐列表",
      recommendedTitle: "按快速回用排序",
      recommendedBody:
        "排序会综合当前价值、分类置信度、重复关注、来源重要性和主题信号，让你更快回到有用资源。",
      subgroups: "二级分组",
      subgroupsTitle: "按实际用途继续缩小",
      allItems: "全部资源"
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
      collection: "使用集合",
      group: "二级分组",
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
      eyebrow: "新知速览",
      title: "追踪关键 UX / 产品来源，形成轻量学习更新。",
      body:
        "这个页面是轻量版的新知来源列表，后面可以继续接成自动摘要、推送 digest，以及可分享的学习看板。",
      live: "新知来源列表",
      fallback: "如果某个来源暂时无法抓取，看板仍会保留来源本身，保证你的工作流稳定。"
    },
    settings: {
      eyebrow: "设置",
      title: "让系统保持精简、可维护，并支持中英文切换。",
      language: "语言",
      languageBody: "在中文和英文之间切换界面。选择会保存在当前浏览器。",
      optimization: {
        eyebrow: "优化任务",
        title: "用很短的引导流程改善信息库。",
        body:
          "这类事情本质上是维护成本，所以不放在首页打扰你。目标不是一次整理完，而是每次顺手完成一小批。",
        needsCategory: "分类不清",
        lowConfidence: "规则置信度低",
        genericReference: "资源类型过泛",
        guideEyebrow: "5 分钟流程",
        steps: [
          "1. 先打开数量最多的一个队列。",
          "2. 只看标题、域名和当前标签，不做深度阅读。",
          "3. 修正或确认一小批，然后停止。"
        ],
        start: "开始引导整理"
      },
      learning: {
        eyebrow: "系统学习",
        title: "系统观察到的整理习惯",
        body:
          "这块不放首页。你做过几次轻量复核后，系统只把可能沉淀成长期规则的模式拿出来给你确认。",
        categoryRule: "{domain} → 更常归为 {value}",
        resourceRule: "{domain} → 更常视作 {value}",
        monitorRule: "{domain} → 可考虑作为新知来源监控",
        confidence: {
          early: "早期信号",
          medium: "重复信号",
          strong: "强信号"
        },
        examples: "个例子",
        basedOn: "基于：",
        approve: "确认",
        approvedState: "已确认",
        ignore: "忽略",
        approved: "条已确认",
        empty: "先完成几次 5 分钟整理；当系统发现稳定模式后，会在这里显示规则建议。",
        localOnly: "原型说明：确认结果先保存在当前浏览器本地。之后可以写入 taxonomy 规则或 agent 记忆。"
      },
      workflow: "长期使用方式",
      workflowBody:
        "更新流程：重新导出 Chrome 书签 HTML，运行解析脚本，刷新仪表盘，然后导出精选收藏目录用于分享。",
      sources: "新知来源维护",
      sourcesBody:
        "UX 新知来源保存在本地配置里。你可以随着阶段性研究重点增减来源。"
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
