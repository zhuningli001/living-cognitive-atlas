import Link from "next/link";
import { getDashboardData, getReviewData, getSmartCollections, getUserProfileData } from "@/lib/data";

function percent(count, total) {
  if (!total) return "0%";
  return `${Math.round((count / total) * 100)}%`;
}

export default async function PanelPreviewPage() {
  const profile = getUserProfileData();
  const dashboard = getDashboardData();
  const review = getReviewData();
  const collections = getSmartCollections();
  const currentStage = dashboard.evolutionStages.at(-1);
  const topDimension = profile.dimensions[0];
  const total = dashboard.totals.total;
  const activeCollections = collections
    .filter((collection) => ["reading-learning", "tools-plugins", "inspiration-references", "sources-to-monitor"].includes(collection.slug))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[430px]">
      <section className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white/78 shadow-atlas">
        <div className="border-b border-black/5 bg-paper/70 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-rust/60">Chrome memory mirror</p>
              <h2 className="mt-1 font-serif text-2xl leading-tight text-ink">{profile.headline}</h2>
            </div>
            <span className="rounded-full border border-pine/15 bg-sage/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-pine">
              Local
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/58">
            {profile.summary}
          </p>
        </div>

        <div className="space-y-5 px-5 py-5">
          <section>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-rust/60">Now</p>
              <Link href="/profile" className="text-xs text-rust underline decoration-rust/25 underline-offset-4">
                Full profile
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-[76px_1fr] gap-3">
              <div className="grid aspect-square place-items-center rounded-full border border-pine/20 bg-paper font-serif text-2xl text-ink">
                {currentStage?.range.split("-").at(-1) ?? "Now"}
              </div>
              <div className="border-l border-black/10 pl-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-rust/55">{currentStage?.range ?? "Current"}</p>
                <h3 className="mt-1 font-serif text-xl leading-tight text-ink">{currentStage?.label ?? "Current phase"}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink/52">{currentStage?.topWorldview ?? topDimension?.label}</p>
              </div>
            </div>
          </section>

          <section>
            <p className="text-[10px] uppercase tracking-[0.2em] text-rust/60">Top interests</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.interests.slice(0, 7).map((interest) => (
                <Link
                  key={interest.label}
                  href={`/search?tag=${encodeURIComponent(interest.label)}`}
                  className="rounded-full border border-black/5 bg-paper/80 px-2.5 py-1 text-xs text-ink/62"
                >
                  {interest.label} · {interest.count}
                </Link>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <MiniMetric label="Bookmarks" value={total} />
            <MiniMetric label="Domains" value={dashboard.totals.uniqueDomains} />
          </section>

          <section>
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-rust/60">Profile mix</p>
              <span className="text-xs text-ink/45">{topDimension?.share ?? 0}% strongest</span>
            </div>
            <div className="mt-3 space-y-3">
              {profile.dimensions.slice(0, 3).map((dimension) => (
                <div key={dimension.label}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate text-ink/62">{dimension.label}</span>
                    <span className="font-serif text-base text-ink">{dimension.share}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-black/5">
                    <div className="h-full rounded-full bg-pine/70" style={{ width: `${dimension.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-rust/60">Return paths</p>
              <span className="text-xs text-ink/45">{activeCollections.length} quick doors</span>
            </div>
            <div className="mt-3 divide-y divide-black/5 rounded-[1rem] border border-black/5 bg-paper/65">
              {activeCollections.map((collection) => (
                <Link key={collection.slug} href={collection.href} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <span className="min-w-0 truncate text-sm text-ink/72">{collection.shortLabel}</span>
                  <span className="font-serif text-lg text-ink">{collection.count}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[1rem] border border-pine/10 bg-sage/10 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-pine/70">Review</p>
                <p className="mt-1 text-sm leading-5 text-ink/64">
                  {review.totals.lowConfidence} low-confidence links · {percent(review.totals.lowConfidence, total)}
                </p>
              </div>
              <Link href="/review" className="rounded-full bg-pine px-3 py-1.5 text-xs text-white">
                Start
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-[1rem] border border-black/5 bg-paper/70 p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-rust/50">{label}</p>
      <p className="mt-1 font-serif text-2xl text-ink">{Number(value).toLocaleString()}</p>
    </div>
  );
}
