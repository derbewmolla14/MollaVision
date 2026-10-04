import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    setIsSubmitting(true);
    try {
      await register(form);
      navigate(from, { replace: true, state: { message: 'Account created successfully.' } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-8 text-center"><h1 className="mb-2 text-3xl font-bold text-blue-600">MollaVision</h1><h2 className="text-2xl font-bold text-gray-900">Create an account</h2><p className="mt-2 text-gray-600">Start building your learning path today</p></div>
        {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['name', 'Name', 'text', FiUser], ['email', 'Email', 'email', FiMail], ['password', 'Password', 'password', FiLock], ['confirmPassword', 'Confirm Password', 'password', FiLock]].map(([name, label, type, Icon]) => <label key={name} className="block text-sm font-medium text-gray-700">{label}<span className="relative mt-2 block"><Icon className="absolute left-3 top-3 text-gray-400" size={20} /><input name={name} type={type} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} minLength={type === 'password' ? 6 : undefined} className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" required /></span></label>)}
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Loading...' : 'Create Account'}</Button>
        </form>
        <p className="mt-6 text-center text-gray-600">Already have an account? <Link to="/login" state={{ from }} className="font-medium text-blue-600 hover:text-blue-700">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;