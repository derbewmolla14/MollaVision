import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { completeLesson, getProgress } from '../controllers/progressController.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/', getProgress);
router.post('/lessons/:lessonId/complete', completeLesson);

export default router;