import '@/styles/AnnouncementBar.css';

export default function AnnouncementBar() {
    return (
        <div className="announcement-bar" id="announce">
            <span>Liking this extension? </span>
            <a href="https://paypal.me/ElmerTecson" target="_blank" rel="noopener noreferrer">
                Support me on PayPal
            </a>
            <button className="close-announcement" onClick={dismissAnnouncement}>✕</button>
        </div>
    );
}

function dismissAnnouncement() {
    const announcementBar = document.getElementById('announce');
    if (announcementBar) announcementBar.style.display = 'none';
}
