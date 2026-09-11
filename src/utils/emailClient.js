/**
 * Email Client Utility
 * Integrates Outlook Web, Outlook Desktop, and Webmail clients with
 * clipboard safeguards and collaborator delivery guarantees.
 * Completely dynamic: Zero hardcoded email fallbacks.
 */

export const EMAIL_CLIENT_PREF_KEY = 'devj_preferred_email_client';
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
    },
    {
        id: 'gmail-web',
        name: 'Gmail Web',
        shortName: 'Gmail Web',
        description: 'Opens mail.google.com in browser with draft pre-filled',
        badge: 'Webmail',
        buildUrl: ({ to, subject, body }) =>
            `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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

export const getStoredOutlookAppPassword = () => {
    try {
        return localStorage.getItem(OUTLOOK_APP_PASSWORD_KEY) || '';
    } catch {
        return '';
    }
};

export const setStoredOutlookAppPassword = (pwd = '') => {
    try {
        if (pwd && pwd.trim()) {
            localStorage.setItem(OUTLOOK_APP_PASSWORD_KEY, pwd.trim());
        } else {
            localStorage.removeItem(OUTLOOK_APP_PASSWORD_KEY);
        }
    } catch (e) {
        console.warn('Failed to save Outlook app password:', e);
    }
};

export const hasStoredOutlookAppPassword = () => {
    return Boolean(getStoredOutlookAppPassword());
};

/**
 * Sends email directly over Outlook SMTP without opening any browser tab or client
 */
export const sendDirectOutlookEmail = async ({
    to = '',
    subject = '',
    body = '',
    appPassword = '',
    fromEmail = '',
    fromName = ''
}) => {
    const trimmedTo = String(to).trim();
    if (!isValidEmail(trimmedTo)) {
        throw new Error(`Invalid recipient email address: "${trimmedTo}". Please verify collaborator email.`);
    }

    const cleanBody = cleanEmailBody(body);
    const password = appPassword || getStoredOutlookAppPassword();

    if (!password) {
        throw new Error('Outlook App Password is required to send directly. Please configure it in settings.');
    }

    const senderEmail = (fromEmail || getActiveSenderEmail()).trim();
    if (!senderEmail) {
        throw new Error('Sender email is required. Please verify your account email address.');
    }

    const token = localStorage.getItem('devj_admin_auth_token_v1') || '';
    const res = await fetch('/api/contact/send-direct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            to: trimmedTo,
            subject,
            body: cleanBody,
            appPassword: password,
            fromEmail: senderEmail,
            fromName: (fromName || '').trim()
        })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch email directly via Outlook SMTP.');
    }

    return {
        success: true,
        messageId: data.messageId,
        to: trimmedTo,
        fromEmail: senderEmail,
        subject
    };
};
