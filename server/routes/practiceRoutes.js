import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { createPractice, deletePractice, getPractice, listMySubmissions, listPractices, submitPractice, updatePractice } from '../controllers/practiceController.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/submissions/me', listMySubmissions);
router.get('/', listPractices);
router.get('/:practiceId', getPractice);
router.post('/', adminMiddleware, createPractice);
router.put('/:practiceId', adminMiddleware, updatePractice);
router.delete('/:practiceId', adminMiddleware, deletePractice);
router.post('/:practiceId/submit', submitPractice);

export default router;