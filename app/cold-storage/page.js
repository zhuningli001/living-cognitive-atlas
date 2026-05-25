import { BookmarkCard } from "@/components/bookmark-card";
import { getDashboardData } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

export default async function ColdStoragePage() {
  const { copy } = await getCopy("cold");
  const { coldStorage, statusCounts, duplicateClusters, totals } = getDashboardData();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {statusCounts.map((entry) => (
            <span key={entry.label} className="rounded-full border border-black/5 bg-paper/80 px-4 py-2 text-sm text-ink/70">
              {entry.label.replace("_", " ")}: {entry.count}
            </span>
          ))}
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-ink/62">
          {totals.duplicateClusters} duplicate clusters suggest recurring reference points you kept saving across years, folders, or phases of work. This section separates true residue from persistent obsessions.
        </p>
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{copy.repeats}</p>
            <h3 className="mt-2 font-serif text-3xl text-ink">{copy.repeatsTitle}</h3>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {duplicateClusters.slice(0, 8).map((cluster) => (
            <article key={cluster.id} className="rounded-atlas bg-paper/80 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-rust/55">{cluster.domain}</p>
                  <h4 className="mt-2 font-serif text-2xl leading-tight text-ink">{cluster.title}</h4>
                </div>
                <span className="rounded-full border border-black/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink/55">
                  {cluster.duplicateCount} saves
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-ink/65">
                Saved from {cluster.firstSavedYear ?? "unknown"} to {cluster.lastSavedYear ?? "unknown"} across {cluster.folders.length} folders.
              </p>
              <p className="mt-2 text-sm leading-7 text-ink/58">{cluster.transitionNarrative}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {cluster.worldview.map((tag) => (
                  <span key={tag} className="rounded-full bg-pine/10 px-3 py-1 text-xs text-pine">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {cluster.folders.slice(0, 3).map((folder) => (
                  <span key={folder} className="rounded-full border border-black/5 px-3 py-1 text-xs text-ink/60">
                    {folder}
                  </span>
                ))}
              </div>
              <a
                href={cluster.url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block text-sm text-rust underline decoration-rust/30 underline-offset-4"
              >
                Open recurring reference
              </a>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {coldStorage.slice(0, 60).map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}
