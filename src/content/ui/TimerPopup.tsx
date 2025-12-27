import { useRef, useEffect, useState } from 'react';
import getConfig from '@/utils/Settings/getConfig';;
import { DEFAULT_POSITION, CONFIG, TIME_PRESETS, BASE_TIMER } from '@/constants';
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
import setTimeColor from '@/utils/dom/setTimeColor';
import addUnsolved from '@/utils/Analytics/addUnsolved';
import addSolved from '@/utils/Analytics/addSolved';
import hideSkipIndicator from '@/utils/dom/hideSkipIndicator';
import showSkipIndicator from '@/utils/dom/showSkipIndicator';
import getTimePresets from '@/utils/time-presets/getTimePresets';
import { Rnd } from 'react-rnd';
import closeSettingsPages from '@/utils/closeSettingsPages';
import { markExtensionForClose } from '../main';

let puzzleEndObserver: MutationObserver | null = null;
let skipInProgress = false;

function safeSkip(action: Function) {
    if (skipInProgress) return;
    skipInProgress = true;

    try {
        action();
    } finally {
        setTimeout(() => {
            skipInProgress = false;
        }, 1000); // give Lichess breathing room
    }
}


export default function TimerPopup() {
    const nodeRef = useRef<HTMLDivElement>(null);
    const clickRef = useRef(true);
    const click = (fn: Function) => {
        if (clickRef.current) fn();
    };

    const [settings, setSettings] = useState<Record<string, any> | null>(null);
    const [timePresets, setTimePresets] = useState<Record<string, any> | null>(null);
    const [activePreset, setActivePreset] = useState<{
        name: string;
        data: Record<string, any>;
    } | null>(null);
    const [initialTime, setInitialTime] = useState(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasStartedRef = useRef(false);
    const [skipCountdown, setSkipCountdown] = useState<number | null>(null);
    const [size, setSize] = useState(BASE_TIMER);
    const [position, setPosition] = useState(DEFAULT_POSITION);
    const [scale, setScale] = useState(1);

    // Load config
    useEffect(() => {
        (async () => {
            const config = await getConfig();
            setSettings(config);
            const timePresetsConfig = await getTimePresets();
            setTimePresets(timePresetsConfig);
        })();

        const handleChange = (
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) => {
            if (areaName === 'local') {
                if (changes[CONFIG]) setSettings(changes[CONFIG].newValue);
                if (changes[TIME_PRESETS]) setTimePresets(changes[TIME_PRESETS].newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleChange);
        return () => chrome.storage.onChanged.removeListener(handleChange);
    }, []);

    useEffect(() => {
        if (!settings || !timePresets) return;

        const currentName = settings.behaviorSettings?.currentTimePreset;
        const data = timePresets[currentName] || {};

        setActivePreset({ name: currentName, data });
    }, [settings, timePresets]);

    // Set initial timer
    useEffect(() => {
        if (!activePreset) return;
        const time = timeStringToMs(
            activePreset.data?.[`timeControl${activePreset.data.timerType}`] ??
                '00:00:00',
        );
        setInitialTime(time);
        setCurrentTime(time);
    }, [activePreset]);

    // Timer logic
    useEffect(() => {
        if (!running) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setCurrentTime((prev) => {
                const next = Math.max(prev - 10, 0);

                if (next === 0) {
                    clearInterval(intervalRef.current!);
                    hasStartedRef.current = false;
                    if (settings?.preferencesSettings?.showAnalyticsPopup) {
                        addUnsolved();
                    }
                    if (
                        settings?.preferencesSettings?.enableVisuals &&
                        settings?.preferencesSettings?.showVisualLowTime
                    )
                        setTimeColor('var(--bad-color)', 'bold');
                    if (
                        settings?.preferencesSettings?.enableSounds &&
                        settings?.preferencesSettings?.alertWhenTimerIsZero
                    )
                        playAudio(WrongBeep);
                    if (settings?.preferencesSettings.showSkipIndicator) {
                        showSkipIndicator();
                        const countdown = setInterval(() => {
                            setSkipCountdown((prev) => {
                                if (prev === null || prev <= 0) {
                                    clearInterval(countdown);
                                    return prev;
                                }
                                if (prev - 1 === 0) clearInterval(countdown);
                                return prev - 1;
                            });
                        }, 1000);
                    }
                    
                    setRunning(false);

                    if (
                        activePreset?.data.timerType === '0' &&
                        settings?.behaviorSettings?.skipToNextPuzzle
                    ) {
                        const delay = settings?.behaviorSettings?.countdownBeforeSkipping
                            ? activePreset.data.countdownBeforeSkippingNum
                            : 1;

                        // Call timerEnd to handle skip & reset safely
                        safeSkip(() => {
                            timerEnd(
                                initialTime,
                                setCurrentTime,
                                setRunning,
                                delay,
                                settings.preferencesSettings.alertWhenNextPuzzle,
                                settings.preferencesSettings.showVisualLowTime,
                                hasStartedRef,
                                setSkipCountdown,
                                activePreset.data.countdownBeforeSkippingNum,
                                settings.preferencesSettings.showSkipIndicator,
                                settings.preferencesSettings.enableSounds,
                                settings.preferencesSettings.enableVisuals,
                            );
                        });
                    }
                }

                if (next === 3000 && settings?.preferencesSettings?.enableSounds && settings?.preferencesSettings?.alertWhenTimeShort)
                    playAudio(TickTock);
                if (next === 3000 && settings?.preferencesSettings?.enableVisuals && settings?.preferencesSettings?.showVisualLowTime)
                    setTimeColor('var(--bad-color)', 'bold', 'var(--ticking-animation)');
                return next;
            });
        }, 10);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running, settings, initialTime, activePreset]);

    // Stop timer when puzzle is solved
    useEffect(() => {
        if (
            activePreset?.data?.timerType === '0' &&
            settings?.behaviorSettings?.skipToNextPuzzle &&
            running
        ) {
            if (puzzleEndObserver) puzzleEndObserver.disconnect();
            puzzleEndObserver = new MutationObserver(() => {
                const puzzleBoard = document.querySelector('.puzzle__board');
                if (!puzzleBoard) return;

                const interval = setInterval(() => {
                    const voteBtn = document.querySelector(
                        '.puzzle__vote__buttons > .vote-up.vote',
                    ) as HTMLElement | null;
                    const continueBtn = document.querySelector('.continue') as HTMLElement | null;
                    if (voteBtn || continueBtn) {
                        clearInterval(interval);
                        puzzleEndObserver?.disconnect();
                        if (hasStartedRef.current) {
                            hasStartedRef.current = false;
                            if (settings.preferencesSettings.showAnalyticsPopup) {
                                addSolved();
                            }
                            if (
                                settings.preferencesSettings.enableSounds &&
                                settings.preferencesSettings.alertWhenSolved
                            )
                                playAudio(SolvedBeep);
                            if (
                                settings.preferencesSettings.enableVisuals &&
                                settings.preferencesSettings.showVisualPuzzleSolved
                            )
                                setTimeColor('var(--good-color)', 'bold');
                            if (settings.preferencesSettings.showSkipIndicator) {
                                showSkipIndicator();
                                const countdown = setInterval(() => {
                                    setSkipCountdown((prev) => {
                                        if (prev === null || prev <= 0) {
                                            clearInterval(countdown);
                                            return prev;
                                        }
                                        if (prev - 1 === 0) clearInterval(countdown);
                                        return prev - 1;
                                    });
                                }, 1000);
                            }
                        }
                        setRunning(false);

                        const delay =
                            (settings?.behaviorSettings?.countdownBeforeSkipping
                                ? activePreset.data.countdownBeforeSkippingNum
                                : 1) * 1000;

                        if (voteBtn) {
                            setTimeout(() => {
                                safeSkip(() => {
                                    if (document.body.contains(voteBtn))
                                        voteBtn.click();
                                });
                            }, delay);
                        } else if (continueBtn) {
                            setTimeout(() => {
                                safeSkip(() => {
                                    if (document.body.contains(continueBtn))
                                        continueBtn.click();
                                });
                            }, delay);
                        }

                        setTimeout(() => {
                            // Wait for the *next puzzle* and its vote button
                            const waitForNextPuzzle = setInterval(() => {
                                const newPuzzleReady =
                                    document.querySelector('.puzzle__board') &&
                                    (document.querySelector('.view_solution') ||
                                        document.querySelector('.continue'));

                                if (newPuzzleReady) {
                                    clearInterval(waitForNextPuzzle);
                                    hasStartedRef.current = true;
                                    if (settings.preferencesSettings.showSkipIndicator) {
                                        setSkipCountdown(activePreset.data.countdownBeforeSkippingNum);
                                        hideSkipIndicator();
                                    }

                                    // Reset timer safely after next puzzle loads
                                    setCurrentTime(initialTime);
                                    setRunning(true);
                                    if (
                                        settings.preferencesSettings.enableSounds &&
                                        settings.preferencesSettings.alertWhenNextPuzzle
                                    )
                                        playAudio(NextBeep);
                                    if (
                                        settings.preferencesSettings.enableVisuals &&
                                        settings.preferencesSettings.showVisualLowTime
                                    )
                                        setTimeColor('var(--text-color)');
                                }
                            }, 300);
                        }, delay);
                    }
                }, 100);
            });

            puzzleEndObserver.observe(document.body, { childList: true, subtree: true });

            return () => puzzleEndObserver?.disconnect();
        }
    }, [running, settings, initialTime, activePreset]);

    useEffect(() => {
        setSkipCountdown(activePreset?.data.countdownBeforeSkippingNum);
    }, [activePreset]);

    if (!settings) return null;

    if (skipCountdown === null) return null;

    return (        
        <Rnd
            size={size}
            position={position}
            lockAspectRatio
            enableResizing={{
                bottomRight: true,
                topLeft: true,
                bottomLeft: true,
                topRight: true,
            }}
            onDragStop={(_, d) => {
                setPosition({ x: d.x, y: d.y });
                setTimeout(() => clickRef.current = true, 1);
            }}
            onResize={(_, __, ref, ___, pos) => {
                setSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
                setPosition(pos);
                const newScale = ref.offsetWidth / BASE_TIMER.width;
                setScale(newScale);
                clickRef.current = true;
            }}
            onStart={() => { clickRef.current = true; }} onDrag={() => { clickRef.current = false; }}
            style={{
                background: 'var(--background-color)',
                borderRadius: '8px',
                boxShadow: 'var(--popup-shadow)',
                overflow: 'hidden',
                cursor: 'default',
            }}
        >
            <div
                ref={nodeRef}
                className="popup timer-popup"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            >
                {settings.preferencesSettings?.showTimer && (
                    <p className="timer number">
                        {(() => {
                            const [timeStr, msStr] = msToTimeString(currentTime || 0);
                            return (
                                <>
                                    <span className="big-time">{timeStr}</span>
                                    <span className="small-time">:{msStr}</span>
                                </>
                            );
                        })()}
                    </p>
                )}
                {settings.preferencesSettings?.showTimerButtons && (
                    <div className="timer-buttons">
                        <div className="timer-btn-part">
                            <button
                                className="timer-btn pause-play-button"
                                onMouseUp={() =>
                                    click(() => {
                                        unlockAudio();
                                        if (
                                            settings.preferencesSettings.enableSounds &&
                                            settings.preferencesSettings.alertButtonClicks
                                        ) {
                                            playAudio(NextBeep);
                                        }
                                        setRunning(!running);
                                        hasStartedRef.current = true;
                                    })
                                }
                            >
                                {running ? (
                                    <PauseIcon className="pause-play-icon" />
                                ) : (
                                    <PlayIcon className="pause-play-icon" />
                                )}
                            </button>
                            <button
                                className="timer-btn cancel-button"
                                onMouseUp={() =>
                                    click(() => {
                                        setRunning(false);
                                        setCurrentTime(initialTime);
                                        setTimeColor('var(--text-color)', 'normal');
                                        if (
                                            settings.preferencesSettings.enableSounds &&
                                                settings.preferencesSettings.alertButtonClicks
                                        )
                                            playAudio(NextBeep);
                                    })
                                }
                            >
                                <CancelIcon className="cancel-icon" />
                            </button>
                        </div>
                        <div className="timer-btn-part">
                            <button
                                className="timer-btn restart-button"
                                onMouseUp={() =>
                                    click(() => {
                                        setCurrentTime(initialTime);
                                        setTimeColor('var(--text-color)', 'normal');
                                        if (
                                            settings.preferencesSettings.enableSounds &&
                                                settings.preferencesSettings.alertButtonClicks
                                        )
                                            playAudio(NextBeep);
                                    })
                                }
                            >
                                <RestartIcon className="restart-icon" />
                            </button>
                            <button
                                className="timer-btn settings-button"
                                onMouseUp={() =>
                                    click(() => {
                                        setRunning(false);
                                        if (
                                            settings.preferencesSettings.enableSounds &&
                                                settings.preferencesSettings.alertButtonClicks
                                        )
                                            playAudio(NextBeep);
                                        markExtensionForClose();
                                        chrome.runtime.sendMessage({ action: 'openSettings' });
                                    })
                                }
                            >
                                <SettingsIcon className="settings-icon" />
                            </button>
                        </div>
                    </div>
                )}
                {settings.preferencesSettings?.showSkipIndicator && (
                    <p className="skip-indicator noselect" hidden>
                        {(skipCountdown === 0) ? 'Skipping...' : `Skipping in ${skipCountdown}...`}
                    </p>
                )}
            </div>
        </Rnd>
    );
}

// Wait for selector utility
function waitFor(selector: string, callback: (el: Element) => void) {
    const existing = document.querySelector(selector);
    if (existing) {
        callback(existing);
        return;
    }

    if (puzzleEndObserver) {
        puzzleEndObserver.disconnect();
    }

    puzzleEndObserver = new MutationObserver((_mut, obs) => {
        const el = document.querySelector(selector);
        if (el) {
            obs.disconnect();
            callback(el);
            puzzleEndObserver?.disconnect();
        }
    });

    puzzleEndObserver.observe(document.body, { childList: true, subtree: true });
}

// Timer end & safe puzzle skip
function timerEnd(
    initialTime: number,
    setCurrentTime: any,
    setRunning: any,
    delaySeconds: number,
    playTheAudio: boolean,
    showVisual: boolean,
    hasStarted: any,
    setSkipCountdown: any,
    defaultSkipCountdown: number,
    showSkipIndicator: boolean,
    allowAudio: boolean,
    allowVisuals: boolean,
) {
    // Step 1: Click "Next puzzle" button in solution view
    waitFor('.view_solution > .button.button-empty:nth-child(2)', (nextBtn) => {
        (nextBtn as HTMLElement).click();

        // Step 2: Wait for next puzzle board to load
        waitFor('.puzzle__board', () => {
            // Step 3: Wait for vote button
            waitFor('.puzzle__vote__buttons > .vote-up.vote', (voteBtn) => {
                setTimeout(() => {
                    if (document.body.contains(voteBtn))
                        (voteBtn as HTMLElement).click();

                    // Step 4: Reset timer safely
                    setCurrentTime(initialTime);
                    setRunning(true);
                    if (showSkipIndicator) {
                        setSkipCountdown(defaultSkipCountdown);
                        hideSkipIndicator();
                    }
                    hasStarted.current = true;
                    if (allowVisuals && showVisual) setTimeColor('var(--text-color)');
                    if (allowAudio && playTheAudio) playAudio(NextBeep);
                }, delaySeconds * 1000);
            });

            // Step 3: Wait for continue button (For unregistered user)
            waitFor('.continue', (continueBtn) => {
                setTimeout(() => {
                    if (document.body.contains(continueBtn))
                        (continueBtn as HTMLElement).click();

                    // Step 4: Reset timer safely
                    setCurrentTime(initialTime);
                    setRunning(true);
                    if (showSkipIndicator) {
                        setSkipCountdown(defaultSkipCountdown);
                        hideSkipIndicator();
                    }
                    hasStarted.current = true;
                    if (allowVisuals && showVisual) setTimeColor('var(--text-color)');
                    if (allowAudio && playTheAudio) playAudio(NextBeep);
                }, delaySeconds * 1000);
            });
        });
    });
}
