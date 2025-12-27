export default function closeSettingsPages() {
    chrome.runtime.sendMessage({ type: 'REQUEST_EXTENSION_CLOSE' });
}