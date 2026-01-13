import browser from 'webextension-polyfill';

export async function get(item: string, fallbackConfig: unknown = {}): Promise<unknown> {
    if (!browser?.storage?.local) {
        console.warn('browser.storage.local not available, using fallback config');
        return fallbackConfig;
    }

    try {
        const res = await browser.storage.local.get(item); // <-- returns a Promise
        return res[item] ?? fallbackConfig; // use nullish coalescing
    } catch (err) {
        console.error('Error reading from storage.local:', err);
        return fallbackConfig;
    }
}

export async function set(item: string, value: Record<string, unknown>): Promise<void> {
    if (!browser?.storage?.local) {
        console.warn('browser.storage.local not available — cannot save config');
        return;
    }

    try {
        await browser.storage.local.set({ [item]: value }); // <-- returns a Promise
    } catch (err) {
        console.error('Error saving to browser.storage.local:', err);
        throw err;
    }
}
