export type CheckboxProps = {
    className?: string;
    initialState: boolean;
    configName: string;
    text?: string;
    storageFunction: Function;
    [key: string]: any;
};

export type InputProps = {
    className?: string;
    initialState: number;
    configName: string;
    min?: string;
    max?: string;
    storageFunction: Function;
    [key: string]: any;
};

export type RadioProps = {
    className?: string;
    initialState: string;
    configName: string;
    options: {
        name: string;
        optionName: string;
    }[];
    label: string;
    storageFunction: Function;
    [key: string]: any;
};

export type TimePickerProps = {
    initialState: string;
    configName: string;
    label: string;
    storageFunction: Function;
    [key: string]: any;
};

export type ListboxProps = {
    className?: string;
    initialState: string;
    configName: string;
    storageFunction: Function;
    options: Record<string, Record<string, string>>;
    label: string;
    [key: string]: any;
};

export type ColorPickerProps = {
    className?: string;
    initialState: string;
    configName: string;
    storageFunction: Function;
    label: string;
    [key: string]: any;
};

export type SwitchProps = {
    className?: string;
    initialState: boolean;
    configName: string;
    text?: string;
    storageFunction: Function;
    [key: string]: any;
};
