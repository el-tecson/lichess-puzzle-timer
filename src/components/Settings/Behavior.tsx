import { useEffect, useState } from 'react';
import { Tab, TabPanel } from '@/components/Tabs';
import ComputerIcon from '@/assets/computer.svg?react';
import {
    Checkbox,
    Input,
    Listbox,
    Radio,
    TimePicker,
} from '@/components/Settings/CustomComponents/BehaviorComponents';
import getConfig from '@/utils/Settings/getConfig';
import { CONFIG, TIME_PRESETS } from '@/constants';
import Associated from '@/components/Associated';
import Section from '@/components/Section';
import { Switch } from './CustomComponents/PreferencesComponents';
import getTimePresets from '@/utils/time-presets/getTimePresets';

export function BehaviorTab() {
    return (
        <Tab>
            <ComputerIcon />
            <p className="tab-name">Behavior</p>
        </Tab>
    );
}

export function BehaviorPanel() {
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
        <TabPanel>
            <p className="panel-name">Behavior</p>
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
            </div>
        </TabPanel>
    );
}
