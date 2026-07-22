import { BookmarkShell } from "@/components/bookmark-shell";

function getPreviewImage(url) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`;
}

export function PreviewFrame({ url, title, ratio = "aspect-[16/10]" }) {
  return (
    <div className={`relative ${ratio} overflow-hidden rounded-[1.15rem] border border-black/5 bg-[#e6e4df]`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink/35">
        <span className="flex h-12 w-10 items-center justify-center rounded-sm bg-[#f2b705] text-xs font-semibold text-white shadow-sm">
          404
        </span>
      </div>
      <img
        src={getPreviewImage(url)}
        alt={title}
        className="absolute inset-0 h-full w-full bg-[#e6e4df] object-cover object-top"
        loading="lazy"
      />
    </div>
  );
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

export function BookmarkCard({ bookmark, showPreview = false, showReason = false, reasonLabel = "Why recommended" }) {
  const worldviewTags = asArray(bookmark.worldview_tags);
  const aestheticTags = asArray(bookmark.aesthetic_tags);
  const status = bookmark.value_status ?? "active";

  return (
    <BookmarkShell bookmarkId={bookmark.id}>
      <article className="frost-panel flex h-full flex-col rounded-atlas border border-black/5 p-5 shadow-atlas transition hover:-translate-y-0.5 hover:shadow-lg">
        {showPreview ? (
          <a href={bookmark.url} target="_blank" rel="noreferrer" className="mb-5 block">
            <PreviewFrame url={bookmark.url} title={bookmark.title} />
          </a>
        ) : null}
        <div className="flex items-start justify-between gap-4 pr-9">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{bookmark.year ?? "Unknown year"}</p>
            <a href={bookmark.url} target="_blank" rel="noreferrer" className="group/title mt-2 block">
              <h3 className="font-serif text-xl leading-tight text-ink transition group-hover/title:text-rust">{bookmark.title}</h3>
            </a>
          </div>
          {bookmark.possible_favicon ? (
            <img
              src={bookmark.possible_favicon}
              alt=""
              className="h-8 w-8 rounded-full border border-black/5 bg-white object-cover"
            />
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/70">{bookmark.folder_path || "Unfiled"}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {worldviewTags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-pine/10 px-3 py-1 text-xs text-pine">
              {tag}
            </span>
          ))}
          {aestheticTags.slice(0, 1).map((tag) => (
            <span key={tag} className="rounded-full bg-rust/10 px-3 py-1 text-xs text-rust">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 text-sm text-ink/60">
          <a href={bookmark.url} target="_blank" rel="noreferrer" className="underline decoration-transparent underline-offset-4 transition hover:text-rust hover:decoration-rust/25">
            {bookmark.domain}
          </a>
          <span className="rounded-full border border-black/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink/48">
            {status.replace("_", " ")}
          </span>
        </div>
        {showReason && bookmark.usefulness_reason ? (
          <div className="mt-4 rounded-2xl border border-pine/10 bg-sage/10 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-pine/65">{reasonLabel}</p>
            <p className="mt-1 text-xs leading-5 text-ink/58">{bookmark.usefulness_reason}</p>
          </div>
        ) : null}
        {bookmark.duplicate_count > 1 ? (
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink/45">
            Saved {bookmark.duplicate_count} times
            {bookmark.first_saved_year && bookmark.last_saved_year
              ? ` · ${bookmark.first_saved_year} to ${bookmark.last_saved_year}`
              : ""}
          </p>
        ) : null}
      </article>
    </BookmarkShell>
  );
}
