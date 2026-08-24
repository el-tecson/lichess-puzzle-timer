import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener((message: any) => {
    switch (message.action) {
    case 'openSettings':
        browser.tabs.create({
            url: browser.runtime.getURL('local.html#/settings'),
        });
        break;

    case 'openKofi':
        browser.tabs.create({
            url: 'https://ko-fi.com/emmanuelleutecson',
        });
        break;
    }
});
