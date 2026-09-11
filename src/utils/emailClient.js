/**
 * Email Client Utility
 * Integrates Outlook Web, Outlook Desktop, and Webmail clients with
 * clipboard safeguards and collaborator delivery guarantees.
 * Completely dynamic: Zero hardcoded email fallbacks.
 */

export const EMAIL_CLIENT_PREF_KEY = 'devj_preferred_email_client';
export const GMAIL_USER_KEY = 'devj_gmail_user_v1';
export const GMAIL_APP_PASSWORD_KEY = 'devj_gmail_app_password_v1';
export const OUTLOOK_APP_PASSWORD_KEY = 'devj_outlook_app_password_v1';

/**
 * Resolves the active user/sender email dynamically from local storage or context
 */
export const getActiveSenderEmail = () => {
    try {
        const stored = JSON.parse(localStorage.getItem('devj_portfolio_data_v1') || '{}');
        if (stored?.profile?.email) return stored.profile.email.trim();
    } catch (e) {}
    return '';
};

export const OUTLOOK_ACCOUNT_EMAIL = getActiveSenderEmail();

export const EMAIL_CLIENTS = [
    {
        id: 'outlook-web',
        name: 'Outlook Web (Personal / Live)',
        shortName: 'Outlook Web',
        description: 'Opens outlook.live.com in browser ready to send from your Outlook account',
        badge: 'Recommended',
        buildUrl: ({ to, subject, body }) =>
            `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    },
    {
        id: 'gmail-web',
        name: 'Gmail Web',
        shortName: 'Gmail Web',
        description: 'Opens mail.google.com in browser with draft pre-filled',
        badge: 'Webmail',
        buildUrl: ({ to, subject, body }) =>
            `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    },
    {
        id: 'outlook-desktop',
        name: 'Outlook Desktop / Windows Mail',
        shortName: 'Outlook Desktop',
        description: 'Opens local Outlook desktop app or Windows default email client via mailto:',
        badge: 'Desktop App',
        buildUrl: ({ to, subject, body }) =>
            `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    },
    {
        id: 'outlook-office',
        name: 'Outlook Office 365 (Work / School)',
        shortName: 'Outlook 365',
        description: 'Opens outlook.office.com for Microsoft 365 commercial accounts',
        badge: 'M365',
        buildUrl: ({ to, subject, body }) =>
            `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
];

/**
 * Strips raw markdown asterisks and headers so text reads naturally in email clients
 */
export const cleanEmailBody = (text = '') => {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold **text** -> text
        .replace(/\*(.*?)\*/g, '$1')     // Italic *text* -> text
        .replace(/^#+\s+/gm, '')        // Headers # Title -> Title
        .trim();
};

/**
 * Validates an email address format
 */
export const isValidEmail = (email = '') => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

/**
 * Dispatches draft to selected email client with clipboard safety-net
 */
export const dispatchEmail = async ({
    clientId = 'outlook-web',
    to = '',
    subject = '',
    body = ''
}) => {
    const trimmedTo = String(to).trim();
    if (!isValidEmail(trimmedTo)) {
        throw new Error(`Invalid recipient email address: "${trimmedTo}". Please verify collaborator email.`);
    }

    const cleanBody = cleanEmailBody(body);
    const client = EMAIL_CLIENTS.find((c) => c.id === clientId) || EMAIL_CLIENTS[0];
    const targetUrl = client.buildUrl({ to: trimmedTo, subject, body: cleanBody });

    // Store user preference
    try {
        localStorage.setItem(EMAIL_CLIENT_PREF_KEY, client.id);
    } catch (e) {
        // Safe fallback
    }

    // Safeguard: Copy full un-truncated message to clipboard
    let clipboardCopied = false;
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(cleanBody);
            clipboardCopied = true;
        }
    } catch (clipErr) {
        console.warn('Clipboard write fallback:', clipErr);
    }

    // Launch email client
    if (client.id === 'outlook-desktop') {
        window.location.href = targetUrl;
    } else {
        const openedWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer');
        if (!openedWindow) {
            window.location.href = targetUrl;
        }
    }

    return {
        success: true,
        client,
        to: trimmedTo,
        subject,
        clipboardCopied,
        bodyLength: cleanBody.length
    };
};

