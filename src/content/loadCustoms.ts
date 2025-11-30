import getCustomsConfig from '@/utils/Settings/getCustomsConfig';
import getConfig from '@/utils/Settings/getConfig';
import camelToKebab from '@/utils/camelToKebab';

export async function setRootVars(customs_config: Record<string, Record<string, string>>) {
    const config = await getConfig();
    const selected = customs_config[config.customizationSettings!.currentCustomsName!]!;
    const style = document.createElement('style');
    style.id = 'custom-vars';
    style.textContent = Object.entries(selected)
        .map(([key, value]) => `:root { --${camelToKebab(key)}: ${value}; }`)
        .join('\n');
    document.head.appendChild(style);
}

export async function setShadowRootVars(
    shadowRoot: ShadowRoot,
    customs_config: Record<string, Record<string, string>>,
) {
    const config = await getConfig();
    const selected = customs_config[config.customizationSettings!.currentCustomsName!]!;

    // Remove old vars if they exist
    const oldStyle = shadowRoot.getElementById('custom-vars');
    if (oldStyle) oldStyle.remove();

    const style = document.createElement('style');
    style.id = 'custom-vars';

    // CSS variables inside :host so they apply to shadow DOM
    style.textContent = Object.entries(selected)
        .map(([key, value]) => `:host { --${camelToKebab(key)}: ${value}; }`)
        .join('\n');

    shadowRoot.appendChild(style);
}

(async function LoadCustomizations() {
    const config = await getCustomsConfig();
    await setRootVars(config);
})();
