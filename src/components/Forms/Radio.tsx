import '@/styles/components/Forms/Radio.css';
import { RadioGroup, Radio as HUIRadio } from '@headlessui/react';
import { useState } from 'react';
import CircleIcon from '@/assets/circle.svg?react';
import type { RadioProps } from '@/types/components';

export default function Radio({
    className = '',
    initialState,
    configName,
    options,
    label,
    storageFunction,
    ...props
}: RadioProps) {
    const [selected, setSelected] = useState(initialState);

    const handleChange = async (newValue: string) => {
        setSelected(newValue);
        await storageFunction(configName, newValue);
    };

    return (
        <RadioGroup
            value={selected}
            onChange={handleChange}
            aria-label={label}
            className="radio-group noselect"
            {...props}
        >
            {options.map((opt) => (
                <HUIRadio
                    key={opt.optionName}
                    value={opt.optionName}
                    className="radio"
                >
                    <div className="circle-icon-container">
                        <CircleIcon className="circle-icon" />
                    </div>
                    <p className="input-text">{opt.name}</p>
                </HUIRadio>
            ))}
        </RadioGroup>
    )
}