import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    originalName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const lessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: null, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    content: { type: mongoose.Schema.Types.Mixed, default: [] },
    module: { type: String, default: 'General' },
    order: { type: Number, required: true, min: 1 },
    videoUrl: { type: String, default: '' },
    videoProvider: { type: String, default: '' },
    videoPublicId: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    pptUrl: { type: String, default: '' },
    pptxUrl: { type: String, default: '' },
    resources: [resourceSchema],
    isPreview: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    duration: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

lessonSchema.index({ courseId: 1, order: 1 }, { unique: true });

export default mongoose.model('Lesson', lessonSchema);