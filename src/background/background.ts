chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
    case 'openSettings':
        chrome.tabs.create({
            url: chrome.runtime.getURL('local.html#/settings'),
        });
        break;

    case 'openPayPal':
        chrome.tabs.create({
            url: 'https://www.paypal.me/ElmerTecson',
        });
        break;
    }
});
