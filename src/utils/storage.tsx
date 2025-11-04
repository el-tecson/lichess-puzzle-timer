export async function get(item: string) {
    const res = await chrome.storage.sync.get(item);
    return res;
}

export async function set(item: string, value: any) {
    const res = await chrome.storage.sync.set(item, value);
    return res;
}