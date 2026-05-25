import { BookmarkCard } from "@/components/bookmark-card";
import { getSearchOptions, searchBookmarks } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

export default async function SearchPage({ searchParams }) {
  const { copy } = await getCopy("search");
  const params = await searchParams;
  const filters = {
    query: params?.q ?? "",
    year: params?.year ?? "all",
    status: params?.status ?? "all",
    category: params?.category ?? "all",
    resourceType: params?.resourceType ?? "all",
    action: params?.action ?? "all",
    tag: params?.tag ?? "all"
  };
  const options = getSearchOptions();
  const results = searchBookmarks(filters);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
        <form className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.18em] text-ink/50">{copy.keyword}</span>
            <input
              name="q"
              defaultValue={filters.query}
              placeholder="AI, documentary, parenting, ritual..."
              className="w-full rounded-full border border-black/5 bg-paper/70 px-4 py-3 outline-none ring-0 placeholder:text-ink/35 focus:border-pine"
            />
          </label>
          <Select label={copy.year} name="year" value={filters.year} options={["all", ...options.years.map(String)]} />
          <Select label={copy.status} name="status" value={filters.status} options={["all", ...options.statuses]} />
          <Select label={copy.category} name="category" value={filters.category} options={["all", ...options.categories]} />
          <Select label={copy.resourceType} name="resourceType" value={filters.resourceType} options={["all", ...options.resourceTypes]} />
          <Select label={copy.action} name="action" value={filters.action} options={["all", ...options.actionTags]} />
          <Select label={copy.tag} name="tag" value={filters.tag} options={["all", ...options.tags]} />
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="rounded-full bg-pine px-5 py-3 text-sm text-white transition hover:bg-pine/90"
            >
              {copy.apply}
            </button>
            <a
              href="/search"
              className="rounded-full border border-black/5 bg-paper/70 px-5 py-3 text-sm text-ink/70 transition hover:bg-white"
            >
              {copy.reset}
            </a>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-ink/60">{results.length.toLocaleString()} {copy.matched}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.slice(0, 60).map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} showPreview />
          ))}
        </div>
      </section>
    </div>
  );
}

function Select({ label, name, value, options }) {
  return (
    <label className="space-y-2">
      <span className="text-xs uppercase tracking-[0.18em] text-ink/50">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="w-full rounded-full border border-black/5 bg-paper/70 px-4 py-3 outline-none focus:border-pine"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? label : option}
          </option>
        ))}
      </select>
    </label>
  );
}
