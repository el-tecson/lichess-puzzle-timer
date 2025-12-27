export default function showSkipIndicator() {
    const host = document.getElementById('lptimer-shadow-host');
    const skipIndicator =
        host?.shadowRoot?.querySelector('.skip-indicator') as HTMLElement | null;
    if (skipIndicator) {
        skipIndicator.removeAttribute('hidden');
    }
}
