import getCustomsConfig from "@/utils/Settings/getCustomsConfig";
import getConfig from "@/utils/Settings/getConfig";
import camelToKebab from "@/utils/camelToKebab";

async function setRootVars(customs_config: Record<string, Record<string, string>>) {
    const config = await getConfig(); 
    const selected = customs_config[config.customizationSettings!.currentCustomsName!]!;
    const style = document.createElement('style');
    style.id = 'custom-vars';
    style.textContent = Object.entries(selected)
      .map(([key, value]) => `:root { --${camelToKebab(key)}: ${value}; }`)
      .join('\n');
    document.head.appendChild(style);
}

(async function LoadCustomizations() {
    const config = await getCustomsConfig();
    await setRootVars(config);
})();