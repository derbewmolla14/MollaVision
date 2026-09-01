import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlay } from 'react-icons/fi';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import useProgress from '../hooks/useProgress';
import { getCourseById } from '../data/courses';
import { getLessonsByOrder } from '../data/lessons';

const CourseDetails = () => {
  const { courseId } = useParams();
  const course = getCourseById(courseId);
  const { enrollCourse, isEnrolled, getLastLesson, completedCount } = useProgress(courseId);
  const lessons = getLessonsByOrder(courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-16">
          <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8">
            <FiArrowLeft size={20} />
            Back to Courses
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const enrolled = isEnrolled(courseId);
  const lastLesson = getLastLesson(courseId);
  const firstLesson = lessons[0];
  const startLesson = lastLesson || (firstLesson?.id);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-16">
          <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8">
            <FiArrowLeft size={20} />
            Back to Courses
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const difficultyColor = {
    'Beginner': 'green',
    'Intermediate': 'yellow',
    'Advanced': 'red',
  }[course.level] || 'default';

  const progressPercentage = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
            <FiArrowLeft size={20} />
            Back to Courses
          </Link>
          <div className="flex items-start justify-between gap-8">
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {course.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {course.description}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant={difficultyColor}>
                  {course.level}
                </Badge>
                <span className="text-gray-600 font-medium">
                  {course.lessons} lessons
                </span>
                {enrolled && (
                  <span className="text-green-600 font-medium">
                    {completedCount} completed
                  </span>
                )}
              </div>
            </div>
            <div className="text-6xl">
              {course.icon}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Progress Bar */}
            {enrolled && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Your Progress</h3>
                  <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {completedCount} of {lessons.length} lessons completed
                </p>
              </div>
            )}

            {/* Course Description Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Learn {course.title} from beginner to advanced. This comprehensive course covers all essential concepts, 
                techniques, and best practices. You'll work through practical examples, exercises, and real-world projects 
                to build a solid understanding of {course.title}.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By the end of this course, you'll be able to build practical applications and understand the core principles 
                of {course.title}. This course is perfect for beginners and includes interactive exercises and playgrounds.
              </p>
            </div>

            {/* Course Lessons */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              <div className="space-y-3">
                {lessons.map((lesson, idx) => {
                  const isCompleted = completedCount > 0 ? 
                    // This is a simplified check - in production you'd check the actual lesson
                    idx < Math.ceil(completedCount) : false;

                  return (
                    <Link
                      key={lesson.id}
                      to={`/courses/${courseId}/${lesson.id}`}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-gray-500">{lesson.module}</p>
                      </div>
                      <FiPlay className="flex-shrink-0 text-gray-400 group-hover:text-blue-600" size={20} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Start Course Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 mb-6">
              {enrolled ? (
                <>
                  <Link
                    to={`/courses/${courseId}/${startLesson}`}
                    className="w-full"
                  >
                    <Button variant="primary" className="w-full mb-4">
                      {getLastLesson(courseId) ? '▶ Continue Learning' : '▶ Start Learning'}
                    </Button>
                  </Link>
                  {getLastLesson(courseId) && (
                    <p className="text-xs text-gray-600 text-center">
                      Continuing from where you left off
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    className="w-full mb-4"
                    onClick={() => {
                      enrollCourse(courseId);
                    }}
                  >
                    Enroll Now
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    Start learning with interactive lessons
                  </p>
                </>
              )}
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-lg font-bold text-gray-900">{course.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-lg font-bold text-gray-900">{lessons.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Duration</p>
                <p className="text-lg font-bold text-gray-900">{Math.ceil(lessons.length * 1.5)}h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
