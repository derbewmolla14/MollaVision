import Course from '../models/Course.js';
import Practice from '../models/Practice.js';
import PracticeSubmission from '../models/PracticeSubmission.js';

const publicPractice = (practice, includeAnswers = false) => {
  const value = practice.toObject ? practice.toObject() : practice;
  return {
    ...value,
    questions: includeAnswers ? value.questions : value.questions.map(({ correctAnswer, ...question }) => question),
  };
};

const validatePractice = (body) => {
  if (!body.title?.trim() || !body.description?.trim() || !body.chapter?.trim() || !body.courseId) return 'Title, description, course, and chapter are required';
  if (!Array.isArray(body.questions) || body.questions.length === 0) return 'At least one question is required';
  if (body.questions.some((question) => !question.prompt?.trim() || !question.correctAnswer?.trim())) return 'Every question needs a prompt and correct answer';
  return null;
};

export const listPractices = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { isPublished: true };
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.chapter) filter.chapter = req.query.chapter;
    const practices = await Practice.find(filter).populate('courseId', 'title slug').sort({ createdAt: -1 });
    res.json({ practices: practices.map((practice) => publicPractice(practice, req.user.role === 'admin')) });
  } catch (error) {
    next(error);
  }
};

export const getPractice = async (req, res, next) => {
  try {
    const practice = await Practice.findById(req.params.practiceId).populate('courseId', 'title slug');
    if (!practice || (!practice.isPublished && req.user.role !== 'admin')) return res.status(404).json({ message: 'Practice not found' });
    const submission = await PracticeSubmission.findOne({ practiceId: practice._id, userId: req.user._id }).select('-answers');
    res.json({ practice: publicPractice(practice, req.user.role === 'admin'), submission });
  } catch (error) {
    next(error);
  }
};

export const createPractice = async (req, res, next) => {
  try {
    const validationError = validatePractice(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    if (!await Course.exists({ _id: req.body.courseId })) return res.status(404).json({ message: 'Course not found' });
    const practice = await Practice.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ practice: publicPractice(practice, true) });
  } catch (error) {
    next(error);
  }
};

export const updatePractice = async (req, res, next) => {
  try {
    const validationError = validatePractice(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const practice = await Practice.findByIdAndUpdate(req.params.practiceId, req.body, { new: true, runValidators: true });
    if (!practice) return res.status(404).json({ message: 'Practice not found' });
    res.json({ practice: publicPractice(practice, true) });
  } catch (error) {
    next(error);
  }
};

export const deletePractice = async (req, res, next) => {
  try {
    const practice = await Practice.findByIdAndDelete(req.params.practiceId);
    if (!practice) return res.status(404).json({ message: 'Practice not found' });
    await PracticeSubmission.deleteMany({ practiceId: practice._id });
    res.json({ message: 'Practice deleted' });
  } catch (error) {
    next(error);
  }
};

export const submitPractice = async (req, res, next) => {
  try {
    const practice = await Practice.findOne({ _id: req.params.practiceId, isPublished: true });
    if (!practice) return res.status(404).json({ message: 'Practice not found' });
    if (!Array.isArray(req.body.answers)) return res.status(400).json({ message: 'Answers must be an array' });

    const answers = practice.questions.map((question) => {
      const submitted = req.body.answers.find((item) => item.questionId === question._id.toString());
      return { questionId: question._id, answer: String(submitted?.answer || '').trim() };
    });
    const score = practice.questions.reduce((total, question, index) => (
      total + (answers[index].answer.toLowerCase() === question.correctAnswer.trim().toLowerCase() ? question.marks : 0)
    ), 0);
    const totalMarks = practice.questions.reduce((total, question) => total + question.marks, 0);
    const submission = await PracticeSubmission.findOneAndUpdate(
      { practiceId: practice._id, userId: req.user._id },
      { answers, score, totalMarks, percentage: totalMarks ? Math.round((score / totalMarks) * 100) : 0, submittedAt: new Date(), status: 'graded' },
      { upsert: true, new: true, runValidators: true }
    );
    res.json({ message: 'Practice submitted successfully', submission: { score: submission.score, totalMarks: submission.totalMarks, percentage: submission.percentage, status: submission.status, submittedAt: submission.submittedAt } });
  } catch (error) {
    next(error);
  }
};

export const listMySubmissions = async (req, res, next) => {
  try {
    const submissions = await PracticeSubmission.find({ userId: req.user._id }).populate('practiceId', 'title chapter').sort({ submittedAt: -1 });
    res.json({ submissions });
  } catch (error) {
    next(error);
  }
};