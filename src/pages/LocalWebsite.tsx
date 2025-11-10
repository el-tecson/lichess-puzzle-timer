import { HashRouter, Routes, Route } from "react-router-dom"
import SettingsPage from '@/pages/SettingsPage'
import AboutPage from '@/pages/About'
import HowToUsePage from "@/pages/HowToUse"
import Navbar from '@/components/Navbar'
import '@/styles/index.css'
import '@/styles/LocalWebsite.css'

export default function LocalWebsite() {
    return (
        <>
            <HashRouter>
                <div id="background-overlay"></div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<AboutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/how-to-use" element={<HowToUsePage />} />
                </Routes>
            </HashRouter>
        </>
    )
}