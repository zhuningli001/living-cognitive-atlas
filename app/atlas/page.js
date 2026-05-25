import { BookmarkCard } from "@/components/bookmark-card";
import { getAtlasGroups } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

const dimensions = [
  { key: "primary_category", label: "Category" },
  { key: "resource_type_tags", label: "Resource Type" },
  { key: "action_tags", label: "Action" }
];

export default async function AtlasPage({ searchParams }) {
  const { copy } = await getCopy("atlas");
  const resolvedSearchParams = await searchParams;
  const selected = dimensions.find((item) => item.key === resolvedSearchParams?.group)?.key ?? "primary_category";
  const groups = getAtlasGroups(selected).slice(0, 12);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-5xl leading-none text-ink">{copy.title}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {dimensions.map((dimension) => (
            <a
              key={dimension.key}
              href={`/atlas?group=${dimension.key}`}
              className={`rounded-full border px-4 py-2 text-sm ${selected === dimension.key ? "border-pine bg-pine text-white" : "border-black/5 bg-paper/70 text-ink/75"}`}
            >
              {copy.tabs[dimension.key]}
            </a>
          ))}
        </div>
      </section>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.label} className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{group.bookmarks.length} {copy.linked}</p>
                <h3 className="font-serif text-3xl text-ink">{group.label}</h3>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.bookmarks.slice(0, 6).map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
