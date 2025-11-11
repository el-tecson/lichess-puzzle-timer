import { useEffect, useState } from "react";
import { Tab, TabPanel } from "@/components/Tabs";
import ComputerIcon from "@/assets/computer.svg?react";
import {
  Checkbox,
  Input,
  Radio,
  TimePicker,
} from "@/components/Settings/CustomComponents/BehaviorComponents";
import getConfig from "@/utils/Settings/getConfig";
import { CONFIG } from "@/constants";
import Associated from "@/components/Associated";
import Section from "@/components/Section";

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
      <p className="panel-name">Behavior</p>
      <div className="part">
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
              initialState={
                settings.behaviorSettings?.countdownBeforeSkippingNum
              }
              configName="countdownBeforeSkippingNum"
            />
          </Checkbox>
        </Associated>
        <Checkbox
          initialState={settings.behaviorSettings?.showSolution}
          configName="showSolution"
          text="Show solution/offer solution when timer hits 0."
        />
        <Checkbox
          initialState={settings.behaviorSettings?.showDialog}
          configName="showDialog"
          text={'Show "Time\'s Up!" dialog when timer hits 0.'}
        />
        <Section sectionName="Timer">
          <Radio
            initialState={settings.behaviorSettings.timerType}
            configName="timerType"
            label="Type of timer"
            options={[
              {
                name: "Timer resets after each puzzle.",
                optionName: "0",
              },
              {
                name: "Timer is a set amount of time.",
                optionName: "1",
              },
            ]}
          />
          {settings.behaviorSettings?.timerType === "0" && (
            <TimePicker
              initialState={settings.behaviorSettings?.timeControl0}
              configName="timeControl0"
              label="Time Control"
            />
          )}
          {settings.behaviorSettings?.timerType === "1" && (
            <TimePicker
              initialState={settings.behaviorSettings?.timeControl1}
              configName="timeControl1"
              label="Time Control"
            />
          )}
        </Section>
        <Checkbox
          initialState={settings.behaviorSettings?.puzzleLimit}
          configName="puzzleLimit"
          text="Puzzle Limit:"
        >
          <Input
            initialState={settings.behaviorSettings?.puzzleLimitNum}
            configName="puzzleLimitNum"
          />
        </Checkbox>
      </div>
    </TabPanel>
  );
}
