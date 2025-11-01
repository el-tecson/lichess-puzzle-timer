import { HashRouter, Routes, Route } from "react-router-dom"
import SettingsPage from '@/pages/SettingsPage'
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
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </HashRouter>
        </>
    )
}