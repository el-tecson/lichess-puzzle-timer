import getAnalytics from './getAnalytics';
import setAnalytics from './setAnalytics';

export default async function addUnsolved() {
    const analytics = await getAnalytics();
    await setAnalytics({
        totalPuzzles: analytics.totalPuzzles + 1,
        solved : analytics.solved,
        unsolved: analytics.unsolved + 1,
    });
}

