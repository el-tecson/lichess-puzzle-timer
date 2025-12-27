import getAnalytics from './getAnalytics';
import setAnalytics from './setAnalytics';

export default async function addSolved() {
    const analytics = await getAnalytics();
    await setAnalytics({
        totalPuzzles: analytics.totalPuzzles + 1,
        solved : analytics.solved + 1,
        unsolved: analytics.unsolved,
    });
}

