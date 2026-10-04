import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from '../controllers/courseController.js';

const router = express.Router();

router.get('/', listCourses);
router.get('/:courseId', getCourse);
router.post('/', authMiddleware, adminMiddleware, createCourse);
router.put('/:courseId', authMiddleware, adminMiddleware, updateCourse);
router.delete('/:courseId', authMiddleware, adminMiddleware, deleteCourse);

export default router;