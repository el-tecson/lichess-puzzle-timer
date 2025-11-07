import '@/styles/components/Forms/Checkbox.css';
import { Checkbox as HUICheckbox } from "@headlessui/react";
import CheckIcon from '@/assets/check.svg?react';
import { useState } from "react";
import changeBehaviorSettings from "@/utils/Settings/behavior";

export default function Checkbox({
    className = '',
    initialState = false,
    configName,
    text = "[INSERT TEXT]",
    ...props
}: {
    className?: string;
    initialState: boolean;
    configName: string;
    text?: string;
    [key: string]: any;
}) {
    const [enabled, setEnabled] = useState(initialState);
    const handleClick = async () => {
        const newValue = !enabled;
        setEnabled(newValue);
        await changeBehaviorSettings(configName, newValue);
    };

    return (
        <HUICheckbox
            checked={enabled}
            onChange={handleClick}
            className={`checkbox ${className}`}
            {...props}
        >
            <div className="check-icon-container">
                <CheckIcon className="check-icon" />
            </div>
            <p className="input-text">
                {text}
            </p>
        </HUICheckbox>
    )
}