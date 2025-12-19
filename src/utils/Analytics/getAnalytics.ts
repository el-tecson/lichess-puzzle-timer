import type { AnalyticsData } from "@/types/analytics";

export default function getAnalytics(): Promise<AnalyticsData> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'getAnalytics' }, (response) => {
            resolve(response.data as AnalyticsData);
        });
    });
}
