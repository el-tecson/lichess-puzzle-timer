let analyticsData = {
    totalPuzzles: 0,
    solved: 0,
    unsolved: 0
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openSettings') {
        chrome.tabs.create({
            url: chrome.runtime.getURL('local.html#/settings'),
        });
    }
    if (message.action === 'openPayPal') {
        chrome.tabs.create({
            url: 'https://www.paypal.me/ElmerTecson',
        });
    }
    if (message.action === 'updateAnalytics') {
        analyticsData = message.data
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0]?.id;
            if (!tabId) return;

            chrome.tabs.sendMessage(tabId, {
                action: "analyticsUpdated"
            });
        });
    } else if (message.action === 'getAnalytics') {
        sendResponse({data: analyticsData});
    }
});
