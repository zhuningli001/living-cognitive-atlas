import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultFeedbackPath = path.join(repoRoot, "docs", "p0.8-feedback-log.csv");
const feedbackPath = path.resolve(process.argv[2] || defaultFeedbackPath);

const yesValues = new Set(["yes", "y", "true", "1", "done", "complete", "completed"]);
const completionColumns = [
  "installed",
  "scanned",
  "opened_report",
  "marked_feedback",
  "approved_rule",
  "rescanned",
  "cleared_data"
];

async function main() {
  const csv = await fs.readFile(feedbackPath, "utf8");
  const rows = parseCsv(csv).filter((row) => row.tester_id);

  if (!rows.length) {
    throw new Error(`No tester rows found in ${path.relative(repoRoot, feedbackPath)}.`);
  }

  const summary = summarizeRows(rows);
  console.log(renderMarkdown(summary));
}

function summarizeRows(rows) {
  const activeRows = rows.filter((row) => hasAnyProgress(row));
  const completedRows = rows.filter((row) => normalizeBoolean(row.cleared_data) || Number(row.score || 0) >= 2);
  const scores = rows.map((row) => Number(row.score || 0)).filter((score) => Number.isFinite(score));
  const averageScore = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  const scoreTwoCount = rows.filter((row) => Number(row.score || 0) >= 2).length;
  const blockers = rows.filter((row) => String(row.blocker || "").trim());
  const completion = Object.fromEntries(completionColumns.map((column) => [
    column,
    rows.filter((row) => normalizeBoolean(row[column])).length
  ]));

  return {
    rows,
    activeRows,
    completedRows,
    averageScore,
    scoreTwoCount,
    blockers,
    completion,
    decision: recommendDecision({ rows, activeRows, completedRows, averageScore, scoreTwoCount, blockers })
  };
}

function hasAnyProgress(row) {
  return completionColumns.some((column) => normalizeBoolean(row[column])) || Boolean(String(row.completed_at || "").trim());
}

function normalizeBoolean(value) {
  return yesValues.has(String(value || "").trim().toLowerCase());
}

function recommendDecision({ activeRows, completedRows, averageScore, scoreTwoCount, blockers }) {
  if (activeRows.length < 3) return "Fix P0: not enough completed tester evidence yet.";
  if (blockers.length >= 2) return "Fix P0: repeated blockers appeared in the cohort.";
  if (scoreTwoCount >= 3) return "Keep: the first cohort completed the loop; continue to a broader cohort.";
  if (completedRows.length >= 3 && averageScore < 1.5) return "Simplify: testers reached the product but the loop felt heavy or unclear.";
  if (completedRows.length >= 3) return "Deepen: the loop works enough to improve profile quality next.";
  return "Fix P0: completion is still too weak for broader testing.";
}

function renderMarkdown(summary) {
  const lines = [
    "# P0.8 Cohort Summary",
    "",
    `Feedback file: \`${path.relative(repoRoot, feedbackPath)}\``,
    "",
    "## Counts",
    "",
    `- Tester rows: ${summary.rows.length}`,
    `- Testers with any progress: ${summary.activeRows.length}`,
    `- Testers scored 2: ${summary.scoreTwoCount}`,
    `- Average score: ${summary.averageScore.toFixed(2)}`,
    `- Blocker reports: ${summary.blockers.length}`,
    "",
    "## Step Completion",
    "",
    ...completionColumns.map((column) => `- ${formatColumn(column)}: ${summary.completion[column]}/${summary.rows.length}`),
    "",
    "## Blockers",
    ""
  ];

  if (summary.blockers.length) {
    for (const row of summary.blockers) {
      lines.push(`- ${row.tester_id}: ${row.blocker}`);
    }
  } else {
    lines.push("- None recorded.");
  }

  lines.push(
    "",
    "## Recommended Decision",
    "",
    summary.decision,
    "",
    "## Tester Notes",
    ""
  );

  for (const row of summary.rows) {
    const notes = String(row.notes || "").trim() || "No notes.";
    const nextAction = String(row.next_action || "").trim() || "No next action recorded.";
    lines.push(`- ${row.tester_id}: score ${Number(row.score || 0)}. ${notes} Next: ${nextAction}`);
  }

  return lines.join("\n");
}

function formatColumn(column) {
  return column.replaceAll("_", " ");
}

function parseCsv(csv) {
  const rows = splitRows(csv.trim()).filter(Boolean);
  const [headerRow, ...bodyRows] = rows;
  const headers = splitCells(headerRow).map((header) => header.trim());

  return bodyRows.map((row) => {
    const cells = splitCells(row);
    return Object.fromEntries(headers.map((header, index) => [header, (cells[index] || "").trim()]));
  });
}

function splitRows(csv) {
  const rows = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && next === '"') {
      current += char + next;
      index += 1;
      continue;
    }

    if (char === '"') inQuotes = !inQuotes;

    if (char === "\n" && !inQuotes) {
      rows.push(current.replace(/\r$/, ""));
      current = "";
      continue;
    }

    current += char;
  }

  if (current) rows.push(current.replace(/\r$/, ""));
  return rows;
}

function splitCells(row) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < row.length; index += 1) {
    const char = row[index];
    const next = row[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
