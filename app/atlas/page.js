import { BookmarkCard, PreviewFrame } from "@/components/bookmark-card";
import { BookmarkShell } from "@/components/bookmark-shell";
import { ProfileMirror } from "@/components/profile-mirror";
import { getAtlasGroups, getDashboardData, getUserProfileData } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

const views = [
  { key: "structure" },
  { key: "profile" },
  { key: "evolution" }
];

const dimensions = [
  { key: "primary_category", label: "Category" },
  { key: "resource_type_tags", label: "Resource Type" },
  { key: "action_tags", label: "Action" }
];

const layouts = ["list", "grid"];
const sizes = ["small", "medium", "large"];

export default async function AtlasPage({ searchParams }) {
  const { copy } = await getCopy("atlas");
  const resolvedSearchParams = await searchParams;
  const selectedView = views.find((item) => item.key === resolvedSearchParams?.view)?.key ?? "structure";
  const selected = dimensions.find((item) => item.key === resolvedSearchParams?.group)?.key ?? "primary_category";
  const selectedLayout = layouts.includes(resolvedSearchParams?.layout) ? resolvedSearchParams.layout : "list";
  const selectedSize = sizes.includes(resolvedSearchParams?.size) ? resolvedSearchParams.size : "medium";
  const groups = getAtlasGroups(selected).slice(0, 12);
  const selectedFocus = groups.find((group) => group.label === resolvedSearchParams?.focus)?.label ?? "";
  const visibleGroups = selectedFocus ? groups.filter((group) => group.label === selectedFocus) : groups;
  const profile = getUserProfileData();
  const dashboard = getDashboardData();
  const groupCount = visibleGroups.reduce((total, group) => total + group.bookmarks.length, 0);
  const atlasHref = ({ view = selectedView, group = selected, layout = selectedLayout, size = selectedSize, focus = selectedFocus }, hash = "") => {
    const params = new URLSearchParams({ view });
    if (view === "structure") {
      params.set("group", group);
      params.set("layout", layout);
      params.set("size", size);
      if (focus) params.set("focus", focus);
    }
    return `/atlas?${params.toString()}${hash}`;
  };

  return (
    <div className="space-y-6">
      <section className="space-y-5 py-3">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
            <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
          </div>
          {copy.body ? <p className="max-w-3xl text-base leading-7 text-ink/65">{copy.body}</p> : null}
        </div>

        <nav className="sticky top-24 z-10 flex flex-wrap items-baseline gap-x-5 gap-y-2 bg-paper/80 py-2 backdrop-blur">
          <span className="text-[11px] uppercase tracking-[0.22em] text-rust/45">{copy.viewLabel}</span>
          {views.map((view) => (
            <a
              key={view.key}
              href={atlasHref({ view: view.key }, view.key === "structure" ? "#atlas-groups" : "")}
              className={`border-b py-1 text-sm transition ${
                selectedView === view.key
                  ? "border-pine text-pine"
                  : "border-transparent text-ink/45 hover:border-black/20 hover:text-ink/75"
              }`}
            >
              {copy.viewTabs[view.key]}
            </a>
          ))}
        </nav>
      </section>

      {selectedView === "structure" ? (
        <section id="atlas-groups" className="space-y-5 scroll-mt-28">
          <ResultControls
            copy={copy}
            dimensions={dimensions}
            groups={groups}
            selected={selected}
            selectedFocus={selectedFocus}
            selectedLayout={selectedLayout}
            selectedSize={selectedSize}
            groupCount={groupCount}
            atlasHref={atlasHref}
          />

          <div className="space-y-6">
            {visibleGroups.map((group) => (
              <section key={group.label} className="space-y-3 border-t border-black/5 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-rust/60">
                      {group.bookmarks.length} {copy.linked}
                    </p>
                    <h3 className="font-serif text-3xl text-ink">{group.label}</h3>
                  </div>
                </div>
                <BookmarkPreviewList bookmarks={group.bookmarks.slice(0, 6)} layout={selectedLayout} size={selectedSize} />
              </section>
            ))}
          </div>
        </section>
      ) : null}

      {selectedView === "profile" ? (
        <section className="space-y-6">
          <ViewIntro eyebrow={copy.profileViewEyebrow} title={copy.profileViewTitle} body={copy.profileViewBody} />
          <ProfileMirror profile={profile} copy={copy} />
        </section>
      ) : null}

      {selectedView === "evolution" ? (
        <section className="space-y-6">
          <ViewIntro eyebrow={copy.evolutionViewEyebrow} title={copy.evolutionViewTitle} body={copy.evolutionViewBody} />
          <EvolutionPanel dashboard={dashboard} copy={copy} />
        </section>
      ) : null}
    </div>
  );
}

