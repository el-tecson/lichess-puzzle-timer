import Logo from "@/assets/lptimer-logo-wide.svg?react"
import SettingsIcon from '@/assets/settings.svg?react'
import ReloadIcon from '@/assets/reload.svg?react'
import KoFiIcon from '@/assets/ko-fi.svg?react'
import "@/styles/Popup.css"

export default function Popup() {
    return (
        <section id="popup">
            <div className="popup-container">
                <Logo className='logo' height="48" width="202" onClick={openLocalWebsite}/>
                <div className="buttons-container">
                    <button className="btn" id="openSettings" onClick={openSettings}>
                        <SettingsIcon />
                        <span className="btn-text">Settings</span>
                    </button>
                    <button className="btn" id="reloadTimer">
                        <ReloadIcon />
                        <span className="btn-text">Reload timer</span>
                    </button>
                    <button className="btn" id="donateBtn">
                        <KoFiIcon />
                        <span className="btn-text">Support me on Ko-Fi</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

function openSettings() {
    chrome.tabs.create({
        url: chrome.runtime.getURL("local.html#/settings")
    });
}

function openLocalWebsite() {
    chrome.tabs.create({
        url: chrome.runtime.getURL("local.html")
    });
}