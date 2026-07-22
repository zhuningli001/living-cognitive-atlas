"use client";

import { useEffect, useMemo, useState } from "react";
import { reviewDecisionStorageKey, ruleSuggestionStorageKey } from "@/lib/review-decisions";

function readLocalJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeLocalJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function confidenceFor(count) {
  if (count >= 3) return "strong";
  if (count >= 2) return "medium";
  return "early";
}

function suggestionId(suggestion) {
  return [suggestion.kind, suggestion.domain, suggestion.value].join(":");
}

function addSuggestion(groups, decision, kind, value) {
  const domain = clean(decision.domain);
  const cleanedValue = clean(value);
  if (!domain || !cleanedValue) return;

  const id = [kind, domain, cleanedValue].join(":");
  const existing = groups.get(id);
  if (existing) {
    existing.count += 1;
    existing.examples.push(decision.title);
    return;
  }

  groups.set(id, {
    id,
    kind,
    domain,
    value: cleanedValue,
    count: 1,
    examples: [decision.title].filter(Boolean)
  });
}

function buildSuggestions(decisions) {
  const groups = new Map();

  decisions
    .filter((decision) => decision?.type !== "skip")
    .forEach((decision) => {
      addSuggestion(groups, decision, "category", decision.category);
      addSuggestion(groups, decision, "resourceType", decision.resourceType);
      if (decision.monitor) addSuggestion(groups, decision, "monitor", "monitor");
    });

  return Array.from(groups.values())
    .map((suggestion) => ({
      ...suggestion,
      confidence: confidenceFor(suggestion.count)
    }))
    .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain))
    .slice(0, 5);
}

function describeSuggestion(suggestion, copy) {
  if (suggestion.kind === "monitor") return copy.monitorRule.replace("{domain}", suggestion.domain);
  if (suggestion.kind === "resourceType") {
    return copy.resourceRule.replace("{domain}", suggestion.domain).replace("{value}", suggestion.value);
  }
  return copy.categoryRule.replace("{domain}", suggestion.domain).replace("{value}", suggestion.value);
}

export function RuleLearningPanel({ copy }) {
  const [decisions, setDecisions] = useState([]);
  const [states, setStates] = useState({});

  useEffect(() => {
    setDecisions(readLocalJson(reviewDecisionStorageKey, []));
    setStates(readLocalJson(ruleSuggestionStorageKey, {}));
  }, []);

  const suggestions = useMemo(() => buildSuggestions(decisions), [decisions]);
  const visibleSuggestions = suggestions.filter((suggestion) => states[suggestionId(suggestion)] !== "ignored");
  const approvedCount = Object.values(states).filter((state) => state === "approved").length;

  function markSuggestion(suggestion, state) {
    const nextStates = { ...states, [suggestionId(suggestion)]: state };
    setStates(nextStates);
    writeLocalJson(ruleSuggestionStorageKey, nextStates);
  }

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white/72 p-6 shadow-atlas">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-rust/60">{copy.eyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/62">{copy.body}</p>
        </div>
        <div className="rounded-full border border-pine/10 bg-sage/10 px-4 py-2 text-sm text-pine">
          {approvedCount} {copy.approved}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {visibleSuggestions.length ? (
          visibleSuggestions.map((suggestion) => {
            const state = states[suggestionId(suggestion)];
            return (
              <article key={suggestion.id} className="rounded-[1.35rem] border border-black/5 bg-paper/75 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-ink/40">
                      {copy.confidence[suggestion.confidence]} · {suggestion.count} {copy.examples}
                    </p>
                    <p className="mt-2 text-base leading-7 text-ink">{describeSuggestion(suggestion, copy)}</p>
                    {suggestion.examples[0] ? <p className="mt-1 text-xs leading-5 text-ink/42">{copy.basedOn} {suggestion.examples[0]}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => markSuggestion(suggestion, "approved")}
                      className={`rounded-full px-3 py-1.5 text-sm transition ${state === "approved" ? "bg-pine text-white" : "border border-black/5 bg-white/75 text-ink/60 hover:bg-white"}`}
                    >
                      {state === "approved" ? copy.approvedState : copy.approve}
                    </button>
                    <button type="button" onClick={() => markSuggestion(suggestion, "ignored")} className="rounded-full px-3 py-1.5 text-sm text-ink/42 transition hover:bg-white/65">
                      {copy.ignore}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[1.35rem] border border-dashed border-black/10 bg-paper/55 p-5 text-sm leading-7 text-ink/55">
            {copy.empty}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs leading-5 text-ink/42">{copy.localOnly}</p>
    </section>
  );
}
