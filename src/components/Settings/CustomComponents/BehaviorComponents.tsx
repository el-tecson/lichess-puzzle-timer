import {
    Input as CustomInput,
    Radio as CustomRadio,
    TimePicker as CustomTimePicker,
    Listbox as CustomListbox,
} from '@/components/Forms';
import { Checkbox as CustomCheckbox } from '@/components/Templates';
import changeBehaviorSettings from '@/utils/Settings/behavior';
import type { InputProps, ListboxProps, RadioProps, TimePickerProps } from '@/types/components';
import type { CheckboxProps } from '@/types/templates';
import { changeTimePresets } from '@/utils/time-presets/changeTimePresets';

export function Checkbox({
    initialState,
    configName,
    ...props
}: Omit<CheckboxProps, 'storageFunction'>) {
    return (
        <CustomCheckbox
            initialState={initialState}
            configName={configName}
            storageFunction={changeBehaviorSettings}
            {...props}
        />
    );
}

export function Input({ initialState, configName, ...props }: Omit<InputProps, 'storageFunction'>) {
    return (
        <CustomInput
            initialState={initialState}
            configName={configName}
            storageFunction={changeTimePresets}
            {...props}
        />
    );
}

export function Radio({
    initialState,
    configName,
    options,
    label,
    ...props
}: Omit<RadioProps, 'storageFunction'>) {
    return (
        <CustomRadio
            initialState={initialState}
            configName={configName}
            options={options}
            label={label}
            storageFunction={changeTimePresets}
            {...props}
        />
    );
}

export function TimePicker({
    initialState,
    configName,
    label,
    ...props
}: Omit<TimePickerProps, 'storageFunction'>) {
    return (
        <CustomTimePicker
            initialState={initialState}
            configName={configName}
            label={label}
            storageFunction={changeTimePresets}
            {...props}
        />
    );
}

export function Listbox({
    initialState,
    configName,
    storageFunction,
    options,
    label,
    ...props
}: Omit<ListboxProps, 'storageFunction'>) {
    return (
        <CustomListbox
            initialState={initialState}
            configName={configName}
            storageFunction={changeBehaviorSettings}
            options={options}
            label={label}
            {...props}
        />
    );
}
