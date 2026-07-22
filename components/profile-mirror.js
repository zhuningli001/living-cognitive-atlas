function formatPercent(value) {
  return `${value}%`;
}

export function ProfileMirror({ profile, copy }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/72 shadow-atlas">
      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="border-b border-black/5 p-7 lg:border-b-0 lg:border-r">
          <p className="text-xs uppercase tracking-[0.26em] text-rust/60">{copy.profileEyebrow}</p>
          <h3 className="mt-3 font-serif text-4xl leading-tight text-ink">{profile.headline}</h3>
          <p className="mt-4 text-sm leading-7 text-ink/62">{profile.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {profile.interests.slice(0, 7).map((interest) => (
              <a
                key={interest.label}
                href={`/search?tag=${encodeURIComponent(interest.label)}`}
                className="rounded-full border border-black/5 bg-paper/75 px-3 py-1.5 text-xs text-ink/62 transition hover:border-pine/20 hover:bg-white"
              >
                {interest.label} · {interest.count}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-4 p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <SignalStrip title={copy.profileRegions} items={profile.rhythm.topRegions.slice(0, 3)} />
            <SignalStrip title={copy.profileResourceMode} items={profile.rhythm.topResourceTypes.slice(0, 3)} />
            <SignalStrip title={copy.profileActionMode} items={profile.rhythm.topActions.slice(0, 3)} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {profile.dimensions.slice(0, 4).map((dimension) => (
              <article key={dimension.label} className="rounded-[1.35rem] border border-black/5 bg-paper/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-serif text-xl leading-tight text-ink">{dimension.label}</h4>
                  <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-pine">{formatPercent(dimension.share)}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-ink/55">{dimension.description}</p>
              </article>
            ))}
          </div>

          {profile.classificationLeads.length ? (
            <div className="rounded-[1.35rem] border border-pine/10 bg-sage/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-pine/70">{copy.profileNextRules}</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/62">
                {profile.classificationLeads.map((lead) => (
                  <li key={lead}>· {lead}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function SignalStrip({ title, items }) {
  return (
    <div className="rounded-[1.25rem] border border-black/5 bg-paper/65 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-rust/55">{title}</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-ink/65">{item.label}</span>
            <span className="font-serif text-lg text-ink">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
