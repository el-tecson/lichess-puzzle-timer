import '@/background/loadDefaults';
import '@/content/loadCustoms';
import { HashRouter, Routes, Route } from 'react-router-dom';
import SettingsPage from '@/pages/SettingsPage';
import AboutPage from '@/pages/About';
import HowToUsePage from '@/pages/HowToUse';
import Navbar from '@/components/Navbar';
import '@/styles/index.css';
import '@/styles/local.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AnnouncementBar from './components/AnnouncementBar';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HashRouter>
            <div id="background-overlay"></div>
            <AnnouncementBar />
            <Navbar />
            <Routes>
                <Route path="/" element={<AboutPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/how-to-use" element={<HowToUsePage />} />
            </Routes>
        </HashRouter>
    </StrictMode>
);
