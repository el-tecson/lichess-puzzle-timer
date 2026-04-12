import '@/styles/AnnouncementBar.css';

export default function AnnouncementBar() {
    const reviewLink = getReviewLink();

    return (
        <div className="announcement-bar" id="announce">
            <span>Enjoying this extension? </span>
            <a href={reviewLink} target="_blank" rel="noopener noreferrer">
                A quick review would mean a lot.
            </a>
            <button className="close-announcement" onClick={dismissAnnouncement}>✕</button>
        </div>
    );
}

function dismissAnnouncement() {
    const announcementBar = document.getElementById('announce');
    if (announcementBar) announcementBar.style.display = 'none';
}

const getReviewLink = () => {
    if (typeof navigator === 'undefined') return '';

    return navigator.userAgent.includes('Firefox')
        ? 'https://addons.mozilla.org/en-US/firefox/addon/lichess-puzzle-timer/reviews/'
        : 'https://chromewebstore.google.com/detail/ifloeapglolidlgbfjnfidpnpnobddof/reviews';
};