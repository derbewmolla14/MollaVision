import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminSettings = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container-custom py-10">
      <Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><FiArrowLeft /> Admin dashboard</Link>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AdminSidebar />
        <main className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-slate-600">Authentication and storage settings are managed through the server environment.</p>
          <section className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Server configuration</h2>
            <p className="mt-2 text-sm text-slate-600">Secrets stay on the backend. Update server/.env and restart the API when changing MongoDB, Clerk, or storage configuration.</p>
          </section>
        </main>
      </div>
    </div>
  </div>
);

export default AdminSettings;
