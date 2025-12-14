export default function setTimeColor(color: string, fontWeight = 'normal', animation = '') {
    const host = document.getElementById('lptimer-shadow-host');
    const timer =
        host?.shadowRoot?.querySelector('.timer') as HTMLElement | null;
    if (timer) {
        timer.childNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
                node.style.color = color;
                node.style.fontWeight = fontWeight;
                node.style.animation = animation;
            }
        });
    }
}
