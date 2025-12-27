import { CONFIG } from "@/constants";
import getConfig from "./Settings/getConfig";
import decimalize from "./decimalize";

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let gainNode: GainNode | null = null;

// Keeps track of currently “locked” beeps
const beepLocks: Record<string, boolean> = {};

// Must be called once after ANY user click
export async function unlockAudio() {
    if (!audioContext) {
        audioContext = new AudioContext();

        // Create GainNode for volume control
        gainNode = audioContext.createGain();
        const config = await getConfig();
        gainNode.gain.value = 
            decimalize(config.preferencesSettings?.soundVolume) ?? 0.5;

        // Connect GainNode to output
        gainNode.connect(audioContext.destination);

        const handleChange = (
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) => {
            if (areaName === 'local' && changes[CONFIG]) {
                if (!gainNode) return;
                const newConfig = changes[CONFIG].newValue;
                gainNode.gain.value = 
                    decimalize(newConfig.preferencesSettings?.soundVolume) ?? 0.5;
            }
        };

        chrome.storage.onChanged.addListener(handleChange);
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

