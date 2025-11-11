import { CONFIG } from "@/constants";
import getConfig from "@/utils/Settings/getConfig";
import { set } from "@/utils/storage";

export default async function changeBehaviorSettings(
  item: string,
  value: any,
): Promise<void> {
  const config = await getConfig();
  await set(CONFIG, {
    ...config,
    behaviorSettings: {
      ...config.behaviorSettings,
      [item]: value,
    },
  });
}
