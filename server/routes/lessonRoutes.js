import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { optionalAuthMiddleware } from '../middleware/optionalAuthMiddleware.js';
import { createLesson, deleteLesson, getLesson, listLessons, updateLesson } from '../controllers/lessonController.js';

const router = express.Router();

router.get('/course/:courseId', optionalAuthMiddleware, listLessons);
router.get('/:lessonId', optionalAuthMiddleware, getLesson);
router.post('/course/:courseId', authMiddleware, adminMiddleware, createLesson);
router.put('/:lessonId', authMiddleware, adminMiddleware, updateLesson);
router.delete('/:lessonId', authMiddleware, adminMiddleware, deleteLesson);

export default router;