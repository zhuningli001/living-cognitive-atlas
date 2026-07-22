import Link from "next/link";
import { getDashboardData, getReviewData, getUserProfileData } from "@/lib/data";

function percent(count, total) {
  if (!total) return "0%";
  return `${Math.round((count / total) * 100)}%`;
}

function asList(items, limit = 5) {
  return items.slice(0, limit).map((item) => item.label).join(" / ");
}

function getPieSegments(dimensions) {
  const total = dimensions.reduce((sum, dimension) => sum + dimension.share, 0) || 1;
  const colors = ["#3f5a4b", "#9ca88f", "#cdbda3", "#8e5f4d", "#e3dacc"];
  let cursor = 0;

  return dimensions.map((dimension, index) => {
    const start = cursor;
    const size = (dimension.share / total) * 100;
    cursor += size;

    return {
      ...dimension,
      color: colors[index % colors.length],
      start,
      end: cursor
    };
  });
}

function getPieBackground(segments) {
  if (!segments.length) {
    return "conic-gradient(#d8d0bf 0 100%)";
  }

  return `conic-gradient(${segments
    .map((segment) => `${segment.color} ${segment.start.toFixed(2)}% ${segment.end.toFixed(2)}%`)
    .join(", ")})`;
}

export default async function ProfilePage() {
  const profile = getUserProfileData();
  const dashboard = getDashboardData();
  const review = getReviewData();
  const total = dashboard.totals.total;
  const dimensionSegments = getPieSegments(profile.dimensions);
  const pieBackground = getPieBackground(dimensionSegments);
  const confidenceCaveat = `${review.totals.lowConfidence} low-confidence links (${percent(review.totals.lowConfidence, total)}) still need human confirmation.`;
  const reviewCaveat = `${review.totals.needsReview} links are still in Needs Review, so the portrait should be read as a working hypothesis.`;
  const sourceCaveat = "Bookmarks reveal information behavior and attention patterns; they should not be treated as a full personality diagnosis.";

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-black/5 bg-white/75 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">MVP profile board</p>
        <h2 className="mt-3 max-w-4xl font-serif text-5xl leading-none text-ink">{profile.headline}</h2>
        <p className="mt-5 max-w-4xl text-base leading-8 text-ink/68">{profile.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <MetricPill label="Bookmarks read" value={total} />
          <MetricPill label="Domains" value={dashboard.totals.uniqueDomains} />
          <MetricPill label="Interest phases" value={dashboard.evolutionStages.length} />
          <MetricPill label="Review queue" value={review.priorityItems.length} />
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="#growth-path" className="rounded-full bg-pine px-5 py-3 text-sm text-white shadow-atlas transition hover:bg-pine/90">
            View growth path
          </Link>
          <Link href="#dimension-details" className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/70 transition hover:bg-white">
            Read profile mix
          </Link>
          <Link href="/panel" className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/70 transition hover:bg-white">
            Side panel preview
          </Link>
          <Link href="/profile/import" className="rounded-full border border-black/5 bg-paper/80 px-5 py-3 text-sm text-ink/70 transition hover:bg-white">
            Import snapshot
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.16fr_0.84fr]">
        <div id="growth-path" className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-rust/60">Development line</p>
              <h3 className="mt-2 font-serif text-3xl text-ink">A linear growth path through saved attention</h3>
            </div>
            <a href="#development-details" className="text-sm text-rust underline decoration-rust/25 underline-offset-4">
              Details
            </a>
          </div>
          <ProfileTimeline stages={dashboard.evolutionStages} compact />
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-rust/60">Dominant dimensions</p>
              <h3 className="mt-2 font-serif text-3xl leading-tight text-ink">Profile mix</h3>
            </div>
            <a href="#dimension-details" className="text-sm text-rust underline decoration-rust/25 underline-offset-4">
              Details
            </a>
          </div>
          <ProfilePie segments={dimensionSegments} background={pieBackground} signalCount={profile.dimensions.length} compact />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.22em] text-rust/60">Core keywords</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">What the archive keeps returning to</h3>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.interests.slice(0, 12).map((interest) => (
              <Link
                key={interest.label}
                href={`/search?tag=${encodeURIComponent(interest.label)}`}
                className="rounded-full border border-black/5 bg-paper/75 px-3 py-1.5 text-sm text-ink/62 transition hover:border-pine/20 hover:bg-white"
              >
                {interest.label} · {interest.count}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.22em] text-rust/60">Source structure</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">Where the signal comes from</h3>
          <div className="mt-5 space-y-3">
            {dashboard.topDomains.slice(0, 7).map((domain) => (
              <SignalBar key={domain.label} label={domain.label} count={domain.count} total={total} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <RhythmPanel title="Resource mode" items={profile.rhythm.topResourceTypes} total={total} />
        <RhythmPanel title="Return action" items={profile.rhythm.topActions} total={total} />
        <RhythmPanel title="Save intent" items={profile.rhythm.topSaveIntents} total={total} />
      </section>

      <section id="development-details" className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas scroll-mt-28">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-rust/60">Development line</p>
            <h3 className="mt-2 font-serif text-3xl text-ink">A linear growth path through saved attention</h3>
          </div>
          <p className="max-w-xl text-sm leading-7 text-ink/58">
            These stages are generated from saved years and dominant tags. They are useful for reflection, not final autobiography.
          </p>
        </div>
        <ProfileTimeline stages={dashboard.evolutionStages} />
      </section>

      <section id="dimension-details" className="scroll-mt-28 rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-rust/60">Dominant dimensions</p>
            <h3 className="mt-2 font-serif text-3xl text-ink">Profile mix, with evidence weight</h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-ink/52">
            The chart shows signal strength; the rows explain only the most useful evidence.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <ProfilePie segments={dimensionSegments} background={pieBackground} signalCount={profile.dimensions.length} />
          <div className="divide-y divide-black/5 rounded-[1.25rem] border border-black/5 bg-paper/55">
            {profile.dimensions.map((dimension) => (
              <DimensionRow key={dimension.label} dimension={dimension} />
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-black/5 pt-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pine/70">Caveats</p>
            <div className="mt-2 grid gap-2 text-sm leading-6 text-ink/58 md:grid-cols-3 lg:grid-cols-1">
              <p>{sourceCaveat}</p>
              <p>{confidenceCaveat}</p>
              <p>{reviewCaveat}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pine/70">Next rules</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {(profile.classificationLeads.length ? profile.classificationLeads : ["No urgent rule gaps detected yet."]).slice(0, 4).map((lead) => (
                <p key={lead} className="rounded-[1rem] border border-pine/10 bg-sage/10 p-3 text-sm leading-6 text-ink/62">
                  {lead}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.22em] text-rust/60">MVP interpretation</p>
        <h3 className="mt-2 font-serif text-3xl text-ink">Current portrait in one line</h3>
        <p className="mt-4 text-base leading-8 text-ink/68">
          This archive currently points toward {asList(profile.dimensions, 3).toLowerCase()}, supported by source patterns such as {asList(dashboard.topDomains, 4)}.
        </p>
      </section>
    </div>
  );
}

function TimelineStage({ stage, index, totalStages, compact = false }) {
  const isLast = index === totalStages - 1;
  const nodeSize = compact ? "h-12 w-12" : "h-14 w-14";

  return (
    <article className="min-w-0">
      <div className="flex items-center">
        <div className={`relative z-10 grid shrink-0 place-items-center rounded-full border font-serif ${nodeSize} ${isLast ? "border-pine bg-pine text-white" : "border-black/10 bg-paper text-ink"}`}>
          <span className={compact ? "text-base" : "text-lg"}>{stage.range.split("-").at(-1)}</span>
        </div>
        {index < totalStages - 1 ? <div className="h-px flex-1 bg-pine/35" /> : null}
      </div>
      <div className={`mt-4 border-l pl-3 text-left ${isLast ? "border-pine/45" : "border-black/10"}`}>
        <p className="text-[10px] uppercase tracking-[0.18em] text-rust/55">{stage.range}</p>
        <h4 className={`mt-1 font-serif leading-tight text-ink ${compact ? "text-lg" : "text-xl"}`}>{stage.label}</h4>
        {!compact ? <p className="mt-2 text-xs leading-5 text-ink/58">{stage.narrative}</p> : <p className="mt-1 truncate text-xs text-ink/45">{stage.topWorldview}</p>}
      </div>
    </article>
  );
}

function ProfileTimeline({ stages, compact = false }) {
  if (compact) {
    return (
      <div className="mt-5">
        <div className="hidden md:grid md:grid-cols-4 md:gap-x-0">
          {stages.map((stage, index) => (
            <TimelineStage key={stage.range} stage={stage} index={index} totalStages={stages.length} compact />
          ))}
        </div>
        <div className="space-y-3 md:hidden">
          {stages.map((stage) => (
            <MobileTimelineStage key={stage.range} stage={stage} compact />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block mt-8">
        <div className="grid grid-cols-4 gap-x-0 gap-y-4">
          {stages.map((stage, index) => (
            <TimelineStage key={stage.range} stage={stage} index={index} totalStages={stages.length} />
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-4 lg:hidden">
        {stages.map((stage) => (
          <MobileTimelineStage key={stage.range} stage={stage} />
        ))}
      </div>
    </>
  );
}

function MobileTimelineStage({ stage, compact = false }) {
  if (compact) {
    return (
      <article className="grid grid-cols-[46px_1fr] items-start gap-3">
        <div className="flex flex-col items-center">
          <div className="font-serif text-lg leading-none text-ink">{stage.range.split("-").at(-1)}</div>
          <div className="mt-2 h-9 w-px bg-pine/25" />
        </div>
        <div className="pb-3 text-left">
          <p className="text-[10px] uppercase tracking-[0.18em] text-rust/55">{stage.range}</p>
          <h4 className="mt-1 font-serif text-xl leading-tight text-ink">{stage.label}</h4>
        </div>
      </article>
    );
  }

  return (
    <article className="grid grid-cols-[44px_1fr] gap-3">
      <div className="flex flex-col items-center">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-pine bg-paper font-serif text-sm text-ink">
          {stage.range.split("-").at(-1)}
        </div>
        <div className="mt-2 h-full min-h-12 w-px bg-black/10" />
      </div>
      <div className="rounded-[1rem] border border-black/5 bg-paper/70 p-4 text-left">
        <p className="text-xs uppercase tracking-[0.18em] text-rust/55">{stage.range}</p>
        <h4 className="mt-1 font-serif text-xl leading-tight text-ink">{stage.label}</h4>
        {!compact ? <p className="mt-2 text-sm leading-6 text-ink/60">{stage.narrative}</p> : null}
      </div>
    </article>
  );
}

function ProfilePie({ segments, background, signalCount, compact = false }) {
  if (compact) {
    return (
      <div className="mt-5 grid items-center gap-5 md:grid-cols-[178px_1fr]">
        <div className="mx-auto grid aspect-square w-[168px] place-items-center rounded-full border border-black/5" style={{ background }}>
          <div className="grid h-[64%] w-[64%] place-items-center rounded-full border border-black/5 bg-white/90 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-rust/55">Mix</p>
              <p className="font-serif text-3xl leading-none text-ink">{signalCount}</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {segments.slice(0, 4).map((dimension) => (
            <div key={dimension.label} className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-black/5 pb-2 last:border-b-0">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: dimension.color }} />
                <span className="truncate text-sm text-ink/64">{dimension.label}</span>
              </div>
              <p className="font-serif text-xl leading-none text-ink">{dimension.share}%</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-[1.5rem] border border-black/5 bg-paper/70 ${compact ? "mt-5 p-4" : "p-5"}`}>
      <div
        className={`mx-auto grid aspect-square place-items-center rounded-full border border-black/5 p-5 shadow-inner ${compact ? "max-w-[190px]" : "max-w-[240px]"}`}
        style={{ background }}
      >
        <div className="grid h-[62%] w-[62%] place-items-center rounded-full border border-black/5 bg-white/90 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-rust/55">Profile mix</p>
            <p className="mt-1 font-serif text-3xl text-ink">{signalCount}</p>
            <p className="text-xs text-ink/45">signals</p>
          </div>
        </div>
      </div>
      <div className={`space-y-2 ${compact ? "mt-4" : "mt-5"}`}>
        {segments.slice(0, compact ? 4 : segments.length).map((dimension) => (
          <div key={dimension.label} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: dimension.color }} />
              <span className="truncate text-ink/62">{dimension.label}</span>
            </div>
            <span className="font-serif text-lg text-ink">{dimension.share}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DimensionRow({ dimension }) {
  return (
    <article className="grid gap-3 px-4 py-3 md:grid-cols-[1fr_92px] md:items-center">
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3 md:justify-start">
          <h4 className="truncate font-serif text-xl leading-tight text-ink">{dimension.label}</h4>
          <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-xs text-pine md:hidden">{dimension.share}%</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/55">{dimension.description}</p>
      </div>
      <div className="hidden md:block">
        <p className="text-right font-serif text-2xl leading-none text-ink">{dimension.share}%</p>
        <div className="mt-2 h-1.5 rounded-full bg-black/5">
          <div className="h-full rounded-full bg-pine/70" style={{ width: `${dimension.share}%` }} />
        </div>
      </div>
    </article>
  );
}

function MetricPill({ label, value }) {
  return (
    <span className="rounded-full border border-black/5 bg-paper/75 px-3 py-1.5 text-xs text-ink/54">
      {label} <span className="font-serif text-base text-ink">{Number(value).toLocaleString()}</span>
    </span>
  );
}

function SignalBar({ label, count, total }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-ink/66">{label}</span>
        <span className="font-serif text-lg text-ink">{count}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-black/5">
        <div className="h-full rounded-full bg-rust/70" style={{ width: percent(count, total) }} />
      </div>
    </div>
  );
}

function RhythmPanel({ title, items, total }) {
  return (
    <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
      <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{title}</p>
      <div className="mt-5 space-y-4">
        {items.slice(0, 5).map((item) => (
          <SignalBar key={item.label} label={item.label} count={item.count} total={total} />
        ))}
      </div>
    </section>
  );
}
