import DarkCustomConf from "@/configs/dark_custom.json";
import camelToKebab from "@/utils/camelToKebab";

async function getCustomConfig(): Promise<Record<string, string> | null> {
  if (!chrome?.storage?.sync) {
    console.warn("chrome.storage.sync not available, using fallback config");
    return DarkCustomConf;
  }

  return new Promise((resolve) => {
    chrome.storage.sync.get(['custom_conf'], (res) => {
      resolve(res.custom_conf || DarkCustomConf);
    });
  });
}

function setRootVars(config: Record<string, string>) {
  const style = document.createElement('style');
  style.id = 'custom-vars';
  style.textContent = Object.entries(config)
    .map(([key, value]) => `:root { --${camelToKebab(key)}: ${value}; }`)
    .join('\n');
  document.head.appendChild(style);
}

(async function LoadCustomizations() {
    const config = await getCustomConfig();
    if (config) {
        setRootVars(config);
    }
    else {
        setRootVars(DarkCustomConf);
    }
})();