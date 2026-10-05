import { useState } from 'react';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import { authAPI } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must contain at least 6 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    setIsSubmitting(true);
    try {
      const { data } = await authAPI.resetPassword(token, form);
      navigate('/login', { replace: true, state: { message: data.message } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'This reset link is invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"><FiArrowLeft size={16} /> Back to Login</Link>
        <div className="mb-8"><h1 className="text-3xl font-bold text-blue-600">Choose a new password</h1><p className="mt-2 text-gray-600">Use a strong password you have not used before.</p></div>
        {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          {['password', 'confirmPassword'].map((field) => <label key={field} className="block text-sm font-medium text-gray-700">{field === 'password' ? 'New password' : 'Confirm new password'}<span className="relative mt-2 block"><FiLock className="absolute left-3 top-3 text-gray-400" size={20} /><input type="password" value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} minLength="6" required className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" /></span></label>)}
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Updating...' : 'Reset Password'}</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;