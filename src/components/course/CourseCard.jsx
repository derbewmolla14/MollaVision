import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiClock } from 'react-icons/fi';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const difficultyColor = {
    Beginner: 'green',
    Intermediate: 'yellow',
    Advanced: 'red',
  }[course.level] || 'default';

  return (
    <Card className="group flex h-full flex-col p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl shadow-sm">{course.icon}</div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={course.isPremium ? 'yellow' : 'green'} className="text-[10px] font-semibold uppercase tracking-wide">
            {course.isPremium ? 'Premium' : 'Free'}
          </Badge>
          <Badge variant={difficultyColor} className="text-[10px] font-semibold uppercase tracking-wide">
            {course.level}
          </Badge>
        </div>
      </div>

      <h3 className="mb-2 text-xl font-bold text-slate-900">{course.title}</h3>
      <p className="mb-5 flex-grow text-sm leading-6 text-slate-600">{course.description}</p>

      <div className="mb-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <FiBookOpen size={14} />
          {course.lessons} lessons
        </span>
        <span className="inline-flex items-center gap-2">
          <FiClock size={14} />
          {Math.ceil(course.lessons * 1.5)}h
        </span>
      </div>

      <Link to={`/courses/${course.id}`} className="mt-auto" onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        if (!isAuthenticated) {
          event.preventDefault();
          navigate('/login', { state: { from: `/courses/${course.id}`, source: location.pathname } });
        }
      }}>
        <Button variant="primary" className="w-full justify-center text-sm">
          Start Learning
          <FiArrowRight size={16} />
        </Button>
      </Link>
    </Card>
  );
};

export default CourseCard;
