import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

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