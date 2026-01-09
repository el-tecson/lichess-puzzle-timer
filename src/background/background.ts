import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener((message: any) => {
    switch (message.action) {
    case 'openSettings':
        browser.tabs.create({
            url: browser.runtime.getURL('local.html#/settings'),
        });
        break;

    case 'openPayPal':
        browser.tabs.create({
            url: 'https://www.paypal.me/ElmerTecson',
        });
        break;
    }
});
