// Storage utilities for localStorage management
const STORAGE_PREFIX = "mollavision_";

export const storage = {
  // Progress tracking
  setLessonComplete: (courseId, lessonId) => {
    const key = `${STORAGE_PREFIX}progress_${courseId}`;
    const progress = JSON.parse(localStorage.getItem(key) || '{}');
    progress[lessonId] = true;
    localStorage.setItem(key, JSON.stringify(progress));
  },

  isLessonComplete: (courseId, lessonId) => {
    const key = `${STORAGE_PREFIX}progress_${courseId}`;
    const progress = JSON.parse(localStorage.getItem(key) || '{}');
    return progress[lessonId] === true;
  },

  getCourseProgress: (courseId) => {
    const key = `${STORAGE_PREFIX}progress_${courseId}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
  },

  getCompletedCount: (courseId) => {
    const progress = storage.getCourseProgress(courseId);
    return Object.values(progress).filter(v => v === true).length;
  },

  // Last viewed lesson
  setLastLesson: (courseId, lessonId) => {
    const key = `${STORAGE_PREFIX}last_lesson_${courseId}`;
    localStorage.setItem(key, lessonId);
  },

  getLastLesson: (courseId) => {
    const key = `${STORAGE_PREFIX}last_lesson_${courseId}`;
    return localStorage.getItem(key);
  },

  // Enrolled courses
  enrollCourse: (courseId) => {
    const key = `${STORAGE_PREFIX}enrolled_courses`;
    const enrolled = JSON.parse(localStorage.getItem(key) || '[]');
    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId);
      localStorage.setItem(key, JSON.stringify(enrolled));
    }
  },

  getEnrolledCourses: () => {
    const key = `${STORAGE_PREFIX}enrolled_courses`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  isEnrolled: (courseId) => {
    return storage.getEnrolledCourses().includes(courseId);
  },

  // Clear all progress
  clearAllProgress: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};

export default storage;
