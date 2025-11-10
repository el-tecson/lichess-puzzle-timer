import { CONFIG, CUSTOMS_CONFIG } from "@/constants";
import getConfig from "@/utils/Settings/getConfig";
import { set } from "@/utils/storage";
import getCustomsConfig from "./getCustomsConfig";
import { setRootVars } from "@/content/loadCustoms";

export default async function changeCustomizationSettings(
    item: string,
    value: any
): Promise<void> {
    const customsConfig = await getCustomsConfig();
    const config = await getConfig();
    await set(CONFIG, {
        ...config,
        customizationSettings: {
            ...config.customizationSettings,
            [item]: value,
        }
    })
    await setRootVars(customsConfig);
}

export async function changeCustomsSettings(
    item: string,
    value: any
): Promise<void> {
    const customsConfig = await getCustomsConfig();
    const config = await getConfig();
    await set(CUSTOMS_CONFIG, {
        ...customsConfig,
        custom: {
            ...customsConfig[config.customizationSettings?.currentCustomsName],
            textLabel: 'Custom',
            [item]: value
        }
    })
    await setRootVars(customsConfig);
}