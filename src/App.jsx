import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Lesson from './pages/Lesson';
import Practice from './pages/Practice';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Certificates from './pages/Certificates';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminPractices from './pages/AdminPractices';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminUsers from './pages/AdminUsers';
import AdminSubmissions from './pages/AdminSubmissions';
import AdminCourses from './pages/AdminCourses';
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route path="/courses/:courseId/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
            <Route path="/admin/practices" element={<ProtectedRoute role="admin"><AdminPractices /></ProtectedRoute>} />
            <Route path="/admin/practice" element={<ProtectedRoute role="admin"><AdminPractices /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/courses" element={<ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/submissions" element={<ProtectedRoute role="admin"><AdminSubmissions /></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/tutorials" element={<Courses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
