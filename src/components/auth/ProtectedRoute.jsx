import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading your account...</div>;
  }

  if (!user) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
};

export default ProtectedRoute;