import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', authenticateToken, uploadLimiter, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded or invalid format' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
            message: 'Image uploaded successfully',
            url: fileUrl,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
        });
    } catch (error) {
        console.error('Upload route error:', error.message);
        res.status(500).json({ message: error.message || 'Error processing upload' });
    }
});

export default router;