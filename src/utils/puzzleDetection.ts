export function isPuzzlePage() {
    const domCheck = document.querySelector('.puzzle__board, .main-board') !== null;
    return domCheck;
}
