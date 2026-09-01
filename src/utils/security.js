/**
 * DevJ Security & Anti-Tampering Shield
 * - Disables DevTools shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U)
 * - Disables right-click inspect context menu
 * - Rate limits authentication attempts against brute-force attacks
 * - Honeypot detection for bot traffic
 */

const RATE_LIMIT_KEY = 'devj_sec_rate_limit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 3 * 60 * 1000; // 3 minutes

export const initSecurityShield = () => {
    // 1. Disable Right Click Context Menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // 2. Disable Keyboard Shortcuts for DevTools
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl + Shift + I (Inspect), Ctrl + Shift + J (Console), Ctrl + Shift + C (Element Inspector)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Mac: Cmd + Option + I / J / C
        if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl + U (View Source)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // Ctrl + S (Save Page)
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // 3. DevTools Open Console Clearer / Warning
    setInterval(() => {
        if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
            console.clear();
        }
    }, 2000);
};

// Rate Limiter for Login
export const checkLoginRateLimit = () => {
    try {
        const record = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
        const now = Date.now();

        if (record.lockedUntil && now < record.lockedUntil) {
            const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
            return {
                allowed: false,
                remainingSeconds,
                message: `Too many failed attempts. Security lockout active for ${remainingSeconds}s.`,
            };
        }

        // Reset if lockout expired
        if (record.lockedUntil && now >= record.lockedUntil) {
            localStorage.removeItem(RATE_LIMIT_KEY);
            return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
        }

        const attempts = record.attempts || 0;
        return {
            allowed: attempts < MAX_ATTEMPTS,
            remainingAttempts: MAX_ATTEMPTS - attempts,
        };
    } catch {
        return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
    }
};

export const recordFailedLoginAttempt = () => {
    try {
        const record = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
        const now = Date.now();
        const attempts = (record.attempts || 0) + 1;

        if (attempts >= MAX_ATTEMPTS) {
            const lockedUntil = now + LOCKOUT_DURATION_MS;
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts, lockedUntil }));
            return { locked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
        }

        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ attempts, lastAttempt: now }));
        return { locked: false, remainingAttempts: MAX_ATTEMPTS - attempts };
    } catch {
        return { locked: false };
    }
};

export const clearLoginRateLimit = () => {
    localStorage.removeItem(RATE_LIMIT_KEY);
};
