import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch skills' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { category, name, description, proficiency, iconName, order } = req.body;
        const skill = await prisma.skill.create({
            data: {
                category: category || 'Development',
                name,
                description,
                proficiency: Number(proficiency) || 90,
                iconName: iconName || 'Code',
                order: Number(order) || 0,
            },
        });
        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create skill' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { category, name, description, proficiency, iconName, order } = req.body;
        const skill = await prisma.skill.update({
            where: { id },
            data: {
                category,
                name,
                description,
                proficiency: Number(proficiency),
                iconName,
                order: Number(order),
            },
        });
        res.json(skill);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update skill' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.skill.delete({ where: { id } });
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete skill' });
    }
});

export default router;