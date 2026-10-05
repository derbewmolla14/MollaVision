export const adminMiddleware = (req, res, next) => {
  if (req.clerkRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};