import '@/styles/components/Forms/Listbox.css';
import type { ListboxProps } from '@/types/components';
import {
    Listbox as HUIListbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { useState, useEffect } from 'react';
import DropdownArrow from '@/assets/dd-arrow.svg?react';

export default function Listbox({
    className = '',
    initialState,
    configName,
    storageFunction,
    options,
    label,
    ...props
}: ListboxProps) {
    const [selected, setSelected] = useState(initialState);

    useEffect(() => {
        setSelected(initialState);
    }, [initialState]);

    const handleChange = async (newValue: ListboxProps['initialState']) => {
        setSelected(newValue);
        await storageFunction(configName, newValue);
    };

    return (
        <div className="listbox">
            <p className="listbox-label">{label}</p>
            <HUIListbox value={selected} onChange={handleChange} {...props}>
                <ListboxButton className={`listbox-button noselect ${className}`}>
                    <p className="listbox-selected">{options[selected]?.textLabel}</p>
                    <DropdownArrow className="dropdown-arrow-icon" aria-hidden="true" />
                </ListboxButton>
                <ListboxOptions anchor="bottom" transition className={`listbox-options ${className}`}>
                    {Object.entries(options).map(([key, value]) => (
                        <ListboxOption key={key} value={key} className="listbox-option">
                            {value.textLabel}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </HUIListbox>
        </div>
    );
}
