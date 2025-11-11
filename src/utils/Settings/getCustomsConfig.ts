import DarkCustomConf from '@/configs/dark_custom.json';
import { get } from '@/utils/storage';

export default async function getCustomsConfig() {
    const custom_conf = await get('custom_conf', DarkCustomConf);
    return custom_conf as Record<string, Record<string, string>>;
}
