import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Chapter from '../models/Chapter.js';

const makeSlug = (title) => title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const listCourses = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isPublished: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.isPremium) filter.isPremium = req.query.isPremium === 'true';
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { instructor: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 }).select('-lessons');
    res.json({ courses });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.courseId }).populate({
      path: 'lessons',
      select: 'title description module order isPreview isPremium duration',
      options: { sort: { order: 1 } },
    });
    if (!course || (!course.isPublished && req.user?.role !== 'admin')) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ course });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, shortDescription, category, level, language, instructor, thumbnail, price, isPremium, isPublished } = req.body;
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const course = await Course.create({
      title: title.trim(),
      slug: makeSlug(title),
      description: description.trim(),
      shortDescription,
      category,
      level,
      language,
      instructor,
      thumbnail,
      price,
      isPremium,
      isPublished,
    });
    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.title) updates.slug = makeSlug(updates.title);
    const course = await Course.findByIdAndUpdate(req.params.courseId, updates, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.courseId, { isPublished: false }, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course unpublished', course });
  } catch (error) {
    next(error);
  }
};