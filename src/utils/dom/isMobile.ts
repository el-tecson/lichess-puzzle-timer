import matchMediaQuery from 'matchmediaquery';

export default function isMobile() {
    const currentWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    return matchMediaQuery('(max-width: 600px)', { width: currentWidth }).matches;
}