export const getStoredGmailUser = () => {
    try {
        return localStorage.getItem(GMAIL_USER_KEY) || '';
    } catch {
        return '';
    }
};

export const setStoredGmailUser = (email = '') => {
    try {
        if (email && email.trim()) {
            localStorage.setItem(GMAIL_USER_KEY, email.trim());
        } else {
            localStorage.removeItem(GMAIL_USER_KEY);
        }
    } catch (e) {
        console.warn('Failed to save Gmail account:', e);
    }
};

export const getStoredGmailAppPassword = () => {
    try {
        return localStorage.getItem(GMAIL_APP_PASSWORD_KEY) || localStorage.getItem(OUTLOOK_APP_PASSWORD_KEY) || '';
    } catch {
        return '';
    }
};

export const setStoredGmailAppPassword = (pwd = '') => {
    try {
        if (pwd && pwd.trim()) {
            localStorage.setItem(GMAIL_APP_PASSWORD_KEY, pwd.trim());
        } else {
            localStorage.removeItem(GMAIL_APP_PASSWORD_KEY);
        }
    } catch (e) {
        console.warn('Failed to save Gmail app password:', e);
    }
};

export const hasStoredGmailCredentials = () => {
    return Boolean(getStoredGmailAppPassword());
};

// Aliases for backward compatibility
export const getStoredOutlookAppPassword = getStoredGmailAppPassword;
export const setStoredOutlookAppPassword = setStoredGmailAppPassword;
export const hasStoredOutlookAppPassword = hasStoredGmailCredentials;

/**
 * Sends email directly in-app using Gmail SMTP without opening any external browser window
 */
export const sendDirectEmail = async ({
    to = '',
    subject = '',
    body = '',
    gmailUser = '',
    appPassword = '',
    fromEmail = '',
    fromName = ''
}) => {
    const trimmedTo = String(to).trim();
    if (!isValidEmail(trimmedTo)) {
        throw new Error(`Invalid recipient email address: "${trimmedTo}". Please verify collaborator email.`);
    }

    const cleanBody = cleanEmailBody(body);
    const password = appPassword || getStoredGmailAppPassword();
    const gUser = (gmailUser || getStoredGmailUser()).trim();

    const senderEmail = (fromEmail || getActiveSenderEmail()).trim();

    const token = localStorage.getItem('devj_admin_auth_token_v1') || '';
    const payload = JSON.stringify({
        to: trimmedTo,
        subject,
        body: cleanBody,
        gmailUser: gUser,
        appPassword: password,
        fromEmail: senderEmail,
        fromName: (fromName || '').trim()
    });

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    let res;
    let data;

    // 1. Try relative /api route first
    try {
        res = await fetch('/api/contact/send-direct', {
            method: 'POST',
            headers,
            body: payload
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            data = await res.json();
        }
    } catch {
        // Fall through to port 5000 fallback
    }

    // 2. If proxy was bypassed or returned non-JSON, try http://localhost:5000 directly
    if (!data) {
        try {
            res = await fetch('http://localhost:5000/api/contact/send-direct', {
                method: 'POST',
                headers,
                body: payload
            });
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                data = await res.json();
            } else {
                throw new Error('API server returned unexpected HTML. Please ensure backend server on port 5000 is active.');
            }
        } catch (backendErr) {
            throw new Error(backendErr.message || 'Could not connect to the backend email service on port 5000.');
        }
    }

    if (!res || !res.ok) {
        const errorMsg = data?.error || data?.message || 'Failed to dispatch email directly via Gmail SMTP.';
        throw new Error(errorMsg);
    }

    return {
        success: true,
        messageId: data.messageId,
        to: trimmedTo,
        fromEmail: senderEmail || gUser,
        subject
    };
};

// Backward compatibility alias
export const sendDirectOutlookEmail = sendDirectEmail;

