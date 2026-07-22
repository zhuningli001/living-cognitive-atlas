const HANDOFF_REQUEST = "living-cognitive-atlas:request-extension-snapshot";
const HANDOFF_RESPONSE = "living-cognitive-atlas:extension-snapshot";
const HANDOFF_IMPORTED = "living-cognitive-atlas:extension-snapshot-imported";

if (isReportImportPage()) {
  sendLatestSnapshot();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (changes.profileSnapshot?.newValue || changes.preferredLanguage?.newValue) {
      sendLatestSnapshot();
    }
  });

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== window.location.origin) return;
    if (event.data?.source === HANDOFF_REQUEST) sendLatestSnapshot();
    if (event.data?.source === HANDOFF_IMPORTED) markSnapshotImported(event.data.snapshotGeneratedAt);
  });
}

async function sendLatestSnapshot() {
  try {
    const { profileSnapshot, preferredLanguage } = await chrome.storage.local.get(["profileSnapshot", "preferredLanguage"]);
    if (!profileSnapshot) return;

    window.postMessage(
      {
        source: HANDOFF_RESPONSE,
        snapshot: profileSnapshot,
        preferredLanguage
      },
      window.location.origin
    );
  } catch {
    // The report page can still use manual JSON import if extension storage is unavailable.
  }
}

function isReportImportPage() {
  return window.location.pathname === "/profile/import";
}

async function markSnapshotImported(snapshotGeneratedAt) {
  try {
    await chrome.storage.local.set({
      reportHandoffState: {
        status: "imported",
        snapshotGeneratedAt: snapshotGeneratedAt || null,
        importedAt: new Date().toISOString()
      }
    });
  } catch {
    // The report still works without reflecting completion in the side panel.
  }
}
