import { useState, useEffect } from "react";
import getConfig from "@/utils/Settings/getConfig";
import { CONFIG } from "@/constants";
import { Tab, TabPanel } from "@/components/Tabs";
import PreferencesIcon from "@/assets/preferences.svg?react";
import { Checkbox } from "@/components/Settings/CustomComponents/PreferencesComponents";
import Associated from "@/components/Associated";
import Section from "@/components/Section";

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
      if (areaName === "local" && changes[CONFIG]) {
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
          <Checkbox
            initialState={settings.preferencesSettings?.showSmallPopup}
            configName="showSmallPopup"
            text="Show small popup icon."
          />
          <Checkbox
            initialState={settings.preferencesSettings?.showSmallPopupOnTactics}
            configName="showSmallPopupOnTactics"
            text="Show small popup on tactics page."
          />
          <Checkbox
            initialState={
              settings.preferencesSettings?.showSmallPopupEverywhere
            }
            configName="showSmallPopupEverywhere"
            text="Show small popup everywhere on the website."
          />
        </Associated>
        <Section sectionName="Sound">
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
        </Section>
        <Section sectionName="Timer">
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
      </div>
    </TabPanel>
  );
}
