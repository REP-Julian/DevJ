import express from 'express';
import prisma from '../utils/prisma.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const profile = await prisma.profile.findFirst();
        const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
        const achievements = await prisma.achievement.findMany({ orderBy: { order: 'asc' } });
        const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
        const hobbies = await prisma.hobby.findMany({ orderBy: { order: 'asc' } });

        res.json({
            profile: profile || {
                name: 'Julian Agustino',
                tagline: 'Artificial Intelligence Enthusiast, Vibe Developer and Creative Developer',
                description: 'I love turning ideas into interactive experiences and exploring the possibilities of artificial intelligence through creative development.',
                avatarUrl: '',
                email: 'contact@devj.com',
                githubUrl: 'https://github.com',
                linkedinUrl: 'https://linkedin.com',
                twitterUrl: 'https://twitter.com'
            },
            skills,
            achievements,
            projects,
            hobbies
        });
    } catch (error) {
        console.error('Portfolio aggregation error:', error);
        res.status(500).json({ message: 'Error retrieving portfolio data' });
    }
});

export default router;