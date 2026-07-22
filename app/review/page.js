import Link from "next/link";
import { BookmarkShell } from "@/components/bookmark-shell";
import { ReviewSession } from "@/components/review-session";
import { getReviewData } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

export default async function ReviewPage() {
  const { copy } = await getCopy("review");
  const data = getReviewData();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink/68">{copy.body}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Metric label={copy.metrics.total} value={data.totals.total} />
          <Metric label={copy.metrics.needsReview} value={data.totals.needsReview} />
          <Metric label={copy.metrics.lowConfidence} value={data.totals.lowConfidence} />
          <Metric label={copy.metrics.genericReference} value={data.totals.genericReference} />
          <Metric label={copy.metrics.monitor} value={data.totals.monitorCandidates} />
          <Metric label={copy.metrics.cleanup} value={data.totals.cleanupCandidates} />
        </div>
      </section>

      <ReviewSession items={data.priorityItems.slice(0, 24)} copy={copy} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {data.queues.map((queue) => (
          <Link
            key={queue.id}
            href={queue.href}
            className="rounded-atlas border border-black/5 bg-white/70 p-5 shadow-atlas transition hover:-translate-y-0.5 hover:border-pine/20 hover:bg-white"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{queue.label}</p>
            <p className="mt-3 font-serif text-4xl text-ink">{queue.count}</p>
            <p className="mt-3 text-sm leading-6 text-ink/62">{queue.description}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{copy.priorityEyebrow}</p>
            <h3 className="mt-2 font-serif text-3xl text-ink">{copy.priorityTitle}</h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-ink/58">{copy.priorityBody}</p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {data.priorityItems.slice(0, 12).map((bookmark) => (
            <ReviewCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ReviewColumn id="low-confidence" title={copy.lowConfidenceTitle} items={data.lowConfidence} />
        <ReviewColumn id="generic-reference" title={copy.genericReferenceTitle} items={data.genericReference} />
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-atlas bg-paper/80 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
}

function ReviewColumn({ id, title, items }) {
  return (
    <section id={id} className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
      <h3 className="font-serif text-3xl text-ink">{title}</h3>
      <div className="mt-5 space-y-4">
        {items.map((bookmark) => (
          <ReviewCard key={bookmark.id} bookmark={bookmark} compact />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ bookmark, compact = false }) {
  const topics = asArray(bookmark.canonical_topics);
  const resourceTypes = asArray(bookmark.resource_type_tags);
  const actions = asArray(bookmark.action_tags);
  const reasons = asArray(bookmark.classification_reasons);

  return (
    <BookmarkShell bookmarkId={bookmark.id}>
      <article className="rounded-atlas border border-black/5 bg-paper/80 p-5 pr-14">
        <div className="flex items-start justify-between gap-4">
          <div>
            <a href={bookmark.url} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.18em] text-rust/55 transition hover:text-rust">
              {bookmark.domain || "unknown source"}
            </a>
            <a href={bookmark.url} target="_blank" rel="noreferrer" className="mt-2 block">
              <h4 className="font-serif text-2xl leading-tight text-ink transition hover:text-rust">{bookmark.title}</h4>
            </a>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${bookmark.classification_confidence === "low" ? "bg-rust/10 text-rust" : "bg-pine/10 text-pine"}`}>
            {bookmark.classification_confidence ?? "unknown"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag tone="pine">{bookmark.primary_category}</Tag>
          {resourceTypes.slice(0, 2).map((tag) => <Tag key={tag}>{tag}</Tag>)}
          {actions.slice(0, 2).map((tag) => <Tag key={tag} tone="rust">{tag}</Tag>)}
        </div>

        {topics.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.slice(0, 3).map((topic) => (
              <Link
                key={topic}
                href={`/search?tag=${encodeURIComponent(topic)}`}
                className="rounded-full bg-white/70 px-3 py-1 text-xs text-ink/62"
              >
                {topic}
              </Link>
            ))}
          </div>
        ) : null}

        {!compact && bookmark.usefulness_reason ? (
          <p className="mt-4 text-sm leading-7 text-ink/62">{bookmark.usefulness_reason}</p>
        ) : null}

        {!compact && reasons.length ? (
          <div className="mt-4 rounded-2xl border border-black/5 bg-white/55 p-3 text-xs leading-6 text-ink/52">
            {reasons.slice(0, 3).map((reason) => (
              <p key={`${reason.layer}-${reason.tag}-${reason.evidence}`}>
                {reason.layer}: {reason.tag} ← {reason.evidence}
              </p>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link href={`/search?category=${encodeURIComponent(bookmark.primary_category)}`} className="text-ink/55 underline decoration-black/15 underline-offset-4">
            View category
          </Link>
        </div>
      </article>
    </BookmarkShell>
  );
}

function Tag({ children, tone = "ink" }) {
  const className = {
    ink: "border border-black/5 bg-white/70 text-ink/62",
    pine: "bg-pine/10 text-pine",
    rust: "bg-rust/10 text-rust"
  }[tone];

  return <span className={`rounded-full px-3 py-1 text-xs ${className}`}>{children}</span>;
}
