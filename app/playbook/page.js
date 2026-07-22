import Link from "next/link";
import { getLang } from "@/lib/i18n";

const content = {
  en: {
    eyebrow: "Product playbook",
    title: "Chrome Memory Mirror is a local-first personal cognition layer.",
    body:
      "This page is the compact public explanation: what the product does, how testers should use it, where feedback should go, and how each MVP loop should be judged.",
    primaryAction: "Read MVP loop",
    secondaryAction: "Release checklist",
    promiseTitle: "Core loop",
    promiseBody:
      "The product is not trying to reorganize bookmarks as the final goal. It turns saved links into an inspectable information portrait, then lets user feedback become better local rules.",
    loop: [
      "Scan Chrome bookmarks locally",
      "Show a compact personal dashboard",
      "Open the full cognitive profile",
      "Collect lightweight human corrections",
      "Promote repeated corrections into approved rules",
      "Improve future analysis without hiding the logic"
    ],
    mvpTitle: "MVP 1.2 target",
    mvpBody:
      "A first external tester should be able to install the unpacked extension, understand the privacy boundary, scan bookmarks, inspect the profile, correct mistakes, approve rules, export data, and clear local state without running the local web app.",
    priorities: [
      {
        label: "P0",
        title: "Complete extension-only loop",
        body: "Options page, report feedback, rule approval, empty states, language coverage, and local reset/export."
      },
      {
        label: "P1",
        title: "Better tester readiness",
        body: "Install guide, QA checklist, stale snapshot warning, compact panel hierarchy, and store screenshot plan."
      },
      {
        label: "P2",
        title: "Richer intelligence later",
        body: "Semantic search, AI summaries, source previews, dead-link checks, and optional cloud features only after trust is clear."
      }
    ],
    platformsTitle: "Where to test publicly",
    platformsBody:
      "Different platforms answer different questions. Start with controlled testers, then expand only after privacy copy and reset flows are solid.",
    platforms: [
      {
        name: "GitHub",
        fit: "Builders, early collaborators, technical testers",
        method: "README, Releases, Issues, Discussions, project board"
      },
      {
        name: "Chrome Web Store unlisted",
        fit: "Real installation testing with a private link",
        method: "Unlisted beta, privacy policy, versioned release notes"
      },
      {
        name: "Tally or Google Forms",
        fit: "Structured feedback from non-technical testers",
        method: "Install result, trust score, profile accuracy, confusion points"
      },
      {
        name: "Notion public page",
        fit: "A readable product log and tester handbook",
        method: "Roadmap, changelog, known limitations, tester instructions"
      },
      {
        name: "Discord, Slack, or Circle",
        fit: "Small community feedback over multiple iterations",
        method: "Tester cohort, weekly prompts, screenshot-based feedback"
      },
      {
        name: "Product Hunt, Reddit, Hacker News",
        fit: "Broader positioning validation after beta stability",
        method: "Launch story, demo video, privacy-first framing"
      }
    ],
    feedbackTitle: "Feedback prompts",
    feedback: [
      "Did the portrait feel recognizable?",
      "Which inference felt wrong or too confident?",
      "Could you explain where your data is stored?",
      "Would you open this side panel again next week?",
      "What should the system learn from your corrections?"
    ],
    reviewTitle: "Iteration review",
    reviewBody:
      "Every cycle should end with a decision. Keep what clearly helps, simplify what feels heavy, deepen what proves useful, and remove anything that weakens trust.",
    reviewLabels: ["Goal", "Changed", "Validated", "Friction", "Decision", "Next smallest step"],
    linksTitle: "Project documents",
    links: [
      { href: "/profile", label: "Live profile" },
      { href: "/optimize", label: "Rule learning" },
      { href: "/settings", label: "Settings" },
      { href: "https://github.com/zhuningli001/living-cognitive-atlas", label: "GitHub repository" }
    ]
  },
  zh: {
    eyebrow: "产品 Playbook",
    title: "Chrome Memory Mirror 是一个本地优先的个人认知层。",
    body:
      "这个页面是给测试者和合作者看的独立说明：产品到底做什么、测试时怎么看、反馈放在哪里，以及每一版 MVP 应该如何判断好坏。",
    primaryAction: "查看迭代方法",
    secondaryAction: "发布检查清单",
    promiseTitle: "核心闭环",
    promiseBody:
      "它不是把书签重新整理完就结束。真正目标是把保存过的链接变成可检查的信息画像，再让用户反馈逐步沉淀成本地规则。",
    loop: [
      "本地扫描 Chrome 书签",
      "生成极简个人 dashboard",
      "打开完整认知画像",
      "收集很轻的人工修正",
      "把重复修正转成可批准规则",
      "让未来分析变好，同时保留可解释性"
    ],
    mvpTitle: "MVP 1.2 目标",
    mvpBody:
      "第一个外部测试者应该可以不运行本地网页应用，只通过插件完成安装、理解隐私边界、扫描书签、查看画像、修正错误、批准规则、导出数据和清除本地状态。",
    priorities: [
      {
        label: "P0",
        title: "完成插件内闭环",
        body: "设置页、报告页反馈、规则批准、空状态、语言覆盖、本地清除和导出。"
      },
      {
        label: "P1",
        title: "提高测试准备度",
        body: "安装说明、QA 清单、过期 snapshot 提醒、小面板信息层级，以及商店截图计划。"
      },
      {
        label: "P2",
        title: "之后再增加智能层",
        body: "语义搜索、AI 摘要、来源预览、死链检查和云端能力，都应该在信任边界清楚之后再做。"
      }
    ],
    platformsTitle: "可以放到哪些更大的平台测试",
    platformsBody:
      "不同平台验证不同问题。先从可控测试者开始，等隐私说明和清除数据流程稳定后，再扩大范围。",
    platforms: [
      {
        name: "GitHub",
        fit: "开发者、早期合作者、技术测试者",
        method: "README、Releases、Issues、Discussions、项目看板"
      },
      {
        name: "Chrome Web Store unlisted",
        fit: "用私密链接测试真实安装流程",
        method: "非公开 beta、隐私政策、版本 release notes"
      },
      {
        name: "Tally 或 Google Forms",
        fit: "收集非技术用户的结构化反馈",
        method: "安装结果、信任评分、画像准确度、困惑点"
      },
      {
        name: "Notion 公开页",
        fit: "可读的产品日志和测试者手册",
        method: "路线图、更新记录、已知限制、测试步骤"
      },
      {
        name: "Discord、Slack 或 Circle",
        fit: "小范围社区连续反馈",
        method: "测试者群组、每周问题、截图反馈"
      },
      {
        name: "Product Hunt、Reddit、Hacker News",
        fit: "beta 稳定后验证更大范围定位",
        method: "发布故事、演示视频、本地隐私优先叙事"
      }
    ],
    feedbackTitle: "建议收集的反馈问题",
    feedback: [
      "这个画像像不像你？",
      "哪一个推断明显不对或过于自信？",
      "你能不能说清楚数据存在哪里？",
      "你下周还会不会打开这个侧边面板？",
      "系统应该从你的修正里学到什么？"
    ],
    reviewTitle: "迭代复盘",
    reviewBody:
      "每个周期都要落到一个决策：有用就保留，太重就简化，验证有效就深化，削弱信任就移除。",
    reviewLabels: ["目标", "改动", "验证", "阻力", "决策", "下一步最小动作"],
    linksTitle: "项目入口",
    links: [
      { href: "/profile", label: "查看画像" },
      { href: "/optimize", label: "规则学习" },
      { href: "/settings", label: "设置" },
      { href: "https://github.com/zhuningli001/living-cognitive-atlas", label: "GitHub 仓库" }
    ]
  }
};

