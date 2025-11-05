import { Input as HUIInput } from "@headlessui/react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import changeBehaviorSettings from "@/utils/Settings/behavior";
import useAutosizeInput from "@/utils/hooks/useAutosizeInput";

export default function Input({
    className = '',
    initialState,
    configName,
    min = "0",
    ...props
}: {
    className?: string;
    initialState: number;
    configName: string;
    min?: string;
    [key: string]: any;
}) {
    const [value, setValue] = useState(initialState);
    const inputRef = useAutosizeInput(value);

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setValue(newValue);
        await changeBehaviorSettings(configName, newValue);
    };

    return (
        <HUIInput
            as="input"
            ref={inputRef}
            type="number"
            value={value.toString()}
            onChange={handleChange}
            className="input"
            {...props}
        />
    )
}