import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(payload.userId);
    }
  } catch {
    req.user = null;
  }

  next();
};