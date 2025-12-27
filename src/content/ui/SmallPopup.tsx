import PayPalIcon from '@/assets/paypal.svg?react';
import Draggable from 'react-draggable';
import { useRef, useEffect, useState } from 'react';
import { DEFAULT_POSITION, TIME_PRESETS } from '@/constants';
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
    Listbox,
    Radio,
    TimePicker,
} from '@/components/Settings/CustomComponents/BehaviorComponents';
import { Switch } from '@/components/Settings/CustomComponents/PreferencesComponents';
import getTimePresets from '@/utils/time-presets/getTimePresets';
import VersionIndicator from '@/components/VersionIndicator';
import closeSettingsPages from '@/utils/closeSettingsPages';
import { markExtensionForClose } from '../main';

export default function SmallPopup() {
    const nodeRef = useRef<HTMLDivElement>(null);
    const [showFirst, setShowFirst] = useState(true);

    // Track whether the mouse actually moved
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

    if (!settings || !activePreset) return;

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
                    <div className="big-popup" style={{ position: 'relative' }}>
                        <div className="popup-headers">
                            <WideLogo className="wide-logo" onMouseUp={() => {
                                markExtensionForClose();
                                click(openSettings)
                            }} />
                            <div
                                className="minimize-icon"
                                onMouseUp={() => click(() => setShowFirst(true))}
                            >
                                <MinimizeIcon />
                            </div>
                        </div>
                        <Listbox
                            className="time-preset"
                            initialState={activePreset.name}
                            configName="currentTimePreset"
                            options={timePresets}
                            label="Preset:"
                        />
                        <div className="part">
                            <Switch
                                initialState={settings.preferencesSettings?.enableTimer}
                                configName="enableTimer"
                                text="Enable timer."
                            />
                            <Associated>
                                <Checkbox
                                    initialState={settings.behaviorSettings?.skipToNextPuzzle}
                                    configName="skipToNextPuzzle"
                                    text="Skip to next puzzle when timer hits 0."
                                />
                                <Checkbox
                                    initialState={settings.behaviorSettings?.countdownBeforeSkipping}
                                    configName="countdownBeforeSkipping"
                                    text="Countdown before skipping:"
                                >
                                    <Input
                                        key={activePreset.name}
                                        initialState={activePreset.data.countdownBeforeSkippingNum}
                                        configName="countdownBeforeSkippingNum"
                                    />
                                </Checkbox>
                            </Associated>
                            <Section key={activePreset.name} sectionName="Timer">
                                <Radio
                                    initialState={activePreset.data.timerType}
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
                                {activePreset.data.timerType === '0' && (
                                    <TimePicker
                                        initialState={activePreset.data.timeControl0}
                                        configName="timeControl0"
                                        label="Time Control"
                                    />
                                )}
                                {activePreset.data.timerType === '1' && (
                                    <TimePicker
                                        initialState={activePreset.data.timeControl1}
                                        configName="timeControl1"
                                        label="Time Control"
                                    />
                                )}
                            </Section>
                            <button
                                className="btn"
                                id="donateBtn"
                                onClick={() => click(openPayPal)}
                            >
                                <PayPalIcon />
                                <span className="btn-text">Support me on PayPal</span>
                            </button>
                        </div>
                        {
                            !showFirst && <VersionIndicator
                                style={{
                                    fontSize: '10px',
                                    bottom: '0px'
                                }}
                            />
                        }
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
