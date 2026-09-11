import express from 'express';
import nodemailer from 'nodemailer';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Direct Outlook SMTP Send (Without opening Outlook in browser)
router.post('/send-direct', authenticateToken, async (req, res) => {
    try {
        const { to, subject, body, appPassword } = req.body;

        if (!to || !subject || !body) {
            return res.status(400).json({ error: 'Recipient email, subject, and message body are required.' });
        }

        const senderEmail = (req.body.fromEmail || process.env.OUTLOOK_USER || '').trim();
        if (!senderEmail) {
            return res.status(400).json({
                error: 'Sender Outlook email is required. Please specify your account email in settings.'
            });
        }

        const senderName = (req.body.fromName || process.env.OUTLOOK_SENDER_NAME || '').trim();
        const password = appPassword || process.env.OUTLOOK_APP_PASSWORD;

        if (!password || !password.trim()) {
            return res.status(400).json({
                error: 'Outlook App Password is required to send directly. Please configure your 16-character Microsoft App Password in settings.'
            });
        }

        const cleanPassword = password.trim().replace(/\s+/g, '');

        const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: senderEmail,
                pass: cleanPassword
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: senderName ? `"${senderName}" <${senderEmail}>` : senderEmail,
            to: to.trim(),
            replyTo: senderEmail,
            subject: subject.trim(),
            text: body.trim(),
            headers: {
                'X-Mailer': 'DevJ-Portfolio-DirectClient'
            }
        };

        const info = await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: `Email delivered directly to ${to} from your Outlook account (${senderEmail})!`,
            messageId: info.messageId,
            to: to.trim()
        });
    } catch (err) {
        console.error('[Outlook SMTP Error]:', err);
        let errorMsg = err.message || 'Failed to dispatch email via Outlook SMTP.';
        if (err.code === 'EAUTH' || errorMsg.includes('Invalid login') || errorMsg.includes('535 5.7.139')) {
            errorMsg = 'Outlook Authentication Failed: Invalid credentials. Please verify your 16-character Microsoft App Password generated at account.microsoft.com/security.';
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