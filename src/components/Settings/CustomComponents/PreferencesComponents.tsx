import { 
    Checkbox as CustomCheckbox, 
    Switch as CustomSwitch, 
    Slider as CustomSlider,
} from '@/components/Templates';
import changePreferencesSettings from '@/utils/Settings/preferences';
import type { CheckboxProps, SwitchProps, SliderProps } from '@/types/templates';

export function Checkbox({
    initialState,
    configName,
    ...props
}: Omit<CheckboxProps, 'storageFunction'>) {
    return (
        <CustomCheckbox
            initialState={initialState}
            configName={configName}
            storageFunction={changePreferencesSettings}
            {...props}
        />
    );
}

export function Switch({
    initialState,
    configName,
    ...props
}: Omit<SwitchProps, 'storageFunction'>) {
    return (
        <CustomSwitch
            initialState={initialState}
            configName={configName}
            storageFunction={changePreferencesSettings}
            {...props}
        />
    );
}

export function Slider({
    initialState,
    configName,
    label,
    ...props
}: Omit<SwitchProps, 'storageFunction'>) {
    return (
        <CustomSlider
            label={label}
            initialState={initialState}
            configName={configName}
            storageFunction={changePreferencesSettings}
            {...props}
        />
    );
}