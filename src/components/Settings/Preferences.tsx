import { useState, useEffect } from 'react';
import getConfig from '@/utils/Settings/getConfig';
import { CONFIG } from '@/constants';
import { Tab, TabPanel } from '@/components/Tabs';
import PreferencesIcon from '@/assets/preferences.svg?react';
import { Checkbox, Slider, Switch } from '@/components/Settings/CustomComponents/PreferencesComponents';
import Section from '@/components/Section';
import Associated from '../Associated';
import resetEverything from '@/utils/Settings/resetEverything';
import ResetIcon from "@/assets/reload.svg?react";

export function PreferencesTab() {
    return (
        <Tab>
            <PreferencesIcon />
            <p className="tab-name">Preferences</p>
        </Tab>
    );
}

export function PreferencesPanel() {
    const [settings, setSettings] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        (async () => {
            const config = await getConfig();
            setSettings(config);
        })();

        const handleChange = (
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
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
        <TabPanel>
            <p className="panel-name">Preferences</p>
            <div className="part">
                <Associated>
                    <Switch
                        initialState={settings.preferencesSettings?.enableTimer}
                        configName="enableTimer"
                        text="Enable timer."
                    />
                    <Checkbox
                        initialState={settings.preferencesSettings?.showAnalyticsPopup}
                        configName="showAnalyticsPopup"
                        text="Show analytics popup."
                    />
                    <Checkbox
                        initialState={settings.preferencesSettings?.showSkipIndicator}
                        configName="showSkipIndicator"
                        text="Show skip countdown."
                    />
                </Associated>
                <Checkbox
                    initialState={settings.preferencesSettings?.showSmallPopup}
                    configName="showSmallPopup"
                    text="Show small popup icon."
                />
                <Section sectionName="Sound">
                    <Associated>
                        <Switch
                            initialState={settings.preferencesSettings?.enableSounds}
                            configName="enableSounds"
                            text="Enable sounds."
                        />
                        <Checkbox
                            initialState={settings.preferencesSettings?.alertWhenTimerIsZero}
                            configName="alertWhenTimerIsZero"
                            text="Alert when timer has reached 0."
                        />
                        <Checkbox
                            initialState={settings.preferencesSettings?.alertWhenNextPuzzle}
                            configName="alertWhenNextPuzzle"
                            text="Alert when moving on to next puzzle."
                        />
                        <Checkbox
                            initialState={settings.preferencesSettings?.alertWhenTimeShort}
                            configName="alertWhenTimeShort"
                            text="Alert when timer has less than 3 seconds left."
                        />
                        <Checkbox
                            initialState={settings.preferencesSettings?.alertWhenSolved}
                            configName="alertWhenSolved"
                            text="Alert when puzzle had been solved."
                        />
                        <Checkbox
                            initialState={settings.preferencesSettings?.alertButtonClicks}
                            configName="alertButtonClicks"
                            text="Show sound when clicking timer buttons."
                        />
                    </Associated>
                    <Slider
                        initialState={settings.preferencesSettings?.soundVolume}
                        configName="soundVolume"
                        label="Volume:"
                    />
                </Section>
                <Section sectionName="Timer">
                    <Associated>
                        <Switch
                            initialState={settings.preferencesSettings?.enableVisuals}
                            configName="enableVisuals"
                            text="Enable visuals."
                        />
                        <Checkbox
                            initialState={settings.preferencesSettings?.showVisualLowTime}
                            configName="showVisualLowTime"
                            text="Show visual change when time is low."
                        />
                        <Checkbox
                            initialState={settings.preferencesSettings?.showVisualPuzzleSolved}
                            configName="showVisualPuzzleSolved"
                            text="Show visual change when puzzle is solved."
                        />
                    </Associated>
                    <Checkbox
                        initialState={settings.preferencesSettings?.showTimer}
                        configName="showTimer"
                        text="Show timer while solving puzzles."
                    />
                    <Checkbox
                        initialState={settings.preferencesSettings?.showTimerButtons}
                        configName="showTimerButtons"
                        text="Show buttons beside puzzle timer."
                    />
                </Section>
                <Section sectionName="Danger Zone">
                    <button
                        className="btn reset-everything-btn"
                        onClick={async () => {
                            await resetEverything();
                        }}
                    >
                        <ResetIcon />
                        <span className="btn-text">Reset everything to defaults.</span>
                    </button>                    
                </Section>
            </div>
        </TabPanel>
    );
}
