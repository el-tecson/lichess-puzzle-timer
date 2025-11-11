import '@/styles/components/Forms/Input.css';
import { Input as HUIInput } from '@headlessui/react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import useAutosizeInput from '@/utils/hooks/useAutosizeInput';
import type { InputProps } from '@/types/components';

export default function Input({
    className = '',
    initialState,
    configName,
    min = '0',
    max = '9007199254740991',
    storageFunction,
    ...props
}: InputProps) {
    const [value, setValue] = useState(initialState);
    const inputRef = useAutosizeInput(value);

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setValue(newValue);
        await storageFunction(configName, newValue);
    };

    return (
        <HUIInput
            as="input"
            ref={inputRef}
            type="number"
            min={min}
            max={max}
            value={value.toString()}
            onChange={handleChange}
            className="input"
            {...props}
        />
    );
}
