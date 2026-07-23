import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const extensionDir = path.join(repoRoot, "extension");
const distDir = path.join(repoRoot, "dist");
const manifestPath = path.join(extensionDir, "manifest.json");
const packageJsonPath = path.join(repoRoot, "package.json");
const releaseNotesPath = path.join(repoRoot, "docs", "external-test-release-notes.md");
const checklistPath = path.join(repoRoot, "docs", "external-tester-checklist.md");
const operatorFiles = [
  ["docs/p0.8-test-execution-runbook.md", "P0.8_RUNBOOK.md"],
  ["docs/p0.8-cohort-tracker.csv", "p0.8-cohort-tracker.csv"],
  ["docs/p0.8-feedback-log.csv", "p0.8-feedback-log.csv"],
  ["docs/tester-invitation.md", "TESTER_INVITATION.md"],
  ["docs/external-feedback-form-schema.md", "FEEDBACK_FORM_SCHEMA.md"],
  ["docs/test-cohort-retrospective.md", "COHORT_RETROSPECTIVE.md"],
  [".github/release-drafts/chrome-memory-mirror-v0.1.1.md", "GITHUB_RELEASE_DRAFT.md"]
];
const allowedExtensionFiles = [
  "manifest.json",
  "background.js",
  "bookmark-profile-engine.js",
  "sidepanel.html",
  "sidepanel.css",
  "sidepanel.js",
  "report.html",
  "report.css",
  "report.js",
  "options.html",
  "options.css",
  "options.js"
];
const disallowedPatterns = [
  { label: "network fetch", pattern: /fetch\s*\(/ },
  { label: "XMLHttpRequest", pattern: /XMLHttpRequest/ },
  { label: "bookmark write API", pattern: /chrome\.bookmarks\.(create|update|remove|move)/ },
  { label: "history API", pattern: /chrome\.history/ },
  { label: "identity API", pattern: /chrome\.identity|getProfileUserInfo/ },
  { label: "localhost handoff", pattern: /localhost:3002|127\.0\.0\.1/ }
];

async function main() {
  const [manifest, packageJson] = await Promise.all([
    readJson(manifestPath),
    readJson(packageJsonPath)
  ]);

  validateManifest(manifest);
  await validateExtensionFiles();

  const version = manifest.version;
  if (packageJson.version !== version) {
    throw new Error(`Version mismatch: package.json is ${packageJson.version}, extension manifest is ${version}.`);
  }

  const bundleName = `chrome-memory-mirror-v${version}-unpacked`;
  const operatorKitName = `${bundleName}-operator-kit`;
  const bundleDir = path.join(distDir, bundleName);
  const operatorKitDir = path.join(distDir, operatorKitName);
  const zipPath = path.join(distDir, `${bundleName}.zip`);
  const operatorZipPath = path.join(distDir, `${operatorKitName}.zip`);
  const manifestSummaryPath = path.join(distDir, `${bundleName}-manifest-summary.json`);

  await fs.rm(bundleDir, { recursive: true, force: true });
  await fs.rm(operatorKitDir, { recursive: true, force: true });
  await fs.mkdir(bundleDir, { recursive: true });
  await fs.mkdir(operatorKitDir, { recursive: true });

  for (const fileName of allowedExtensionFiles) {
    await fs.copyFile(path.join(extensionDir, fileName), path.join(bundleDir, fileName));
  }

  await fs.writeFile(path.join(bundleDir, "TESTER_README.md"), createTesterReadme(manifest), "utf8");
  await fs.copyFile(releaseNotesPath, path.join(bundleDir, "RELEASE_NOTES.md"));
  await fs.copyFile(checklistPath, path.join(bundleDir, "TESTER_CHECKLIST.md"));
  await fs.writeFile(
    manifestSummaryPath,
    `${JSON.stringify(createManifestSummary(manifest), null, 2)}\n`,
    "utf8"
  );
  await createOperatorKit(operatorKitDir);

  const zipResult = await createZip(bundleName, zipPath);
  const operatorZipResult = await createZip(operatorKitName, operatorZipPath);
  const checksumFiles = [manifestSummaryPath];
  if (zipResult.created) checksumFiles.push(zipPath);
  if (operatorZipResult.created) checksumFiles.push(operatorZipPath);
  checksumFiles.push(...await listFiles(bundleDir));
  checksumFiles.push(...await listFiles(operatorKitDir));
  await fs.writeFile(path.join(distDir, `${bundleName}-checksums.txt`), await createChecksums(checksumFiles), "utf8");

  console.log(`Extension test package created: ${path.relative(repoRoot, bundleDir)}`);
  console.log(`Operator kit created: ${path.relative(repoRoot, operatorKitDir)}`);
  if (zipResult.created) {
    console.log(`Zip archive created: ${path.relative(repoRoot, zipPath)}`);
  } else {
    console.log("Zip archive skipped: system zip command is unavailable.");
  }
  if (operatorZipResult.created) {
    console.log(`Operator kit zip created: ${path.relative(repoRoot, operatorZipPath)}`);
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function validateManifest(manifest) {
  const expectedPermissions = ["bookmarks", "storage", "sidePanel"];
  const permissions = manifest.permissions || [];
  const unexpectedPermissions = permissions.filter((permission) => !expectedPermissions.includes(permission));
  const missingPermissions = expectedPermissions.filter((permission) => !permissions.includes(permission));

  if (manifest.manifest_version !== 3) throw new Error("Extension package requires Manifest V3.");
  if (missingPermissions.length) throw new Error(`Manifest is missing permissions: ${missingPermissions.join(", ")}.`);
  if (unexpectedPermissions.length) throw new Error(`Manifest has unexpected permissions: ${unexpectedPermissions.join(", ")}.`);
  if (manifest.host_permissions?.length) throw new Error("Manifest must not request host_permissions for the external test package.");
  if (manifest.content_scripts?.length) throw new Error("Manifest must not include content_scripts for the external test package.");
}

async function validateExtensionFiles() {
  for (const fileName of allowedExtensionFiles) {
    const filePath = path.join(extensionDir, fileName);
    await fs.access(filePath, fsConstants.R_OK);

    if (!/\.(js|json|html|css)$/.test(fileName)) continue;

    const source = await fs.readFile(filePath, "utf8");
    const match = disallowedPatterns.find(({ pattern }) => pattern.test(source));
    if (match) throw new Error(`${fileName} contains disallowed ${match.label}.`);
  }
}

async function createZip(bundleName, zipPath) {
  try {
    await fs.rm(zipPath, { force: true });
    execFileSync("zip", ["-qr", path.basename(zipPath), bundleName], { cwd: distDir, stdio: "ignore" });
    return { created: true };
  } catch {
    return { created: false };
  }
}

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  }));
  return files.flat();
}

