import Link from "next/link";
import { getReclassifyData } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

export default async function ReclassifyPage() {
  const { copy } = await getCopy("reclassify");
  const data = getReclassifyData();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink/68">{copy.body}</p>
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{copy.blueprint}</p>
        <h3 className="mt-2 font-serif text-3xl text-ink">{copy.blueprintTitle}</h3>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {data.categoryBlueprint.map((entry) => (
            <article key={entry.label} className="rounded-atlas bg-paper/80 p-5">
              <div className="flex items-center justify-between gap-4">
                <Link href={`/search?category=${encodeURIComponent(entry.label)}`} className="font-serif text-2xl text-ink">
                  {entry.label}
                </Link>
                <span className="text-sm text-ink/50">{entry.count}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-ink/60">{entry.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.sampleTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-ink/68"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
