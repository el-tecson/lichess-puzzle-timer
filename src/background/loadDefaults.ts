import getConfig from "@/utils/Settings/getConfig";
import getCustomsConfig from "@/utils/Settings/getCustomsConfig";
import { set } from "@/utils/storage";

await (async function setDefaultConfig() {
    await set('config', await getConfig());
    await set('custom_conf', await getCustomsConfig());
})();