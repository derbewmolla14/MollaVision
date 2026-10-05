import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { createChapter, deleteChapter, listChapters, updateChapter } from '../controllers/chapterController.js';

const router = express.Router();
router.get('/course/:courseId', listChapters);
router.post('/course/:courseId', authMiddleware, adminMiddleware, createChapter);
router.put('/:chapterId', authMiddleware, adminMiddleware, updateChapter);
router.delete('/:chapterId', authMiddleware, adminMiddleware, deleteChapter);
export default router;