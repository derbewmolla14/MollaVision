import { Link, useLocation } from 'react-router-dom';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { courses } from '../data/courses';
import useProgress from '../hooks/useProgress';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { enrolledCourses } = useProgress();
  const myCourses = courses.filter((course) => enrolledCourses.includes(course.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Your learning space</p>
          <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="mt-2 text-gray-600">Keep your momentum going with your enrolled courses.</p>
          {location.state?.message && <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{location.state.message}</p>}
        </div>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">My courses</h2>
            <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">Browse courses <FiArrowRight size={16} /></Link>
          </div>
          {myCourses.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:border-blue-300 transition-colors">
                  <FiBookOpen className="text-blue-600 mb-4" size={22} />
                  <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{course.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">Continue learning <FiArrowRight size={15} /></span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-dashed border-gray-300 p-10 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your learning list is ready</h3>
              <p className="text-gray-600 mb-5">Enroll in a course to see your progress here.</p>
              <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-semibold">Explore the catalog</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
