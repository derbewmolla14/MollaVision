import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { courses } from '../../src/data/courses.js';
import { lessons } from '../../src/data/lessons.js';

const migrate = async () => {
  await connectDatabase();

  for (const sourceCourse of courses) {
    const course = await Course.findOneAndUpdate(
      { slug: sourceCourse.id },
      {
        $set: {
          title: sourceCourse.title,
          slug: sourceCourse.id,
          description: sourceCourse.description,
          shortDescription: sourceCourse.description,
          category: sourceCourse.category,
          level: sourceCourse.level,
          isPublished: true,
          totalLessons: sourceCourse.lessons,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const sourceLessons = lessons.filter((lesson) => lesson.courseId === sourceCourse.id);
    for (const sourceLesson of sourceLessons) {
      await Lesson.findOneAndUpdate(
        { courseId: course._id, order: sourceLesson.order },
        {
          $set: {
            courseId: course._id,
            title: sourceLesson.title,
            description: sourceLesson.content?.find((item) => item.type === 'text')?.text || '',
            content: sourceLesson.content || [],
            module: sourceLesson.module,
            order: sourceLesson.order,
            isPreview: sourceLesson.order === 1,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const courseLessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).select('_id');
    course.lessons = courseLessons.map((lesson) => lesson._id);
    course.totalLessons = courseLessons.length || sourceCourse.lessons;
    await course.save();
  }

  console.log(`Migrated ${courses.length} courses and ${lessons.length} source lessons`);
};

migrate()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => mongoose.connection.close());