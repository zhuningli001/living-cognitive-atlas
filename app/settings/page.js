import { SettingsPanel } from "@/components/settings-panel";
import { getCopy } from "@/lib/i18n";

export default async function SettingsPage() {
  const { lang, copy } = await getCopy("settings");

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SettingsPanel lang={lang} copy={copy} />

        <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
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
