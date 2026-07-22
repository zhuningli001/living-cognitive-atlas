import Link from "next/link";
import { getDashboardData, getReviewData } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

export default async function OptimizePage() {
  const { copy } = await getCopy("optimize");
  const review = getReviewData();
  const dashboard = getDashboardData();
  const cards = [
    {
      ...copy.cards.reclassify,
      metric: dashboard.worldviewCounts.length,
      metricLabel: copy.metricLabels.taxonomyGroups
    },
    {
      ...copy.cards.review,
      metric: review.totals.lowConfidence,
      metricLabel: copy.metricLabels.lowConfidence
    },
    {
      ...copy.cards.cold,
      metric: dashboard.totals.coldStorage,
      metricLabel: copy.metricLabels.coldLinks
    },
    {
      ...copy.cards.rules,
      metric: review.totals.genericReference,
      metricLabel: copy.metricLabels.genericReferences
    },
    {
      ...copy.cards.settings,
      metric: dashboard.totals.uniqueDomains,
      metricLabel: copy.metricLabels.domains
    },
    {
      ...copy.cards.export,
      metric: dashboard.curatedBookmarks.length,
      metricLabel: copy.metricLabels.curatedLinks
    }
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-5 py-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
          <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
        </div>
        <p className="text-base leading-7 text-ink/64">{copy.body}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {review.queues.slice(0, 3).map((queue) => (
          <Link key={queue.id} href={queue.href} className="rounded-[1.5rem] border border-black/5 bg-white/68 p-5 shadow-atlas transition hover:-translate-y-0.5 hover:bg-white">
            <p className="text-xs uppercase tracking-[0.18em] text-rust/55">{copy.queuesEyebrow}</p>
            <h3 className="mt-2 font-serif text-2xl text-ink">{queue.label}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/58">{queue.description}</p>
            <p className="mt-4 font-serif text-3xl text-ink">{queue.count}</p>
          </Link>
        ))}
      </section>

      <section className="space-y-4">
        <div className="border-t border-black/10 pt-5">
          <p className="text-xs uppercase tracking-[0.22em] text-rust/55">{copy.actionsEyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.actionsTitle}</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="group rounded-[1.5rem] border border-black/5 bg-white/62 p-5 transition hover:bg-white hover:shadow-atlas">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-serif text-2xl leading-tight text-ink">{card.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-ink/58">{card.body}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-3xl text-ink">{card.metric}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink/38">{card.metricLabel}</p>
                </div>
              </div>
              <span className="mt-5 inline-block text-sm text-rust underline decoration-rust/25 underline-offset-4 group-hover:decoration-rust">
                {copy.open}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
