import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  prompt: { type: String, required: true, trim: true },
  type: { type: String, enum: ['multiple-choice', 'short-answer', 'true-false', 'fill-blank', 'explain-list'], default: 'short-answer' },
  options: [optionSchema],
  correctAnswer: { type: String, required: true, trim: true },
  marks: { type: Number, min: 1, default: 1 },
  explanation: { type: String, default: '', trim: true },
});

const practiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    chapter: { type: String, required: true, trim: true, maxlength: 120 },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: null, index: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    marks: { type: Number, min: 1, default: 1 },
    questions: { type: [questionSchema], validate: [(items) => items.length > 0, 'At least one question is required'] },
    isPublished: { type: Boolean, default: false },
    deadline: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Practice', practiceSchema);