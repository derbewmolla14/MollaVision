import jwt from 'jsonwebtoken';

export const createToken = (userId, role = 'student') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isPremium: user.isPremium,
  profileImage: user.profileImage,
  enrolledCourses: user.enrolledCourses,
});