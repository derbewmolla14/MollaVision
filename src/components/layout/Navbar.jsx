import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import Button from '../common/Button';

const navItems = [
  { to: '/tutorials', label: 'Tutorials' },
  { to: '/courses', label: 'Courses' },
  { to: '/practice', label: 'Practice' },
  { to: '/projects', label: 'Projects' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 transition-colors hover:text-blue-600">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">M</span>
            <span>MollaVision</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
            <label className="relative block w-full max-w-xs">
              <span className="sr-only">Search courses and lessons</span>
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="search"
                placeholder="Search courses and lessons..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <Link to="/login">
              <Button variant="secondary" className="px-4 py-2.5 text-sm">Login</Button>
            </Link>
            <Link to="/courses">
              <Button variant="primary" className="px-4 py-2.5 text-sm">Sign Up</Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Search courses">
              <FiSearch size={18} />
            </button>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-200 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}

              <div className="mt-2 space-y-2 border-t border-slate-200 pt-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  Login
                </Link>
                <Link to="/courses" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
