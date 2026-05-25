function getPreviewImage(url) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

export function BookmarkCard({ bookmark, showPreview = false }) {
  const worldviewTags = asArray(bookmark.worldview_tags);
  const aestheticTags = asArray(bookmark.aesthetic_tags);
  const status = bookmark.value_status ?? "active";

  return (
    <article className="frost-panel flex h-full flex-col rounded-atlas border border-black/5 p-5 shadow-atlas transition hover:-translate-y-0.5 hover:shadow-lg">
      {showPreview ? (
        <div className="mb-5 overflow-hidden rounded-[1.25rem] border border-black/5 bg-paper/70">
          <img
            src={getPreviewImage(bookmark.url)}
            alt={bookmark.title}
            className="aspect-[16/10] w-full object-cover object-top"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{bookmark.year ?? "Unknown year"}</p>
          <h3 className="mt-2 font-serif text-xl leading-tight text-ink">{bookmark.title}</h3>
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
        <span>{bookmark.domain}</span>
        <span className="rounded-full border border-black/5 px-3 py-1 uppercase tracking-[0.18em]">
          {status.replace("_", " ")}
        </span>
      </div>
      {bookmark.duplicate_count > 1 ? (
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink/45">
          Saved {bookmark.duplicate_count} times
          {bookmark.first_saved_year && bookmark.last_saved_year
            ? ` · ${bookmark.first_saved_year} to ${bookmark.last_saved_year}`
            : ""}
        </p>
      ) : null}
      <a
        href={bookmark.url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 text-sm text-rust underline decoration-rust/30 underline-offset-4"
      >
        Open source
      </a>
    </article>
  );
}
