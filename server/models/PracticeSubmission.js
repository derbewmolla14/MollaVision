import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answer: { type: String, default: '' },
}, { _id: false });

const submissionSchema = new mongoose.Schema(
  {
    practiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Practice', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [answerSchema],
    score: { type: Number, min: 0, default: 0 },
    totalMarks: { type: Number, min: 0, default: 0 },
    percentage: { type: Number, min: 0, max: 100, default: 0 },
    status: { type: String, enum: ['submitted', 'graded'], default: 'graded' },
    feedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
    gradedAt: { type: Date, default: null },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

submissionSchema.index({ practiceId: 1, userId: 1 }, { unique: true });

export default mongoose.model('PracticeSubmission', submissionSchema);