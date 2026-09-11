import express from 'express';
import nodemailer from 'nodemailer';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
// Check whether Gmail SMTP credentials are configured on server
router.get('/smtp-status', authenticateToken, (req, res) => {
    const hasEnvUser = Boolean(process.env.GMAIL_USER && process.env.GMAIL_USER.trim());
    const hasEnvPassword = Boolean(process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_APP_PASSWORD.trim());
    const rawUser = (process.env.GMAIL_USER || '').trim();

    let maskedUser = '';
    if (rawUser && rawUser.includes('@')) {
        const [name, domain] = rawUser.split('@');
        maskedUser = `${name.slice(0, 3)}***@${domain}`;
    }

    res.json({
        configured: hasEnvUser && hasEnvPassword,
        hasEnvCredentials: hasEnvUser && hasEnvPassword,
        userEmail: rawUser,
        userMasked: maskedUser,
        replyToDefault: (process.env.OUTLOOK_USER || '').trim()
    });
});

// Direct In-App Email Dispatch (Gmail SMTP with Google App Password)
router.post('/send-direct', authenticateToken, async (req, res) => {
    try {
        const { to, subject, body, appPassword } = req.body;

        if (!to || !subject || !body) {
            return res.status(400).json({ error: 'Recipient email, subject, and message body are required.' });
        }

        // Collaborator replies route back to the user's primary/Outlook address
        const replyToEmail = (req.body.fromEmail || req.body.replyTo || process.env.OUTLOOK_USER || '').trim();
        const senderName = (req.body.fromName || process.env.OUTLOOK_SENDER_NAME || 'Julian Agustino').trim();

        // Gmail credentials
        const envUser = (process.env.GMAIL_USER || '').trim();
        const envPassword = (process.env.GMAIL_APP_PASSWORD || '').trim().replace(/\s+/g, '');

        const clientUser = (req.body.gmailUser || '').trim();
        const clientPassword = (appPassword || '').trim().replace(/\s+/g, '');

        const gmailUser = clientUser || envUser;
        const initialPassword = clientPassword || envPassword;

        if (!gmailUser) {
            return res.status(400).json({
                error: 'Gmail account address is required for direct sending. Please enter your Gmail address in settings.'
            });
        }

        if (!initialPassword) {
            return res.status(400).json({
                error: 'A 16-character Google App Password is required. Generate one at myaccount.google.com/apppasswords and enter it in settings.'
            });
        }

        const mailOptions = {
            from: senderName ? `"${senderName}" <${gmailUser}>` : gmailUser,
            to: to.trim(),
            replyTo: replyToEmail || gmailUser,
            subject: subject.trim(),
            text: body.trim(),
            headers: {
                'X-Mailer': 'DevJ-Portfolio-DirectClient'
            }
        };

        let info;
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmailUser,
                    pass: initialPassword
                }
            });
            info = await transporter.sendMail(mailOptions);
        } catch (authAttemptErr) {
            // If client password failed (e.g. stale client cache) and server has verified .env credentials, retry with .env
            if (authAttemptErr.code === 'EAUTH' && envPassword && initialPassword !== envPassword) {
                console.log('[Gmail SMTP Notice]: Client credentials rejected; retrying with verified server .env credentials...');
                const retryTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: envUser || gmailUser,
                        pass: envPassword
                    }
                });
                mailOptions.from = senderName ? `"${senderName}" <${envUser || gmailUser}>` : (envUser || gmailUser);
                info = await retryTransporter.sendMail(mailOptions);
            } else {
                throw authAttemptErr;
            }
        }

        return res.json({
            success: true,
            provider: 'gmail',
            message: `Email delivered directly to ${to} via Gmail! Replies will route to ${replyToEmail || gmailUser}.`,
            messageId: info.messageId,
            to: to.trim()
        });
    } catch (err) {
        console.error('[Gmail SMTP Error]:', err);
        let errorMsg = err.message || 'Failed to dispatch email directly via Gmail.';
        if (err.code === 'EAUTH' || errorMsg.includes('Invalid login') || errorMsg.includes('Username and Password not accepted') || errorMsg.includes('535-5.7.8')) {
            errorMsg = 'Gmail Authentication Failed: Google rejected the login credentials. Please verify your Gmail address and ensure you are using a 16-character App Password generated at myaccount.google.com/apppasswords (with 2-Step Verification enabled).';
        } else if (errorMsg.includes('basic authentication is disabled') || errorMsg.includes('535 5.7.139')) {
            errorMsg = 'Microsoft Restriction: Microsoft has disabled Basic Authentication for personal Outlook accounts. Use your Gmail App Password for direct sending, or click "Send via Outlook Web" below.';
        }
        return res.status(500).json({ error: errorMsg });
    }
});

// Active Server-Sent Events (SSE) subscriber connections
const sseClients = new Set();

/**
 * Broadcast real-time events to all connected admin clients
 * @param {'new_message' | 'update_message' | 'delete_message'} type
 * @param {any} data
 */
export const broadcastMessageEvent = (type, data) => {
    const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of sseClients) {
        try {
            client.write(payload);
        } catch {
            sseClients.delete(client);
        }
    }
};

