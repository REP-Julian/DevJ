import express from 'express';
import nodemailer from 'nodemailer';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Helper: Basic email format validator
const isValidEmail = (email) => {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// Check whether Gmail SMTP credentials are configured on server (Admin only)
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
        userMasked: maskedUser,
        replyToDefault: (process.env.OUTLOOK_USER || '').trim(),
    });
});

// Direct In-App Email Dispatch (Gmail SMTP with verified server credentials only)
router.post('/send-direct', authenticateToken, async (req, res) => {
    try {
        const { to, subject, body } = req.body || {};

        if (!to || !subject || !body) {
            return res.status(400).json({ error: 'Recipient email, subject, and message body are required.' });
        }

        if (!isValidEmail(to)) {
            return res.status(400).json({ error: 'A valid recipient email address is required.' });
        }

        const replyToEmail = (process.env.OUTLOOK_USER || process.env.GMAIL_USER || '').trim();
        const senderName = (process.env.OUTLOOK_SENDER_NAME || 'Julian Agustino').trim();

        const gmailUser = (process.env.GMAIL_USER || '').trim();
        const gmailPassword = (process.env.GMAIL_APP_PASSWORD || '').trim().replace(/\s+/g, '');

        if (!gmailUser || !gmailPassword) {
            return res.status(400).json({
                error: 'Server email credentials are not configured in environment variables.',
            });
        }

        const mailOptions = {
            from: senderName ? `"${senderName}" <${gmailUser}>` : gmailUser,
            to: to.trim(),
            replyTo: replyToEmail || gmailUser,
            subject: String(subject).trim().slice(0, 200),
            text: String(body).trim().slice(0, 10000),
            headers: {
                'X-Mailer': 'DevJ-Portfolio-DirectClient',
            },
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPassword,
            },
        });

        const info = await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            provider: 'gmail',
            message: `Email delivered directly to ${to}! Replies route to ${replyToEmail || gmailUser}.`,
            messageId: info.messageId,
            to: to.trim(),
        });
    } catch (err) {
        console.error('[Gmail SMTP Error]:', err.message);
        return res.status(500).json({ error: 'Failed to dispatch email directly via Gmail.' });
    }
});

// Active Server-Sent Events (SSE) subscriber connections
const sseClients = new Set();

/**
 * Broadcast real-time events to authenticated admin listeners
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
 * Synchronize messages to Appwrite Cloud Storage with restricted (non-public) access
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
            repliedAt: m.repliedAt || null,
        }));

        const headers = {
            'X-Appwrite-Project': projectId,
            'X-Appwrite-Key': apiKey,
        };

        const blob = new Blob([JSON.stringify(formatted, null, 2)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('fileId', 'messages_data');
        formData.append('file', blob, 'messages-data.json');
        // Do NOT set read("any") - private admin data only!

        try {
            await fetch(`${endpoint}/storage/buckets/portfolio/files/messages_data`, {
                method: 'DELETE',
                headers,
            });
        } catch {}

        await fetch(`${endpoint}/storage/buckets/portfolio/files`, {
            method: 'POST',
            headers,
            body: formData,
        });
    } catch (err) {
        console.warn('[Appwrite Cloud Messages Sync Notice]:', err.message);
    }
};

// Real-Time SSE Stream Endpoint (Protected: Admin token required)
router.get('/stream', authenticateToken, (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
    }

    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', timestamp: new Date().toISOString() })}\n\n`);

    sseClients.add(res);

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

// Public contact submission with rate limiting and strict validation
router.post('/', contactLimiter, async (req, res) => {
    try {
        const { name, email, message, subject } = req.body || {};

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide all required fields (name, email, message).' });
        }

        const trimmedName = String(name).trim();
        const trimmedEmail = String(email).trim().toLowerCase();
        const trimmedMessage = String(message).trim();
        const trimmedSubject = subject ? String(subject).trim().slice(0, 150) : 'Direct Inquiry';

        if (trimmedName.length < 2 || trimmedName.length > 100) {
            return res.status(400).json({ message: 'Name must be between 2 and 100 characters.' });
        }

        if (!isValidEmail(trimmedEmail) || trimmedEmail.length > 120) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        if (trimmedMessage.length < 5 || trimmedMessage.length > 5000) {
            return res.status(400).json({ message: 'Message must be between 5 and 5000 characters.' });
        }

        const newMessage = await prisma.message.create({
            data: {
                name: trimmedName,
                email: trimmedEmail,
                message: trimmedMessage,
                subject: trimmedSubject,
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
            repliedAt: newMessage.repliedAt || null,
        };

        broadcastMessageEvent('new_message', formatted);
        syncMessagesToAppwrite().catch(() => {});

        res.status(201).json({ message: 'Message sent successfully!', data: formatted });
    } catch (error) {
        console.error('[Direct Contact Error]:', error.message);
        res.status(500).json({ message: 'Failed to deliver message' });
    }
});

// Admin message list (Protected)
router.get('/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
        const formatted = messages.map((m) => ({
            id: String(m.id),
            name: m.name,
            email: m.email,
            subject: m.subject || 'Direct Inquiry',
            message: m.message,
            createdAt: m.createdAt,
            replied: Boolean(m.replied),
            repliedAt: m.repliedAt,
        }));
        res.json(formatted);
    } catch (error) {
        console.error('[Get Messages Error]:', error.message);
        res.status(500).json({ message: 'Failed to retrieve messages' });
    }
});

// Admin message update (Protected)
router.patch('/messages/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }
        const { replied, read } = req.body || {};
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
            data: updateData,
        });

        const formatted = {
            id: String(updated.id),
            name: updated.name,
            email: updated.email,
            subject: updated.subject || 'Direct Inquiry',
            message: updated.message,
            createdAt: updated.createdAt,
            replied: Boolean(updated.replied),
            repliedAt: updated.repliedAt,
        };

        broadcastMessageEvent('update_message', formatted);
        syncMessagesToAppwrite().catch(() => {});

        res.json({ message: 'Message updated successfully', data: formatted });
    } catch (error) {
        console.error('[Update Message Error]:', error.message);
        res.status(500).json({ message: 'Failed to update message' });
    }
});

// Admin message delete (Protected)
router.delete('/messages/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }
        await prisma.message.delete({ where: { id } }).catch(() => {});

        broadcastMessageEvent('delete_message', { id: String(req.params.id) });
        syncMessagesToAppwrite().catch(() => {});

        res.json({ message: 'Message deleted' });
    } catch (error) {
        console.error('[Delete Message Error]:', error.message);
        res.status(500).json({ message: 'Failed to delete message' });
    }
});

export default router;