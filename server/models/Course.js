import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    instructor: { type: String, default: '' },
    category: { type: String, default: 'programming' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    language: { type: String, default: 'English' },
    price: { type: Number, min: 0, default: 0 },
    isPremium: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    totalLessons: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);