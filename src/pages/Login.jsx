import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.status === 500
        ? 'Something went wrong on the server. Please try again.'
        : requestError.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-blue-600">MollaVision</h1>
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-gray-600">Welcome back! Login to your account</p>
        </div>
        {location.state?.message && <p className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">{location.state.message}</p>}
        {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-gray-700">Email
            <span className="relative mt-2 block"><FiMail className="absolute left-3 top-3 text-gray-400" size={20} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" required /></span>
          </label>
          <label className="block text-sm font-medium text-gray-700">Password
            <span className="relative mt-2 block"><FiLock className="absolute left-3 top-3 text-gray-400" size={20} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" required /></span>
          </label>
          <div className="flex justify-end"><Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">Forgot Password?</Link></div>
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Loading...' : 'Login'}</Button>
        </form>
        <p className="mt-6 text-center text-gray-600">Need an account? <Link to="/register" state={{ from }} className="font-medium text-blue-600 hover:text-blue-700">Create Account</Link></p>
      </div>
    </div>
  );
};

export default Login;
