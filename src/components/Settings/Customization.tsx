import { Tab, TabPanel } from "@headlessui/react";
import BrushIcon from '@/assets/brush.svg?react';

export function CustomizationTab() {
    return (
        <Tab className="tab">
            <BrushIcon />
            <p className="tab-name">Customization</p>
        </Tab>
    )
}

export function CustomizationPanel() {
    return (
        <TabPanel className="tab-panel">

        </TabPanel>
    )
}