export function isPuzzlePage() {
    const domCheck = document.querySelector('.puzzle__board') !== null;
    return domCheck;
}
