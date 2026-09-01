import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devj-super-secret-production-key-2026';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired session token' });
        }
        req.user = user;
        next();
    });
};