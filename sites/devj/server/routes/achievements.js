import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const achievements = await prisma.achievement.findMany({ orderBy: { order: 'asc' } });
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch achievements' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, category, date, description, imageUrl, order } = req.body;
        const achievement = await prisma.achievement.create({
            data: {
                title,
                category,
                date,
                description,
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
                order: Number(order) || 0,
            },
        });
        res.status(201).json(achievement);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create achievement' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, category, date, description, imageUrl, order } = req.body;
        const achievement = await prisma.achievement.update({
            where: { id },
            data: {
                title,
                category,
                date,
                description,
                imageUrl,
                order: Number(order),
            },
        });
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update achievement' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.achievement.delete({ where: { id } });
        res.json({ message: 'Achievement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete achievement' });
    }
});

export default router;