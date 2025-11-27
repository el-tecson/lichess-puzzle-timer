export default function msToTimeString(ms: number) {
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;

    const minutes = Math.floor(ms / 60000);
    ms %= 60000;

    const seconds = Math.floor(ms / 1000);
    ms %= 1000;

    const milliseconds = ms; // 0–999

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const msStr = String(Math.floor(milliseconds / 10)).padStart(2, '0');

    return [`${hh}:${mm}:${ss}`, msStr];
}
