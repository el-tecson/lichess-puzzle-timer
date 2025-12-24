import type { AnalyticsData } from '@/types/analytics';
import { get } from '../storage';
import { ANALYTICS_CONFIG } from '@/constants';

export default async function getAnalytics(): Promise<AnalyticsData> {
    const analytics = get(ANALYTICS_CONFIG, {
        totalPuzzles: 0,
        solved: 0,
        unsolved: 0,
    });
    return analytics as Promise<AnalyticsData>;
}
