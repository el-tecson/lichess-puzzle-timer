import { CONFIG } from "@/constants";
import getConfig from "@/utils/Settings/getConfig";
import { set } from "@/utils/storage";

export default async function changePreferencesSettings(
    item: string,
    value: any
): Promise<void> {
    const config = await getConfig();
    await set(CONFIG, {
        ...config,
        preferencesSettings: {
            ...config.preferencesSettings,
            [item]: value,
        }
    })
}