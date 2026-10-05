import { SignUp } from '@clerk/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const redirectFromQuery = new URLSearchParams(location.search).get('redirect_url');
  const from = location.state?.from || redirectFromQuery || '/dashboard';
  const signInUrl = `/login?redirect_url=${encodeURIComponent(from)}`;

  useEffect(() => {
    if (!loading && isAuthenticated) navigate(from, { replace: true });
  }, [from, isAuthenticated, loading, navigate]);

  if (loading || isAuthenticated) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading authentication...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <SignUp
        routing="path"
        path="/register"
        signInUrl={signInUrl}
        fallbackRedirectUrl={from}
        appearance={{ variables: { colorPrimary: '#2563eb', borderRadius: '0.5rem' } }}
      />
    </div>
  );
};

export default Register;