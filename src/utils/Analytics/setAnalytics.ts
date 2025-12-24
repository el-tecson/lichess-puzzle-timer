import { ANALYTICS_CONFIG } from "@/constants";
import { set } from "../storage";
import type { AnalyticsData } from "@/types/analytics";

export default async function setAnalytics(data: AnalyticsData) {
    await set(ANALYTICS_CONFIG, data);
}