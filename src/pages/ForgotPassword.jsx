import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import Button from '../components/common/Button';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);
    try {
      const { data } = await authAPI.forgotPassword(email);
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to contact the password reset service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"><FiArrowLeft size={16} /> Back to Login</Link>
        <div className="mb-8"><h1 className="text-3xl font-bold text-blue-600">Reset your password</h1><p className="mt-2 text-gray-600">Enter your email and we will send a secure reset link if an account exists.</p></div>
        {message && <p className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
        {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-gray-700">Email address<span className="relative mt-2 block"><FiMail className="absolute left-3 top-3 text-gray-400" size={20} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></span></label>
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Sending...' : 'Send Reset Link'}</Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;