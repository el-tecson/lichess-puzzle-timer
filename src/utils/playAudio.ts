let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

// Keeps track of currently “locked” beeps
const beepLocks: Record<string, boolean> = {};

// Must be called once after ANY user click
export function unlockAudio() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

export default async function playAudio(src: string) {
    try {
        if (!audioContext) {
            console.warn('AudioContext not unlocked yet — call unlockAudio() on user click.');
            return;
        }

        // Prevent multiple triggers of same sound
        if (beepLocks[src]) return;
        beepLocks[src] = true;

        // Stop currently playing audio
        if (currentSource) {
            try {
                currentSource.stop();
            } catch {}
            currentSource.disconnect();
            currentSource = null;
        }

        const response = await fetch(chrome.runtime.getURL(src));
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);

        currentSource = source;

        source.onended = () => {
            currentSource = null;
            beepLocks[src] = false; // unlock when finished
        };
    } catch (e) {
        console.error('Audio play error:', e);
    }
}
