import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiClipboard, FiLayers, FiUsers } from 'react-icons/fi';
import { adminAPI } from '../services/api';
import AdminSidebar from '../components/admin/AdminSidebar';

const Admin = () => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI.statistics()
      .then(({ data }) => setStatistics(data.statistics))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load admin statistics.'));
  }, []);

  const cards = [
    ['Total users', (statistics?.totalStudents || 0) + (statistics?.totalAdmins || 0), FiUsers],
    ['Total admins', statistics?.totalAdmins, FiUsers],
    ['Total courses', statistics?.totalCourses, FiBookOpen],
    ['Total lessons', statistics?.totalLessons, FiLayers],
    ['Total practices', statistics?.totalPractices, FiBookOpen],
    ['Submissions', statistics?.totalSubmissions, FiClipboard],
    ['Active users', statistics?.activeUsers, FiUsers],
    ['Enrollments', statistics?.totalEnrollments, FiClipboard],
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Content management</p>
            <h1 className="text-4xl font-bold text-gray-900">Admin dashboard</h1>
          </div>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium">View public catalog</Link>
        </div>

        {error && <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="flex flex-col gap-8 lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, value, Icon]) => (
            <div key={label} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <Icon className="text-blue-600 mb-4" size={22} />
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{value ?? '...'}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course management</h2>
          <p className="text-gray-600">Course and lesson creation endpoints are ready for the editor workflow.</p>
          <Link to="/admin/practices" className="mt-4 inline-flex font-semibold text-blue-600 hover:text-blue-700">Manage practice exercises</Link>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;