/**
 * Synchronize all database messages directly to Appwrite Cloud Storage (Bucket "portfolio", File "messages_data")
 */
export const syncMessagesToAppwrite = async () => {
    try {
        const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
        const projectId = process.env.VITE_APPWRITE_PROJECT_ID || '6aa1516d001f3ded0bc0';
        const apiKey = process.env.APPWRITE_API_KEY;
        if (!apiKey) return;

        const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
        const formatted = messages.map((m) => ({
            id: String(m.id),
            name: m.name,
            email: m.email,
            subject: m.subject || 'Direct Inquiry',
            message: m.message,
            createdAt: m.createdAt,
            replied: Boolean(m.replied),
            repliedAt: m.repliedAt || null
        }));

        const headers = {
            'X-Appwrite-Project': projectId,
            'X-Appwrite-Key': apiKey,
        };

        const blob = new Blob([JSON.stringify(formatted, null, 2)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('fileId', 'messages_data');
        formData.append('file', blob, 'messages-data.json');
        formData.append('permissions[]', 'read("any")');

        try {
            await fetch(`${endpoint}/storage/buckets/portfolio/files/messages_data`, {
                method: 'DELETE',
                headers
            });
        } catch {}

        await fetch(`${endpoint}/storage/buckets/portfolio/files`, {
            method: 'POST',
            headers,
            body: formData
        });
    } catch (err) {
        console.warn('[Appwrite Cloud Messages Sync Notice]:', err.message);
    }
};

// Initial sync to Appwrite Cloud Storage
syncMessagesToAppwrite().catch(() => {});

// Real-Time SSE Stream Endpoint
router.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
    }

    // Send connected handshake
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', timestamp: new Date().toISOString() })}\n\n`);

    sseClients.add(res);

    // Heartbeat every 25 seconds to keep connection alive
    const heartbeat = setInterval(() => {
        try {
            res.write(':heartbeat\n\n');
        } catch {
            clearInterval(heartbeat);
            sseClients.delete(res);
        }
    }, 25000);

    req.on('close', () => {
        clearInterval(heartbeat);
        sseClients.delete(res);
    });
});

router.post('/', async (req, res) => {
    try {
        const { name, email, message, subject } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newMessage = await prisma.message.create({
            data: {
                name: String(name).trim(),
                email: String(email).trim(),
                message: String(message).trim(),
                subject: subject ? String(subject).trim() : 'Direct Inquiry',
            },
        });

        const formatted = {
            id: String(newMessage.id),
            name: newMessage.name,
            email: newMessage.email,
            subject: newMessage.subject,
            message: newMessage.message,
            createdAt: newMessage.createdAt,
            replied: newMessage.replied || false,
            repliedAt: newMessage.repliedAt || null
        };

        // Broadcast to all connected admin interfaces in real time
        broadcastMessageEvent('new_message', formatted);

        // Background sync to Appwrite Cloud Storage
        syncMessagesToAppwrite().catch(() => {});

        console.log(`[Direct Contact]: New message received from "${newMessage.name}" <${newMessage.email}>`);
        res.status(201).json({ message: 'Message sent successfully!', data: formatted });
    } catch (error) {
        console.error('[Direct Contact Error]:', error);
        res.status(500).json({ message: 'Failed to deliver message' });
    }
});

router.get('/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
        const formatted = messages.map(m => ({
            id: String(m.id),
            name: m.name,
            email: m.email,
            subject: m.subject || 'Direct Inquiry',
            message: m.message,
            createdAt: m.createdAt,
            replied: Boolean(m.replied),
            repliedAt: m.repliedAt
        }));
        res.json(formatted);
    } catch (error) {
        console.error('[Get Messages Error]:', error);
        res.status(500).json({ message: 'Failed to retrieve messages' });
    }
});

router.patch('/messages/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }
        const { replied, read } = req.body;
        const updateData = {};
        if (typeof replied === 'boolean') {
            updateData.replied = replied;
            updateData.repliedAt = replied ? new Date() : null;
        }
        if (typeof read === 'boolean') {
            updateData.read = read;
        }

        const updated = await prisma.message.update({
            where: { id },
            data: updateData
        });

        const formatted = {
            id: String(updated.id),
            name: updated.name,
            email: updated.email,
            subject: updated.subject || 'Direct Inquiry',
            message: updated.message,
            createdAt: updated.createdAt,
            replied: Boolean(updated.replied),
            repliedAt: updated.repliedAt
        };

        broadcastMessageEvent('update_message', formatted);
        syncMessagesToAppwrite().catch(() => {});

        res.json({ message: 'Message updated successfully', data: formatted });
    } catch (error) {
        console.error('[Update Message Error]:', error);
        res.status(500).json({ message: 'Failed to update message' });
    }
});

router.delete('/messages/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (!isNaN(id)) {
            await prisma.message.delete({ where: { id } }).catch(() => {});
        }
        broadcastMessageEvent('delete_message', { id: String(req.params.id) });
        syncMessagesToAppwrite().catch(() => {});

        res.json({ message: 'Message deleted' });
    } catch (error) {
        console.error('[Delete Message Error]:', error);
        res.status(500).json({ message: 'Failed to delete message' });
    }
});

export default router;