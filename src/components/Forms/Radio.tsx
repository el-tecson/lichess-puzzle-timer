import '@/styles/components/Forms/Radio.css';
import { RadioGroup, Radio as HUIRadio } from '@headlessui/react';
import { useState } from 'react';
import changeBehaviorSettings from '@/utils/Settings/behavior';
import CircleIcon from '@/assets/circle.svg?react';

export default function Radio({
    className = '',
    initialState,
    configName,
    options,
    label,
    ...props
}: {
    className?: string;
    initialState: string;
    configName: string;
    options: {
        name: string;
        optionName: string;
    }[];
    label: string;
    [key: string]: any;
}) {
    const [selected, setSelected] = useState(initialState);

    const handleChange = async (newValue: string) => {
        setSelected(newValue);
        await changeBehaviorSettings(configName, newValue);
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