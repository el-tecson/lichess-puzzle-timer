import getAnalytics from "./getAnalytics";

export default async function addSolved() {
    const analytics = await getAnalytics();
    chrome.runtime.sendMessage({
        action: 'updateAnalytics',
        data: {
            ...analytics,
            solved: analytics.solved! + 1,
            totalPuzzles: analytics.totalPuzzles + 1
        }
    });
}