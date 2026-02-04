chrome.storage.local.get(["enabled"], ({ enabled }) => {
  if (enabled === undefined) {
    chrome.storage.local.set({ enabled: true });
  }
});
