import jwt from 'jsonwebtoken';
import { createClerkClient, verifyToken } from '@clerk/backend';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
    const token = req.cookies.token || bearerToken;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    if (bearerToken && !req.cookies.token && !process.env.CLERK_SECRET_KEY) {
      return res.status(503).json({ message: 'Clerk backend authentication is not configured' });
    }

    let user;
    if (bearerToken && process.env.CLERK_SECRET_KEY) {
      const payload = await verifyToken(bearerToken, { secretKey: process.env.CLERK_SECRET_KEY });
      const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const clerkUser = await clerkClient.users.getUser(payload.sub);
      const email = clerkUser.primaryEmailAddress?.emailAddress?.toLowerCase();
      if (!email) return res.status(401).json({ message: 'Authenticated user has no email address' });
      const clerkRole = clerkUser.publicMetadata?.role === 'admin' ? 'admin' : 'student';
      user = await User.findOneAndUpdate(
        { $or: [{ clerkId: clerkUser.id }, { email }] },
        { $set: { name: clerkUser.fullName || clerkUser.firstName || 'Learner', email, clerkId: clerkUser.id, profileImage: clerkUser.imageUrl || '', role: clerkRole } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      req.clerkUser = clerkUser;
      req.clerkRole = clerkRole;
    } else {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(payload.userId);
    }
    if (!user) return res.status(401).json({ message: 'Authentication required' });
    if (user.status === 'suspended') return res.status(403).json({ message: 'Your account has been suspended.' });

    req.user = user;
    if (!req.clerkRole) req.clerkRole = user.role;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication' });
  }
};