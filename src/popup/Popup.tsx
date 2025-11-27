import Logo from '@/assets/lptimer-logo-wide.svg?react';
import SettingsIcon from '@/assets/settings.svg?react';
import ReloadIcon from '@/assets/reload.svg?react';
import PayPalIcon from '@/assets/paypal.svg?react';
import '@/styles/Popup.css';
import { LICHESS_LINK } from '@/constants';

export default function Popup() {
    return (
        <section id="popup">
            <div className="popup-container">
                <Logo className="logo" height="48" width="202" onClick={openLocalWebsite} />
                <div className="buttons-container">
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
                        <span className="btn-text">Donate via PayPal</span>
                    </button>
                </div>
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
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.id && typeof tab.url === 'string' && tab.url.startsWith(LICHESS_LINK)) {
                chrome.tabs.reload(tab.id);
            }
        });
    });
}
