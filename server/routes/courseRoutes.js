import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from '../controllers/courseController.js';

const router = express.Router();

router.get('/', (req, res, next) => {
	if (req.headers.authorization || req.cookies?.token) return authMiddleware(req, res, () => listCourses(req, res, next));
	return listCourses(req, res, next);
});
router.get('/:courseId', getCourse);
router.post('/', authMiddleware, adminMiddleware, createCourse);
router.put('/:courseId', authMiddleware, adminMiddleware, updateCourse);
router.delete('/:courseId', authMiddleware, adminMiddleware, deleteCourse);

export default router;