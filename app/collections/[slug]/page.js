import Link from "next/link";
import { notFound } from "next/navigation";
import { BookmarkCard } from "@/components/bookmark-card";
import { getSmartCollection } from "@/lib/data";
import { getCopy } from "@/lib/i18n";

export default async function CollectionPage({ params, searchParams }) {
  const { copy } = await getCopy("collections");
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const collection = getSmartCollection(resolvedParams.slug);

  if (!collection) {
    notFound();
  }
  const activeGroup = resolvedSearchParams?.group ?? "all";
  const visibleItems =
    activeGroup === "all"
      ? collection.items
      : collection.items.filter((item) => item.matched_subgroups?.includes(activeGroup));

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-atlas">
        <div className="absolute right-6 top-4 font-serif text-8xl text-pine/10">{collection.icon}</div>
        <p className="text-xs uppercase tracking-[0.28em] text-rust/60">{copy.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-serif text-5xl leading-none text-ink">{collection.label}</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink/68">{collection.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-pine px-4 py-2 text-sm text-white">{collection.count} {copy.items}</span>
          <Link href={collection.searchHref} className="rounded-full border border-black/5 bg-paper/80 px-4 py-2 text-sm text-ink/70">
            {copy.openSearch}
          </Link>
          <Link href="/" className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm text-ink/60">
            {copy.backHome}
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{copy.subgroups}</p>
            <h3 className="mt-2 font-serif text-3xl text-ink">{copy.subgroupsTitle}</h3>
          </div>
          <Link
            href={collection.href}
            className={`rounded-full px-4 py-2 text-sm ${activeGroup === "all" ? "bg-pine text-white" : "border border-black/5 bg-paper/80 text-ink/65"}`}
          >
            {copy.allItems} · {collection.count}
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {collection.subgroups.map((group) => (
            <Link
              key={group.label}
              href={group.href}
              className={`rounded-atlas border p-5 shadow-atlas transition hover:-translate-y-0.5 ${
                activeGroup === group.label ? "border-pine/25 bg-pine/10" : "border-black/5 bg-paper/80 hover:bg-white"
              }`}
            >
            <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{group.label}</p>
            <p className="mt-3 font-serif text-4xl text-ink">{group.count}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{copy.recommended}</p>
            <h3 className="mt-2 font-serif text-3xl text-ink">
              {activeGroup === "all" ? copy.recommendedTitle : `${activeGroup} · ${visibleItems.length}`}
            </h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-ink/58">{copy.recommendedBody}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.slice(0, 60).map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} showPreview={collection.slug === "inspiration-references"} />
          ))}
        </div>
      </section>
    </div>
  );
}
