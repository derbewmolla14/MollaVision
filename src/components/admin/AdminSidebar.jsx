import { NavLink } from 'react-router-dom';
import { FiBarChart2, FiBookOpen, FiClipboard, FiSettings, FiUsers } from 'react-icons/fi';

const links = [
  ['/admin', 'Dashboard', FiBarChart2],
  ['/admin/users', 'Users', FiUsers],
  ['/admin/courses', 'Courses & lessons', FiBookOpen],
  ['/admin/practices', 'Practice', FiBookOpen],
  ['/admin/submissions', 'Submissions', FiClipboard],
  ['/admin/settings', 'Settings', FiSettings],
];

const AdminSidebar = () => (
  <aside className="mb-8 rounded-2xl bg-slate-900 p-3 text-white lg:mb-0 lg:w-60 lg:flex-shrink-0">
    <p className="px-3 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Admin workspace</p>
    <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
      {links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/admin'} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><Icon size={17} />{label}</NavLink>)}
    </nav>
  </aside>
);

export default AdminSidebar;