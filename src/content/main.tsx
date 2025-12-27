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
import '@/background/updateConfig';
import { createRoot } from 'react-dom/client';
import SmallPopup from '@/content/ui/SmallPopup';
import TimerPopup from '@/content/ui/TimerPopup';
import { LICHESS_LINK } from '@/constants';
import { isPuzzlePage } from '@/utils/puzzleDetection';
import getCustomsConfig from '@/utils/Settings/getCustomsConfig';
import { setShadowRootVars } from './loadCustoms';
import RootCSS from '@/styles/content/index.css?inline';
import getConfig from '@/utils/Settings/getConfig';
import { MemoryRouter } from 'react-router-dom';
import AnalyticsPopup from '@/content/ui/AnalyticsPopup';
import closeSettingsPages from '@/utils/closeSettingsPages';

async function injectStyles(shadowRoot: ShadowRoot, styles: Record<string, string>) {
    for (const css of Object.values(styles)) {
        const style = document.createElement('style');
        style.textContent = css;
        shadowRoot.appendChild(style);
    }
}

// Inject shadow DOM and React
async function injectShadowDOM() {
    if (!window.location.href.startsWith(LICHESS_LINK)) return;
    if (document.getElementById('lptimer-shadow-host')) return;

    const host = document.createElement('div');
    host.id = 'lptimer-shadow-host';
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.left = '-1000px';
    host.style.zIndex = '9999';
    document.body.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: 'open' });

    const formStyles = import.meta.glob('/src/styles/components/Forms/*.css', {
        query: '?inline',
        import: 'default',
        eager: true,
    }) as Record<string, string>;
    injectStyles(shadowRoot, formStyles);

    const componentStyles = import.meta.glob('/src/styles/components/*.css', {
        query: '?inline',
        import: 'default',
        eager: true,
    }) as Record<string, string>;
    injectStyles(shadowRoot, componentStyles);

    const templateStyles = import.meta.glob('/src/styles/components/Templates/*.css', {
        query: '?inline',
        import: 'default',
        eager: true,
    }) as Record<string, string>;
    injectStyles(shadowRoot, templateStyles);

    // Load custom vars
    const customs_config = await getCustomsConfig();
    setShadowRootVars(shadowRoot, customs_config);

    // Load Root CSS
    const styleRoot = document.createElement('style');
    styleRoot.textContent = RootCSS;
    shadowRoot.appendChild(styleRoot);

    // Container for React
    const container = document.createElement('div');
    const root = createRoot(container);
    const config = await getConfig();
    root.render(
        isPuzzlePage() ? (
            <>
                {config.preferencesSettings?.enableTimer && <TimerPopup />}
                {
                    (config.preferencesSettings?.enableTimer && config.preferencesSettings?.showAnalyticsPopup)
                    && <AnalyticsPopup />
                }
            </>
        ) : config.preferencesSettings?.showSmallPopup ? (
            <MemoryRouter>
                <SmallPopup />
            </MemoryRouter>
        ) : null,
    );

    // Forward pointer events to document so react-draggable works
    ['pointerdown', 'pointermove', 'pointerup'].forEach((ev) =>
        shadowRoot.addEventListener(ev, (e) => {
            const pevt = e as PointerEvent;
            const pe = new PointerEvent(ev, {
                bubbles: true,
                cancelable: true,
                composed: true,
                clientX: pevt.clientX,
                clientY: pevt.clientY,
                movementX: pevt.movementX,
                movementY: pevt.movementY,
                button: pevt.button,
                buttons: pevt.buttons,
                pointerId: pevt.pointerId,
                pointerType: pevt.pointerType,
                pressure: pevt.pressure,
                ctrlKey: pevt.ctrlKey,
                shiftKey: pevt.shiftKey,
                altKey: pevt.altKey,
                metaKey: pevt.metaKey,
            });
            document.dispatchEvent(pe);
        }),
    );
    shadowRoot.appendChild(container);
}

// --- MAIN ENTRY ---
window.addEventListener('load', async () => {
    injectShadowDOM(); // For the first puzzle
    const config = await getConfig();
    if (config.behaviorSettings?.timerType === '0' && config.behaviorSettings?.skipToNextPuzzle) {
        observePuzzleBoard(); // For SPA navigation
    }
});

// ---------------------------------------------------------------------------
// SPA-safe: detect when the puzzle page appears & inject timer
// ---------------------------------------------------------------------------
function observePuzzleBoard() {
    const observer = new MutationObserver(() => {
        if (isPuzzlePage() && !document.getElementById('lptimer-shadow-host')) {
            injectShadowDOM();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// ---------------------------------------------------------------------------
// Auto-close settings extension pages
// ---------------------------------------------------------------------------
let shouldCloseExtension = false;

// Called when user changes a setting
export function markExtensionForClose() {
    shouldCloseExtension = true;
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && shouldCloseExtension) {
        closeSettingsPages();

        shouldCloseExtension = false; // prevent repeats
    }
});
