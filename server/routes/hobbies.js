import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const hobbies = await prisma.hobby.findMany({ orderBy: { order: 'asc' } });
        res.json(hobbies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch hobbies' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, description, imageUrl, iconName, order } = req.body;
        const hobby = await prisma.hobby.create({
            data: {
                name,
                description,
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                iconName: iconName || 'Heart',
                order: Number(order) || 0,
            },
        });
        res.status(201).json(hobby);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create hobby' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, description, imageUrl, iconName, order } = req.body;
        const hobby = await prisma.hobby.update({
            where: { id },
            data: {
                name,
                description,
                imageUrl,
                iconName,
                order: Number(order),
            },
        });
        res.json(hobby);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update hobby' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.hobby.delete({ where: { id } });
        res.json({ message: 'Hobby deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete hobby' });
    }
});

export default router;