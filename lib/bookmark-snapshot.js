export const PROFILE_SNAPSHOT_SCHEMA_VERSION = "bookmark-profile-snapshot/v1";

const requiredArrayFields = ["topics", "dimensions", "phases", "collections", "reviewQueue", "records"];

export function validateProfileSnapshot(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "Snapshot must be a JSON object." };
  }

  if (value.schemaVersion !== PROFILE_SNAPSHOT_SCHEMA_VERSION) {
    return {
      ok: false,
      error: `Unsupported schema version. Expected ${PROFILE_SNAPSHOT_SCHEMA_VERSION}.`
    };
  }

  if (!value.metrics || typeof value.metrics !== "object") {
    return { ok: false, error: "Snapshot is missing metrics." };
  }

  for (const field of requiredArrayFields) {
    if (!Array.isArray(value[field])) {
      return { ok: false, error: `Snapshot is missing ${field}.` };
    }
  }

  return { ok: true, snapshot: normalizeProfileSnapshot(value) };
}

export function normalizeProfileSnapshot(snapshot) {
  return {
    schemaVersion: snapshot.schemaVersion,
    source: snapshot.source || "unknown",
    generatedAt: snapshot.generatedAt || null,
    headline: snapshot.headline || "Imported bookmark profile",
    summary: snapshot.summary || "This snapshot was imported from a local Chrome extension export.",
    metrics: {
      bookmarks: asNumber(snapshot.metrics.bookmarks),
      domains: asNumber(snapshot.metrics.domains),
      topics: asNumber(snapshot.metrics.topics),
      review: asNumber(snapshot.metrics.review)
    },
    topics: normalizeCountItems(snapshot.topics),
    dimensions: normalizeDimensions(snapshot.dimensions),
    phases: snapshot.phases.map((phase, index) => ({
      year: String(phase.year || phase.meta || index + 1),
      title: String(phase.title || "Phase"),
      meta: String(phase.meta || phase.year || "Unknown period"),
      note: String(phase.note || "No note supplied.")
    })),
    collections: normalizeCountItems(snapshot.collections),
    reviewQueue: snapshot.reviewQueue.map((item, index) => ({
      id: String(item.id || item.url || item.title || `review-${index}`),
      title: String(item.title || "Untitled"),
      domain: String(item.domain || "unknown"),
      reason: String(item.reason || "Needs review"),
      url: item.url || ""
    })),
    records: snapshot.records.map((record, index) => ({
      id: String(record.id || record.normalizedUrl || record.url || index),
      title: String(record.title || "Untitled"),
      url: String(record.url || ""),
      domain: String(record.domain || "unknown"),
      normalizedUrl: String(record.normalizedUrl || record.normalized_url || record.url || ""),
      folderPathLabel: String(record.folderPathLabel || asArray(record.folderPath).join(" / ")),
      folderPath: asArray(record.folderPath),
      year: record.year || null,
      dateAdded: record.dateAdded || null,
      topics: asArray(record.topics),
      resourceType: String(record.resourceType || "reference")
    }))
  };
}

function normalizeCountItems(items) {
  return items.map((item) => ({
    label: String(item.label || "Unknown"),
    count: asNumber(item.count)
  }));
}

function normalizeDimensions(items) {
  return items.map((item) => ({
    label: String(item.label || "Unknown dimension"),
    count: asNumber(item.count),
    share: Math.max(0, Math.min(100, asNumber(item.share)))
  }));
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
