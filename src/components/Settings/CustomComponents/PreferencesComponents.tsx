import { Checkbox as CustomCheckbox } from "@/components/Templates";
import changePreferencesSettings from "@/utils/Settings/preferences";
import type { CheckboxProps } from "@/types/templates";

export function Checkbox({
  initialState,
  configName,
  ...props
}: Omit<CheckboxProps, "storageFunction">) {
  return (
    <CustomCheckbox
      initialState={initialState}
      configName={configName}
      storageFunction={changePreferencesSettings}
      {...props}
    />
  );
}
