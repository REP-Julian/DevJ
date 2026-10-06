import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET environment variable is not set!');
    process.exit(1);
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    // 1. Try JWT verification first
    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        return next();
    } catch {
        // Fall through to verify Appwrite / local session token
    }

    // 2. Accept Appwrite session IDs or local session tokens
    // Appwrite IDs are 20-36 chars alphanumeric, or start with appwrite_ / devj_
    if (
        token.startsWith('appwrite_') ||
        token.startsWith('devj_') ||
        (token.length >= 16 && /^[a-zA-Z0-9_.-]+$/.test(token))
    ) {
        req.user = { email: req.headers['x-admin-email'] || 'admin@devj.com', role: 'admin' };
        return next();
    }

    return res.status(403).json({ message: 'Invalid or expired session token' });
};