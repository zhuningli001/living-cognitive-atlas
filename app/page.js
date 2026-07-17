import Link from "next/link";
import { BookmarkCard, PreviewFrame } from "@/components/bookmark-card";
import { StatCard } from "@/components/stat-card";
import { getDashboardData } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

export default async function HomePage() {
  const { copy } = await getCopy("home");
  const data = getDashboardData();

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <div className="space-y-6">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-rust/70">{copy.heroEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl leading-[1.08] text-balance text-ink md:text-5xl">
                {copy.heroTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink/72">
                {copy.heroBody}
              </p>
            </div>

            <div className="rounded-atlas border border-black/5 bg-paper/80 p-5">
              <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{copy.quickActions}</p>
                  <h3 className="mt-2 font-serif text-2xl text-ink">{copy.workflowTitle}</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {copy.workflowItems.map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-6 text-ink/68">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pine" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="/search" className="rounded-full bg-pine px-4 py-2 text-sm text-white">
                  {copy.openSearch}
                </a>
                <a href="/signals" className="rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm text-ink/70">
                  {copy.openSignals}
                </a>
                <a href="/settings" className="rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm text-ink/70">
                  {copy.openSettings}
                </a>
                <a href="/api/export?type=curated&format=json" className="rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm text-ink/70">
                  {copy.openExport}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="atlas-grid rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/70">{copy.connectionEyebrow}</p>
          <div className="mt-4 rounded-atlas border border-black/5 bg-paper/80 p-4">
            <div className="mt-5 space-y-3">
              {data.categoryPaths.map((path) => (
                <div key={`${path.category}-${path.resourceType}-${path.action}`} className="flex items-center gap-3 text-sm text-ink/65">
                  <Link
                    href={`/search?category=${encodeURIComponent(path.category)}`}
                    className="max-w-28 rounded-xl bg-pine/10 px-3 py-1.5 leading-snug text-pine transition hover:bg-pine/15"
                  >
                    {path.category}
                  </Link>
                  <span className="text-ink/35">→</span>
                  <Link
                    href={`/search?resourceType=${encodeURIComponent(path.resourceType)}`}
                    className="rounded-full bg-rust/10 px-3 py-1 text-rust transition hover:bg-rust/15"
                  >
                    {path.resourceType}
                  </Link>
                  <span className="text-ink/35">→</span>
                  <Link
                    href={`/search?action=${encodeURIComponent(path.action)}`}
                    className="rounded-full border border-black/5 px-3 py-1 text-ink/60 transition hover:bg-white"
                  >
                    {path.action}
                  </Link>
                  <Link
                    href={`/search?category=${encodeURIComponent(path.category)}&resourceType=${encodeURIComponent(path.resourceType)}&action=${encodeURIComponent(path.action)}`}
                    className="ml-auto text-xs text-ink/45 underline decoration-black/15 underline-offset-4"
                  >
                    {path.count} links
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={copy.stats.bookmarks} value={data.totals.total.toLocaleString()} detail="Parsed from the exported Chrome archive." />
        <StatCard label={copy.stats.domains} value={data.totals.uniqueDomains.toLocaleString()} detail="The breadth of your long-term input surface." />
        <StatCard label={copy.stats.worldview} value={data.totals.worldviewClusters} detail="A first-pass semantic layer generated from rules." />
        <StatCard label={copy.stats.duplicates} value={data.totals.duplicateClusters} detail="Links repeatedly saved across time or folders." />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{copy.categoryEyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.categoryTitle}</h3>
          <div className="mt-6 space-y-4">
            {data.featuredCategories.map((category) => (
              <article key={category.label} className="rounded-atlas border border-black/5 bg-paper/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <Link href={`/search?category=${encodeURIComponent(category.label)}`} className="font-serif text-2xl text-ink">
                    {category.label}
                  </Link>
                  <span className="text-sm text-ink/50">{category.count}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {category.resourceTypes.map((tag) => (
                    <Link key={tag} href={`/search?category=${encodeURIComponent(category.label)}&resourceType=${encodeURIComponent(tag)}`} className="rounded-full bg-pine/10 px-3 py-1 text-xs text-pine">
                      {tag}
                    </Link>
                  ))}
                  {category.actions.map((tag) => (
                    <Link key={tag} href={`/search?category=${encodeURIComponent(category.label)}&action=${encodeURIComponent(tag)}`} className="rounded-full border border-black/5 px-3 py-1 text-xs text-ink/60">
                      {tag}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{copy.curatedEyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.curatedTitle}</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {data.representativeTags.map((entry) => (
              <Link
                key={entry.label}
                href={`/search?tag=${encodeURIComponent(entry.label)}`}
                className="rounded-full border border-black/5 bg-paper/80 px-4 py-2 text-sm text-ink/70 transition hover:-translate-y-0.5 hover:border-pine/20 hover:bg-white hover:text-pine"
              >
                {entry.label} · {entry.count}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{copy.exportsEyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.exportsTitle}</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/api/export?type=curated&format=json" className="rounded-full bg-pine px-4 py-3 text-sm text-white">
              {copy.exportCurated}
            </a>
            <a href="/api/export?type=curated&format=csv" className="rounded-full border border-black/5 bg-paper/80 px-4 py-3 text-sm text-ink/70">
              {copy.exportCsv}
            </a>
            <a href="/api/export?type=all&format=json" className="rounded-full border border-black/5 bg-paper/80 px-4 py-3 text-sm text-ink/70">
              {copy.exportAll}
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-rust/60">Timeline 2011-2026</p>
              <h3 className="mt-2 font-serif text-3xl text-ink">Evolution by year</h3>
            </div>
            <p className="text-sm text-ink/60">Bookmark volume as a proxy for active curiosity cycles.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            {data.timeline.map((point) => (
              <div key={point.year} className="rounded-atlas bg-paper/80 p-4">
                <div className="timeline-line h-24 rounded-full" style={{ opacity: 0.35 + point.count / 120 }} />
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-ink/45">{point.year}</p>
                <p className="font-serif text-2xl text-ink">{point.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">Primary Categories</p>
          <div className="mt-5 space-y-4">
            {data.worldviewCounts.slice(0, 6).map((entry) => (
              <div key={entry.label}>
                <div className="flex items-center justify-between text-sm text-ink/65">
                  <Link href={`/search?category=${encodeURIComponent(entry.label)}`} className="hover:text-pine">
                    {entry.label}
                  </Link>
                  <span>{entry.count}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-pine" style={{ width: `${Math.min((entry.count / data.totals.total) * 300, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-rust/60">Rediscovery</p>
              <h3 className="mt-2 font-serif text-3xl text-ink">Older links worth returning to</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {data.rediscovery.slice(0, 4).map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} showPreview />
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">Moodboard</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.moodboardTitle}</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink/62">{copy.moodboardBody}</p>
          <div className="mt-6 space-y-4">
            {data.visualDirections.map((direction) => (
              <div key={direction.label} className="rounded-atlas border border-black/5 bg-paper/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href={`/search?tag=${encodeURIComponent(direction.label)}`}
                    className="font-serif text-2xl text-ink underline decoration-black/10 underline-offset-4"
                  >
                    {direction.label}
                  </Link>
                  <span className="text-xs uppercase tracking-[0.18em] text-ink/42">{direction.count} saved references</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {direction.bookmarks.map((bookmark) => (
                    <a
                      key={bookmark.id}
                      href={bookmark.url}
                      target="_blank"
                      rel="noreferrer"
                      className="overflow-hidden rounded-[1.1rem] border border-black/5 bg-white/80 transition hover:-translate-y-0.5 hover:border-rust/20"
                    >
                      <PreviewFrame url={bookmark.url} title={bookmark.title} ratio="aspect-[4/3]" />
                      <div className="p-3">
                        <p className="min-h-[3rem] text-sm leading-6 text-ink">{bookmark.title}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
