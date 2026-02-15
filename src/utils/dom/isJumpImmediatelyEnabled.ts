export default function isJumpImmediatelyEnabled() {
    const el = document.getElementById(
        'cmn-tg-puzzle-toggle-autonext'
    ) as HTMLInputElement | null;

    return el?.checked ?? false;
}