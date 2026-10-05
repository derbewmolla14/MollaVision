import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { deleteUser, getStatistics, getSubmission, getUser, gradeSubmission, listSubmissions, listUsers, updateUserRole, updateUserStatus } from '../controllers/adminController.js';

const router = express.Router();
router.use(authMiddleware, adminMiddleware);
router.get('/statistics', getStatistics);
router.get('/users', listUsers);
router.get('/users/:userId', getUser);
router.patch('/users/:userId/role', updateUserRole);
router.patch('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);
router.get('/submissions', listSubmissions);
router.get('/submissions/:submissionId', getSubmission);
router.patch('/submissions/:submissionId/grade', gradeSubmission);

export default router;