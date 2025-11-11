import { Tab as HUITab } from '@headlessui/react';

export default function Tab({ className = '', ...props }) {
    return (
        <HUITab
            className={({ selected }) => `tab ${className} ${selected ? 'active' : ''}`}
            {...props}
        />
    );
}
