import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { canAccessLesson } from '../utils/access.js';
import { getYouTubeVideoId } from '../utils/youtube.js';

const lessonFields = ['title', 'description', 'module', 'order', 'videoUrl', 'isPreview', 'isPremium', 'isPublished', 'duration', 'content'];
const pickFields = (source) => Object.fromEntries(lessonFields.filter((field) => source[field] !== undefined).map((field) => [field, source[field]]));
const findCourse = (courseId) => (/^[a-f\d]{24}$/i.test(courseId) ? Course.findById(courseId) : Course.findOne({ slug: courseId }));

const validateVideo = (updates) => {
  if (updates.videoUrl === undefined) return true;
  if (!updates.videoUrl) {
    updates.videoId = '';
    return true;
  }
  const videoId = getYouTubeVideoId(updates.videoUrl);
  if (!videoId) return false;
  updates.videoId = videoId;
  return true;
};

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
    const course = await findCourse(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!course.isPublished && req.user?.role !== 'admin') return res.status(404).json({ message: 'Course not found' });
    const lessonFilter = { courseId: course._id };
    if (req.user?.role !== 'admin') lessonFilter.isPublished = true;
    const lessons = await Lesson.find(lessonFilter).sort({ order: 1 });
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
    const course = await Course.findById(lesson.courseId);
    if (!course || (!course.isPublished && req.user?.role !== 'admin') || (!lesson.isPublished && req.user?.role !== 'admin')) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
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
    const course = await findCourse(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const updates = pickFields(req.body);
    if (!updates.title?.trim() || !Number.isInteger(Number(updates.order)) || Number(updates.order) < 1) {
      return res.status(400).json({ message: 'Lesson title and a positive order are required' });
    }
    updates.order = Number(updates.order);
    if (!validateVideo(updates)) return res.status(400).json({ message: 'Enter a valid YouTube watch, youtu.be, or embed URL.' });
    const lesson = await Lesson.create({ ...updates, courseId: course._id });
    await Course.findByIdAndUpdate(course._id, { $addToSet: { lessons: lesson._id }, $inc: { totalLessons: 1 } });
    res.status(201).json({ lesson });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'A lesson already uses that order in this course.' });
    next(error);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const existing = await Lesson.findById(req.params.lessonId);
    if (!existing) return res.status(404).json({ message: 'Lesson not found' });
    const updates = pickFields(req.body);
    if (updates.order !== undefined) {
      updates.order = Number(updates.order);
      if (!Number.isInteger(updates.order) || updates.order < 1) return res.status(400).json({ message: 'Lesson order must be a positive integer' });
    }
    if (!validateVideo(updates)) return res.status(400).json({ message: 'Enter a valid YouTube watch, youtu.be, or embed URL.' });
    if (updates.order !== undefined && updates.order !== existing.order) {
      await Lesson.updateOne({ _id: existing._id }, { $set: { order: -existing.order } });
      const direction = updates.order > existing.order ? 1 : -1;
      await Lesson.updateMany(
        { courseId: existing.courseId, order: direction === 1 ? { $gt: existing.order, $lte: updates.order } : { $gte: updates.order, $lt: existing.order } },
        { $inc: { order: -direction } }
      );
    }
    const lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, updates, { new: true, runValidators: true });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ lesson });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'A lesson already uses that order in this course.' });
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