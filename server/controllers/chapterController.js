import Chapter from '../models/Chapter.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

export const listChapters = async (req, res, next) => {
  try {
    const chapters = await Chapter.find({ courseId: req.params.courseId }).sort({ order: 1 });
    res.json({ chapters });
  } catch (error) { next(error); }
};

export const createChapter = async (req, res, next) => {
  try {
    if (!req.body.title?.trim()) return res.status(400).json({ message: 'Chapter title is required' });
    if (!await Course.exists({ _id: req.params.courseId })) return res.status(404).json({ message: 'Course not found' });
    const order = req.body.order || (await Chapter.countDocuments({ courseId: req.params.courseId })) + 1;
    const chapter = await Chapter.create({ ...req.body, courseId: req.params.courseId, order });
    res.status(201).json({ chapter });
  } catch (error) { next(error); }
};

export const updateChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.chapterId, req.body, { new: true, runValidators: true });
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json({ chapter });
  } catch (error) { next(error); }
};

export const deleteChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    await Lesson.updateMany({ chapterId: chapter._id }, { $set: { chapterId: null } });
    res.json({ message: 'Chapter deleted' });
  } catch (error) { next(error); }
};