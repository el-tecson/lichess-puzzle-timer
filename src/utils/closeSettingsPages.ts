import browser from 'webextension-polyfill';

export default function closeSettingsPages() {
    browser.runtime.sendMessage({ type: 'REQUEST_EXTENSION_CLOSE' });
}
