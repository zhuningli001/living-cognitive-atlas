import Link from "next/link";
import { AttentionMap } from "@/components/attention-map";
import { BookmarkCard } from "@/components/bookmark-card";
import { CollectionIllustration } from "@/components/collection-illustration";
import { getDashboardData } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

export default async function HomePage() {
  const { copy } = await getCopy("home");
  const data = getDashboardData();
  const monitorCollection = data.smartCollections.find((collection) => collection.slug === "sources-to-monitor");
  const toolsCollection = data.smartCollections.find((collection) => collection.slug === "tools-plugins");
  const visibleCollections = data.smartCollections.filter((collection) => collection.slug !== "review-cleanup").slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/75 p-7 shadow-atlas">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-sage/15 blur-2xl" />
          <p className="relative text-xs uppercase tracking-[0.28em] text-rust/70">{copy.heroEyebrow}</p>
          <h2 className="relative mt-3 font-serif text-4xl leading-[1.02] text-balance text-ink md:text-6xl">
            {copy.heroTitle}
          </h2>
          <p className="relative mt-5 max-w-2xl text-base leading-8 text-ink/70">
            {copy.heroBody}
          </p>
          <div className="relative mt-7 flex flex-wrap gap-3">
            <Link href="/search" className="rounded-full bg-pine px-5 py-3 text-sm text-white shadow-atlas transition hover:bg-pine/90">
              {copy.searchAction}
            </Link>
            <Link href="/signals" className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/70 transition hover:bg-white">
              {copy.signalsAction}
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-[#efe9dc]/85 p-5 text-ink shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/55">{copy.focusStripEyebrow}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SignalTile label={copy.stats.bookmarks} value={data.totals.total} />
            <SignalTile label={copy.metrics.tools} value={toolsCollection?.count ?? 0} />
            <SignalTile label={copy.metrics.monitor} value={monitorCollection?.count ?? 0} />
          </div>
          <div className="mt-5 rounded-[1.35rem] border border-black/5 bg-white/55 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-rust/45">{copy.todaysReturnEyebrow}</p>
            <h3 className="mt-2 font-serif text-2xl text-ink">{copy.todaysReturnTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/58">{copy.todaysReturnBody}</p>
            <div className="mt-4 space-y-3">
              {data.rediscovery.slice(0, 3).map((bookmark) => (
                <a
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-black/5 bg-paper/70 p-3 transition hover:bg-white"
                >
                  <p className="line-clamp-2 text-sm leading-5 text-ink/76">{bookmark.title}</p>
                  <p className="mt-1 text-xs text-ink/42">{bookmark.domain}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-pine/70">
                    {copy.whyNow} · {getRediscoveryReason(bookmark, copy)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AttentionMap maps={data.attentionMaps} copy={copy} />

      <section className="py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{copy.smartCollectionsEyebrow}</p>
            <h3 className="mt-2 font-serif text-3xl text-ink">{copy.smartCollectionsTitle}</h3>
          </div>
          <p className="max-w-xl text-sm leading-7 text-ink/62">{copy.smartCollectionsBody}</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCollections.map((collection) => (
            <Link
              key={collection.slug}
              href={collection.href}
              className="group relative overflow-hidden rounded-[1.35rem] border border-black/5 bg-paper/70 p-3.5 transition hover:-translate-y-0.5 hover:border-pine/20 hover:bg-white hover:shadow-atlas"
            >
              <div className="flex items-center gap-3">
                <CollectionIllustration slug={collection.slug} />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-rust/55">{collection.shortLabel}</p>
                  <h4 className="mt-1 truncate font-serif text-xl leading-tight text-ink">{collection.label}</h4>
                </div>
              </div>
              <div className="relative mt-3 flex items-center justify-between gap-3">
                <p className="text-xs leading-5 text-ink/52">{collection.count} links</p>
                <div className="flex min-w-0 flex-wrap justify-end gap-1.5">
                  {collection.subgroups.filter((group) => group.count > 0).slice(0, 2).map((group) => (
                    <span key={group.label} className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] text-ink/45">
                      {group.label}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{copy.deeperEyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.deeperTitle}</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <DeepLink href="/atlas" title={copy.atlasLink} body={copy.atlasBody} />
            <DeepLink href="/evolution" title={copy.evolutionLink} body={copy.evolutionBody} />
            <DeepLink href="/settings#optimization" title={copy.optimizeLink} body={copy.optimizeBody} />
            <DeepLink href="/api/export?type=curated&format=json" title={copy.exportCurated} body={copy.exportBody} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{copy.rediscoveryEyebrow}</p>
              <h3 className="mt-2 font-serif text-3xl text-ink">{copy.rediscoveryTitle}</h3>
            </div>
            <Link href="/search?status=rediscover" className="text-sm text-rust underline decoration-rust/25 underline-offset-4">
              {copy.openCollection}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {data.rediscovery.slice(0, 3).map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} showPreview showReason reasonLabel={copy.whyRecommended} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SignalTile({ label, value }) {
  return (
    <div className="rounded-[1.2rem] border border-black/5 bg-white/45 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink/42">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink">{Number(value).toLocaleString()}</p>
    </div>
  );
}

function DeepLink({ href, title, body }) {
  return (
    <Link href={href} className="rounded-atlas border border-black/5 bg-paper/80 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-atlas">
      <h4 className="font-serif text-2xl text-ink">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-ink/58">{body}</p>
    </Link>
  );
}

function getRediscoveryReason(bookmark, copy) {
  const topics = Array.isArray(bookmark.canonical_topics) ? bookmark.canonical_topics : [];

  if (topics.length) {
    return `${copy.reasonTopicPrefix} ${topics.slice(0, 2).join(" / ")}.`;
  }

  if (bookmark.usefulness_reason) {
    return bookmark.usefulness_reason;
  }

  return copy.reasonFallback;
}
