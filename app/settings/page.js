import Link from "next/link";
import { RuleLearningPanel } from "@/components/rule-learning-panel";
import { SettingsPanel } from "@/components/settings-panel";
import { getReviewData } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

export default async function SettingsPage() {
  const { lang, copy } = await getCopy("settings");
  const review = getReviewData();
  const optimizationTasks = [
    {
      label: copy.optimization.needsCategory,
      count: review.totals.needsReview,
      href: "/search?category=Needs%20Review"
    },
    {
      label: copy.optimization.lowConfidence,
      count: review.totals.lowConfidence,
      href: "/review#low-confidence"
    },
    {
      label: copy.optimization.genericReference,
      count: review.totals.genericReference,
      href: "/review#generic-reference"
    }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SettingsPanel lang={lang} copy={copy} />

        <section id="optimization" className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{copy.optimization.eyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.optimization.title}</h3>
          <p className="mt-3 text-sm leading-7 text-ink/62">{copy.optimization.body}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {optimizationTasks.map((task) => (
              <Link
                key={task.label}
                href={task.href}
                className="rounded-atlas border border-black/5 bg-paper/75 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-atlas"
              >
                <p className="text-xs leading-5 text-ink/55">{task.label}</p>
                <p className="mt-2 font-serif text-3xl text-ink">{task.count}</p>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-[1.35rem] border border-pine/10 bg-sage/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-pine/70">{copy.optimization.guideEyebrow}</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-ink/64">
              {copy.optimization.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Link href="/review" className="mt-4 inline-flex rounded-full bg-pine px-4 py-2 text-sm text-white">
              {copy.optimization.start}
            </Link>
          </div>
        </section>

        <div className="lg:col-span-2">
          <RuleLearningPanel copy={copy.learning} />
        </div>

        <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas lg:col-start-2">
          <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{copy.workflow}</p>
          <p className="mt-3 text-sm leading-7 text-ink/62">{copy.workflowBody}</p>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-rust/60">{copy.sources}</p>
          <p className="mt-3 text-sm leading-7 text-ink/62">{copy.sourcesBody}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/api/export?type=curated&format=json" className="rounded-full bg-pine px-4 py-2 text-sm text-white">
              Curated JSON
            </a>
            <a href="/api/export?type=curated&format=csv" className="rounded-full border border-black/5 bg-paper/70 px-4 py-2 text-sm text-ink/70">
              Curated CSV
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
