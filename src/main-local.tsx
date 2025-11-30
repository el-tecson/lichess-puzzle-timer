/*
 * Copyright 2025 Emmanuel Leu Tecson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    </StrictMode>,
);