async function createOperatorKit(operatorKitDir) {
  for (const [source, target] of operatorFiles) {
    await fs.copyFile(path.join(repoRoot, source), path.join(operatorKitDir, target));
  }

  await fs.writeFile(
    path.join(operatorKitDir, "README.md"),
    `# Chrome Memory Mirror P0.8 Operator Kit

Use this folder to run the first 3-5 person external test.

Start with \`P0.8_RUNBOOK.md\`, track invitations in \`p0.8-cohort-tracker.csv\`, record results in \`p0.8-feedback-log.csv\`, then run:

\`\`\`bash
npm run summarize-cohort -- dist/chrome-memory-mirror-v0.1.1-unpacked-operator-kit/p0.8-feedback-log.csv
\`\`\`

Do not collect private bookmark URLs, exported snapshots, personal folder names, or screenshots with sensitive bookmarks.
`,
    "utf8"
  );
}

async function createChecksums(filePaths) {
  const rows = [];
  for (const filePath of filePaths) {
    const content = await fs.readFile(filePath);
    const hash = createHash("sha256").update(content).digest("hex");
    rows.push(`${hash}  ${path.relative(distDir, filePath)}`);
  }
  return `${rows.sort().join("\n")}\n`;
}

function createManifestSummary(manifest) {
  return {
    name: manifest.name,
    version: manifest.version,
    minimumChromeVersion: manifest.minimum_chrome_version,
    permissions: manifest.permissions,
    hostPermissions: manifest.host_permissions || [],
    hasContentScripts: Boolean(manifest.content_scripts?.length),
    packageNotes: [
      "External tester package is local-first.",
      "No bookmark write permissions are requested.",
      "No host permissions or content scripts are included."
    ]
  };
}

function createTesterReadme(manifest) {
  return `# ${manifest.name} ${manifest.version} Tester Package

This unpacked Chrome extension package is for first external MVP testing.

## Install

1. Open \`chrome://extensions\`.
2. Enable \`Developer mode\`.
3. Click \`Load unpacked\`.
4. Select this unpacked package folder.
5. Open the \`${manifest.name}\` side panel.

## Test path

1. Confirm the first-run state is empty.
2. Click \`Scan bookmarks\`.
3. Open the built-in full report.
4. Mark at least one feedback action.
5. Approve or ignore one suggested rule.
6. Return to the side panel and check the tester loop.
7. Clear local data when finished.

## Privacy boundary

- Reads bookmark titles, URLs, folders, and saved dates only after user-triggered scan.
- Does not edit, move, delete, or create Chrome bookmarks.
- Does not read browser history, page contents, passwords, cookies, or open tabs.
- Stores profile snapshots, feedback, and approved rules in Chrome extension local storage.
- Exported snapshots may contain private URLs and inferred interests. Do not share them publicly.

## Feedback

Please file feedback through GitHub Issues using the \`Extension test feedback\` template.
Do not paste private bookmark URLs, personal folder names, exported snapshots, or screenshots containing sensitive bookmarks.
`;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
