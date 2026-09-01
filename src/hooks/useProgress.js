import { useState, useCallback, useEffect } from 'react';
import storage from '../utils/storage';

export const useProgress = (courseId) => {
  const [completedCount, setCompletedCount] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    // Update completed count when component mounts
    if (courseId) {
      setCompletedCount(storage.getCompletedCount(courseId));
    }
    setEnrolledCourses(storage.getEnrolledCourses());
  }, [courseId]);

  const markAsComplete = useCallback((courseId, lessonId) => {
    storage.setLessonComplete(courseId, lessonId);
    setCompletedCount(storage.getCompletedCount(courseId));
  }, []);

  const isComplete = useCallback((courseId, lessonId) => {
    return storage.isLessonComplete(courseId, lessonId);
  }, []);

  const enrollCourse = useCallback((courseId) => {
    storage.enrollCourse(courseId);
    setEnrolledCourses(storage.getEnrolledCourses());
  }, []);

  const setLastLesson = useCallback((courseId, lessonId) => {
    storage.setLastLesson(courseId, lessonId);
  }, []);

  const getLastLesson = useCallback((courseId) => {
    return storage.getLastLesson(courseId);
  }, []);

  const isEnrolled = useCallback((courseId) => {
    return storage.isEnrolled(courseId);
  }, []);

  return {
    completedCount,
    enrolledCourses,
    markAsComplete,
    isComplete,
    enrollCourse,
    setLastLesson,
    getLastLesson,
    isEnrolled
  };
};

export default useProgress;
