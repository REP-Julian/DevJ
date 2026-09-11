/**
 * Email Client Utility
 * Integrates Outlook Web, Outlook Desktop, and Webmail clients with
 * clipboard safeguards and collaborator delivery guarantees.
 */

export const OUTLOOK_ACCOUNT_EMAIL = 'agustino.julian@outlook.ph';

export const EMAIL_CLIENT_PREF_KEY = 'devj_preferred_email_client';

export const EMAIL_CLIENTS = [
    {
        id: 'outlook-web',
        name: 'Outlook Web (Personal / Live)',
        shortName: 'Outlook Web',
        description: 'Opens outlook.live.com in browser ready to send from your Outlook account (agustino.julian@outlook.ph)',
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
            // Popup blocker might intercept; fallback to same window or mailto
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
