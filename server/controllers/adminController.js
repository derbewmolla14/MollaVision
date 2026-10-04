import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';

export const getStatistics = async (req, res, next) => {
  try {
    const [totalStudents, totalCourses, freeCourses, premiumCourses, totalLessons, totalEnrollments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      Course.countDocuments({ isPremium: false }),
      Course.countDocuments({ isPremium: true }),
      Lesson.countDocuments(),
      Enrollment.countDocuments(),
    ]);
    res.json({ statistics: { totalStudents, totalCourses, freeCourses, premiumCourses, totalLessons, totalEnrollments } });
  } catch (error) {
    next(error);
  }
};