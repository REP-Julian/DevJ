import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('image'), (req, res) => {
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
        });
    } catch (error) {
        console.error('Upload route error:', error);
        res.status(500).json({ message: error.message || 'Error processing upload' });
    }
});

export default router;