import 'dotenv/config';
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { connectDatabase } from '../config/db.js';
import { getYouTubeVideoId } from '../utils/youtube.js';

const videos = [
  ['Introduction — Part 1', 'https://www.youtube.com/watch?v=o-XL-sIE-8I&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=1'],
  ['Introduction — Part 2', 'https://www.youtube.com/watch?v=Xq4Y6UFY88o&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=2'],
  ['HTML Lesson 3', 'https://www.youtube.com/watch?v=UdR6cBtXUBs&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=3'],
  ['HTML Lesson 4', 'https://www.youtube.com/watch?v=4WF5I3ggbec&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=4'],
  ['HTML Lesson 5', 'https://www.youtube.com/watch?v=Yj4NzvbcDmk&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=5'],
  ['HTML Lesson 6', 'https://www.youtube.com/watch?v=Yj4NzvbcDmk&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=6'],
  ['HTML Lesson 7', 'https://www.youtube.com/watch?v=Ng_oXHY1OcE&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=8'],
  ['HTML Lesson 8', 'https://www.youtube.com/watch?v=Ejn3FlJEyK4&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=10'],
  ['HTML Lesson 9', 'https://www.youtube.com/watch?v=YK1DRh-IqKA&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=9'],
  ['HTML Lesson 10', 'https://www.youtube.com/watch?v=2yvjr-1Lmto&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=11'],
  ['HTML Lesson 11', 'https://www.youtube.com/watch?v=sVKBZb9Yn14&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=12'],
  ['HTML Lesson 12', 'https://www.youtube.com/watch?v=JtXHpKtoqS8&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=13'],
  ['HTML Lesson 13', 'https://www.youtube.com/watch?v=krta0ixqZmo&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=14'],
  ['HTML Lesson 14', 'https://www.youtube.com/watch?v=vrfeEn570Do&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=15'],
  ['HTML Lesson 15', 'https://www.youtube.com/watch?v=QfgKANeKAG0&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=16'],
  ['HTML Lesson 16', 'https://www.youtube.com/watch?v=rF3e_ZfiOzg&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=17'],
  ['HTML Lesson 17', 'https://www.youtube.com/watch?v=oNOCTpYO3IM&list=PLRvH37iEcMFH20jKJBpp4fjStM8hOcQyc&index=18'],
];

const run = async () => {
  await connectDatabase();
  const course = await Course.findOneAndUpdate(
    { slug: 'html-complete-course' },
    {
      title: 'HTML Complete Course',
      description: 'Learn HTML through an ordered series of video lessons. Add explanations, examples, and supplementary materials as they become available.',
      category: 'programming',
      level: 'Beginner',
      isPublished: true,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
  );

  const lessonIds = [];
  for (const [index, [title, videoUrl]] of videos.entries()) {
    const videoId = getYouTubeVideoId(videoUrl);
    const lesson = await Lesson.findOneAndUpdate(
      { courseId: course._id, order: index + 1 },
      { title, description: '', videoUrl, videoId, order: index + 1, isPublished: true, isPreview: index === 0, isPremium: false },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
    );
    lessonIds.push(lesson._id);
  }

  await Course.findByIdAndUpdate(course._id, { lessons: lessonIds, totalLessons: lessonIds.length });
  console.log(`HTML course seeded with ${lessonIds.length} lessons. Lesson 5 and 6 intentionally share a video ID for review.`);
};

run()
  .catch((error) => {
    console.error(`HTML course seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
