export default function hideSkipIndicator() {
    const host = document.getElementById('lptimer-shadow-host');
    const skipIndicator =
        host?.shadowRoot?.querySelector('.skip-indicator') as HTMLElement | null;
    if (skipIndicator) {
        skipIndicator.setAttribute('hidden', '');
    }
}