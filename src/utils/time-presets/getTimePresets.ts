import { TIME_PRESETS } from '@/constants';
import { get } from '@/utils/storage';
import TimePresetsConfig from '@/configs/time_presets.json';

export default async function getTimePresets() {
    const timePresets = await get(TIME_PRESETS, TimePresetsConfig);
    return timePresets as Record<string, Record<string, number | string>>;
}
