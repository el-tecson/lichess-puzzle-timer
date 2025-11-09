import type { ReactNode } from "react";

export type CheckboxProps = {
    className?: string;
    initialState: boolean;
    configName: string;
    text?: string;
    storageFunction: Function;
    [key: string]: any;
}

export type InputProps = {
    className?: string;
    initialState: number;
    configName: string;
    min?: string;
    max?: string;
    storageFunction: Function;
    [key: string]: any;
}

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
}

export type TimePickerProps = {
    initialState: string;
    configName: string;
    label: string;
    storageFunction: Function;
    [key: string]: any;
}