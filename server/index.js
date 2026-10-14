import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { globalLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import profileRoutes from './routes/profile.js';
import skillsRoutes from './routes/skills.js';
import achievementsRoutes from './routes/achievements.js';
import projectsRoutes from './routes/projects.js';
import hobbiesRoutes from './routes/hobbies.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Restrict CORS to configured production and development origins
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const defaultAllowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://devj.agustino-julian.workers.dev',
];
const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map((o) => o.trim()).filter(Boolean)
    : defaultAllowedOrigins;

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like same-origin, curl, server-to-server)
            if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                return callback(null, true);
            }
            return callback(new Error('Cross-Origin Request Blocked: Origin not authorized by CORS policy.'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);

// Security: Body parser size limits to prevent Denial of Service via oversized requests
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static uploads serving with safe options
app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'), {
        maxAge: '1d',
        dotfiles: 'ignore',
    })
);

// Global API rate limiting
app.use('/api', globalLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/hobbies', hobbiesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV || 'development',
    });
});

// Safe global error handler: does not leak stack traces or internal implementation paths
app.use((err, req, res, next) => {
    console.error('[DevJ Error]:', err.message);
    const statusCode = err.status || (err.message?.includes('CORS') ? 403 : 500);
    const isProd = process.env.NODE_ENV === 'production';
    res.status(statusCode).json({
        error: isProd ? 'Internal Server Error' : err.message || 'An unexpected error occurred',
        message: isProd ? 'An error occurred while processing the request.' : err.message,
    });
});

// Export app for test runner suites
export { app };

const isDirectRun = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('server/index.js');
if (isDirectRun && process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`[DevJ Server] Running securely on http://localhost:${PORT}`);
    });
}