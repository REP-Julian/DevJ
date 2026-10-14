import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET environment variable is not set!');
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
}

router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Valid email and password are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: 'admin' },
            JWT_SECRET || 'dev-fallback-secret-for-tests-only',
            { expiresIn: '7d', algorithm: 'HS256' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: { id: admin.id, email: admin.email, role: 'admin' }
        });
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(500).json({ message: 'Internal server error during authentication' });
    }
});

router.get('/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

export default router;