import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', trim: true },
    order: { type: Number, required: true, min: 1 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

chapterSchema.index({ courseId: 1, order: 1 }, { unique: true });

export default mongoose.model('Chapter', chapterSchema);