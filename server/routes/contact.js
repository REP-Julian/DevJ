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

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newMessage = await prisma.message.create({
            data: { name, email, message },
        });
        res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Failed to deliver message' });
    }
});

router.get('/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve messages' });
    }
});

router.delete('/messages/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.message.delete({ where: { id } });
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete message' });
    }
});

export default router;