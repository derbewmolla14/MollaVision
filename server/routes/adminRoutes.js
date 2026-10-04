import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { getStatistics } from '../controllers/adminController.js';

const router = express.Router();
router.use(authMiddleware, adminMiddleware);
router.get('/statistics', getStatistics);

export default router;