function ControlGroup({ label, children }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[11px] uppercase tracking-[0.2em] text-ink/35">{label}</span>
      <div className="flex gap-4">{children}</div>
    </div>
  );
}

function ResultControls({
  copy,
  dimensions,
  groups,
  selected,
  selectedFocus,
  selectedLayout,
  selectedSize,
  groupCount,
  atlasHref
}) {
  return (
    <div className="space-y-3 border-y border-black/10 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <ControlGroup label={copy.groupByLabel}>
            {dimensions.map((dimension) => (
              <a
                key={dimension.key}
                href={atlasHref({ group: dimension.key, focus: "" }, "#atlas-groups")}
                className={`border-b py-1 text-sm transition ${
                  selected === dimension.key ? "border-pine text-pine" : "border-transparent text-ink/45 hover:border-black/20 hover:text-ink/70"
                }`}
              >
                {copy.tabs[dimension.key]}
              </a>
            ))}
          </ControlGroup>
        </div>
        <p className="text-sm text-ink/45">
          {groups.length} {copy.groups} · {groupCount} {copy.linked}
        </p>
      </div>

      {copy.viewDescriptions?.[selected] ? <p className="text-sm leading-6 text-ink/56">{copy.viewDescriptions[selected]}</p> : null}

      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <ControlGroup label={copy.showLabel}>
          <a
            href={atlasHref({ focus: "" }, "#atlas-groups")}
            className={`border-b py-1 text-sm transition ${
              selectedFocus ? "border-transparent text-ink/45 hover:border-black/20 hover:text-ink/70" : "border-ink text-ink"
            }`}
          >
            {copy.allGroups}
          </a>
          {groups.map((group) => (
            <a
              key={group.label}
              href={atlasHref({ focus: group.label }, "#atlas-groups")}
              className={`border-b py-1 text-sm transition ${
                selectedFocus === group.label ? "border-ink text-ink" : "border-transparent text-ink/45 hover:border-black/20 hover:text-ink/70"
              }`}
            >
              {group.label} <span className="text-xs text-ink/35">{group.bookmarks.length}</span>
            </a>
          ))}
        </ControlGroup>

        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
          <ControlGroup label={copy.layoutLabel}>
            {layouts.map((layout) => (
              <a
                key={layout}
                href={atlasHref({ layout }, "#atlas-groups")}
                className={`border-b py-1 text-sm transition ${
                  selectedLayout === layout ? "border-ink text-ink" : "border-transparent text-ink/45 hover:border-black/20 hover:text-ink/70"
                }`}
              >
                {copy.layouts[layout]}
              </a>
            ))}
          </ControlGroup>
          <ControlGroup label={copy.sizeLabel}>
            {sizes.map((size) => (
              <a
                key={size}
                href={atlasHref({ size }, "#atlas-groups")}
                className={`border-b py-1 text-sm transition ${
                  selectedSize === size ? "border-ink text-ink" : "border-transparent text-ink/45 hover:border-black/20 hover:text-ink/70"
                }`}
              >
                {copy.sizes[size]}
              </a>
            ))}
          </ControlGroup>
        </div>
      </div>
    </div>
  );
}

