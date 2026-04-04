import browser from 'webextension-polyfill';
import type { Storage } from 'webextension-polyfill';
import type { ConfigProps } from '@/types/config';

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
import { markExtensionForClose } from '../main';
import isMobile from '@/utils/dom/isMobile';
import { BASE_TIMER_MOBILE } from '@/constants/timer-popup';
import isFailed from '@/utils/dom/isFailed';
import isJumpImmediatelyEnabled from '@/utils/dom/isJumpImmediatelyEnabled';

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
    const clickRef = useRef(true);
    const onPointerDown = () => {
        clickRef.current = true;
    };
    const onPointerMove = () => {
        clickRef.current = false;
    };
    const click = (fn: Function) => {
        if (clickRef.current) fn();
    };

    const [settings, setSettings] = useState<ConfigProps | null>(null);
    const [timePresets, setTimePresets] = useState<ConfigProps | null>(null);
    const [activePreset, setActivePreset] = useState<{
        name: string;
        data: ConfigProps;
    } | null>(null);
    const initialTime = useRef<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [running, setRunning] = useState(false);
    const hasStartedRef = useRef(false);
    const initialSkipCountdown = useRef<number | null>(null);
    const [skipCountdown, setSkipCountdown] = useState<number | null>(null);
    const isMobileRef = useRef(isMobile());
    const [size, setSize] = useState(BASE_TIMER);
    const [position, setPosition] = useState(DEFAULT_POSITION);
    const [scale, setScale] = useState(1);
    const disablePlayButton = useRef(false);
    const isFailedPuzzle = useRef(false);
    const runningRef = useRef(false);
    const rafRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const timerEndRef = useRef<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isJumpImmediatelyEnabled()) return;
            const complete = document.querySelector('div.complete');

            if (
                complete?.textContent?.trim() === 'Success!' &&
                runningRef.current
            ) {
                setRunning(false);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const puzzleTools = document.querySelector('.puzzle__tools');

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type !== 'childList') continue;

                // Convert removedNodes NodeList to array
                Array.from(mutation.removedNodes).forEach((node) => {
                    if (node instanceof HTMLElement &&
                        node.classList.contains('puzzle__feedback') &&
                        node.classList.contains('after')) {
                        if (!isJumpImmediatelyEnabled()) return;
                        if (!runningRef.current) return;
                        if (!isFailedPuzzle.current) addSolved();
                        disablePlayButton.current = false;
                        hasStartedRef.current = true;
                        isFailedPuzzle.current = false;
                        if (settings?.preferencesSettings.showSkipIndicator) {
                            setSkipCountdown(initialSkipCountdown.current);
                            hideSkipIndicator();
                        }

                        // Reset timer safely after next puzzle loads
                        if (activePreset?.data.timerType === '0')
                            setCurrentTime(initialTime.current);
                        setRunning(true);
                        if (
                            settings?.preferencesSettings.enableSounds &&
                            settings.preferencesSettings.alertWhenNextPuzzle
                        )
                            playAudio(NextBeep);
                        if (
                            settings?.preferencesSettings.enableVisuals &&
                            settings.preferencesSettings.showVisualLowTime
                        )
                            setTimeColor('var(--text-color)');
                    }
                });
            }
        });

        observer.observe(puzzleTools!, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [initialTime, activePreset, settings]);


    useEffect(() => {
        const mobile = isMobile();
        isMobileRef.current = mobile;
        setSize(mobile ? BASE_TIMER_MOBILE : BASE_TIMER);
    }, []);

    // Load config
    useEffect(() => {
        (async () => {
            const config = await getConfig();
            setSettings(config);
            const timePresetsConfig = await getTimePresets();
            setTimePresets(timePresetsConfig);
        })();

        const handleChange = (
            changes: Record<string, Storage.StorageChange>,
            areaName: string,
        ) => {
            if (areaName === 'local') {
                if (changes[CONFIG]) setSettings(changes[CONFIG].newValue as ConfigProps);
                if (changes[TIME_PRESETS]) setTimePresets(changes[TIME_PRESETS].newValue as ConfigProps);
            }
        };

        browser.storage.onChanged.addListener(handleChange);
        return () => browser.storage.onChanged.removeListener(handleChange);
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
        initialTime.current = time;
        setCurrentTime(initialTime.current);
    }, [activePreset]);

    // Timer logic
    useEffect(() => {
        if (!running) {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            return;
        }

        const perfNow = performance.now();
        lastTimeRef.current = perfNow;
        timerEndRef.current = perfNow + initialTime.current;

        const loop = (now: number) => {
            const elapsed = now - lastTimeRef.current;
            lastTimeRef.current = now;

            setCurrentTime((prev) => {
                const next = Math.max(prev - elapsed, 0);

                if (next === 0) {
                    cancelAnimationFrame(rafRef.current!);

                    disablePlayButton.current = true;
                    hasStartedRef.current = false;

                    if (settings?.preferencesSettings?.showAnalyticsPopup) {
                        if (!isFailedPuzzle.current) addUnsolved();
                    }

                    if (settings?.preferencesSettings?.enableVisuals &&
                        settings?.preferencesSettings?.showVisualLowTime) {
                        setTimeColor('var(--bad-color)', 'bold');
                    }

                    if (settings?.preferencesSettings?.enableSounds &&
                        settings?.preferencesSettings?.alertWhenTimerIsZero) {
                        playAudio(WrongBeep);
                    }

                    if (
                        settings?.preferencesSettings.showSkipIndicator &&
                        settings.behaviorSettings.skipToNextPuzzle &&
                        activePreset?.data.timerType === '0'
                    ) {
                        showSkipIndicator();
                        setSkipCountdown(initialSkipCountdown.current);
                        const countdown = setInterval(() => {
                            if (hasStartedRef.current) clearInterval(countdown);
                            setSkipCountdown((prev) => {
                                if (prev === null || prev <= 0) {
                                    clearInterval(countdown); return prev;
                                }
                                if (prev - 1 === 0) clearInterval(countdown);
                                return prev - 1;
                            });
                        }, 1000);
                    }

                    setRunning(false);
                    runningRef.current = false;

                    if (activePreset?.data.timerType === '0') {
                        const delay =
                            settings?.behaviorSettings.skipToNextPuzzle &&
                            settings?.behaviorSettings?.countdownBeforeSkipping &&
                            initialSkipCountdown.current !== 0
                                ? initialSkipCountdown.current!
                                : 1;

                        safeSkip(() => {
                            timerEnd(
                                initialTime.current,
                                setCurrentTime,
                                setRunning,
                                delay,
                                settings?.preferencesSettings.alertWhenNextPuzzle,
                                settings?.preferencesSettings.showVisualLowTime,
                                hasStartedRef,
                                setSkipCountdown,
                                initialSkipCountdown.current,
                                settings?.preferencesSettings.showSkipIndicator,
                                settings?.preferencesSettings.enableSounds,
                                settings?.preferencesSettings.enableVisuals,
                                disablePlayButton,
                                settings?.behaviorSettings.skipToNextPuzzle,
                                activePreset?.data.timerType,
                                isFailedPuzzle,
                                runningRef,
                            );
                        });
                    }
                }

                if (
                    next <= 3000 &&
                    prev > 3000
                ) {
                    if (settings?.preferencesSettings?.enableSounds &&
                        settings?.preferencesSettings?.alertWhenTimeShort) {
                        playAudio(TickTock);
                    }
                    if (settings?.preferencesSettings?.enableVisuals &&
                        settings?.preferencesSettings?.showVisualLowTime) {
                        setTimeColor('var(--bad-color)', 'bold', 'var(--ticking-animation)');
                    }
                }

                return next;
            });

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        // cleanup
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [running, settings, initialTime, activePreset]);

    // Stop timer when puzzle is solved
    useEffect(() => {
        if (running) {
            if (puzzleEndObserver) puzzleEndObserver.disconnect();
            puzzleEndObserver = new MutationObserver(() => {
                const puzzleBoard = document.querySelector('.puzzle__board');
                if (!puzzleBoard) return;

                const interval = setInterval(() => {
                    if (!isFailedPuzzle.current && isFailed()) {
                        isFailedPuzzle.current = true;
                        addUnsolved();
                    }
                    const voteBtn = document.querySelector(
                        '.puzzle__vote__buttons > .vote-up.vote',
                    ) as HTMLElement | null;
                    const continueBtn = document.querySelector('.continue') as HTMLElement | null;
                    
                    if ((voteBtn || continueBtn) && runningRef.current === true && performance.now() < timerEndRef.current) {
                        clearInterval(interval);
                        disablePlayButton.current = true;
                        puzzleEndObserver?.disconnect();
                        if (hasStartedRef.current) {
                            hasStartedRef.current = false;
                            if (settings?.preferencesSettings.showAnalyticsPopup) {
                                if (!isFailedPuzzle.current) addSolved();
                            }
                            if (
                                settings?.preferencesSettings.enableSounds &&
                                settings.preferencesSettings.alertWhenSolved
                            )
                                playAudio(SolvedBeep);
                            if (
                                settings?.preferencesSettings.enableVisuals &&
                                settings.preferencesSettings.showVisualPuzzleSolved
                            )
                                setTimeColor('var(--good-color)', 'bold');
                            if (
                                settings?.preferencesSettings.showSkipIndicator &&
                                settings?.behaviorSettings.skipToNextPuzzle
                            ) {
                                showSkipIndicator();
                                setSkipCountdown(initialSkipCountdown.current);
                                const countdown = setInterval(() => {
                                    if (hasStartedRef.current) {
                                        clearInterval(countdown);
                                    }
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
                        runningRef.current = false;

                        const delay =
                            (settings?.behaviorSettings.skipToNextPuzzle &&
                                settings?.behaviorSettings?.countdownBeforeSkipping &&
                                initialSkipCountdown.current !== 0
                                ? initialSkipCountdown.current!
                                : 1) * 1000;

                        if (voteBtn && settings?.behaviorSettings.skipToNextPuzzle) {
                            setTimeout(() => {
                                safeSkip(() => {
                                    if (hasStartedRef.current) return;
                                    if (document.body.contains(voteBtn))
                                        voteBtn.click();
                                });
                            }, delay);
                        } else if (continueBtn && settings?.behaviorSettings.skipToNextPuzzle) {
                            setTimeout(() => {
                                safeSkip(() => {
                                    if (hasStartedRef.current) return;
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
                                    document.querySelector('.view_solution');

                                if (newPuzzleReady) {
                                    clearInterval(waitForNextPuzzle);
                                    if (hasStartedRef.current) return;
                                    disablePlayButton.current = false;
                                    hasStartedRef.current = true;
                                    isFailedPuzzle.current = false;
                                    if (settings?.preferencesSettings.showSkipIndicator) {
                                        setSkipCountdown(initialSkipCountdown.current);
                                        hideSkipIndicator();
                                    }

                                    // Reset timer safely after next puzzle loads
                                    if (activePreset?.data.timerType === '0')
                                        setCurrentTime(initialTime.current);
                                    setRunning(true);
                                    runningRef.current = true;
                                    if (
                                        settings?.preferencesSettings.enableSounds &&
                                        settings.preferencesSettings.alertWhenNextPuzzle
                                    )
                                        playAudio(NextBeep);
                                    if (
                                        settings?.preferencesSettings.enableVisuals &&
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
        initialSkipCountdown.current = activePreset?.data.countdownBeforeSkippingNum;
        setSkipCountdown(initialSkipCountdown.current);
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
                const newScale = ref.offsetWidth / (isMobileRef.current ? BASE_TIMER_MOBILE.width : BASE_TIMER.width);
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
                                    <span className="small-time">.{msStr}</span>
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
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={() =>
                                    click(() => {
                                        if (disablePlayButton.current) return;
                                        unlockAudio();
                                        if (
                                            settings.preferencesSettings.enableSounds &&
                                            settings.preferencesSettings.alertButtonClicks
                                        ) {
                                            playAudio(NextBeep);
                                        }
                                        setRunning(!running);
                                        runningRef.current = !runningRef.current;
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
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={() =>
                                    click(() => {
                                        unlockAudio();
                                        hasStartedRef.current = true;
                                        setRunning(false);
                                        runningRef.current = false;
                                        setCurrentTime(initialTime.current);
                                        setTimeColor('var(--text-color)', 'normal');
                                        setSkipCountdown(initialSkipCountdown.current);
                                        hideSkipIndicator();
                                        disablePlayButton.current = false;
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
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={() =>
                                    click(() => {
                                        unlockAudio();
                                        setCurrentTime(initialTime.current);
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
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={() =>
                                    click(() => {
                                        unlockAudio();
                                        setRunning(false);
                                        runningRef.current = false;
                                        if (
                                            settings.preferencesSettings.enableSounds &&
                                                settings.preferencesSettings.alertButtonClicks
                                        )
                                            playAudio(NextBeep);
                                        markExtensionForClose();
                                        browser.runtime.sendMessage({ action: 'openSettings' });
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

function waitFor(
    selector: string,
    callback: (el: Element | null) => void,
    ignore?: boolean,
    timeout = 1000
) {
    const existing = document.querySelector(selector);
    if (existing) {
        callback(existing);
        return;
    }

    const observer = new MutationObserver((_mut, obs) => {
        const el = document.querySelector(selector);
        if (el) {
            clearTimeout(timer);
            obs.disconnect();
            callback(el);
        }
    });

    const timer = setTimeout(() => {
        observer.disconnect();
        if (ignore) callback(null);
    }, timeout);

    observer.observe(document.body, { childList: true, subtree: true });
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
    defaultSkipCountdown: number | null,
    showSkipIndicator: boolean,
    allowAudio: boolean,
    allowVisuals: boolean,
    disablePlayButton: any,
    skipToNextPuzzle: boolean,
    timerType: string,
    isFailedPuzzle: any,
    runningRef: any,
) {
    // Step 1: Click "Next puzzle" button in solution view
    waitFor('.view_solution > .button.button-empty:nth-child(2)', (nextBtn) => {
        try {
            (nextBtn as HTMLElement).click();
        } catch {}
        // Step 2: Wait for next puzzle board to load
        waitFor('.puzzle__board', () => {
            // Step 3: Wait for vote button
            waitFor('.puzzle__vote__buttons > .vote-up.vote', (voteBtn) => {
                setTimeout(() => {
                    if (hasStarted.current) return;
                    if (document.body.contains(voteBtn) && skipToNextPuzzle)
                        (voteBtn as HTMLElement).click();

                    const waitForNextPuzzle = setInterval(() => {
                        const newPuzzleReady =
                            document.querySelector('.puzzle__board') &&
                            document.querySelector('.view_solution');

                        if (newPuzzleReady) {
                            clearInterval(waitForNextPuzzle);
                            if (hasStarted.current) return;
                            disablePlayButton.current = false;
                            hasStarted.current = true;
                            isFailedPuzzle.current = false;
                            if (showSkipIndicator) {
                                setSkipCountdown(defaultSkipCountdown);
                                hideSkipIndicator();
                            }

                            // Reset timer safely after next puzzle loads
                            if (timerType === '0')
                                setCurrentTime(initialTime);
                            setRunning(true);
                            runningRef.current = true;
                            if (allowVisuals && showVisual) setTimeColor('var(--text-color)');
                            if (allowAudio && playTheAudio) playAudio(NextBeep);
                        }
                    }, 300);
                }, delaySeconds * 1000);
            });

            // Step 3: Wait for continue button (For unregistered user)
            waitFor('.continue', (continueBtn) => {
                setTimeout(() => {
                    if (hasStarted.current) return;
                    if (document.body.contains(continueBtn) && skipToNextPuzzle)
                        (continueBtn as HTMLElement).click();

                    const waitForNextPuzzle = setInterval(() => {
                        const newPuzzleReady =
                            document.querySelector('.puzzle__board') &&
                            document.querySelector('.view_solution');

                        if (newPuzzleReady) {
                            clearInterval(waitForNextPuzzle);
                            if (hasStarted.current) return;
                            disablePlayButton.current = false;
                            hasStarted.current = true;
                            isFailedPuzzle.current = false;
                            if (showSkipIndicator) {
                                setSkipCountdown(defaultSkipCountdown);
                                hideSkipIndicator();
                            }

                            // Reset timer safely after next puzzle loads
                            if (timerType === '0')
                                setCurrentTime(initialTime);
                            setRunning(true);
                            runningRef.current = true;
                            if (allowVisuals && showVisual) setTimeColor('var(--text-color)');
                            if (allowAudio && playTheAudio) playAudio(NextBeep);
                        }
                    }, 300);
                }, delaySeconds * 1000);
            });
        }, true);
    }, true);
}
