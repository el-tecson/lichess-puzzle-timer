import {
  Listbox as CustomListbox,
  ColorPicker as CustomColorPicker,
} from "@/components/Forms";
import type { ColorPickerProps, ListboxProps } from "@/types/components";
import changeCustomizationSettings, {
  changeCustomsSettings,
} from "@/utils/Settings/customization";

export function Listbox({
  initialState,
  configName,
  storageFunction,
  options,
  label,
  ...props
}: Omit<ListboxProps, "storageFunction">) {
  return (
    <CustomListbox
      initialState={initialState}
      configName={configName}
      storageFunction={changeCustomizationSettings}
      options={options}
      label={label}
      {...props}
    />
  );
}

export function ColorPicker({
  initialState,
  configName,
  storageFunction,
  label,
  ...props
}: Omit<ColorPickerProps, "storageFunction">) {
  return (
    <CustomColorPicker
      initialState={initialState}
      configName={configName}
      storageFunction={changeCustomsSettings}
      label={label}
      {...props}
    />
  );
}
