import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Progress from '../models/Progress.js';

export const getProgress = async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.courseId) filter.courseId = req.query.courseId;
    const progress = await Progress.find(filter).populate('courseId currentLesson completedLessons');
    res.json({ progress });
  } catch (error) {
    next(error);
  }
};

export const completeLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    const course = await Course.findById(lesson.courseId).select('totalLessons');
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, courseId: lesson.courseId },
      { $addToSet: { completedLessons: lesson._id }, $set: { currentLesson: lesson._id, lastAccessedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    progress.percentage = course?.totalLessons ? Math.round((progress.completedLessons.length / course.totalLessons) * 100) : 0;
    await progress.save();
    res.json({ progress });
  } catch (error) {
    next(error);
  }
};