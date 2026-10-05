import jwt from 'jsonwebtoken';
import { createClerkClient, verifyToken } from '@clerk/backend';
import User from '../models/User.js';

export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    if (token && process.env.CLERK_SECRET_KEY && req.headers.authorization?.startsWith('Bearer ')) {
      const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
      const clerkUser = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(payload.sub);
      req.user = await User.findOne({ clerkId: clerkUser.id });
    } else if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(payload.userId);
    }
  } catch {
    req.user = null;
  }

  next();
};