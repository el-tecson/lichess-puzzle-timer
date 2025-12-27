import { ANALYTICS_CONFIG, CONFIG, CUSTOMS_CONFIG, DEFAULT_ANALYTICS, TIME_PRESETS } from "@/constants";
import DefaultConfig from "@/configs/default_config.json";
import DefaultCustomsConfig from "@/configs/dark_custom.json";
import DefaultTimePresets from "@/configs/time_presets.json";
import { set } from "@/utils/storage";
import { setRootVars } from "@/content/loadCustoms";

export default async function resetEverything() {
    await set(CONFIG, DefaultConfig);
    await set(CUSTOMS_CONFIG, DefaultCustomsConfig);
    await setRootVars(DefaultCustomsConfig);
    await set(TIME_PRESETS, DefaultTimePresets);
    await set(ANALYTICS_CONFIG, DEFAULT_ANALYTICS);
}