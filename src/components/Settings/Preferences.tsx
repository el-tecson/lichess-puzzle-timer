import { Tab, TabPanel } from "@headlessui/react";
import PreferencesIcon from '@/assets/preferences.svg?react';

export function PreferencesTab() {
    return (
        <Tab className="tab">
            <PreferencesIcon />
            <p className="tab-name">Preferences</p>
        </Tab>
    )
}

export function PreferencesPanel() {
    return (
        <TabPanel className="tab-panel">

        </TabPanel>
    )
}