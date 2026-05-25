import { getCopy } from "@/lib/i18n";
import { getSignalBoard } from "@/lib/signals";

export const dynamic = "force-dynamic";

export default async function SignalsPage() {
  const { copy } = await getCopy("signals");
  const board = await getSignalBoard();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink/68">{copy.body}</p>
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{copy.live}</p>
        <p className="mt-2 text-sm leading-7 text-ink/58">{copy.fallback}</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {board.map((source) => (
            <article key={source.name} className="rounded-atlas bg-paper/80 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-rust/55">{source.category}</p>
                  <h3 className="mt-2 font-serif text-2xl text-ink">{source.name}</h3>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/5 px-3 py-1 text-xs text-ink/60"
                >
                  Visit
                </a>
              </div>
              <div className="mt-5 space-y-3">
                {source.items.length ? (
                  source.items.map((item) => (
                    <a
                      key={item.link}
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-atlas border border-black/5 bg-white/70 p-4 transition hover:border-rust/20 hover:bg-white"
                    >
                      <p className="text-sm leading-6 text-ink">{item.title}</p>
                      {item.date ? <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ink/42">{item.date}</p> : null}
                    </a>
                  ))
                ) : (
                  <div className="rounded-atlas border border-dashed border-black/10 bg-white/40 p-4 text-sm leading-7 text-ink/55">
                    Feed unavailable right now. The source remains tracked for the weekly board.
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
