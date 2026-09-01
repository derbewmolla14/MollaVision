import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import CourseSidebar from '../components/learning/CourseSidebar';
import LessonContent from '../components/learning/LessonContent';
import LessonNavigation from '../components/learning/LessonNavigation';
import Exercise from '../components/learning/Exercise';
import Button from '../components/common/Button';
import useProgress from '../hooks/useProgress';
import { getLessonById, getLessonsByOrder } from '../data/lessons';
import { getCourseById } from '../data/courses';
import { getExerciseById } from '../data/exercises';

const Lesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { markAsComplete, isComplete } = useProgress(courseId);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  useEffect(() => {
    // Get lesson and course data
    const lessonData = getLessonById(courseId, lessonId);
    const courseData = getCourseById(courseId);

    if (!lessonData || !courseData) {
      navigate('/courses');
      return;
    }

    setLesson(lessonData);
    setCourse(courseData);
    setLessonCompleted(isComplete(courseId, lessonId));

    // Get exercise if it exists
    if (lessonData.exercise) {
      const exerciseData = getExerciseById(lessonData.exercise);
      if (exerciseData) {
        setExercise(exerciseData);
      }
    }

    // Close sidebar on desktop
    setSidebarOpen(false);

    // Scroll to top
    window.scrollTo(0, 0);
  }, [courseId, lessonId, navigate, isComplete]);

  const handleMarkComplete = () => {
    markAsComplete(courseId, lessonId);
    setLessonCompleted(true);
  };

  const handleExerciseComplete = () => {
    handleMarkComplete();
  };

  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 truncate">{lesson.title}</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'fixed' : 'hidden'
          } md:relative md:block w-full md:w-64 bg-white border-r border-gray-200 z-30 md:z-0 overflow-y-auto max-h-[calc(100vh-80px)] md:max-h-none`}
        >
          <CourseSidebar
            courseId={courseId}
            currentLessonId={lessonId}
            courseName={course.title}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
            {/* Lesson Header */}
            <div className="mb-8">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                {lesson.module}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                {lesson.title}
              </h1>

              {/* Completion Status */}
              {lessonCompleted && (
                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  ✓ Completed
                </div>
              )}
            </div>

            {/* Lesson Content */}
            <div className="mb-12">
              <LessonContent content={lesson.content} />
            </div>

            {/* Exercise */}
            {exercise && (
              <div className="mb-12">
                <Exercise
                  exercise={exercise}
                  onComplete={handleExerciseComplete}
                />
              </div>
            )}

            {/* Mark as Complete Button */}
            {!lessonCompleted && (
              <div className="mb-12">
                <Button
                  variant="primary"
                  className="text-lg px-8 py-3"
                  onClick={handleMarkComplete}
                >
                  Mark as Complete ✓
                </Button>
              </div>
            )}

            {/* Lesson Navigation */}
            <LessonNavigation courseId={courseId} currentOrder={lesson.order} />
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Lesson;
