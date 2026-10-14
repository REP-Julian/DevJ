import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET environment variable is not set!');
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
}

/**
 * Strictly authenticates requests using cryptographic HMAC-SHA256 JWT signatures.
 * Rejects unverified strings, prefix bypasses (e.g. appwrite_*, devj_*), or arbitrary tokens.
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Allow Bearer token from Authorization header or ?token= query parameter (for SSE EventSource)
    const token = (authHeader && authHeader.startsWith('Bearer ') && authHeader.slice(7).trim()) ||
                  (req.query && typeof req.query.token === 'string' && req.query.token.trim());

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET || 'dev-fallback-secret-for-tests-only', {
            algorithms: ['HS256'],
        });

        req.user = decoded;
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please re-authenticate.' });
        }
        return res.status(403).json({ message: 'Invalid or forged authentication token' });
    }
};

/**
 * Enforces role-based access control ensuring the token holder holds admin privileges.
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Administrator privileges required' });
    }
    return next();
};