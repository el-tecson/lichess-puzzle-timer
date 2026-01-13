import matchMediaQuery from 'matchmediaquery';

export default function isMobile(width = window.innerWidth) {
    return matchMediaQuery('(max-width: 600px)', {
        width: width
    }).matches;
}