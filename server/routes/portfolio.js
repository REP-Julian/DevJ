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
                tagline: 'Full-Stack Developer & AI Systems Integrator',
                description: 'Building full-stack web applications with React, Node.js, and Appwrite, integrated with LLM endpoints and custom REST APIs.',
                avatarUrl: '',
                email: 'contact@devj.com',
                githubUrl: 'https://github.com/REP-Julian',
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