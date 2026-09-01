import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { getNextLesson, getPreviousLesson } from '../../data/lessons';

const LessonNavigation = ({ courseId, currentOrder }) => {
  const prevLesson = getPreviousLesson(courseId, currentOrder);
  const nextLesson = getNextLesson(courseId, currentOrder);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex justify-between items-center">
        {/* Previous Button */}
        {prevLesson ? (
          <Link
            to={`/courses/${courseId}/${prevLesson.id}`}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <FiArrowLeft size={18} />
            Previous Lesson
          </Link>
        ) : (
          <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium opacity-50">
            <FiArrowLeft size={18} />
            Previous Lesson
          </div>
        )}

        {/* Next Button */}
        {nextLesson ? (
          <Link
            to={`/courses/${courseId}/${nextLesson.id}`}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Next Lesson
            <FiArrowRight size={18} />
          </Link>
        ) : (
          <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium opacity-50">
            Next Lesson
            <FiArrowRight size={18} />
          </div>
        )}
      </div>

      {/* Course Completion Message */}
      {!nextLesson && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg text-center">
          <p className="text-green-800 font-medium">
            🎉 Congratulations! You've reached the end of this course.
          </p>
          <p className="text-green-700 text-sm mt-1">
            More lessons coming soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonNavigation;
