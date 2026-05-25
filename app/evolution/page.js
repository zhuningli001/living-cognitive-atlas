import { getDashboardData } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

export default async function EvolutionPage() {
  const { copy } = await getCopy("evolution");
  const data = getDashboardData();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{copy.phases}</p>
          <div className="mt-6 space-y-4">
            {data.evolutionStages.map((stage) => (
              <article key={stage.range} className="rounded-atlas bg-paper/80 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif text-2xl text-ink">{stage.label}</h3>
                  <span className="rounded-full border border-black/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink/55">
                    {stage.range}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-ink/68">{stage.narrative}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink/45">{stage.bookmarkCount} bookmarks in this period</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Tag>{stage.topWorldview}</Tag>
                  <Tag>{stage.topInteraction}</Tag>
                  <Tag>{stage.topAesthetic}</Tag>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-ink/62 md:grid-cols-3">
                  <div>
                    <p className="uppercase tracking-[0.18em] text-ink/42">Worldviews</p>
                    <p className="mt-1">{stage.worldviewEntries.map((entry) => entry.label).join(" · ")}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.18em] text-ink/42">Interaction</p>
                    <p className="mt-1">{stage.interactionEntries.map((entry) => entry.label).join(" · ")}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.18em] text-ink/42">Aesthetic</p>
                    <p className="mt-1">{stage.aestheticEntries.map((entry) => entry.label).join(" · ")}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{copy.intensity}</p>
          <div className="mt-8 space-y-5">
            {data.timeline.map((point) => (
              <div key={point.year} className="grid grid-cols-[84px_1fr_56px] items-center gap-4">
                <p className="text-sm uppercase tracking-[0.18em] text-ink/55">{point.year}</p>
                <div className="h-4 rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-pine to-rust" style={{ width: `${Math.min((point.count / 180) * 100, 100)}%` }} />
                </div>
                <p className="text-right font-serif text-2xl text-ink">{point.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.2em] text-rust/60">Phase shifts</p>
        <h3 className="mt-2 font-serif text-3xl text-ink">{copy.shifts}</h3>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {data.themeDrifts.map((drift) => (
            <article key={drift.range} className="rounded-atlas bg-paper/80 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-rust/55">{drift.range}</p>
              <h4 className="mt-2 font-serif text-2xl text-ink">
                {drift.from} → {drift.to}
              </h4>
              <div className="mt-4 space-y-3 text-sm leading-6 text-ink/65">
                <p>
                  Worldview shifted from <span className="text-ink">{drift.worldviewShift.from}</span> toward <span className="text-ink">{drift.worldviewShift.to}</span>.
                </p>
                <p>
                  Interaction moved from <span className="text-ink">{drift.interactionShift.from}</span> toward <span className="text-ink">{drift.interactionShift.to}</span>.
                </p>
                <p>
                  Aesthetic language introduced <span className="text-ink">{drift.aestheticShift.newcomer}</span> as a fresh surface cue.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Tag({ children }) {
  return <span className="rounded-full bg-pine/10 px-3 py-1 text-xs text-pine">{children}</span>;
}
