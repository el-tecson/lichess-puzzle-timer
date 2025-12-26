import getTimePresets from "@/utils/time-presets/getTimePresets";
import getConfig from "@/utils/Settings/getConfig";
import { TIME_PRESETS } from "@/constants";
import { set } from "@/utils/storage";
import changeBehaviorSettings from "../Settings/behavior";

export async function changeTimePresets(item: string, value: any): Promise<void> {
    const timePresets = await getTimePresets();
    const config = await getConfig();
    await set(TIME_PRESETS, {
        ...timePresets,
        "6CUSTOM": {
            ...timePresets[config.behaviorSettings?.currentTimePreset],
            textLabel: 'Custom',
            [item]: value,
        },
    });
    await changeBehaviorSettings('currentTimePreset', '6CUSTOM');
}