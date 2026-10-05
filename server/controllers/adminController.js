import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import Practice from '../models/Practice.js';
import PracticeSubmission from '../models/PracticeSubmission.js';
import Chapter from '../models/Chapter.js';

export const getStatistics = async (req, res, next) => {
  try {
    const [totalStudents, totalAdmins, totalCourses, totalChapters, freeCourses, premiumCourses, totalLessons, totalEnrollments, totalPractices, totalSubmissions, activeUsers, recentRegistrations, recentSubmissions, recentCourses] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Course.countDocuments(),
      Chapter.countDocuments(),
      Course.countDocuments({ isPremium: false }),
      Course.countDocuments({ isPremium: true }),
      Lesson.countDocuments(),
      Enrollment.countDocuments(),
      Practice.countDocuments(),
      PracticeSubmission.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.find().select('name email role status createdAt').sort({ createdAt: -1 }).limit(5),
      PracticeSubmission.find().populate('userId', 'name email').populate('practiceId', 'title').sort({ submittedAt: -1 }).limit(5),
      Course.find().select('title isPublished createdAt').sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({ statistics: { totalStudents, totalAdmins, totalCourses, totalChapters, freeCourses, premiumCourses, totalLessons, totalEnrollments, totalPractices, totalSubmissions, activeUsers, recentRegistrations, recentSubmissions, recentCourses } });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$or = [{ name: { $regex: req.query.search, $options: 'i' } }, { email: { $regex: req.query.search, $options: 'i' } }];
    const users = await User.find(filter).select('name email role status profileImage enrolledCourses createdAt updatedAt').populate('enrolledCourses', 'title slug').sort({ createdAt: -1 }).limit(100);
    res.json({ users });
  } catch (error) { next(error); }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('name email role status profileImage enrolledCourses createdAt updatedAt').populate('enrolledCourses', 'title slug');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) { next(error); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    if (req.params.userId === req.user._id.toString()) return res.status(400).json({ message: 'You cannot change your own admin role' });
    if (!['student', 'admin'].includes(req.body.role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.userId, { role: req.body.role }, { new: true }).select('name email role status');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) { next(error); }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    if (req.params.userId === req.user._id.toString()) return res.status(400).json({ message: 'You cannot suspend your own account' });
    if (!['active', 'suspended'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
    const user = await User.findByIdAndUpdate(req.params.userId, { status: req.body.status }, { new: true }).select('name email role status');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.userId === req.user._id.toString()) return res.status(400).json({ message: 'You cannot delete your own account' });
    const user = await User.findByIdAndUpdate(req.params.userId, { status: 'suspended' }, { new: true }).select('name email role status');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deactivated', user });
  } catch (error) { next(error); }
};

export const listSubmissions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.practiceId) filter.practiceId = req.query.practiceId;
    if (req.query.userId) filter.userId = req.query.userId;
    const submissions = await PracticeSubmission.find(filter).populate('userId', 'name email').populate('practiceId', 'title chapter').sort({ submittedAt: -1 }).limit(200);
    res.json({ submissions });
  } catch (error) { next(error); }
};

export const getSubmission = async (req, res, next) => {
  try {
    const submission = await PracticeSubmission.findById(req.params.submissionId).populate('userId', 'name email').populate('practiceId');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ submission });
  } catch (error) { next(error); }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const score = Number(req.body.score);
    const totalMarks = Number(req.body.totalMarks);
    if (!Number.isFinite(score) || !Number.isFinite(totalMarks) || score < 0 || totalMarks < 0 || score > totalMarks) return res.status(400).json({ message: 'Score must be between zero and total marks' });
    const submission = await PracticeSubmission.findByIdAndUpdate(req.params.submissionId, { score, percentage: totalMarks ? Math.round((score / totalMarks) * 100) : 0, totalMarks, feedback: String(req.body.feedback || '').trim(), status: 'graded', gradedAt: new Date(), gradedBy: req.user._id }, { new: true, runValidators: true });
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ submission });
  } catch (error) { next(error); }
};