import { SignIn } from '@clerk/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const redirectFromQuery = new URLSearchParams(location.search).get('redirect_url');
  const from = location.state?.from || redirectFromQuery || '/dashboard';
  const signUpUrl = `/register?redirect_url=${encodeURIComponent(from)}`;

  useEffect(() => {
    if (!loading && isAuthenticated) navigate(from, { replace: true });
  }, [from, isAuthenticated, loading, navigate]);

  if (loading || isAuthenticated) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading authentication...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">M</div>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">MollaVision</h1>
        </div>
        <SignIn
          routing="path"
          path="/login"
          signUpUrl={signUpUrl}
          fallbackRedirectUrl={from}
          localization={{ formButtonPrimary: 'Login' }}
          appearance={{ options: { socialButtonsPlacement: 'bottom' } }}
        />
      </div>
    </div>
  );
};

export default Login;