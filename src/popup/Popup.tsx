import Logo from '@/assets/lptimer-logo-wide.svg?react';
import SettingsIcon from '@/assets/settings.svg?react';
import ReloadIcon from '@/assets/reload.svg?react';
import PayPalIcon from '@/assets/paypal.svg?react';
import '@/styles/Popup.css';
import { Switch } from '@/components/Settings/CustomComponents/PreferencesComponents';
import { useEffect, useState } from 'react';
import getConfig from '@/utils/Settings/getConfig';
import { CONFIG } from '@/constants';
import VersionIndicator from '@/components/VersionIndicator';

export default function Popup() {
    const [settings, setSettings] = useState<Record<string, any> | null>(null);

    // Load config
    useEffect(() => {
        (async () => {
            const config = await getConfig();
            setSettings(config);
        })();

        const handleChange = (
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) => {
            if (areaName === 'local' && changes[CONFIG]) {
                setSettings(changes[CONFIG]?.newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleChange);
        return () => chrome.storage.onChanged.removeListener(handleChange);
    }, []);

    if (!settings) return null;

    return (
        <section id="popup">
            <div className="popup-container">
                <Logo className="logo" height="48" width="202" onClick={openLocalWebsite} />
                <div className="buttons-container">
                    <Switch
                        initialState={settings.preferencesSettings?.enableTimer}
                        configName="enableTimer"
                        text="Enable timer."
                    />
                    <button className="btn" id="openSettings" onClick={openSettings}>
                        <SettingsIcon />
                        <span className="btn-text">Settings</span>
                    </button>
                    <button className="btn" id="reloadTimer" onClick={reloadAllLichessTabs}>
                        <ReloadIcon />
                        <span className="btn-text">Reload timer</span>
                    </button>
                    <button
                        className="btn"
                        id="donateBtn"
                        onClick={() => {
                            chrome.tabs.create({
                                url: 'https://www.paypal.me/ElmerTecson',
                            });
                        }}
                    >
                        <PayPalIcon />
                        <span className="btn-text">Support me on PayPal</span>
                    </button>
                </div>
                <VersionIndicator
                    style={{
                        left: '-16px',
                        bottom: '-16px'
                    }}
                />
            </div>
        </section>
    );
}

function openSettings() {
    chrome.tabs.create({
        url: chrome.runtime.getURL('local.html#/settings'),
    });
}

function openLocalWebsite() {
    chrome.tabs.create({
        url: chrome.runtime.getURL('local.html'),
    });
}

function reloadAllLichessTabs() {
    chrome.tabs.query(
        { url: 'https://lichess.org/*' },
        (tabs) => {
            tabs.forEach((tab) => {
                if (tab.id) chrome.tabs.reload(tab.id);
            });
        },
    );
}
