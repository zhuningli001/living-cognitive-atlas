"use client";

import { useRouter } from "next/navigation";

export function SettingsPanel({ lang, copy }) {
  const router = useRouter();

  function setLanguage(nextLang) {
    document.cookie = `atlas-lang=${nextLang}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-atlas">
      <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{copy.language}</p>
      <p className="mt-2 text-sm leading-7 text-ink/62">{copy.languageBody}</p>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => setLanguage("zh")}
          className={`rounded-full px-4 py-2 text-sm ${lang === "zh" ? "bg-pine text-white" : "border border-black/5 bg-paper/70 text-ink/70"}`}
        >
          中文
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`rounded-full px-4 py-2 text-sm ${lang === "en" ? "bg-pine text-white" : "border border-black/5 bg-paper/70 text-ink/70"}`}
        >
          English
        </button>
      </div>
    </section>
  );
}
