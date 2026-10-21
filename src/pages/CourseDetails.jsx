import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPlay } from 'react-icons/fi';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import useProgress from '../hooks/useProgress';
import { courseAPI, lessonAPI } from '../services/api';
import { getCourseById } from '../data/courses';
import { getLessonsByOrder } from '../data/lessons';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const fallbackCourse = getCourseById(courseId);
  const [course, setCourse] = useState(fallbackCourse);
  const [lessons, setLessons] = useState(() => getLessonsByOrder(courseId));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { enrollCourse, isEnrolled, getLastLesson, completedCount } = useProgress(courseId);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([courseAPI.get(courseId), lessonAPI.list(courseId)])
      .then(([courseResponse, lessonResponse]) => {
        if (!active) return;
        const apiCourse = courseResponse.data.course;
        setCourse({ ...apiCourse, id: apiCourse.slug, lessons: apiCourse.totalLessons });
        setLessons(lessonResponse.data.lessons.map((lesson) => ({
          ...lesson,
          id: lesson._id,
          module: lesson.module || 'General',
        })));
      })
      .catch(() => {
        if (active && !fallbackCourse) setError('Unable to load this course. Check that the API and database are available.');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [courseId, fallbackCourse]);

  const enrolled = isEnrolled(courseId);
  const lastLesson = getLastLesson(courseId);
  const firstLesson = lessons[0];
  const startLesson = lastLesson || firstLesson?.id;
  const progressPercentage = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const difficultyColor = { Beginner: 'green', Intermediate: 'yellow', Advanced: 'red' }[course?.level] || 'default';
  const lessonCount = course?.totalLessons ?? course?.lessons ?? lessons.length;
  const description = course?.description || '';
  const about = course?.shortDescription || description;
  const orderedLessons = useMemo(() => [...lessons].sort((a, b) => a.order - b.order), [lessons]);

  if (loading && !course) return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading course...</div>;
  if (!course) return <div className="container-custom py-16"><Link to="/courses" className="text-blue-600">Back to Courses</Link><h1 className="mt-8 text-4xl font-bold">Course Not Found</h1></div>;

  const requireAuth = (event, path) => {
    if (!authLoading && !user) {
      event.preventDefault();
      navigate('/login', { state: { from: path } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"><FiArrowLeft size={20} />Back to Courses</Link>
          <div className="flex items-start justify-between gap-8">
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{description}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant={difficultyColor}>{course.level}</Badge>
                <span className="text-gray-600 font-medium">{lessonCount} lessons</span>
                {error && <span className="text-sm text-amber-700">{error}</span>}
              </div>
            </div>
            {course.thumbnail && <img src={course.thumbnail} alt="" className="hidden h-28 w-40 rounded-xl object-cover sm:block" />}
          </div>
        </div>
      </div>
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {enrolled && <div className="bg-white rounded-lg shadow-md p-6 mb-8"><div className="flex items-center justify-between mb-2"><h3 className="text-sm font-semibold text-gray-700">Your Progress</h3><span className="text-sm font-bold text-blue-600">{progressPercentage}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }} /></div></div>}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8"><h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2><p className="text-gray-600 leading-relaxed">{about}</p></div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              {!orderedLessons.length ? <p className="text-gray-600">No lessons have been published yet.</p> : <div className="space-y-3">{orderedLessons.map((lesson, index) => {
                const path = `/courses/${courseId}/${lesson.id}`;
                return <Link key={lesson.id} to={path} onClick={(event) => requireAuth(event, location.pathname)} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-700">{index + 1}</div>
                  <div className="flex-grow"><h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{lesson.title}</h3><p className="text-xs text-gray-500">{lesson.description || lesson.module || 'Lesson'}</p></div>
                  <FiPlay className="flex-shrink-0 text-gray-400 group-hover:text-blue-600" size={20} />
                </Link>;
              })}</div>}
            </div>
          </div>
          <aside>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <Button variant="primary" className="w-full mb-4" disabled={!startLesson} onClick={(event) => {
                if (!user && !authLoading) { navigate('/login', { state: { from: location.pathname } }); return; }
                if (!enrolled) enrollCourse(courseId);
                if (startLesson) navigate(`/courses/${courseId}/${startLesson}`);
              }}>{enrolled && lastLesson ? 'Continue Learning' : 'Start Learning'}</Button>
              <p className="text-xs text-gray-600 text-center">{lessonCount} lessons · {course.level}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
