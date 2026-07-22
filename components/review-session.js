"use client";

import { useEffect, useMemo, useState } from "react";
import { reviewDecisionStorageKey } from "@/lib/review-decisions";

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function loadDecisions() {
  try {
    return JSON.parse(window.localStorage.getItem(reviewDecisionStorageKey) ?? "[]");
  } catch {
    return [];
  }
}

function saveDecisions(decisions) {
  window.localStorage.setItem(reviewDecisionStorageKey, JSON.stringify(decisions));
}

function formatTemplate(template, values) {
  return Object.entries(values).reduce((text, [key, value]) => text.replace(`{${key}}`, value), template);
}

export function ReviewSession({ items, copy }) {
  const [decisions, setDecisions] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [draft, setDraft] = useState({ category: "", resourceType: "", note: "" });
  const [lastLearning, setLastLearning] = useState("");

  useEffect(() => {
    setDecisions(loadDecisions());
  }, []);

  const decidedIds = useMemo(() => new Set(decisions.map((decision) => decision.id)), [decisions]);
  const queue = items.filter((item) => !decidedIds.has(item.id));
  const current = queue[0];
  const progress = Math.min(sessionCount, 5);
  const topics = asArray(current?.canonical_topics);
  const resourceTypes = asArray(current?.resource_type_tags);
  const actions = asArray(current?.action_tags);
  const reasons = asArray(current?.classification_reasons);

  useEffect(() => {
    if (!current) return;
    setDraft({
      category: current.primary_category ?? "",
      resourceType: resourceTypes[0] ?? "",
      note: ""
    });
  }, [current?.id]);

  function recordDecision(type, overrides = {}) {
    if (!current) return;
    const category = draft.category || current.primary_category;
    const resourceType = draft.resourceType || resourceTypes[0];

    const nextDecision = {
      id: current.id,
      title: current.title,
      url: current.url,
      domain: current.domain,
      type,
      category,
      resourceType,
      note: draft.note,
      createdAt: new Date().toISOString(),
      ...overrides
    };
    const nextDecisions = [nextDecision, ...decisions.filter((decision) => decision.id !== current.id)];
    setDecisions(nextDecisions);
    saveDecisions(nextDecisions);
    setSessionCount((count) => count + 1);
    if (type === "skip") {
      setLastLearning(copy.session.learnedSkip);
    } else if (overrides.monitor) {
      setLastLearning(formatTemplate(copy.session.learnedMonitor, { domain: current.domain || "this source" }));
    } else {
      setLastLearning(formatTemplate(copy.session.learnedRule, { domain: current.domain || "this source", category: category || "this category", resourceType: resourceType || "this type" }));
    }
  }

  function exportDecisions() {
    const blob = new Blob([JSON.stringify(decisions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "review-decisions.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white/72 p-6 shadow-atlas">
      <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-rust/60">{copy.session.eyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.session.title}</h3>
          <p className="mt-3 text-sm leading-7 text-ink/62">{copy.session.body}</p>

          <div className="mt-5 rounded-[1.25rem] border border-black/5 bg-paper/70 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-ink/45">
              <span>{copy.session.progress}</span>
              <span>{progress}/5</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/5">
              <div className="h-full rounded-full bg-pine transition-all" style={{ width: `${(progress / 5) * 100}%` }} />
            </div>
            <p className="mt-3 text-xs leading-5 text-ink/50">
              {queue.length} {copy.session.left}
            </p>
          </div>

          {lastLearning ? (
            <div className="mt-3 rounded-[1.1rem] border border-pine/10 bg-sage/10 p-3 text-xs leading-5 text-pine/80">
              {lastLearning}
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.5rem] border border-pine/10 bg-sage/10 p-4">
          {current ? (
            <article>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <a href={current.url} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.18em] text-rust/55 transition hover:text-rust">
                    {current.domain || "unknown source"}
                  </a>
                  <a href={current.url} target="_blank" rel="noreferrer" className="mt-2 block">
                    <h4 className="font-serif text-3xl leading-tight text-ink transition hover:text-rust">{current.title}</h4>
                  </a>
                </div>
                <span className="rounded-full bg-white/75 px-3 py-1 text-xs text-ink/50">
                  {current.classification_confidence ?? "unknown"}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-ink/50">
                  {copy.session.category}
                  <input
                    value={draft.category}
                    onChange={(event) => setDraft((value) => ({ ...value, category: event.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-black/5 bg-white/75 px-3 py-2 text-sm text-ink outline-none focus:border-pine/30"
                  />
                </label>
                <label className="text-xs text-ink/50">
                  {copy.session.resourceType}
                  <input
                    value={draft.resourceType}
                    onChange={(event) => setDraft((value) => ({ ...value, resourceType: event.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-black/5 bg-white/75 px-3 py-2 text-sm text-ink outline-none focus:border-pine/30"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[current.primary_category, ...resourceTypes.slice(0, 2), ...actions.slice(0, 2), ...topics.slice(0, 2)].filter(Boolean).map((tag) => (
                  <span key={tag} className="rounded-full bg-white/70 px-3 py-1 text-xs text-ink/58">
                    {tag}
                  </span>
                ))}
              </div>

              {current.usefulness_reason ? (
                <p className="mt-4 rounded-2xl border border-black/5 bg-white/60 p-3 text-sm leading-6 text-ink/62">
                  {copy.session.why} · {current.usefulness_reason}
                </p>
              ) : null}

              {reasons.length ? (
                <div className="mt-3 text-xs leading-6 text-ink/45">
                  {reasons.slice(0, 2).map((reason) => (
                    <p key={`${reason.layer}-${reason.tag}-${reason.evidence}`}>
                      {reason.layer}: {reason.tag} ← {reason.evidence}
                    </p>
                  ))}
                </div>
              ) : null}

              <label className="mt-4 block text-xs text-ink/50">
                {copy.session.note}
                <textarea
                  value={draft.note}
                  onChange={(event) => setDraft((value) => ({ ...value, note: event.target.value }))}
                  rows={2}
                  className="mt-1 w-full resize-none rounded-2xl border border-black/5 bg-white/75 px-3 py-2 text-sm text-ink outline-none focus:border-pine/30"
                />
              </label>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => recordDecision("accept")} className="rounded-full bg-pine px-4 py-2 text-sm text-white">
                  {copy.session.accept}
                </button>
                <button type="button" onClick={() => recordDecision("monitor", { monitor: true })} className="rounded-full border border-black/5 bg-white/75 px-4 py-2 text-sm text-ink/65">
                  {copy.session.monitor}
                </button>
                <button type="button" onClick={() => recordDecision("cleanup")} className="rounded-full border border-black/5 bg-white/75 px-4 py-2 text-sm text-ink/65">
                  {copy.session.cleanup}
                </button>
                <button type="button" onClick={() => recordDecision("skip")} className="rounded-full px-4 py-2 text-sm text-ink/45">
                  {copy.session.skip}
                </button>
              </div>

              <a href={current.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm text-ink/45 underline decoration-black/15 underline-offset-4 transition hover:text-rust">
                {copy.session.open}
              </a>
            </article>
          ) : (
            <div className="flex min-h-72 flex-col justify-center">
              <p className="font-serif text-3xl text-ink">{copy.session.doneTitle}</p>
              <p className="mt-3 text-sm leading-7 text-ink/62">{copy.session.doneBody}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-4">
        <p className="text-xs leading-5 text-ink/45">{copy.session.localOnly}</p>
        <button
          type="button"
          onClick={exportDecisions}
          disabled={!decisions.length}
          className="rounded-full border border-black/5 bg-paper/80 px-4 py-2 text-sm text-ink/60 disabled:opacity-40"
        >
          {copy.session.export}
        </button>
      </div>
    </section>
  );
}
