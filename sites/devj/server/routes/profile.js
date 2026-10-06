import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const profile = await prisma.profile.findFirst();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

router.put('/', authenticateToken, async (req, res) => {
    try {
        const { name, tagline, description, avatarUrl, email, githubUrl, linkedinUrl, twitterUrl } = req.body;
        let profile = await prisma.profile.findFirst();

        if (profile) {
            profile = await prisma.profile.update({
                where: { id: profile.id },
                data: { name, tagline, description, avatarUrl, email, githubUrl, linkedinUrl, twitterUrl },
            });
        } else {
            profile = await prisma.profile.create({
                data: { name, tagline, description, avatarUrl, email, githubUrl, linkedinUrl, twitterUrl },
            });
        }

        res.json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

export default router;