export default async function PlaybookPage() {
  const lang = await getLang();
  const copy = content[lang];

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/78 p-7 shadow-atlas md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-rust/70">{copy.eyebrow}</p>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.04] text-ink text-balance md:text-6xl">
              {copy.title}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-ink/68">{copy.body}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#iteration" className="rounded-full bg-pine px-5 py-3 text-sm text-white shadow-atlas transition hover:bg-pine/90">
                {copy.primaryAction}
              </a>
              <a href="#platforms" className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/70 transition hover:bg-white">
                {copy.secondaryAction}
              </a>
            </div>
          </div>

          <div className="border-l border-black/10 pl-6">
            <p className="text-xs uppercase tracking-[0.24em] text-rust/55">{copy.promiseTitle}</p>
            <p className="mt-3 text-sm leading-7 text-ink/62">{copy.promiseBody}</p>
            <ol className="mt-5 space-y-3">
              {copy.loop.map((item, index) => (
                <li key={item} className="grid grid-cols-[2.25rem_1fr] items-start gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-pine/25 bg-paper text-xs text-pine">
                    {index + 1}
                  </span>
                  <span className="border-b border-black/5 pb-3 text-sm leading-6 text-ink/72">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="iteration" className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-black/5 bg-[#efe9dc]/80 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">MVP 1.2</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.mvpTitle}</h3>
          <p className="mt-4 text-sm leading-7 text-ink/66">{copy.mvpBody}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {copy.priorities.map((priority) => (
            <article key={priority.label} className="rounded-[1.25rem] border border-black/5 bg-white/72 p-5 shadow-atlas">
              <p className="text-xs uppercase tracking-[0.2em] text-rust/55">{priority.label}</p>
              <h4 className="mt-3 font-serif text-2xl leading-tight text-ink">{priority.title}</h4>
              <p className="mt-3 text-sm leading-6 text-ink/60">{priority.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="platforms" className="rounded-[2rem] border border-black/5 bg-white/74 p-6 shadow-atlas md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">Testing channels</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.platformsTitle}</h3>
          <p className="mt-3 text-sm leading-7 text-ink/62">{copy.platformsBody}</p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {copy.platforms.map((platform) => (
            <article key={platform.name} className="rounded-[1.15rem] border border-black/5 bg-paper/68 p-5">
              <h4 className="font-serif text-2xl leading-tight text-ink">{platform.name}</h4>
              <p className="mt-3 text-sm leading-6 text-ink/62">{platform.fit}</p>
              <p className="mt-4 border-t border-black/5 pt-4 text-xs uppercase tracking-[0.16em] text-rust/55">{platform.method}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-black/5 bg-white/74 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">Feedback</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.feedbackTitle}</h3>
          <div className="mt-5 space-y-3">
            {copy.feedback.map((item) => (
              <p key={item} className="rounded-full border border-black/5 bg-paper/70 px-4 py-3 text-sm text-ink/68">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-night p-6 text-paper shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-sand">{copy.reviewTitle}</p>
          <p className="mt-3 text-sm leading-7 text-paper/72">{copy.reviewBody}</p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {copy.reviewLabels.map((label) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-paper/78">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-[#efe9dc]/70 p-6 shadow-atlas md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{copy.linksTitle}</p>
          <p className="mt-2 text-sm leading-7 text-ink/62">
            docs/mvp-iteration-loop.md · docs/public-extension-release-plan.md · docs/privacy-policy-draft.md
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {copy.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-black/5 bg-white/60 px-4 py-2 text-sm text-ink/70 transition hover:bg-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
