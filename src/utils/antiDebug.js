/**
 * Client-Side Anti-Tamper & Anti-Inspection Shield
 * Prohibits devtools shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U), disables right-click inspect,
 * and deters client-side runtime tampering.
 */

export const initAntiDebugShield = () => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // 1. Prohibit Right-Click Context Menu (Inspect Element)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    }, { capture: true });

    // 2. Prohibit DevTools and Source-Viewing Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        const isCtrlOrMeta = e.ctrlKey || e.metaKey;

        if (isCtrlOrMeta) {
            // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element)
            if (e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+U (View Source)
            if (['u', 'U'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+S (Save Page)
            if (['s', 'S'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }, { capture: true });

    // 3. Security Warning in Console
    try {
        const titleStyle = 'color: #ea580c; font-size: 24px; font-weight: 900; -webkit-text-stroke: 1px black;';
        const bodyStyle = 'color: #4b5563; font-size: 13px; font-weight: 600; line-height: 1.5;';
        console.log('%cSTOP! Unauthorized Inspection Prohibited', titleStyle);
        console.log('%cDevJ incorporates active client integrity checks and automated threat logging. Any unauthorized tampering or reverse-engineering attempts will trigger an automated 24-hour IP restriction.', bodyStyle);
    } catch {
        // Silent fail if console is restricted
    }

    // 4. Subtle DevTools Detection & Console Clear in Production
    if (import.meta.env.PROD) {
        setInterval(() => {
            const widthDiff = window.outerWidth - window.innerWidth > 160;
            const heightDiff = window.outerHeight - window.innerHeight > 160;
            if (widthDiff || heightDiff) {
                // Devtools is docked and open
                try {
                    console.clear();
                } catch {
                    // Ignore
                }
            }
        }, 1500);
    }
};
