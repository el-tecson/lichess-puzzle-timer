import { useState, useEffect } from "react";
import getConfig from "@/utils/Settings/getConfig";
import getCustomsConfig from "@/utils/Settings/getCustomsConfig";
import { CONFIG, CUSTOMS_CONFIG } from "@/constants";
import { Tab, TabPanel } from "@/components/Tabs";
import {
  Listbox,
  ColorPicker,
} from "@/components/Settings/CustomComponents/CustomizationComponents";
import BrushIcon from "@/assets/brush.svg?react";
import type { ReactNode } from "react";

export function CustomizationTab() {
  return (
    <Tab>
      <BrushIcon />
      <p className="tab-name">Customization</p>
    </Tab>
  );
}

export function CustomizationPanel() {
  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const [customsSettings, setCustomsSettings] = useState<Record<
    string,
    any
  > | null>(null);
  const [activePreset, setActivePreset] = useState<{
    name: string;
    data: Record<string, any>;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const config = await getConfig();
      setSettings(config);
      const customsConfig = await getCustomsConfig();
      setCustomsSettings(customsConfig);
    })();

    const handleChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName === "local") {
        if (changes[CONFIG]) setSettings(changes[CONFIG].newValue);
        if (changes[CUSTOMS_CONFIG])
          setCustomsSettings(changes[CUSTOMS_CONFIG].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!settings || !customsSettings) return;

    const currentName = settings.customizationSettings?.currentCustomsName;
    const data = customsSettings[currentName] || {};

    setActivePreset({ name: currentName, data });
  }, [settings, customsSettings]);

  if (!activePreset) return;

  return (
    <TabPanel>
      <p className="panel-name">Customization</p>
      <Listbox
        initialState={activePreset.name}
        configName="currentCustomsName"
        options={customsSettings}
        label="Preset:"
      />
      <div className="part">
        <ColorPicker
          initialState={activePreset.data.textColor}
          configName="textColor"
          label="Text Color:"
        />
        <ColorPicker
          initialState={activePreset.data.backgroundColor}
          configName="backgroundColor"
          label="Background Color:"
        />
        <Combined>
          <ColorPicker
            initialState={activePreset.data.overlayColor}
            configName="overlayColor"
            label="Overlay Color:"
          />
          <ColorPicker
            initialState={activePreset.data.overOverlayColor}
            configName="overOverlayColor"
            label="Over-Overlay Color:"
          />
        </Combined>
        <Combined>
          <ColorPicker
            initialState={activePreset.data.accentColor}
            configName="accentColor"
            label="Accent Color:"
          />
          <ColorPicker
            initialState={activePreset.data.accentHoverColor}
            configName="overOverlayColor"
            label="Accent Hover Color:"
          />
        </Combined>
        <Combined>
          <ColorPicker
            initialState={activePreset.data.goodColor}
            configName="goodColor"
            label="Good Color:"
          />
          <ColorPicker
            initialState={activePreset.data.goodHoverColor}
            configName="goodHoverColor"
            label="Good Hover Color:"
          />
        </Combined>
        <Combined>
          <ColorPicker
            initialState={activePreset.data.badColor}
            configName="badColor"
            label="Bad Color:"
          />
          <ColorPicker
            initialState={activePreset.data.badHoverColor}
            configName="badHoverColor"
            label="Bad Hover Color:"
          />
        </Combined>
        <ColorPicker
          initialState={activePreset.data.inputColor}
          configName="inputColor"
          label="Input Color:"
        />
        <Combined className="big-gap">
          <Combined className="downward">
            <Combined className="downward">
              <p className="color-label">Pause/Play Button</p>
              <ColorPicker
                initialState={activePreset.data.pausePlayButtonNormal}
                configName="pausePlayButtonNormal"
                label="Normal Color:"
                className="padded"
              />
              <ColorPicker
                initialState={activePreset.data.pausePlayButtonHover}
                configName="pausePlayButtonHover"
                label="Hover Color:"
                className="padded"
              />
            </Combined>
            <Combined className="downward">
              <p className="color-label">Cancel Button</p>
              <ColorPicker
                initialState={activePreset.data.cancelButtonNormal}
                configName="cancelButtonNormal"
                label="Normal Color:"
                className="padded"
              />
              <ColorPicker
                initialState={activePreset.data.cancelButtonHover}
                configName="cancelButtonHover"
                label="Hover Color:"
                className="padded"
              />
            </Combined>
          </Combined>
          <Combined className="downward">
            <Combined className="downward">
              <p className="color-label">Restart Button</p>
              <ColorPicker
                initialState={activePreset.data.restartButtonNormal}
                configName="restartButtonNormal"
                label="Normal Color:"
                className="padded"
              />
              <ColorPicker
                initialState={activePreset.data.restartButtonHover}
                configName="restartButtonHover"
                label="Hover Color:"
                className="padded"
              />
            </Combined>
            <Combined className="downward">
              <p className="color-label">Settings Button</p>
              <ColorPicker
                initialState={activePreset.data.settingsButtonNormal}
                configName="settingsButtonNormal"
                label="Normal Color:"
                className="padded"
              />
              <ColorPicker
                initialState={activePreset.data.settingsButtonHover}
                configName="settingsButtonHover"
                label="Hover Color:"
                className="padded"
              />
            </Combined>
          </Combined>
        </Combined>
        <ColorPicker
          initialState={activePreset.data.logoColor}
          configName="logoColor"
          label="Logo Color:"
        />
        <Combined>
          <ColorPicker
            initialState={activePreset.data.buttonColor}
            configName="buttonColor"
            label="Button Color:"
          />
          <ColorPicker
            initialState={activePreset.data.buttonHoverColor}
            configName="buttonHoverColor"
            label="Button Hover Color:"
          />
        </Combined>
      </div>
    </TabPanel>
  );
}

function Combined({
  className = "",
  children,
  ...props
}: {
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}) {
  return (
    <div className={`combined ${className}`} {...props}>
      {children}
    </div>
  );
}
