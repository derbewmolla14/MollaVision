import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { canAccessLesson } from '../utils/access.js';

const safeLesson = (lesson, canAccess) => {
  const data = lesson.toObject();
  if (!canAccess) {
    delete data.videoUrl;
    delete data.videoPublicId;
    delete data.pdfUrl;
    delete data.pptUrl;
    delete data.pptxUrl;
    data.resources = [];
    data.content = [];
    data.isLocked = true;
  }
  return data;
};

export const listLessons = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.courseId });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });
    const result = await Promise.all(lessons.map(async (lesson) => safeLesson(lesson, await canAccessLesson(req.user, lesson))));
    res.json({ lessons: result });
  } catch (error) {
    next(error);
  }
};

export const getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    const canAccess = await canAccessLesson(req.user, lesson);
    if (!canAccess && !lesson.isPreview) return res.status(403).json({ message: 'Premium access required' });
    res.json({ lesson: safeLesson(lesson, canAccess) });
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const lesson = await Lesson.create({ ...req.body, courseId });
    await Course.findByIdAndUpdate(courseId, { $addToSet: { lessons: lesson._id }, $inc: { totalLessons: 1 } });
    res.status(201).json({ lesson });
  } catch (error) {
    next(error);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, req.body, { new: true, runValidators: true });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ lesson });
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    await Course.findByIdAndUpdate(lesson.courseId, { $pull: { lessons: lesson._id }, $inc: { totalLessons: -1 } });
    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    next(error);
  }
};