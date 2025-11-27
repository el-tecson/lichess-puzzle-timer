chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openSettings') {
        chrome.tabs.create({
            url: chrome.runtime.getURL('local.html#/settings'),
        });
    }
    if (message.action === 'openKoFi') {
        chrome.tabs.create({
            url: 'https://ko-fi.com/',
        });
    }
});
