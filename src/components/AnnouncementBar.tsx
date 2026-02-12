import '@/styles/AnnouncementBar.css';

export default function AnnouncementBar() {
    return (
        <div className="announcement-bar" id="announce">
            <span>Enjoying this extension? </span>
            <a href="https://chromewebstore.google.com/detail/ifloeapglolidlgbfjnfidpnpnobddof/reviews" target="_blank" rel="noopener noreferrer">
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
