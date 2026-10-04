import Enrollment from '../models/Enrollment.js';

export const canAccessLesson = async (user, lesson) => {
  if (!lesson.isPremium || user?.role === 'admin' || user?.isPremium) return true;
  if (!user) return Boolean(lesson.isPreview);

  return Boolean(await Enrollment.exists({ userId: user._id, courseId: lesson.courseId, accessType: 'premium' }));
};