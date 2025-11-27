import { useRef, useEffect, useState } from 'react';
import getConfig from '@/utils/Settings/getConfig';
import Draggable from 'react-draggable';
import { DEFAULT_POSITION, CONFIG } from '@/constants';
import PlayIcon from '@/assets/play.svg?react';
import PauseIcon from '@/assets/pause.svg?react';
import CancelIcon from '@/assets/cancel.svg?react';
import RestartIcon from '@/assets/reload.svg?react';
import SettingsIcon from '@/assets/settings.svg?react';
import timeStringToMs from '@/utils/timeStringToMs';
import msToTimeString from '@/utils/msToTimeString';
import NextBeep from '@/assets/audio/next-beep.wav';
import SolvedBeep from '@/assets/audio/solved-beep.mp3';
import TickTock from '@/assets/audio/tick-tock.wav';
import WrongBeep from '@/assets/audio/wrong-beep.mp3';
import playAudio, { unlockAudio } from '@/utils/playAudio';

export default function TimerPopup() {
    const nodeRef = useRef<HTMLDivElement>(null);
    const clickRef = useRef(true);
    const click = (fn: Function) => { if (clickRef.current) fn(); };

    const [settings, setSettings] = useState<Record<string, any> | null>(null);
    const [initialTime, setInitialTime] = useState(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load config
    useEffect(() => {
        (async () => {
            const config = await getConfig();
            setSettings(config);
        })();

        const handleChange = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
            if (areaName === 'local' && changes[CONFIG]) {
                setSettings(changes[CONFIG]?.newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleChange);
        return () => chrome.storage.onChanged.removeListener(handleChange);
    }, []);

    // Set initial timer
    useEffect(() => {
        if (!settings) return;
        const time = timeStringToMs(settings.behaviorSettings?.[`timeControl${settings.behaviorSettings?.timerType}`] ?? "00:00:00");
        setInitialTime(time);
        setCurrentTime(time);
    }, [settings]);

    // Timer logic
    useEffect(() => {
        if (!running) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setCurrentTime(prev => {
                const next = Math.max(prev - 10, 0);

                if (next === 0) {
                    clearInterval(intervalRef.current!);
                    if (settings?.preferencesSettings?.alertWhenTimerIsZero) playAudio(WrongBeep);
                    setRunning(false);

                    if (settings?.behaviorSettings?.timerType === '0' && settings?.behaviorSettings?.skipToNextPuzzle) {
                        const delay = settings?.behaviorSettings?.countdownBeforeSkipping
                            ? settings.behaviorSettings.countdownBeforeSkippingNum
                            : 1;
                        
                        // Call timerEnd to handle skip & reset safely
                        timerEnd(initialTime, setCurrentTime, setRunning, delay, settings.preferencesSettings.alertWhenNextPuzzle);
                    }
                }

                if (next === 3000 && settings?.preferencesSettings?.alertWhenTimeShort) playAudio(TickTock);

                return next;
            });
        }, 10);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running, settings, initialTime]);

    // Stop timer when puzzle is solved
    useEffect(() => {
        if (settings?.behaviorSettings?.timerType === '0' && settings.behaviorSettings?.skipToNextPuzzle) {
            const observer = new MutationObserver(() => {
                const puzzleBoard = document.querySelector(".puzzle__board");
                if (!puzzleBoard) return;

                const interval = setInterval(() => {
                    const voteBtn = document.querySelector('.puzzle__vote__buttons > .vote-up.vote') as HTMLElement | null;
                    const continueBtn = document.querySelector('.continue') as HTMLElement | null;
                    if (voteBtn || continueBtn) {
                        const host = document.getElementById('lptimer-shadow-host');
                        const bigTime = host?.shadowRoot?.querySelector('.big-time')?.textContent ?? "00:00:00";
                        const smallTime = host?.shadowRoot?.querySelector('.small-time')?.textContent ?? ":00";

                        // Puzzle solved (timer was running)
                        if (bigTime !== "00:00:00" && smallTime !== ":00") {
                            clearInterval(interval);
                            if (settings.preferencesSettings.alertWhenSolved) playAudio(SolvedBeep);
                            setRunning(false);

                            const delay = (settings?.behaviorSettings?.countdownBeforeSkipping
                                ? settings.behaviorSettings.countdownBeforeSkippingNum
                                : 1) * 1000;

                            if (voteBtn) {
                                setTimeout(() => {
                                    voteBtn.click();
                                }, delay);
                            }
                            else if (continueBtn) {
                                setTimeout(() => {
                                    continueBtn.click();
                                }, delay);
                            }

                            setTimeout(() => {
                                // Wait for the *next puzzle* and its vote button
                                const waitForNextPuzzle = setInterval(() => {
                                    const newPuzzleReady =
                                        document.querySelector(".puzzle__board") &&
                                        (document.querySelector(".view_solution") || document.querySelector('.continue'));

                                    if (newPuzzleReady) {
                                        clearInterval(waitForNextPuzzle);

                                        // Reset timer safely after next puzzle loads
                                        setCurrentTime(initialTime);
                                        setRunning(true);
                                        if (settings.preferencesSettings.alertWhenNextPuzzle) playAudio(NextBeep);
                                    }
                                }, 20);
                            }, delay);
                        }
                    }
                }, 20);
            });

            observer.observe(document.body, { childList: true, subtree: true });

            return () => observer.disconnect();
        }
    }, [running, settings, initialTime]);

    if (!settings) return null;

    return (
        <Draggable
            defaultPosition={DEFAULT_POSITION}
            nodeRef={nodeRef}
            onStart={() => { clickRef.current = true; }}
            onDrag={() => { clickRef.current = false; }}
        >
            <div ref={nodeRef} className="popup timer-popup">
                {settings.preferencesSettings?.showTimer && (
                    <p className="timer number">
                        {(() => {
                            const [timeStr, msStr] = msToTimeString(currentTime || 0);
                            return <>
                                <span className="big-time">{timeStr}</span>
                                <span className="small-time">:{msStr}</span>
                            </>;
                        })()}
                    </p>
                )}
                {settings.preferencesSettings?.showTimerButtons && (
                    <div className="timer-buttons">
                        <div className="timer-btn-part">
                            <button
                                className="timer-btn pause-play-button"
                                onMouseUp={() => click(() => {
                                    unlockAudio();
                                    setRunning(!running);
                                    chrome.runtime.sendMessage({ action: running ? 'pause' : 'play' });
                                })}
                            >
                                {running ? <PauseIcon className="pause-play-icon" /> : <PlayIcon className="pause-play-icon" />}
                            </button>
                            <button
                                className="timer-btn cancel-button"
                                onMouseUp={() => click(() => {
                                    setRunning(false);
                                    setCurrentTime(initialTime);
                                    chrome.runtime.sendMessage({ action: 'cancel' });
                                })}
                            >
                                <CancelIcon className="cancel-icon" />
                            </button>
                        </div>
                        <div className="timer-btn-part">
                            <button
                                className="timer-btn restart-button"
                                onMouseUp={() => click(() => {
                                    setCurrentTime(initialTime);
                                    chrome.runtime.sendMessage({ action: 'restart' });
                                })}
                            >
                                <RestartIcon className="restart-icon" />
                            </button>
                            <button
                                className="timer-btn settings-button"
                                onMouseUp={() => click(() => {
                                    setRunning(false);
                                    chrome.runtime.sendMessage({ action: 'openSettings' });
                                })}
                            >
                                <SettingsIcon className="settings-icon" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Draggable>
    );
}

// Wait for selector utility
function waitFor(selector: string, callback: (el: Element) => void) {
    const existing = document.querySelector(selector);
    if (existing) { callback(existing); return; }

    const observer = new MutationObserver((_mut, obs) => {
        const el = document.querySelector(selector);
        if (el) { obs.disconnect(); callback(el); }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Timer end & safe puzzle skip
function timerEnd(initialTime: number, setCurrentTime: any, setRunning: any, delaySeconds: number, playTheAudio: boolean) {
    // Step 1: Click "Next puzzle" button in solution view
    waitFor('.view_solution > .button.button-empty:nth-child(2)', (nextBtn) => {
        (nextBtn as HTMLElement).click();

        // Step 2: Wait for next puzzle board to load
        waitFor('.puzzle__board', () => {

            // Step 3: Wait for vote button
            waitFor('.puzzle__vote__buttons > .vote-up.vote', (voteBtn) => {

                setTimeout(() => {
                    (voteBtn as HTMLElement).click();

                    // Step 4: Reset timer safely
                    setCurrentTime(initialTime);
                    setRunning(true);
                    if (playTheAudio) playAudio(NextBeep);

                }, delaySeconds * 1000);
            });

            // Step 3: Wait for continue button (For unregistered user)
            waitFor('.continue', (continueBtn) => {

                setTimeout(() => {
                    (continueBtn as HTMLElement).click();

                    // Step 4: Reset timer safely
                    setCurrentTime(initialTime);
                    setRunning(true);
                    if (playTheAudio) playAudio(NextBeep);

                }, delaySeconds * 1000);
            });
        });
    });
}

