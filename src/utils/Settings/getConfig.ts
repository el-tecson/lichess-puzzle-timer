import DefaultConfig from '@/configs/default_config.json';
import { get } from '@/utils/storage';

export default async function getConfig() {
    const config = await get('config', DefaultConfig);
    return config as Record<string, Record<string, any>>;
}
