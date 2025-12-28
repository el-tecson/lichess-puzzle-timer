import getConfig from '@/utils/Settings/getConfig';
import default_config from '@/configs/default_config.json';
import default_customs_config from '@/configs/dark_custom.json';
import { set } from '@/utils/storage';
import setAnalytics from '@/utils/Analytics/setAnalytics';
import getAnalytics from '@/utils/Analytics/getAnalytics';
import getCustomsConfig from '@/utils/Settings/getCustomsConfig';
import { CUSTOMS_CONFIG } from '@/constants';

type Config = typeof default_config;
type CustomsConfig = typeof default_customs_config;

// Constrain T to object
function mergeConfig<T extends object>(defaultCfg: T, userCfg: Partial<T>): T {
    const merged: any = { ...userCfg };

    for (const key in defaultCfg) {
        const defaultValue = defaultCfg[key];
        const userValue = merged[key];

        // If it's an object (not array), merge recursively
        if (
            defaultValue &&
            typeof defaultValue === 'object' &&
            !Array.isArray(defaultValue)
        ) {
            merged[key] = mergeConfig(defaultValue, (userValue as object) || {});
        } else if (!(key in merged)) {
            // If key is missing in user config, add default
            merged[key] = defaultValue;
        }
    }

    // Remove keys not in default config
    for (const key in merged) {
        if (!(key in defaultCfg)) {
            delete merged[key];
        }
    }

    return merged as T;
}

async function updateConfig() {
    const userConfig: Partial<Config> = await getConfig();
    const updatedConfig = mergeConfig(default_config, userConfig);
    await set('config', updatedConfig);
    const customsConfig: Partial<CustomsConfig> = await getCustomsConfig();
    const updatedCustomsConfig = mergeConfig(default_customs_config, customsConfig);
    await set(CUSTOMS_CONFIG, updatedCustomsConfig);
    await setAnalytics(await getAnalytics());
}

updateConfig();
