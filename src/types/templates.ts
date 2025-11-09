import type { CheckboxProps as CustomCheckboxProps } from "@/types/components"
import type { ReactNode } from "react"

export type CheckboxProps = CustomCheckboxProps & {
    className?: string;
    children?: ReactNode;
}