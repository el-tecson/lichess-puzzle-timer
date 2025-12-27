import '@/styles/components/Forms/Switch.css';
import type { SwitchProps } from '@/types/components';
import { Switch as HUISwitch } from '@headlessui/react';
import { useState } from 'react';
import CircleIcon from '@/assets/circle.svg?react';

export default function Switch({
    className = '',
    initialState = false,
    configName,
    text = '[INSERT TEXT]',
    storageFunction,
    ...props
}: SwitchProps) {
    const [enabled, setEnabled] = useState(initialState);
    const handleClick = async () => {
        const newValue = !enabled;
        setEnabled(newValue);
        await storageFunction(configName, newValue);
    };

    return (
        <HUISwitch
            checked={enabled}
            onChange={handleClick}
            className={`switch ${className}`}
            {...props}
        >
            <div className="switch-icon-container">
                <CircleIcon className="switch-icon" />
            </div>
            <p className="input-text">{text}</p>
        </HUISwitch>
    );
}
