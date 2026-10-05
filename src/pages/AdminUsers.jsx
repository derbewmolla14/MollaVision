import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiTrash2 } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import { adminAPI } from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI.users({ search, role, status }).then(({ data }) => setUsers(data.users)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load users.')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [role, status]);

  const changeStatus = async (user) => {
    try { await adminAPI.updateStatus(user._id, user.status === 'active' ? 'suspended' : 'active'); load(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update user status.'); }
  };
  const changeRole = async (user) => {
    try { await adminAPI.updateRole(user._id, user.role === 'admin' ? 'student' : 'admin'); load(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update user role.'); }
  };
  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try { await adminAPI.deleteUser(user._id); load(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete user.'); }
  };

  return <div className="min-h-screen bg-gray-50"><div className="container-custom py-10"><Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><FiArrowLeft /> Admin dashboard</Link><div className="flex flex-col gap-8 lg:flex-row"><AdminSidebar /><main className="min-w-0 flex-1"><div className="mb-6"><h1 className="text-3xl font-bold text-slate-900">Users</h1><p className="mt-1 text-slate-600">Manage accounts, roles, and access status.</p></div>{error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="mb-5 flex flex-wrap gap-3"><label className="relative flex-1"><FiSearch className="absolute left-3 top-3 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load()} placeholder="Search name or email" className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3" /></label><select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-lg border border-slate-300 px-3"><option value="">All roles</option><option value="student">Students</option><option value="admin">Admins</option></select><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-300 px-3"><option value="">All statuses</option><option value="active">Active</option><option value="suspended">Suspended</option></select></div><div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Registered</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-500">Loading users...</td></tr> : users.map((user) => <tr key={user._id} className="border-b border-slate-100 last:border-0"><td className="px-5 py-4"><p className="font-semibold text-slate-900">{user.name}</p><p className="text-slate-500">{user.email}</p></td><td className="px-5 py-4"><button onClick={() => changeRole(user)} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{user.role}</button></td><td className="px-5 py-4"><button onClick={() => changeStatus(user)} className={`rounded-full px-3 py-1 text-xs font-semibold ${user.status === 'suspended' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{user.status}</button></td><td className="px-5 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td><td className="px-5 py-4"><button onClick={() => deleteUser(user)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Delete user"><FiTrash2 /></button></td></tr>)}</tbody></table></div></main></div></div></div>;
};

export default AdminUsers;