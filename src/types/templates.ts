import type {
    CheckboxProps as CustomCheckboxProps, 
    SwitchProps as CustomSwitchProps, 
    SliderProps as CustomSliderProps
} from '@/types/components';
import type { ReactNode } from 'react';

export type CheckboxProps = CustomCheckboxProps & {
    className?: string;
    children?: ReactNode;
};

export type SwitchProps = CustomSwitchProps & {
    className?: string;
    children?: ReactNode;
};

export type SliderProps = CustomSliderProps & {
    className?: string;
    children?: ReactNode;
    label: string;
};