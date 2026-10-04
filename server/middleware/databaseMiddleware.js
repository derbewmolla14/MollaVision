import { isDatabaseReady } from '../config/db.js';

export const databaseMiddleware = (req, res, next) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable. Configure MONGODB_URI and start MongoDB before using authentication.',
    });
  }

  next();
};