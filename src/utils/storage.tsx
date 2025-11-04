export async function get(item: string, fallbackConfig = {}): Promise<Record<string, string>> {
  if (!chrome?.storage?.sync) {
    console.warn("chrome.storage.sync not available, using fallback config");
    return fallbackConfig;
  }

  return new Promise((resolve) => {
    chrome.storage.sync.get([item], (res) => {
      resolve(res[item] || fallbackConfig);
    });
  });
}

export async function set(item: string, value: Record<string, string>): Promise<void> {
  if (!chrome?.storage?.sync) {
    console.warn("chrome.storage.sync not available — cannot save config");
    return;
  }

  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [item]: value }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving to chrome.storage.sync:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}