function BookmarkPreviewList({ bookmarks, layout, size }) {
  if (layout === "grid") {
    const gridClass = size === "small" ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-3";

    return (
      <div className={`grid gap-3 ${gridClass}`}>
        {bookmarks.map((bookmark) =>
          size === "small" ? (
            <BookmarkCompactCard key={bookmark.id} bookmark={bookmark} />
          ) : (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} showPreview={size === "large"} />
          )
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-black/5 overflow-hidden rounded-[1.35rem] border border-black/5 bg-white/64">
      {bookmarks.map((bookmark) => (
        <BookmarkRow key={bookmark.id} bookmark={bookmark} size={size} />
      ))}
    </div>
  );
}

function BookmarkRow({ bookmark, size }) {
  const thumbnailClass = size === "small" ? "h-9 w-9" : size === "large" ? "h-24 w-36" : "h-16 w-24";

  return (
    <BookmarkShell bookmarkId={bookmark.id}>
      <article className={`grid items-center gap-4 px-4 pr-14 ${size === "small" ? "grid-cols-[36px_1fr] py-2.5" : "grid-cols-[auto_1fr] py-3.5"}`}>
        {size === "small" ? (
          <a href={bookmark.url} target="_blank" rel="noreferrer">
            <img src={bookmark.possible_favicon} alt="" className={`${thumbnailClass} rounded-full border border-black/5 bg-paper object-cover`} />
          </a>
        ) : (
          <a href={bookmark.url} target="_blank" rel="noreferrer" className={thumbnailClass}>
            <PreviewFrame url={bookmark.url} title={bookmark.title} ratio="h-full" />
          </a>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <a href={bookmark.url} target="_blank" rel="noreferrer" className="min-w-0">
              <h4 className={`truncate font-serif text-ink transition hover:text-rust ${size === "large" ? "text-xl" : "text-lg"}`}>{bookmark.title}</h4>
            </a>
            <span className="rounded-full bg-paper/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink/42">{bookmark.year ?? "Unknown"}</span>
          </div>
          <a href={bookmark.url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sm text-ink/55 transition hover:text-rust">
            {bookmark.domain} · {bookmark.primary_category}
          </a>
          {size !== "small" ? <p className="mt-1 truncate text-xs text-ink/42">{bookmark.folder_path || "Unfiled"}</p> : null}
        </div>
      </article>
    </BookmarkShell>
  );
}

function BookmarkCompactCard({ bookmark }) {
  return (
    <BookmarkShell bookmarkId={bookmark.id}>
      <article className="rounded-[1.25rem] border border-black/5 bg-white/66 p-3 pr-12">
        <div className="flex items-start gap-3">
          <a href={bookmark.url} target="_blank" rel="noreferrer">
            <img src={bookmark.possible_favicon} alt="" className="h-8 w-8 rounded-full border border-black/5 bg-paper object-cover" />
          </a>
          <div className="min-w-0">
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              <h4 className="truncate font-serif text-lg leading-tight text-ink transition hover:text-rust">{bookmark.title}</h4>
            </a>
            <a href={bookmark.url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs text-ink/48 transition hover:text-rust">{bookmark.domain}</a>
          </div>
        </div>
      </article>
    </BookmarkShell>
  );
}

function ViewIntro({ eyebrow, title, body }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{eyebrow}</p>
        <h3 className="mt-2 font-serif text-4xl leading-tight text-ink">{title}</h3>
      </div>
      <p className="text-sm leading-7 text-ink/62">{body}</p>
    </div>
  );
}

function EvolutionPanel({ dashboard, copy }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{copy.evolutionPhases}</p>
        {dashboard.evolutionStages.map((stage) => (
          <article key={stage.range} className="rounded-[1.6rem] border border-black/5 bg-white/72 p-5 shadow-atlas">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-serif text-2xl text-ink">{stage.label}</h4>
              <span className="rounded-full bg-paper/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink/50">{stage.range}</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-ink/62">{stage.narrative}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag>{stage.topWorldview}</Tag>
              <Tag>{stage.topInteraction}</Tag>
              <Tag>{stage.topAesthetic}</Tag>
            </div>
          </article>
        ))}
      </div>

      <div className="space-y-6">
        <div className="rounded-[1.8rem] border border-black/5 bg-white/72 p-6 shadow-atlas">
          <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{copy.evolutionIntensity}</p>
          <div className="mt-6 space-y-4">
            {dashboard.timeline.map((point) => (
              <div key={point.year} className="grid grid-cols-[64px_1fr_48px] items-center gap-4">
                <p className="text-xs uppercase tracking-[0.16em] text-ink/52">{point.year}</p>
                <div className="h-3 rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-pine/70" style={{ width: `${Math.min((point.count / 180) * 100, 100)}%` }} />
                </div>
                <p className="text-right font-serif text-xl text-ink">{point.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-black/5 bg-paper/70 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{copy.evolutionShifts}</p>
          <div className="mt-4 space-y-4">
            {dashboard.themeDrifts.slice(0, 3).map((drift) => (
              <article key={drift.range} className="border-t border-black/5 pt-4 first:border-t-0 first:pt-0">
                <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{drift.range}</p>
                <h4 className="mt-1 font-serif text-xl text-ink">
                  {drift.from} → {drift.to}
                </h4>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  {copy.evolutionShiftPrefix} <span className="text-ink">{drift.worldviewShift.from}</span> →{" "}
                  <span className="text-ink">{drift.worldviewShift.to}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }) {
  return <span className="rounded-full bg-pine/10 px-3 py-1 text-xs text-pine">{children}</span>;
}
