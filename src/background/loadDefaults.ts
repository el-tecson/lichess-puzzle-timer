import { CONFIG, CUSTOMS_CONFIG, TIME_PRESETS } from '@/constants';
import getConfig from '@/utils/Settings/getConfig';
import getCustomsConfig from '@/utils/Settings/getCustomsConfig';
import { set } from '@/utils/storage';
import getTimePresets from '@/utils/time-presets/getTimePresets';

await (async function setDefaultConfig() {
    await set(CONFIG, await getConfig());
    await set(CUSTOMS_CONFIG, await getCustomsConfig());
    await set(TIME_PRESETS, await getTimePresets());
})();
