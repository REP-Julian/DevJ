import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
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

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected server error occurred',
    });
});

app.listen(PORT, () => {
    console.log(`[DevJ Server] Running on http://localhost:${PORT}`);
});