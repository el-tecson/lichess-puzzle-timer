export default function timeStringToMs(str: string): number {
    const parts = str.split(':');

    if (parts.length !== 3) {
        throw new Error(`Invalid time format: ${str}`);
    }

    const [hhStr, mmStr, ssStr] = parts;

    const hh = Number(hhStr);
    const mm = Number(mmStr);
    const ss = Number(ssStr);
    const ms = 0;

    return hh * 60 * 60 * 1000 + mm * 60 * 1000 + ss * 1000 + ms;
}
