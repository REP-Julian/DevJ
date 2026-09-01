import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, category, description, technologies, imageUrl, githubUrl, liveUrl, order } = req.body;
        const project = await prisma.project.create({
            data: {
                title,
                category,
                description,
                technologies,
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                githubUrl: githubUrl || '#',
                liveUrl: liveUrl || '#',
                order: Number(order) || 0,
            },
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create project' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, category, description, technologies, imageUrl, githubUrl, liveUrl, order } = req.body;
        const project = await prisma.project.update({
            where: { id },
            data: {
                title,
                category,
                description,
                technologies,
                imageUrl,
                githubUrl,
                liveUrl,
                order: Number(order),
            },
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update project' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.project.delete({ where: { id } });
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete project' });
    }
});

export default router;