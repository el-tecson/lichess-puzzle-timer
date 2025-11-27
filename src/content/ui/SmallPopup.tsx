import PayPalIcon from '@/assets/paypal.svg?react';
import Draggable from 'react-draggable';
import { useRef, useEffect, useState } from 'react';
import { DEFAULT_POSITION } from '@/constants';
import PopupIcon from '@/assets/lptimer-logo.svg?react';
import WideLogo from '@/assets/lptimer-logo-wide.svg?react';
import MinimizeIcon from '@/assets/minimize.svg?react';
import Associated from '@/components/Associated';
import Section from '@/components/Section';
import { CONFIG } from '@/constants';
import getConfig from '@/utils/Settings/getConfig';
import TimePickerCSS from '@/styles/components/Forms/TimePicker.css?inline';
import {
    Checkbox,
    Input,
    Radio,
    TimePicker,
} from '@/components/Settings/CustomComponents/BehaviorComponents';

export default function SmallPopup() {
    const nodeRef = useRef<HTMLDivElement>(null);
    const [showFirst, setShowFirst] = useState(true);

    // Track whether the mouse actually moved
    const clickRef = useRef(true);
    const click = (fn: Function) => {
        if (clickRef.current) fn();
    };

    const [settings, setSettings] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        (async () => {
            const config = await getConfig();
            setSettings(config);
        })();

        const handleChange = (
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string
        ) => {
            if (areaName === 'local' && changes[CONFIG]) {
                setSettings(changes[CONFIG]?.newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleChange);
        return () => chrome.storage.onChanged.removeListener(handleChange);
    }, []);

    if (!settings) return null;

    return (
        <Draggable
            defaultPosition={DEFAULT_POSITION}
            nodeRef={nodeRef}
            onStart={() => {
                clickRef.current = true; // assume a click initially
            }}
            onDrag={() => {
                clickRef.current = false; // dragging happened
            }}
        >
            <div ref={nodeRef} className="popup small-popup">
                {showFirst ? (
                    <div
                        className="small-popup-icon"
                        onMouseUp={() => click(() => setShowFirst(false))}
                    >
                        <PopupIcon />
                    </div>
                ) : (
                    <div className="big-popup">
                        <div className="popup-headers">
                            <WideLogo className="wide-logo" onMouseUp={() => click(openSettings)} />
                            <div
                                className="minimize-icon"
                                onMouseUp={() => click(() => setShowFirst(true))}
                            >
                                <MinimizeIcon />
                            </div>
                        </div>
                        <div className="part">
                            <Associated>
                                <Checkbox
                                    initialState={settings.behaviorSettings?.skipToNextPuzzle}
                                    configName="skipToNextPuzzle"
                                    text="Skip to next puzzle when timer hits 0."
                                />
                                <Checkbox
                                    initialState={
                                        settings.behaviorSettings?.countdownBeforeSkipping
                                    }
                                    configName="countdownBeforeSkipping"
                                    text="Countdown before skipping:"
                                >
                                    <Input
                                        initialState={
                                            settings.behaviorSettings?.countdownBeforeSkippingNum
                                        }
                                        configName="countdownBeforeSkippingNum"
                                    />
                                </Checkbox>
                            </Associated>
                            <Section sectionName="Timer">
                                <Radio
                                    initialState={settings.behaviorSettings.timerType}
                                    configName="timerType"
                                    label="Type of timer"
                                    options={[
                                        {
                                            name: 'Timer resets after each puzzle.',
                                            optionName: '0',
                                        },
                                        {
                                            name: 'Timer is a set amount of time.',
                                            optionName: '1',
                                        },
                                    ]}
                                />
                                {settings.behaviorSettings?.timerType === '0' && (
                                    <TimePicker
                                        initialState={settings.behaviorSettings?.timeControl0}
                                        configName="timeControl0"
                                        label="Time Control"
                                        onClick={addTimePickerCSS}
                                    />
                                )}
                                {settings.behaviorSettings?.timerType === '1' && (
                                    <TimePicker
                                        initialState={settings.behaviorSettings?.timeControl1}
                                        configName="timeControl1"
                                        label="Time Control"
                                        onClick={addTimePickerCSS}
                                    />
                                )}
                            </Section>
                            <button
                                className="btn"
                                id="donateBtn"
                                onClick={() => click(openPayPal)}
                            >
                                <PayPalIcon />
                                <span className="btn-text">Donate via PayPal</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Draggable>
    );
}

function addTimePickerCSS() {
    if (document.getElementById('lptimer-css')) return;

    const style = document.createElement('style');
    style.id = 'lptimer-css';
    style.textContent = TimePickerCSS;
    document.body.appendChild(style);
}

function openSettings() {
    chrome.runtime.sendMessage({ action: 'openSettings' });
}

function openPayPal() {
    chrome.runtime.sendMessage({ action: 'openPayPal' });
}
