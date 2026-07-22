"use client";

import { useEffect, useState } from "react";

const hiddenKey = "living-cognitive-atlas:hidden-bookmarks";

function readHiddenIds() {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(hiddenKey) ?? "[]");
  } catch {
    return [];
  }
}

function writeHiddenIds(ids) {
  window.localStorage.setItem(hiddenKey, JSON.stringify([...new Set(ids)]));
  window.dispatchEvent(new CustomEvent("bookmark-hidden-change"));
}

export function BookmarkShell({ bookmarkId, children }) {
  const [isHidden, setIsHidden] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    const syncHidden = () => {
      setIsHidden(readHiddenIds().includes(bookmarkId));
    };

    syncHidden();
    window.addEventListener("bookmark-hidden-change", syncHidden);

    return () => {
      window.removeEventListener("bookmark-hidden-change", syncHidden);
    };
  }, [bookmarkId]);

  const hideBookmark = () => {
    writeHiddenIds([...readHiddenIds(), bookmarkId]);
    setCanUndo(true);
  };

  const restoreBookmark = () => {
    writeHiddenIds(readHiddenIds().filter((id) => id !== bookmarkId));
    setCanUndo(false);
  };

  if (isHidden) {
    if (!canUndo) return null;

    return (
      <div className="rounded-[1.25rem] border border-black/5 bg-paper/70 p-4 text-sm text-ink/55">
        Hidden from this demo list.
        <button type="button" onClick={restoreBookmark} className="ml-3 text-rust underline decoration-rust/25 underline-offset-4">
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="group/bookmark relative h-full">
      {children}
      <details className="absolute right-4 top-4 z-10">
        <summary className="grid h-8 w-8 cursor-pointer list-none place-items-center rounded-full border border-black/5 bg-white/80 text-ink/45 shadow-sm transition hover:text-ink [&::-webkit-details-marker]:hidden">
          ···
        </summary>
        <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-black/5 bg-white/95 p-2 text-sm shadow-atlas backdrop-blur">
          <button
            type="button"
            onClick={hideBookmark}
            className="block w-full rounded-xl px-3 py-2 text-left text-ink/62 transition hover:bg-paper hover:text-ink"
          >
            Hide from lists
          </button>
        </div>
      </details>
    </div>
  );
}
