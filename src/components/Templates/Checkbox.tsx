import { Checkbox as CustomCheckbox } from "@/components/Forms";
import type { ReactNode } from "react";

export default function Checkbox({
    className = '',
    text,
    configName,
    initialState,
    children,
    ...props
}: {
    className?: string;
    text: string;
    configName: string;
    initialState: boolean;
    children?: ReactNode;
    [key: string]: any;
}) {
    return (
        <div
            className={`checkbox-container noselect ${className}`}
            {...props}
        >
            <CustomCheckbox
                initialState={initialState}
                configName={configName}
                text={text}
            />
            {children}
        </div>
    )
}