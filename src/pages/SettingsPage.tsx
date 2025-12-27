import { TabGroup, TabList, TabPanels } from '@headlessui/react';
import * as Settings from '@/components/Settings/index';
import '@/styles/Settings.css';
import { useEffect } from 'react';

export default function SettingsPage() {
    useEffect(() => {
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg.type === 'REQUEST_EXTENSION_CLOSE') {
                window.close(); // ✅ allowed, no permissions needed
            }
        });
    })

    return (
        <>
            <h1 className="page-title">Settings</h1>
            <TabGroup className="tab-group">
                <TabList className="tab-list">
                    <Settings.BehaviorTab />
                    <Settings.CustomizationTab />
                    <Settings.PreferencesTab />
                </TabList>
                <TabPanels className="tab-panels">
                    <Settings.BehaviorPanel />
                    <Settings.CustomizationPanel />
                    <Settings.PreferencesPanel />
                </TabPanels>
            </TabGroup>
        </>
    );
}
