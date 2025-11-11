import "@/styles/components/Forms/ColorPicker.css";
import { useState, useEffect } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import type { ColorResult } from "react-color";
import { ChromePicker } from "react-color";
import PencilOnBarIcon from "@/assets/pencil-on-bar.svg?react";
import type { ColorPickerProps } from "@/types/components";
import changeCustomizationSettings from "@/utils/Settings/customization";

export default function ColorPicker({
  className = "",
  initialState,
  configName,
  storageFunction,
  label,
  ...props
}: ColorPickerProps) {
  const [color, setColor] = useState(initialState);

  useEffect(() => {
    setColor(initialState);
  }, [initialState]);

  const handleChange = async (newColor: ColorResult) => {
    setColor(newColor.hex);
    await storageFunction(configName, newColor.hex);
    await changeCustomizationSettings("currentCustomsName", "custom");
  };

  return (
    <Popover
      className={`color-picker ${className}`}
      style={{
        position: "relative",
        width: "fit-content",
      }}
      {...props}
    >
      <p className="color-picker-label">{label}</p>
      <PopoverButton className="color-picker-button">
        <div
          className="current-color"
          style={{
            backgroundColor: color,
          }}
        />
        <PencilOnBarIcon className="color-picker-icon" />
      </PopoverButton>

      <PopoverPanel
        className="color-picker-panel"
        style={{
          position: "absolute",
          top: 0,
          left: "100%",
          zIndex: 10,
          marginLeft: "10px",
        }}
      >
        <ChromePicker color={color} onChange={handleChange} />
      </PopoverPanel>
    </Popover>
  );
}
