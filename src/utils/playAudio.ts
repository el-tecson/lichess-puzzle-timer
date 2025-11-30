let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let gainNode: GainNode | null = null;

// Keeps track of currently “locked” beeps
const beepLocks: Record<string, boolean> = {};

// Must be called once after ANY user click
export function unlockAudio() {
    if (!audioContext) {
        audioContext = new AudioContext();

        // Create GainNode for volume control
        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5; // <-- Set volume here (0.0 – 1.0)

        // Connect GainNode to output
        gainNode.connect(audioContext.destination);
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

export default async function playAudio(src: string) {
    try {
        if (!audioContext || !gainNode) {
            console.warn('AudioContext not unlocked yet — call unlockAudio() on user click.');
            return;
        }

        // Prevent multiple triggers of same sound
        if (beepLocks[src]) return;
        beepLocks[src] = true;

        // Stop currently playing audio
        if (currentSource) {
            try { currentSource.stop(); } catch {}
            currentSource.disconnect();
            currentSource = null;
        }

        const response = await fetch(chrome.runtime.getURL(src));
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = buffer;

        // Route audio through gain node
        source.connect(gainNode);
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

