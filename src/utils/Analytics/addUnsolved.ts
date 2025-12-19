import getAnalytics from "./getAnalytics";

export default async function addUnsolved() {
    const analytics = await getAnalytics();
    chrome.runtime.sendMessage({
        action: 'updateAnalytics',
        data: {
            ...analytics,
            unsolved: analytics.unsolved! + 1,
            totalPuzzles: analytics.totalPuzzles + 1
        }
    });
}