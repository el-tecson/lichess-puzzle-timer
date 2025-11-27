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
            <TimerPopup />
        ) : config.preferencesSettings?.showSmallPopup ? (
            <MemoryRouter>
                <SmallPopup />
            </MemoryRouter>
        ) : null
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
        })
    );
    shadowRoot.appendChild(container);
}

// --- MAIN ENTRY ---
window.addEventListener("load", async () => {
    injectShadowDOM();     // For the first puzzle
    const config = await getConfig();
    if (config.behaviorSettings?.timerType === '0' && config.behaviorSettings?.skipToNextPuzzle) { 
        observePuzzleBoard();  // For SPA navigation
        setupPuzzleObserver(); // For detecting each puzzle load
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
// Detect DOM changes to know when a NEW puzzle loads
// ---------------------------------------------------------------------------
function setupPuzzleObserver() {
    const observer = new MutationObserver(() => {
        // A new puzzle appeared
        if (document.querySelector(".puzzle__board")) {
            onPuzzleLoad();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// ---------------------------------------------------------------------------
// ONE PLACE where puzzle-related automation triggers
// ---------------------------------------------------------------------------
function onPuzzleLoad() {
    waitForVoteButton();
}

// ---------------------------------------------------------------------------
// Wait for vote-up button, then auto-click it after a delay
// ---------------------------------------------------------------------------
function waitForVoteButton() {
    const interval = setInterval(async () => {
        const voteBtn = document.querySelector('.puzzle__vote__buttons > .vote-up.vote') as HTMLElement | null;
        const continueBtn = document.querySelector('.continue') as HTMLElement | null;
        if (voteBtn || continueBtn) {
            const host = document.getElementById('lptimer-shadow-host');
            const bigTime = host?.shadowRoot?.querySelector('.big-time')?.textContent ?? "00:00:00";
            const smallTime = host?.shadowRoot?.querySelector('.small-time')?.textContent ?? ":00";

            if (voteBtn && bigTime !== "00:00:00" && smallTime !== ":00") {
                clearInterval(interval);
                const config = await getConfig();
                const delay = (config.behaviorSettings?.countdownBeforeSkipping ? config.behaviorSettings?.countdownBeforeSkippingNum : 1) * 1000;
                if (voteBtn) {
                    setTimeout(() => {
                        voteBtn.click();
                    }, delay);
                }
                else if (continueBtn) {
                    setTimeout(() => {
                        continueBtn.click();
                    }, delay);
                }
            }
        }
    }, 100);
}
